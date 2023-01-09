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

    const forAndAgainst = [true, false]

    const pendingOrderSummary = {}
    parsedMarketPrices.marketOutcomeAccounts.map((outcome) => {
        pendingOrderSummary[outcome.account.title] = forAndAgainst.map((forAgainst) => {
            let forAgainstSummary = {}
            const filteredOrders = parsedMarketPrices.pendingOrders.filter((pendingOrder) => pendingOrder.account.forOutcome === forAgainst && pendingOrder.account.marketOutcomeIndex === outcome.account.index)
            let forOrAgainst = "Against"
            if (forAgainst) forOrAgainst = "For"
            forAgainstSummary[forOrAgainst] = filteredOrders.map((filteredOrder) => {
                return {
                    stake: filteredOrder.account.stake,
                    price: filteredOrder.account.expectedPrice
                }
            })
            return forAgainstSummary
        })
    })
    const pendingOrderSummary2 = parsedMarketPrices.pendingOrders.map((pendingOrder) => {
        return {
            outcome: parsedMarketPrices.marketOutcomeAccounts[pendingOrder.account.marketOutcomeIndex].account.title,
            forOutcome: pendingOrder.account.forOutcome,
            stake: pendingOrder.account.stake,
            expectedPrice: pendingOrder.account.expectedPrice
        }
    })

    const marketPriceSummary = {}
    parsedMarketPrices.marketOutcomeAccounts.map((outcome) => {
        marketPriceSummary[outcome.account.title] = forAndAgainst.map((forAgainst) => {
            let forAgainstSummary = {}
            const filteredPrices = parsedMarketPrices.marketPrices.filter((marketPrice) => marketPrice.forOutcome === forAgainst && marketPrice.marketOutcome == outcome.account.title)
            let forOrAgainst = "Against"
            if (forAgainst) forOrAgainst = "For"
            forAgainstSummary[forOrAgainst] = filteredPrices.map((filteredPrice) => {
                return {
                    price: filteredPrice.price,
                    liquidity: filteredPrice.matchingPool.liquidityAmount
                }
            })
            return forAgainstSummary
        })
    })
    logJson(
        {
            pendingOrderSummary: pendingOrderSummary,
            marketPriceSummary: marketPriceSummary,
            marketTitle: parsedMarketPrices.market.title,
            marketLock: new Date(parsedMarketPrices.market.marketLockTimestamp * 1000),
            liquidityTotal: liquidityTotal,
            matchedTotal: matchedTotal,
            marketOutcomesSummary: marketOutcomesSummary,
            totalUnmatchedOrders: parsedMarketPrices.pendingOrders.length
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
