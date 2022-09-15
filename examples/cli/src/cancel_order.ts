import { cancelOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

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

const orderPk = new PublicKey("Fy7WiqBy6MuWfnVjiPE8HQqkeLnyaLwBsk8cyyJ5WD8X")
cancelOrderbyPk(orderPk)
