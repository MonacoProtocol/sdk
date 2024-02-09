import { IOrder } from '@/database/types';

export const getUniqueMarketsFromOrders = (orders: IOrder[]): string[] => {
  return [...new Set(orders.map((order) => order.market))];
};

/**
 *  Returns a list of unique purchases from a list of orders, if the connected wallet is
 *  found then we ensure that is at the front of the list.
 */
export const getUniquePurchasersFromOrders = (
  orders: IOrder[],
  connectedWallet: string,
): string[] => {
  const uniquePurchasers = [...new Set(orders.map((order) => order.purchaser))];
  const connectedWalletIndex = uniquePurchasers.indexOf(connectedWallet);
  if (connectedWalletIndex !== -1) {
    const element = uniquePurchasers.splice(connectedWalletIndex, 1)[0];
    uniquePurchasers.unshift(element);
  }
  return uniquePurchasers;
};

export const getUniqueOutcomeIndexesFromOrders = (orders: IOrder[]): number[] => {
  return [...new Set(orders.map((order) => order.marketOutcomeIndex))].sort((a, b) =>
    a > b ? 1 : -1,
  );
};

export const ordersByMarketPublicKey = (orders: IOrder[], marketPublicKey: string) => {
  return orders.filter((order) => order.market === marketPublicKey);
};
