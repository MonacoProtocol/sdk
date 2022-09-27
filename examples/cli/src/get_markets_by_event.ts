import { getMarketAccountsByEvent } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getMarkets(eventAccountPk: PublicKey){
    const program = await getProgram()
    const response = await getMarketAccountsByEvent(program, eventAccountPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["eventPk"], "npm run getMarketsByEvent")
const eventPk = new PublicKey(processArgs.eventPk)
getMarkets(eventPk)
