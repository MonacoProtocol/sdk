import { getMarketOutcomeTitlesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

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

const marketPk = new PublicKey("CCJqgUHtTZcMtkjAuqJuTJoRA78gWpgeRRtbt7tNcZVi")
marketOutcomeTitles(marketPk)
