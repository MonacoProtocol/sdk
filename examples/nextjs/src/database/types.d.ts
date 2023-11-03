/* eslint-disable @typescript-eslint/no-explicit-any */
import Dexie from 'dexie';

declare module 'dexie' {
  interface MonacoProtocolDB extends Dexie {
    markets: Dexie.Table<IMarket, string>;
    marketOutcomes: Dexie.Table<IMarketOutcome, string>;
    marketMatchingPools: Dexie.Table<IMarketMatchingPool, string>;
    marketPositions: Dexie.Table<IMarketPosition, string>;
    orders: Dexie.Table<IOrder, string>;
    fetchTimestamps: Dexie.Table<{ name: string; timestamp: string }, string>;
  }
}

interface IMarket {
  publicKey: string;
  eventAccount: string;
  marketLockTimestamp: number;
  marketOutcomesCount: number;
  marketSettleTimestamp: number;
  marketStatus: string;
  marketType: string;
  marketWinningOutcomeIndex: number;
  published: boolean;
  suspended: boolean;
  title: string;
  inplay: boolean;
  inplayEnabled: boolean;
  eventStartTimestamp: number;
}

interface IMarketOutcome {
  publicKey: string;
  market: string;
  index: number;
  title: string;
  latestMatchedPrice: number;
  matchedTotal: number;
}

interface IMarketMatchingPool {
  publicKey: string;
  market: PublicKey;
  marketOutcomeIndex: number;
  forOutcome: boolean;
  price: number;
  liquidityAmount: number;
  matchedAmount: number;
}

interface IMarketPosition {
  publicKey: string;
  purchaser: string;
  market: string;
  paid: boolean;
  marketOutcomeSums: number[];
  unmatchedExposures: number[];
  payer: string;
  matchedRisk: number;
  matchedRiskedPerProduct: IMatchedRiskAndRate[];
}

interface IMatchedRiskAndRate {
  product: string;
  risk: number;
  rate: number;
}

interface IOrder {
  publicKey: string;
  purchaser: string;
  market: string;
  marketOutcomeIndex: number;
  forOutcome: boolean;
  orderStatus: string;
  product: string | null;
  stake: number;
  risked: number;
  voidedStake: number;
  expectedPrice: number;
  creationTimestamp: number;
  delayExpirationTimestamp: number;
  stakeUnmatched: number;
  payout: number;
  payer: number;
  productCommissionRate: number;
}

interface IEvent {
  publicKey: string;
  categoryId: string;
  categoryTitle: string;
  subcategoryId: string;
  subcategoryTitle: string;
  eventGroupId: string;
  eventGroupTitle: string;
  eventStartTimestamp: number;
  eventEstimatedEndTimestamp: number;
  eventName: string;
  eventParticipantNames: string[];
  eventParticipantIds: string[];
}

interface IMarketEvent {
  marketPublicKey: string;
  eventPublicKey: string;
}

interface IProduct {
  publicKey: string;
  authority: string;
  payer: string;
  commissionEscrow: string;
  productTitle: string;
  commissionRate: number;
}
