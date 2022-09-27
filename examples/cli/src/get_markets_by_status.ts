import { getMarketAccountsByStatus, MarketStatus } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, marketStatusFromString, logResponse } from "./utils";

async function getMarkets(status: MarketStatus){
    const program = await getProgram()
    const response = await getMarketAccountsByStatus(program, status)
    logResponse(response)
}

const processArgs = getProcessArgs(["marketStatus"], "npm run getMarketsByStatus")
const marketStatus = marketStatusFromString(processArgs.marketStatus)
getMarkets(marketStatus)
