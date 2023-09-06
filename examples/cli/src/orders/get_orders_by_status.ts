import {
  getOrdersByStatusForProviderWallet,
  OrderStatusFilter
} from "@monaco-protocol/client";
import {
  getProgram,
  getProcessArgs,
  orderStatusFromString,
  logResponse
} from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function getBetOrders(status: OrderStatusFilter) {
  const program = await getProgram();
  const response = await getOrdersByStatusForProviderWallet(program, status);
  response.data = parseResponseData(response.data);
  logResponse(response);
}

const args = getProcessArgs(["orderStatus"], "npm run getOrdersByStatus");
getBetOrders(orderStatusFromString(args.orderStatus));
