import { getMarketAccountsByStatus, MarketStatus } from "@monaco-protocol/client";
import { getProgram, logJson, log, getProcessArgs, marketStatusFromString } from "./utils";

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

const processArgs = getProcessArgs(["marketStatus"], "npm run getMarketsByStatus")
const marketStatus = marketStatusFromString(processArgs.marketStatus)
getMarkets(marketStatus)
