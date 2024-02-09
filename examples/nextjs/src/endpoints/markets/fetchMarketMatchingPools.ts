import { Program } from '@coral-xyz/anchor';
import {
  GetAccount,
  MarketMatchingPoolWithSeeds,
  getAllMarketMatchingPools,
} from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import db from '@/database/database';
import {
  getLastFetchTimestamp,
  getLocalMarketMatchingPoolsByMarket,
  updateFetchTime,
} from '@/database/endpoints/database';
import { parseResponseData } from '@/utils/parsers';
import { getStoredSettings } from '@/utils/settings';
import { hasElapsed } from '@/utils/time';

const CACHE_DURATION_MINUTES = getStoredSettings().active.cache_market_matching_pools;

export const fetchMarketMatchingPools = async (
  program: Program,
  marketPublicKey: string,
  bustCache = false,
) => {
  const cache = await checkCache(marketPublicKey);
  if (cache && !bustCache) return cache;
  try {
    const matchingPoolsData = await getAllMarketMatchingPools(
      program,
      new PublicKey(marketPublicKey),
    );
    if (matchingPoolsData.success) {
      parseResponseData(matchingPoolsData.data);
      const matchingPoolsToStorePromises = matchingPoolsData.data.marketMatchingPoolsWithSeeds.map(
        (marketMatchingPool) => {
          marketMatchingPoolsForDb(marketMatchingPool);
          updateFetchTime(`marketMatchingPools-${marketPublicKey}`);
        },
      );
      await Promise.all(matchingPoolsToStorePromises);
      return await getLocalMarketMatchingPoolsByMarket(marketPublicKey);
    } else {
      console.log(matchingPoolsData.errors);
      throw new Error(`Error returned from fetchMarketMatchingPools endpoint`);
    }
  } catch (error) {
    console.error('Error fetching market matching pools:', error);
  }
};

const checkCache = async (marketPublicKey: string) => {
  const lastUpdate = await getLastFetchTimestamp(`marketMatchingPools-${marketPublicKey}`);
  const marketMatchingPools = await getLocalMarketMatchingPoolsByMarket(marketPublicKey);
  if (
    lastUpdate &&
    !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES) &&
    Object.keys(marketMatchingPools).length > 0
  ) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return marketMatchingPools;
  }
};

const marketMatchingPoolsForDb = async (
  marketMatchingPool: GetAccount<MarketMatchingPoolWithSeeds>,
) => {
  return db.marketMatchingPools.put({
    publicKey: marketMatchingPool.publicKey.toString(),
    market: marketMatchingPool.account.marketMatchingPool.market.toString(),
    marketOutcomeIndex: marketMatchingPool.account.marketMatchingPool.marketOutcomeIndex,
    forOutcome: marketMatchingPool.account.marketMatchingPool.forOutcome,
    price: marketMatchingPool.account.marketMatchingPool.price,
    liquidityAmount: marketMatchingPool.account.marketMatchingPool.liquidityAmount,
    matchedAmount: marketMatchingPool.account.marketMatchingPool.matchedAmount,
  });
};
