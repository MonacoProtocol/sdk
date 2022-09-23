import { getMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function getMarketByPk(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await getMarket(program, marketPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["marketPk"], "npm run getMarket")
const marketPk = new PublicKey(processArgs.marketPk)
getMarketByPk(marketPk)
