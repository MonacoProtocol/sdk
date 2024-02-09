import { getProgram, getProcessArgs } from "../utils";

async function getLadders() {
  const program = await getProgram();
  const response = await program.account.priceLadder.all();
  console.log(JSON.stringify(response, null, 1));
}

getProcessArgs([], "npm run getLadders");
getLadders();
