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

const mintToken = new PublicKey("Qegj89Mzpx4foJJqkj6B4551aiGrgaV33Dtcm7WZ9kf")
const marketStatus = MarketStatus.Open
getMarkets(marketStatus, mintToken)
