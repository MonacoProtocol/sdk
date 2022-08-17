import { getMarketPrices } from "@betdexlabs/betdex-client";
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

const eventPk = new PublicKey("4R6w8Q52jjnXdJB26K9ML9zUSzthscP3EWhvNZ2WyiAS")
getMarketPricesByPk(eventPk)
