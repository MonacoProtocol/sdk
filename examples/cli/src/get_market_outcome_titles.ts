import { getMarketOutcomeTitlesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function marketOutcomeTitles(marketPk: PublicKey){
    const program = await getProgram()
    const response = await getMarketOutcomeTitlesByMarket(program, marketPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["marketPk"], "npm run getMarketOutcomeTitles")
const marketPk = new PublicKey(processArgs.marketPk)
marketOutcomeTitles(marketPk)
