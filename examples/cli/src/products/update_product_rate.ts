import { createProduct, updateProductCommissionRate } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse, ProtocolTypes } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";
import { PublicKey } from "@solana/web3.js";

async function updateRate(newRate: number) {
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const productTitle = "MONACO_PROTOCOL_SDK";
  const authorityPk = program.provider.publicKey;
  const response = await updateProductCommissionRate(program, productTitle, newRate, authorityPk);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["newRate"], "npm run createProduct");
updateRate(parseFloat(args.newRate));
