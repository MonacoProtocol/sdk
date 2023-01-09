import { getWalletTokenBalancesWithSol } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getBalances(tokenMints: PublicKey[]) {
  const program = await getProgram();
  const response = await getWalletTokenBalancesWithSol(program, tokenMints);
  logResponse(response);
}

const exampleTokens = [
  new PublicKey("Qegj89Mzpx4foJJqkj6B4551aiGrgaV33Dtcm7WZ9kf"),
  new PublicKey("Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH")
];
getProcessArgs([], "npm run getBalances");
getBalances(exampleTokens);
