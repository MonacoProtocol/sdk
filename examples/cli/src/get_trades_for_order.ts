import { getTradesForOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function getTrades(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await getTradesForOrder(program, marketPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["betOrderPk"], "npm run getTradesForOrder")
const betOrderPk = new PublicKey(processArgs.betOrderPk)
getTrades(betOrderPk)
