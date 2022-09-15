import { getMarketPrices } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

async function getMarketPricesByPk(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await getMarketPrices(program, marketPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const eventPk = new PublicKey("Dr8mauGvrpfQqT4y7FdrmMzq37FDijHfvyHvd3wmKEbw")
getMarketPricesByPk(eventPk)
