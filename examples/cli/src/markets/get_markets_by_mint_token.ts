import {
  getMarketAccountsByStatusAndMintAccount,
  MarketStatusFilter
} from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import {
  getProgram,
  getProcessArgs,
  marketStatusFromString,
  logResponse
} from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function getMarkets(
  mintToken: PublicKey,
  marketStatus: MarketStatusFilter
) {
  const program = await getProgram();
  const response = await getMarketAccountsByStatusAndMintAccount(
    program,
    marketStatus,
    mintToken
  );
  response.data = parseResponseData(response.data)
  logResponse(response);
}

// The Monaco Protocol example token: Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH
const args = getProcessArgs(
  ["mintToken", "marketStatus"],
  "npm run getMarketsByMintToken"
);
getMarkets(
  new PublicKey(args.mintToken),
  marketStatusFromString(args.marketStatus)
);
