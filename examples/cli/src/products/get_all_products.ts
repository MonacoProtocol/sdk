import { Products } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse, ProtocolTypes } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function getAllProducts() {
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const response = await Products.productQuery(program).fetch();
  response.data = parseResponseData(response.data)
  logResponse(response);
}

getProcessArgs([], "npm run getAllProducts");
getAllProducts();
