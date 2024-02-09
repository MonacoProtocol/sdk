import db from '@/database/database';
import { IMarketOutcome } from '@/database/types';

export const updateFetchTime = async (fetchedObject: string) => {
  try {
    await db.fetchTimestamps.put({
      name: fetchedObject,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating fetch time:', error);
  }
};

export const getLastFetchTimestamp = async (name: string) => {
  const entry = await db.fetchTimestamps.get(name);
  return entry ? entry.timestamp : null;
};

export const getLocalOrdersByPurchaser = async (publicKeyString: string) => {
  const orders = await db.orders.where('purchaser').equals(publicKeyString).toArray();
  return orders;
};

export const removeLocalOrdersByPurchaser = async (publicKeyString: string) => {
  await db.orders.where('purchaser').equals(publicKeyString).delete();
};

export const getLocalOrdersByMarket = async (publicKeyString: string) => {
  const orders = await db.orders.where('market').equals(publicKeyString).toArray();
  return orders;
};

export const removeLocalOrdersByMarket = async (publicKeyString: string) => {
  await db.orders.where('market').equals(publicKeyString).delete();
};

export const getAllMarkets = async () => {
  const allMarkets = await db.markets.orderBy('marketLockTimestamp').toArray();
  return allMarkets;
};

export const getLocalMarketById = async (publicKey: string) => {
  const market = await db.markets.get(publicKey);
  return market;
};

export const removeLocalMarkets = async () => {
  await db.markets.clear();
};

export const getAllMarketOutcomes = async () => {
  const allMarketOutcomes = await db.marketOutcomes.toArray();
  return allMarketOutcomes;
};

export const getLocalMarketOutcomesByMarket = async (
  marketPublicKey: string,
): Promise<IMarketOutcome[]> => {
  const marketOutcomes = await db.marketOutcomes.where('market').equals(marketPublicKey).toArray();
  return marketOutcomes.sort((a, b) => (a.index > b.index ? 1 : -1));
};

export const getLocalMarketMatchingPoolsByMarket = async (marketPublicKey: string) => {
  const marketMatchingPools = await db.marketMatchingPools
    .where('market')
    .equals(marketPublicKey)
    .toArray();
  return marketMatchingPools;
};

export const getLocalMarketPositionsByPurchaser = async (purchaserPublicKey: string) => {
  const marketPositions = await db.marketPositions
    .where('purchaser')
    .equals(purchaserPublicKey)
    .toArray();
  return marketPositions;
};

export const getLocalMarketPositionsByMarket = async (marketPublicKey: string) => {
  const marketPositions = await db.marketPositions
    .where('market')
    .equals(marketPublicKey)
    .toArray();
  return marketPositions;
};
