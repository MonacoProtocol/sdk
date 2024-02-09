import { getMarketOutcomesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs } from "../utils/utils";

async function marketPriceLadder(marketPk: PublicKey) {
  const program = await getProgram();
  const market = await getMarketOutcomesByMarket(program, marketPk) as any;
  // assuming market has been created with a price ladder account
  const pricesAccount = market.data.marketOutcomeAccounts[0].account.prices
  const response = await program.account.priceLadder.fetch(pricesAccount)
  console.log(JSON.stringify(response, null, 3))
}

const args = getProcessArgs(["marketPk"], "npm run getMarketPriceLadder");
marketPriceLadder(new PublicKey(args.marketPk));
