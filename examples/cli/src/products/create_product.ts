import { createProduct } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse, ProtocolTypes } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function newProduct() {
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const productTitle = "MONACO_PROTOCOL_SDK";
  const commissionRate = 1.23;
  const commissionEscrow = program.provider.publicKey;
  const response = await createProduct(program, productTitle, commissionRate, commissionEscrow);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

getProcessArgs([], "npm run createProduct");
newProduct();
