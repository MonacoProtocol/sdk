import { getOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";

async function getBetOrderbyPk(betOrderPk: PublicKey){
    const program = await getProgram()
    const markets = await getOrder(program, betOrderPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["betOrderPk"], "npm run getOrder")
const betOrderPk = new PublicKey(processArgs.betOrderPk)
getBetOrderbyPk(betOrderPk)
