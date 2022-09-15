import { getMarketAccounts } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

async function getAllMarketAccounts(
    marketPk: PublicKey,
    backing: boolean,
    marketOutcomeIndex: number,
    price: number,
) {
    const program = await getProgram()
    const markets = await getMarketAccounts(
        program,
        marketPk,
        backing,
        marketOutcomeIndex,
        price,
    )
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const marketPk = new PublicKey("CCJqgUHtTZcMtkjAuqJuTJoRA78gWpgeRRtbt7tNcZVi")
getAllMarketAccounts(marketPk, false, 0, 3)
