import { Orders, OrderStatusFilter } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import {
  getProgram,
  getProcessArgs,
  orderStatusFromString,
  logResponse
} from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function getBetOrders(marketPk: PublicKey, status: OrderStatusFilter) {
  const program = await getProgram();
  const response = await Orders.orderQuery(program)
    .filterByMarket(marketPk)
    .filterByStatus(status)
    .fetch();
  response.data = parseResponseData(response.data);
  logResponse(response);
}

const args = getProcessArgs(
  ["marketPk", "orderStatus"],
  "npm run getOrdersForMarketByStatus"
);
getBetOrders(
  new PublicKey(args.marketPk),
  orderStatusFromString(args.orderStatus)
);
