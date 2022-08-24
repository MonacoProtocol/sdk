import { getMarketOutcomeAccounts } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

async function marketOutcomeAccounts(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await getMarketOutcomeAccounts(program, marketPk, ['Rangers', 'Draw', 'PSV Eindhoven'])
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const marketPk = new PublicKey("4R6w8Q52jjnXdJB26K9ML9zUSzthscP3EWhvNZ2WyiAS")
marketOutcomeAccounts(marketPk)
