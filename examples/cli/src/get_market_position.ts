import { getMarketPosition } from "@betdexlabs/betdex-client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";
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

const eventPk = new PublicKey("4R6w8Q52jjnXdJB26K9ML9zUSzthscP3EWhvNZ2WyiAS")
getMarketPositionForProvider(eventPk)
