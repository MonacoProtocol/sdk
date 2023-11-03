import { Program } from '@coral-xyz/anchor';
import { GetAccount, MarketPosition, MarketPositions } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import db from '@/database/database';
import {
  getLastFetchTimestamp,
  getLocalMarketPositionsByMarket,
  getLocalMarketPositionsByPurchaser,
  updateFetchTime,
} from '@/database/endpoints/database';
import { parseResponseData } from '@/utils/parsers';
import { getStoredSettings } from '@/utils/settings';
import { hasElapsed } from '@/utils/time';

const CACHE_DURATION_MINUTES = getStoredSettings().active.cache_market_position;

export const fetchMarketPositionsForPurchaser = async (
  program: Program,
  purchaserPublicKey: string,
) => {
  const cache = await checkCache(purchaserPublicKey);
  if (cache) return cache;
  try {
    const marketPositionsData = await MarketPositions.marketPositionQuery(program)
      .filterByPurchaser(new PublicKey(purchaserPublicKey))
      .fetch();
    if (marketPositionsData.success) {
      parseResponseData(marketPositionsData.data);
      const marketPositionsToStorePromises = marketPositionsData.data.marketPositionAccounts.map(
        (marketPosition) => {
          marketPositionForDb(marketPosition);
        },
      );
      await Promise.all(marketPositionsToStorePromises);
      await updateFetchTime(`marketPositions-${purchaserPublicKey}`);
      return await getLocalMarketPositionsByPurchaser(purchaserPublicKey);
    } else {
      console.log(marketPositionsData.errors);
      throw new Error(`Error returned from fetchMarketPositionsForPurchaser endpoint`);
    }
  } catch (error) {
    console.error('Error fetching market positions:', error);
  }
};

export const fetchMarketPositionsForMarket = async (program: Program, marketPublicKey: string) => {
  try {
    const marketPositionsData = await MarketPositions.marketPositionQuery(program)
      .filterByMarket(new PublicKey(marketPublicKey))
      .fetch();
    if (marketPositionsData.success) {
      parseResponseData(marketPositionsData.data);
      const marketPositionsToStorePromises = marketPositionsData.data.marketPositionAccounts.map(
        (marketPosition) => {
          marketPositionForDb(marketPosition);
        },
      );
      await Promise.all(marketPositionsToStorePromises);
      await updateFetchTime(`marketPositions-${marketPublicKey}`);
      return await getLocalMarketPositionsByMarket(marketPublicKey);
    } else {
      console.log(marketPositionsData.errors);
      throw new Error(`Error returned from fetchMarketPositionsForMarket endpoint`);
    }
  } catch (error) {
    console.error('Error fetching market positions:', error);
  }
};

const checkCache = async (purchaserPublicKey: string) => {
  const lastUpdate = await getLastFetchTimestamp(`marketPositions-${purchaserPublicKey}`);
  const marketPositions = await getLocalMarketPositionsByPurchaser(purchaserPublicKey);
  if (
    lastUpdate &&
    !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES) &&
    Object.keys(marketPositions).length > 0
  ) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return marketPositions;
  }
};

const marketPositionForDb = (marketPosition: GetAccount<MarketPosition>) => {
  return db.marketPositions.put({
    publicKey: marketPosition.publicKey.toString(),
    purchaser: marketPosition.account.purchaser.toString(),
    market: marketPosition.account.market.toString(),
    paid: marketPosition.account.paid,
    marketOutcomeSums: marketPosition.account.marketOutcomeSums,
    unmatchedExposures: marketPosition.account.unmatchedExposures,
    payer: marketPosition.account.payer.toString(),
    matchedRisk: marketPosition.account.matchedRisk,
    matchedRiskPerProduct: marketPosition.account.matchedRiskPerProduct,
  });
};
