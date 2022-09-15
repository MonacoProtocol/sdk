import { getOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

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

const betOrderPk = new PublicKey("Fy7WiqBy6MuWfnVjiPE8HQqkeLnyaLwBsk8cyyJ5WD8X")
getBetOrderbyPk(betOrderPk)
