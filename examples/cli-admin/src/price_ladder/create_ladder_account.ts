import { createPriceLadder, findPriceLadderPda } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs, logResponse } from "../utils";

async function createPriceLadderAccount(priceLadderName: string) {
  const program = await getProgram();
  const pda = findPriceLadderPda(program, priceLadderName);
  const response = await createPriceLadder(program, pda.data.pda, priceLadderName, 317);
  logResponse(response);
}

const args = getProcessArgs(["priceLadderName"], "npm run createLadder");
createPriceLadderAccount(args.priceLadderName);

