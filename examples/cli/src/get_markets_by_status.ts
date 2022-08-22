import { getMarketAccountsByStatus, MarketStatus } from "@monaco-protocol/client";
import { getProgram, logJson, log } from "./utils";

async function getMarkets(status: MarketStatus){
    const program = await getProgram()
    const markets = await getMarketAccountsByStatus(program, status)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

getMarkets(MarketStatus.Open)
