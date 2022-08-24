import { getMarketAccounts } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

async function getBetOrderbyPk(
    marketPk: PublicKey,
    backing: boolean,
    marketOutcomeIndex: number,
    odds: number,
) {
    const program = await getProgram()
    const markets = await getMarketAccounts(
        program,
        marketPk,
        backing,
        marketOutcomeIndex,
        odds,
    )
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const marketPk = new PublicKey("4R6w8Q52jjnXdJB26K9ML9zUSzthscP3EWhvNZ2WyiAS")
getBetOrderbyPk(marketPk, false, 0, 3)