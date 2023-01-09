import { Order } from "@monaco-protocol/client";
import { parseTokenAmountBN } from "./token_parser";

export function parseOrderAccount(order: Order, mintDecimals: number) {
  order.creationTimestamp = order.creationTimestamp.toNumber();
  order.payout = parseTokenAmountBN(order.payout, mintDecimals);
  order.stake = parseTokenAmountBN(order.stake, mintDecimals);
  order.stakeUnmatched = parseTokenAmountBN(order.stakeUnmatched, mintDecimals);
  order.voidedStake = parseTokenAmountBN(order.voidedStake, mintDecimals);
  return order;
}
