import { getTradesForMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function getTrades(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await getTradesForMarket(program, marketPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["marketPk"], "npm run getTradesForMarket")
const marketPk = new PublicKey(processArgs.marketPk)
getTrades(marketPk)
