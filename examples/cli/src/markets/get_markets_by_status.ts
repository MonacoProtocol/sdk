import {
  getMarketAccountsByStatus,
  MarketStatusFilter
} from "@monaco-protocol/client";
import {
  getProgram,
  getProcessArgs,
  marketStatusFromString,
  logResponse
} from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function getMarkets(status: MarketStatusFilter) {
  const program = await getProgram();
  const response = await getMarketAccountsByStatus(program, status);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["marketStatus"], "npm run getMarketsByStatus");
getMarkets(marketStatusFromString(args.marketStatus));
