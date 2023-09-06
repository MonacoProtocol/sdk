import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse } from "../utils/utils";

async function placeOrder(marketPk: PublicKey) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const forOutcome = true;
  const price = 2;
  const stake = 1;
  const sdkExampleProductPk = new PublicKey('bwCvZn6Hs4v51tvwFdAtAyJXzLddjgUMnQn2SehXmhF')
  const response = await createOrderUiStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price,
    stake,
    sdkExampleProductPk
  );
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run placeForOrder");
placeOrder(new PublicKey(args.marketPk));
