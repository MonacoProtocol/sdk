import { Program } from '@coral-xyz/anchor';
import { GetAccount, MarketAccount, Markets, getMarket } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import db from '@/database/database';
import {
  getAllMarkets,
  getLastFetchTimestamp,
  getLocalMarketById,
  removeLocalMarkets,
  updateFetchTime,
} from '@/database/endpoints/database';
import { parseResponseData } from '@/utils/parsers';
import { getStoredSettings } from '@/utils/settings';
import { hasElapsed } from '@/utils/time';

const CACHE_DURATION_MINUTES = getStoredSettings().active.cache_markets;

export const fetchMarkets = async (program: Program) => {
  const cache = await checkCache();
  if (cache) return cache;
  try {
    // remove all markets as some may have been closed and no longer on chain
    await removeLocalMarkets();
    const marketData = await Markets.marketQuery(program).fetch();
    if (marketData.success) {
      parseResponseData(marketData.data);
      const marketsToStorePromises = marketData.data.markets.map((market) => {
        marketForDb(market);
      });
      const marketFetchUpdatePromises = marketData.data.markets.map((market) => {
        marketFetchUpdateForDb(market);
      });
      await Promise.all(marketsToStorePromises);
      await Promise.all(marketFetchUpdatePromises);
      await updateFetchTime('markets');
      return getAllMarkets();
    } else {
      console.log(marketData.errors);
      throw new Error(`Error returned from fetchMarkets endpoint`);
    }
  } catch (error) {
    console.error('Error fetching markets:', error);
  }
};

export const fetchMarket = async (program: Program, marketPublicKey: string, bustCache = false) => {
  const cache = await checkMarketCache(marketPublicKey);
  if (cache && !bustCache) return cache;
  try {
    const marketData = await getMarket(program, new PublicKey(marketPublicKey));
    if (marketData.success) {
      parseResponseData(marketData.data);
      await marketForDb(marketData.data);
      await updateFetchTime(`market-${marketPublicKey}`);
      return await getLocalMarketById(marketPublicKey);
    } else {
      console.log(marketData.errors);
      throw new Error(`Error returned from fetchMarket endpoint`);
    }
  } catch (error) {
    console.error('Error fetching market:', error);
    throw error;
  }
};

const checkCache = async () => {
  const lastUpdate = await getLastFetchTimestamp('markets');
  const allMarkets = await getAllMarkets();
  if (
    lastUpdate &&
    !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES) &&
    Object.keys(allMarkets).length > 0
  ) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return allMarkets;
  }
};

const checkMarketCache = async (marketPublicKey: string) => {
  const lastUpdate = await getLastFetchTimestamp(`market-${marketPublicKey}`);
  const market = await getLocalMarketById(marketPublicKey);
  if (lastUpdate && !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES) && market) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return market;
  }
};

const marketForDb = (market: GetAccount<MarketAccount>) => {
  return db.markets.put({
    publicKey: market.publicKey.toString(),
    eventAccount: market.account.eventAccount.toString(),
    marketLockTimestamp: market.account.marketLockTimestamp,
    marketOutcomesCount: market.account.marketOutcomesCount,
    marketSettleTimestamp: market.account.marketSettleTimestamp,
    marketStatus: market.account.marketStatus,
    marketType: market.account.marketType,
    marketWinningOutcomeIndex: market.account.marketWinningOutcomeIndex,
    published: market.account.published,
    suspended: market.account.suspended,
    title: market.account.title,
    inplay: market.account.inplay,
    inplayEnabled: market.account.inplayEnabled,
    eventStartTimestamp: market.account.eventStartTimestamp,
  });
};

const marketFetchUpdateForDb = async (market: GetAccount<MarketAccount>) => {
  return db.fetchTimestamps.put({
    name: `market-${market.publicKey.toString()}`,
    timestamp: new Date().toISOString(),
  });
};
