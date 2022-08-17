import { getMarketAccountsByEvent } from "@betdexlabs/betdex-client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

async function getMarkets(eventAccountPk: PublicKey){
    const program = await getProgram()
    const markets = await getMarketAccountsByEvent(program, eventAccountPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const eventPk = new PublicKey("1aKQHeedwwMiyqDXC7wZzhRdp2qUmxpbVWMbuwhYpwT")
getMarkets(eventPk)
