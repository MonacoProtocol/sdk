import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake, getMarketOutcomesByMarket } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse, SDK_PRODUCT } from "../utils/utils";

export async function placeOrder(marketPk: PublicKey, forOutcome: boolean = true) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const price = 2;
  const stake = 1;
  // temp as any due to missing field on type
  const market = await getMarketOutcomesByMarket(program, marketPk) as any;
  const response = await createOrderUiStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price,
    stake,
    market.data.marketOutcomeAccounts[marketOutcomeIndex].account.prices,
    SDK_PRODUCT
  );
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run placeForOrder");
placeOrder(new PublicKey(args.marketPk));
