import { MarketPricesAndPendingOrders } from "@monaco-protocol/client"
import { parseMarketOutcomeAccount } from "./market_outcome_parser"
import { parseMarketAccount } from "./market_parser"
import { parseMarketPrice } from "./market_price_parser"
import { parseOrderAccount } from "./order_parser"

export function parseMarketPricesAndPendingOrders(marketPricesAndPendingOrders: MarketPricesAndPendingOrders, mintDecimals: number, reduceLadder: boolean = true, onlyShowOrdersInQueue: boolean = true){
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
