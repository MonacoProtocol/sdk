import { getMarketPrices } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getMarketPricesByPk(marketPk: PublicKey){
    const program = await getProgram()
    const response = await getMarketPrices(program, marketPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["marketPk"], "npm run getMarketPrices")
const marketPk = new PublicKey(processArgs.marketPk)
getMarketPricesByPk(marketPk)
