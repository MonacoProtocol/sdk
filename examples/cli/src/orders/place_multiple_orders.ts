import { PublicKey } from "@solana/web3.js";
import {
  buildOrderInstructionUIStake,
  confirmTransaction,
  getMarketOutcomesByMarket,
  signAndSendInstructionsBatch
} from "@monaco-protocol/client";
import {
  getProgram,
  getProcessArgs,
  logResponse,
  SDK_PRODUCT,
  log
} from "../utils/utils";

export async function placeMultipleOrders(marketPk: PublicKey) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const forOutcome = true;
  const price1 = 2;
  const price2 = 1.98;
  const stake = 1;
  // temp as any due to missing field on type
  const market = (await getMarketOutcomesByMarket(program, marketPk)) as any;
  const order1 = await buildOrderInstructionUIStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price1,
    stake,
    market.data.marketOutcomeAccounts[marketOutcomeIndex].account.prices,
    SDK_PRODUCT
  );
  const order2 = await buildOrderInstructionUIStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price2,
    stake,
    market.data.marketOutcomeAccounts[marketOutcomeIndex].account.prices,
    SDK_PRODUCT
  );
  const orders = [order1.data.instruction, order2.data.instruction];
  const response = await signAndSendInstructionsBatch(program, orders, 2);
  // optional confirmation step, as we know there will only be one signature we are using the first one in the response array
  const confirm = await confirmTransaction(
    program,
    response.data.signatures[0]
  );
  logResponse(response);
  logResponse(confirm);
}

const args = getProcessArgs(["marketPk"], "npm run placeMultipleOrders");
placeMultipleOrders(new PublicKey(args.marketPk));
