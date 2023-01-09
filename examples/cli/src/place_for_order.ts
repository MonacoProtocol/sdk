import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function placeOrder(marketPk: PublicKey) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const forOutcome = true;
  const price = 2;
  const stake = 1;
  const response = await createOrderUiStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price,
    stake
  );
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run placeForOrder");
placeOrder(new PublicKey(args.marketPk));
