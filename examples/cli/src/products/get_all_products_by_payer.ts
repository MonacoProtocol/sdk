import { Products } from "@monaco-protocol/client";
import {
  getProgram,
  getProcessArgs,
  logResponse,
  ProtocolTypes
} from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";
import { PublicKey } from "@solana/web3.js";

async function getAllProductsByPayer(payerPk: PublicKey) {
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const response = await Products.productQuery(program)
    .filterByPayer(payerPk)
    .fetch();
  response.data = parseResponseData(response.data);
  logResponse(response);
}

const args = getProcessArgs(["payerPk"], "npm run getAllProductsByPayer");
getAllProductsByPayer(new PublicKey(args.payerPk));
