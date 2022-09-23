import { getMarketPosition } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs } from "./utils";
import { AnchorProvider } from "@project-serum/anchor";

async function getMarketPositionForProvider(marketPk: PublicKey){
    const program = await getProgram()
    const provider = program.provider as AnchorProvider
    const markets = await getMarketPosition(program, marketPk, provider.wallet.publicKey)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["marketPk"], "npm run getMarketPosition")
const marketPk = new PublicKey(processArgs.marketPk)
getMarketPositionForProvider(marketPk)
