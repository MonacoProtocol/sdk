import { getMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

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

const marketPk = new PublicKey("CCJqgUHtTZcMtkjAuqJuTJoRA78gWpgeRRtbt7tNcZVi")
getMarketByPk(marketPk)
