import { Trade } from "@monaco-protocol/client";
import { parseTokenAmountBN } from "./token_parser";

export function parseTrade(trade: Trade, mintDecimals: number){
    trade.creationTimestamp = trade.creationTimestamp.toNumber()
    trade.stake = parseTokenAmountBN(trade.stake, mintDecimals)
    return trade
}
