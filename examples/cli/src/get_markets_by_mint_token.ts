import { getMarketAccountsByStatusAndMintAccount, MarketStatus } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs, marketStatusFromString } from "./utils";

async function getMarkets(mintToken: PublicKey, marketStatus: MarketStatus){
    const program = await getProgram()
    const markets = await getMarketAccountsByStatusAndMintAccount(program, marketStatus, mintToken)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

// The Monaco Protocol example token: Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH
const processArgs = getProcessArgs(["mintToken", "marketStatus"], "npm run getMarketsByMintToken")
const mintToken = new PublicKey(processArgs.mintToken)
const marketStatus = marketStatusFromString(processArgs.marketStatus)
getMarkets(mintToken, marketStatus)
