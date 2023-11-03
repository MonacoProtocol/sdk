import { IMarketMatchingPool } from '@/database/types';

export interface OutcomePrices {
  for: IMarketMatchingPool[];
  against: IMarketMatchingPool[];
  liquidityAmount?: number;
  matchedAmount?: number;
}

export interface OutcomePricesSummary {
  prices: OutcomePrices[];
  liquidityAmount: number;
  matchedAmount: number;
}

export const mapPricesFromMarketMatchingPools = (
  marketMatchingPools: IMarketMatchingPool[],
  marketOutcomesCount: number,
): OutcomePricesSummary => {
  const prices = [];
  let liquidityAmount = 0;
  let matchedAmount = 0;
  marketMatchingPools.forEach((pool) => {
    liquidityAmount += pool.liquidityAmount;
    matchedAmount += pool.matchedAmount;
  });
  for (let i = 0; i < marketOutcomesCount; i++) {
    const outcomePrices = {
      for: [],
      against: [],
    } as OutcomePrices;
    let forOutcome = marketMatchingPools
      .filter((pool) => pool.marketOutcomeIndex === i)
      .filter((pool) => pool.forOutcome === true);
    let againstOutcome = marketMatchingPools
      .filter((pool) => pool.marketOutcomeIndex === i)
      .filter((pool) => pool.forOutcome === false);
    if (forOutcome) {
      forOutcome = forOutcome
        .filter((pool) => pool.liquidityAmount > 0)
        .sort((a, b) => (a.price > b.price ? 1 : -1));
      outcomePrices.for.push(...forOutcome);
    }
    if (againstOutcome) {
      againstOutcome = againstOutcome
        .filter((pool) => pool.liquidityAmount > 0)
        .sort((a, b) => (a.price < b.price ? 1 : -1));
      outcomePrices.against.push(...againstOutcome);
    }
    prices.push(outcomePrices);
  }
  return { prices, liquidityAmount, matchedAmount };
};
