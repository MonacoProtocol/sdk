import { cancelOrdersForMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function cancelOrders(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await cancelOrdersForMarket(program, marketPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["marketPk"], "npm run cancelOrders")
const marketPk = new PublicKey(processArgs.marketPk)
cancelOrders(marketPk)
