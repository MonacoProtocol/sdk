import { getMarketAccounts } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";
import { parseResponseData } from "./parsers/parsers";

async function getAllMarketAccounts(
  marketPk: PublicKey,
  backing: boolean,
  marketOutcomeIndex: number,
  price: number
) {
  const program = await getProgram();
  const response = await getMarketAccounts(
    program,
    marketPk,
    backing,
    marketOutcomeIndex,
    price
  );
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(
  ["marketPk", "forOutcome", "marketOutcomeIndex", "price"],
  "npm run getMarketAccounts"
);
getAllMarketAccounts(
  new PublicKey(args.marketPk),
  args.forOutcome === "true",
  parseFloat(args.marketOutcomeIndex),
  parseFloat(args.price)
);
