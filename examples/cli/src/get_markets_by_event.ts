import { getMarketAccountsByEvent } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getMarkets(eventAccountPk: PublicKey){
    const program = await getProgram()
    const response = await getMarketAccountsByEvent(program, eventAccountPk)
    logResponse(response)
}

const args = getProcessArgs(["eventPk"], "npm run getMarketsByEvent")
getMarkets(new PublicKey(args.eventPk))
