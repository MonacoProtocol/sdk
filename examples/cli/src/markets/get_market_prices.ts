import { getMarketPrices } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "../utils/utils";
import {
  parseEmptyQueueItemsFromMarketPrices,
  parseResponseData
} from "../parsers/parsers";

async function getMarketPricesByPk(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getMarketPrices(program, marketPk);
  response.data = parseResponseData(response.data);
  response.data.marketPrices = parseEmptyQueueItemsFromMarketPrices(
    response.data.marketPrices
  );

  // remove price ladder from response as they contain 317 items, comment out line below to see full ladder
  response.data.marketOutcomeAccounts.forEach((outcome) => {
    outcome.account.priceLadder = [];
  });

  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarketPrices");
getMarketPricesByPk(new PublicKey(args.marketPk));
