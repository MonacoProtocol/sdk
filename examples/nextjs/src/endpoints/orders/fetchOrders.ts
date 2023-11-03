import { Program } from '@coral-xyz/anchor';
import { GetAccount, Order, Orders } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import db from '@/database/database';
import {
  getLastFetchTimestamp,
  getLocalOrdersByMarket,
  getLocalOrdersByPurchaser,
  removeLocalOrdersByMarket,
  removeLocalOrdersByPurchaser,
  updateFetchTime,
} from '@/database/endpoints/database';
import { parseResponseData } from '@/utils/parsers';
import { getStoredSettings } from '@/utils/settings';
import { hasElapsed } from '@/utils/time';

const CACHE_DURATION_MINUTES = getStoredSettings().active.cache_orders;

export const fetchOrdersForPurchaser = async (program: Program, purchaserPublicKey: string) => {
  const cache = await checkCachePurchaser(purchaserPublicKey);
  if (cache) return cache;
  try {
    // as orders could have been cancelled, we need to remove any local orders for this purchaser
    // in the future we may want to check the diff and only remove orders that have been cancelled
    await removeLocalOrdersByPurchaser(purchaserPublicKey);
    const ordersData = await Orders.orderQuery(program)
      .filterByPurchaser(new PublicKey(purchaserPublicKey))
      .fetch();
    if (ordersData.success) {
      parseResponseData(ordersData.data);
      const ordersToStorePromises = ordersData.data.orderAccounts.map(
        (orderAccount) => ordersForDb(orderAccount),
        updateFetchTime(`orders-${purchaserPublicKey}`),
      );
      await Promise.all(ordersToStorePromises);
      return getLocalOrdersByPurchaser(purchaserPublicKey);
    } else {
      console.log(ordersData.errors);
      throw new Error(`Error returned from fetchOrdersForPurchaser endpoint`);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

export const fetchOrdersForMarket = async (
  program: Program,
  marketPublicKey: string,
  bustCache = false,
) => {
  const cache = await checkCacheMarket(marketPublicKey);
  if (cache && !bustCache) return cache;
  try {
    await removeLocalOrdersByMarket(marketPublicKey);
    const ordersData = await Orders.orderQuery(program)
      .filterByMarket(new PublicKey(marketPublicKey))
      .fetch();
    if (ordersData.success) {
      parseResponseData(ordersData.data);
      const ordersToStorePromises = ordersData.data.orderAccounts.map((orderAccount) =>
        ordersForDb(orderAccount),
      );
      await Promise.all(ordersToStorePromises);
      await updateFetchTime(`orders-${marketPublicKey}`);
      return await getLocalOrdersByMarket(marketPublicKey);
    } else {
      console.log(ordersData.errors);
      throw new Error(`Error returned from fetchOrdersForPurchaser endpoint`);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const checkCachePurchaser = async (purchaserPublicKey: string) => {
  const lastUpdate = await getLastFetchTimestamp(`orders-${purchaserPublicKey}`);
  const orders = await getLocalOrdersByPurchaser(purchaserPublicKey);
  if (
    lastUpdate &&
    !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES) &&
    Object.keys(orders).length > 0
  ) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return orders;
  }
};

const checkCacheMarket = async (marketPublicKey: string) => {
  const lastUpdate = await getLastFetchTimestamp(`orders-${marketPublicKey}`);
  const orders = await getLocalOrdersByMarket(marketPublicKey);
  if (
    lastUpdate &&
    !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES) &&
    Object.keys(orders).length > 0
  ) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return orders;
  }
};

const ordersForDb = async (orderAccount: GetAccount<Order>) => {
  let risked = orderAccount.account.stake;
  if (!orderAccount.account.forOutcome) {
    risked = risked * orderAccount.account.expectedPrice - risked;
  }
  return db.orders.put({
    publicKey: orderAccount.publicKey.toString(),
    purchaser: orderAccount.account.purchaser.toString(),
    market: orderAccount.account.market.toString(),
    marketOutcomeIndex: orderAccount.account.marketOutcomeIndex,
    forOutcome: orderAccount.account.forOutcome,
    orderStatus: orderAccount.account.orderStatus,
    product: orderAccount.account.product,
    stake: orderAccount.account.stake,
    risked: risked,
    voidedStake: orderAccount.account.voidedStake,
    expectedPrice: orderAccount.account.expectedPrice,
    creationTimestamp: orderAccount.account.creationTimestamp,
    delayExpirationTimestamp: orderAccount.account.delayExpirationTimestamp,
    stakeUnmatched: orderAccount.account.stakeUnmatched,
    payout: orderAccount.account.payout,
    payer: orderAccount.account.payer,
    productCommissionRate: orderAccount.account.productCommissionRate,
  });
};
