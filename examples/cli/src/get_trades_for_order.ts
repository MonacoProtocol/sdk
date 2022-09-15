import { getTradesForOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

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

const orderPk = new PublicKey("Ergn5AUNWpfwKbhFm82Ja9ZGDfmizcyKy7QS4Ur1piJG")
getTrades(orderPk)
