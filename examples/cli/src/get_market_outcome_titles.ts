import { getMarketOutcomeTitlesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function marketOutcomeTitles(marketPk: PublicKey){
    const program = await getProgram()
    const response = await getMarketOutcomeTitlesByMarket(program, marketPk)
    console.table(response.data.marketOutcomeTitles)
}

const args = getProcessArgs(["marketPk"], "npm run getMarketOutcomeTitles")
marketOutcomeTitles(new PublicKey(args.marketPk))
