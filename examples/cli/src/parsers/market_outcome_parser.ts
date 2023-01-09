import { MarketOutcomeAccount } from "@monaco-protocol/client";
import { parseTokenAmountBN } from "./token_parser"

export function parseMarketOutcomeAccount(marketOutcomeAccount: MarketOutcomeAccount, mintDecimals: number, reduceLadder: boolean = true){
    const parsedMarketOutcomeAccount = marketOutcomeAccount
    parsedMarketOutcomeAccount.matchedTotal = parseTokenAmountBN(parsedMarketOutcomeAccount.matchedTotal, mintDecimals)
        if(reduceLadder){
            const ladderStart = [...parsedMarketOutcomeAccount.priceLadder.splice(0, 3)]
            const ladderEnd = [...parsedMarketOutcomeAccount.priceLadder.splice(parsedMarketOutcomeAccount.priceLadder.length - 3, 3)]
            parsedMarketOutcomeAccount.priceLadder = [...ladderStart, ...ladderEnd]
        }
    return parsedMarketOutcomeAccount
}