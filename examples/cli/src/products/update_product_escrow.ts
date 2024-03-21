import { updateProductCommissionEscrow } from "@monaco-protocol/client";
import {
  getProgram,
  getProcessArgs,
  logResponse,
  ProtocolTypes
} from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function updateEscrow() {
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const productTitle = "SDK_EXAMPLE_PRODUCT";
  const authorityPk = program.provider.publicKey;
  // Setting as the same Pk as this is just for example purposes
  const newEscrowPk = program.provider.publicKey;
  const response = await updateProductCommissionEscrow(
    program,
    productTitle,
    newEscrowPk,
    authorityPk
  );
  response.data = parseResponseData(response.data);
  logResponse(response);
}

getProcessArgs([], "npm run updateProductEscrow");
updateEscrow();
