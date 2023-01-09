import { Order } from "@monaco-protocol/client";

export function mapOrdersToOutcomesAndForAgainst(
  outcomeTitles: string[],
  orders: Order[]
) {
  const mapping = outcomeTitles.map((outcomeTitle) => {
    const forOutcome = orders.filter(
      (order) =>
        order.forOutcome &&
        order.marketOutcomeIndex === outcomeTitles.indexOf(outcomeTitle)
    );
    const againstOutcome = orders.filter(
      (order) =>
        !order.forOutcome &&
        order.marketOutcomeIndex === outcomeTitles.indexOf(outcomeTitle)
    );
    return {
      for: forOutcome.map((order) => {
        return {
          outcome: outcomeTitle,
          expectedPrice: order.expectedPrice,
          stake: order.stake
        };
      }),
      against: againstOutcome.map((order) => {
        return {
          outcome: outcomeTitle,
          expectedPrice: order.expectedPrice,
          stake: order.stake
        };
      })
    };
  });
  return mapping;
}
