import { MarketPositions } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "../utils/utils";
import { AnchorProvider } from "@coral-xyz/anchor";
import { parseResponseData } from "../parsers/parsers";

async function getMarketPositionForProvider(marketPk: PublicKey) {
  const program = await getProgram();
  const provider = program.provider as AnchorProvider;
  const response = await MarketPositions.marketPositionQuery(program)
    .filterByMarket(marketPk)
    .fetch();
  response.data = parseResponseData(response.data);
  logResponse(response);
}

const args = getProcessArgs(
  ["marketPk"],
  "npm run getMarketPositionsForMarket"
);
getMarketPositionForProvider(new PublicKey(args.marketPk));
