import { openMarket } from "@monaco-protocol/admin-client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function openNewMarket(marketPk: PublicKey){
    const program = await getProgram()
    const response = await openMarket(program, marketPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["marketPk"], "npm run openMarket")
const marketPk = new PublicKey(processArgs.marketPk)
openNewMarket(marketPk)
