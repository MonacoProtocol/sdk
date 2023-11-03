import { IMarket, IMarketOutcome, IMarketPosition } from '@/database/types';

export const marketsByPublicKey = (markets: IMarket[], marketPublicKey: string) => {
  return markets.find((market) => market.publicKey === marketPublicKey);
};

export const marketPositionByMarketPublicKey = (
  marketPositions: IMarketPosition[],
  marketPublicKey: string,
) => {
  return marketPositions.find((marketPosition) => marketPosition.market === marketPublicKey);
};

export const marketOutcomesByMarketPublicKey = (
  marketOutcomes: IMarketOutcome[],
  marketPublicKey: string,
) => {
  return marketOutcomes.filter((marketOutcome) => marketOutcome.market === marketPublicKey);
};

export const getUniqueEventsFromMarkets = (markets: IMarket[]): string[] => {
  return [...new Set(markets.map((market) => market.eventAccount))];
};
