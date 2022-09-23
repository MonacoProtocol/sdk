import { getTradesForMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getTrades(marketPk: PublicKey){
    const program = await getProgram()
    const response = await getTradesForMarket(program, marketPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["marketPk"], "npm run getTradesForMarket")
const marketPk = new PublicKey(processArgs.marketPk)
getTrades(marketPk)
