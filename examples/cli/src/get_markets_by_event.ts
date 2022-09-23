import { getMarketAccountsByEvent } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function getMarkets(eventAccountPk: PublicKey){
    const program = await getProgram()
    const markets = await getMarketAccountsByEvent(program, eventAccountPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["eventPk"], "npm run getMarketsByEvent")
const eventPk = new PublicKey(processArgs.eventPk)
getMarkets(eventPk)
