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
  const statusPromises = statuses.map((status) =>
    Markets.marketQuery(program).filterByStatus(status).fetchPublicKeys()
  );
  const resolvePromises = await Promise.all(statusPromises);
  const allStatuses = [];
  for (const marketStatus of statuses) {
    allStatuses.push({
      status: MarketStatusFilter[marketStatus],
      count: resolvePromises[statuses.indexOf(marketStatus)].data.publicKeys.length
    });
  }
  console.table(allStatuses);
};

getProcessArgs([], "npm run getMarketCount");
getStatusCount();
