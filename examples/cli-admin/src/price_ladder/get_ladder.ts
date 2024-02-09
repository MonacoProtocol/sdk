import { findPriceLadderPda } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs } from "../utils";

async function getLadder(priceLadderName: string) {
  const program = await getProgram();
  const pda = findPriceLadderPda(program, priceLadderName);
  const response = await program.account.priceLadder.fetch(pda.data.pda);
  console.log(JSON.stringify(response));
}

const args = getProcessArgs(["priceLadderName"], "npm run getLadder");
getLadder(args.priceLadderName);

