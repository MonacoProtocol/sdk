import { getWalletTokenBalancesWithSol } from "@monaco-protocol/client";
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

const exampleTokenMint1 = new PublicKey("Qegj89Mzpx4foJJqkj6B4551aiGrgaV33Dtcm7WZ9kf")
const exampleTokenMint2 = new PublicKey("Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH")
getBalances([exampleTokenMint1, exampleTokenMint2])
