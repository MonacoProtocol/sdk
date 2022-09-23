import { getMarketOutcomeTitlesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function marketOutcomeTitles(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await getMarketOutcomeTitlesByMarket(program, marketPk)
    if (!markets){
        log(markets)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["marketPk"], "npm run getMarketOutcomeTitles")
const marketPk = new PublicKey(processArgs.marketPk)
marketOutcomeTitles(marketPk)
