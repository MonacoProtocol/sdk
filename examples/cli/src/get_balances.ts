import { getWalletTokenBalancesWithSol } from "@monacoprotocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log } from "./utils";

async function getBalances(tokenMints: PublicKey[]){
    const program = await getProgram()
    const markets = await getWalletTokenBalancesWithSol(program, tokenMints)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const exampleTokenMint = new PublicKey("Qegj89Mzpx4foJJqkj6B4551aiGrgaV33Dtcm7WZ9kf")
getBalances([exampleTokenMint])
