import { cancelOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function cancelOrderbyPk(orderPk: PublicKey){
    const program = await getProgram()
    const markets = await cancelOrder(program, orderPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["orderPk"], "npm run cancelOrder")
const orderPk = new PublicKey(processArgs.orderPk)
cancelOrderbyPk(orderPk)
