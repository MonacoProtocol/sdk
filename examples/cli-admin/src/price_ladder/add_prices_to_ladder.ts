import { DEFAULT_PRICE_LADDER, addPricesToPriceLadder, findPriceLadderPda } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs, logResponse } from "../utils";

async function addPrices(priceLadderName: string) {
  const program = await getProgram();
  const pda = findPriceLadderPda(program, priceLadderName);
  const batchSize = 15;
  const response = await addPricesToPriceLadder(program, pda.data.pda, DEFAULT_PRICE_LADDER, batchSize);
  logResponse(response);
}

const args = getProcessArgs(["priceLadderName"], "npm run addPricesToLadder");
addPrices(args.priceLadderName);
