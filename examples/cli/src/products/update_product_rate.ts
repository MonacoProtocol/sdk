import { updateProductCommissionRate } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse, ProtocolTypes } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function updateRate(newRate: number) {
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const productTitle = "SDK_EXAMPLE_PRODUCT";
  const authorityPk = program.provider.publicKey;
  const response = await updateProductCommissionRate(program, productTitle, newRate, authorityPk);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["newRate"], "npm run updateProductRate");
updateRate(parseFloat(args.newRate));
