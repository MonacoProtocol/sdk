import { updateProductAuthority } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse, ProtocolTypes } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

async function updateAuth() {
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const provider = program.provider as AnchorProvider;
  const productTitle = "MONACO_PROTOCOL_SDK";
  const authorityPk = program.provider.publicKey;
  // Setting as the same signer for example purposes
  const newAuthority = (provider.wallet as NodeWallet).payer
  const response = await updateProductAuthority(program, productTitle, newAuthority, authorityPk);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

getProcessArgs([], "npm run updateProductEscrow");
updateAuth();
