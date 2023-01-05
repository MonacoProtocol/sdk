import { getMarketPrices, getMintInfo, MarketOutcomeAccount, MarketPrice, MarketPricesAndPendingOrders } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { parseMarketOutcomeAccount } from "./parsers/market_outcome_parser";
import { parseMarketAccount } from "./parsers/market_parser";
import { parseMarketPrice } from "./parsers/market_price_parser";
import { parseOrderAccount } from "./parsers/order_parser";
import { getProgram, getProcessArgs, logJson } from "./utils";

async function getMarketSummary(marketPk: PublicKey){
    const program = await getProgram()
    const response = await getMarketPrices(program, marketPk)
    const mintDetails = await getMintInfo(program, response.data.market.mintAccount)
    const parsedMarketPrices = parseMarketPricesResponse(response.data, mintDetails.data.decimals, true, true)
    const marketOutcomeAccounts =  parsedMarketPrices.marketOutcomeAccounts.map((marketOutcomeAccount) => {
        return marketOutcomeAccount.account
    })
    const matchedTotal = matchedTotalFromParsedOutcomeAccounts(marketOutcomeAccounts)
    const liquidityTotal = liquidityTotalFromParsedMarketPrices(parsedMarketPrices.marketPrices)
    const marketOutcomesSummary = parsedMarketPrices.marketOutcomeAccounts.map((outcome) => {
        return {
            outcome: outcome.account.title,
            latestMatchedPrice: outcome.account.latestMatchedPrice,
            matchedTotal: outcome.account.matchedTotal
        }
    })
    const pendingOrderSummary = parsedMarketPrices.pendingOrders.map((pendingOrder) => {
        return {
            outcomeIndex: pendingOrder.account.marketOutcomeIndex,
            forOutcome: pendingOrder.account.forOutcome,
            stake: pendingOrder.account.stake,
            expectedPrice: pendingOrder.account.expectedPrice
        }
    })
    const marketPricesSummary = parsedMarketPrices.marketPrices.map((marketPrice) => {
        return {
            outcome: marketPrice.marketOutcome,
            outcomeIndex: marketPrice.marketOutcomeIndex,
            price: marketPrice.price,
            forOutcome: marketPrice.forOutcome,
            liquidity: marketPrice.matchingPool.liquidityAmount,
        }
    })
    logJson(
        {
            pendingOrderSummary: pendingOrderSummary,
            marketPriceSummary: marketPricesSummary,
            marketTitle: parsedMarketPrices.market.title,
            marketLock: new Date(parsedMarketPrices.market.marketLockTimestamp * 1000),
            liquidityTotal: liquidityTotal,
            matchedTotal: matchedTotal,
            marketOutcomesSummary: marketOutcomesSummary,
            totalUnmatchedOrders: parsedMarketPrices.pendingOrders.length,
        }
    )
}

export function parseMarketPricesResponse(marketPricesAndPendingOrders: MarketPricesAndPendingOrders, mintDecimals: number, reduceLadder: boolean = true, onlyShowOrdersInQueue: boolean = true){
    marketPricesAndPendingOrders.market = parseMarketAccount(marketPricesAndPendingOrders.market)
    marketPricesAndPendingOrders.marketOutcomeAccounts.map((marketOutcomeAccount) => {
        marketOutcomeAccount.account = parseMarketOutcomeAccount(marketOutcomeAccount.account, mintDecimals, reduceLadder)
    })
    marketPricesAndPendingOrders.marketPrices.map((marketPrices) => {
        marketPrices = parseMarketPrice(marketPrices, mintDecimals, onlyShowOrdersInQueue)
    })
    marketPricesAndPendingOrders.pendingOrders.map(order => {
        order.account = parseOrderAccount(order.account, mintDecimals)
    })
    return marketPricesAndPendingOrders
}

function matchedTotalFromParsedOutcomeAccounts(marketOutcomeAccounts: MarketOutcomeAccount[]){
    let marketMatchedTotal = 0
    marketOutcomeAccounts.map((marketOutcome) => {
        marketMatchedTotal += marketOutcome.matchedTotal
    })
    return marketMatchedTotal
}

function liquidityTotalFromParsedMarketPrices(marketPrices: MarketPrice[]){
    let marketLiquidity = 0
    marketPrices.map((marketPrice) => {
        marketLiquidity += marketPrice.matchingPool.liquidityAmount
    })
    return marketLiquidity
}

const args = getProcessArgs(["marketPk"], "npm run getMarketSummary")
getMarketSummary(new PublicKey(args.marketPk))