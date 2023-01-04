import { getMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getMarketByPk(marketPk: PublicKey){
    const program = await getProgram()
    const response = await getMarket(program, marketPk)
    logResponse(response)
}

const args = getProcessArgs(["marketPk"], "npm run getMarket")
getMarketByPk(new PublicKey(args.marketPk))
