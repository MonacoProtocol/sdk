import { MarketPrice } from "@monaco-protocol/client";

export function mapPricesToOutcomesAndForAgainst(
  outcomeTitles: string[],
  marketPrices: MarketPrice[]
) {
  const mapping = outcomeTitles.map((outcomeTitle) => {
    const forOutcome = marketPrices.filter(
      (marketPrice) =>
        marketPrice.forOutcome && marketPrice.marketOutcome === outcomeTitle
    );
    const againstOutcome = marketPrices.filter(
      (marketPrice) =>
        !marketPrice.forOutcome && marketPrice.marketOutcome === outcomeTitle
    );
    return {
      for: forOutcome.map((price) => {
        return {
          outcome: outcomeTitle,
          stake: price.price,
          liquidity: price.matchingPool.liquidityAmount
        };
      }),
      against: againstOutcome.map((price) => {
        return {
          outcome: outcomeTitle,
          stake: price.price,
          liquidity: price.matchingPool.liquidityAmount
        };
      })
    };
  });
  return mapping;
}
