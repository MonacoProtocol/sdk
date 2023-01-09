import { BN } from "@project-serum/anchor";
import { MarketAccount } from "@monaco-protocol/client";

export function parseMarketAccount(market: MarketAccount) {
  market.marketLockTimestamp = market.marketLockTimestamp.toNumber();
  if (market.marketSettleTimestamp) {
    const settleTimestamp = market.marketSettleTimestamp as BN;
    market.marketSettleTimestamp = settleTimestamp.toNumber();
  }
  return market;
}
