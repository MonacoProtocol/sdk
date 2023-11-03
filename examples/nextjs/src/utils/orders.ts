import { DEFAULT_ORDER_SUMMARY, MappedOrderStatus, settledStatuses } from '@/const/orders';
import { IOrder } from '@/database/types';

import { getUniqueMarketsFromOrders } from './mappers/orders';

export const orderSummary = (orders: IOrder[]) => {
  if (!orders.length) return DEFAULT_ORDER_SUMMARY;
  const orderMarketPks = getUniqueMarketsFromOrders(orders);
  const liveOrders = orders.filter(
    (order) => !settledStatuses.includes(order.orderStatus as MappedOrderStatus),
  );
  const won = orders.reduce(
    (acc, order) =>
      order.orderStatus === MappedOrderStatus.WON
        ? acc + order.payout - (order.risked - order.voidedStake)
        : acc,
    0,
  );
  const lost = orders.reduce(
    (acc, order) => (order.orderStatus === MappedOrderStatus.WON ? acc + order.risked : acc),
    0,
  );
  const summary = {
    liveRisk: liveOrders.reduce((acc, order) => (order ? acc + order.risked : acc), 0),
    won: won,
    lost: lost,
    returns: won - lost,
    numberOfMarkets: orderMarketPks.length,
  };
  return summary;
};
