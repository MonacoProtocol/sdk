import { getMarketOutcomesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function marketOutcomes(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await getMarketOutcomesByMarket(program, marketPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["marketPk"], "npm run getMarketOutcomes")
const marketPk = new PublicKey(processArgs.marketPk)
marketOutcomes(marketPk)
