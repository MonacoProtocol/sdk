import { getMarketAccountsByStatusAndMintAccount, MarketStatus } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

async function getMarkets(marketStatus: MarketStatus, mintToken: PublicKey){
    const program = await getProgram()
    const markets = await getMarketAccountsByStatusAndMintAccount(program, marketStatus, mintToken)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const mintToken = new PublicKey("Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH")
const marketStatus = MarketStatus.Open
getMarkets(marketStatus, mintToken)
