import { MarketStatusFilter, Markets } from "@monaco-protocol/client";
import { getProcessArgs, getProgram } from "../utils/utils";

const getStatusCount = async () => {
  const program = await getProgram();
  const statuses = [
    MarketStatusFilter.Initializing,
    MarketStatusFilter.Open,
    MarketStatusFilter.Settled,
    MarketStatusFilter.Voided,
    MarketStatusFilter.ReadyForSettlement,
    MarketStatusFilter.ReadyToVoid,
    MarketStatusFilter.ReadyToClose
  ];
  const allStatuses = [];
  for (const marketStatus of statuses) {
    const markets = await Markets.marketQuery(program)
      .filterByStatus(marketStatus)
      .fetch();

    allStatuses.push({
      status: MarketStatusFilter[marketStatus],
      count: markets.data.markets.length
    });
  }
  console.table(allStatuses);
};

getProcessArgs([], "npm run getMarketStatusCount");
getStatusCount();
