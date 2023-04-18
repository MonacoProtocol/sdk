import { Orders, OrderStatusFilter } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { parseOrderAccount } from "./parsers/order_parser";
import {
  getProgram,
  getProcessArgs,
  orderStatusFromString,
  logResponse
} from "./utils";

async function getBetOrders(marketPk: PublicKey, status: OrderStatusFilter) {
  const program = await getProgram();
  const response = await Orders.orderQuery(program)
    .filterByMarket(marketPk)
    .filterByStatus(status)
    .fetch();
  response.data.orderAccounts.map((order) => {
    order.account = parseOrderAccount(order.account, 9)
  })
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
