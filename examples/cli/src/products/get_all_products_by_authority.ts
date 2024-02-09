import { Products } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse, ProtocolTypes } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";
import { PublicKey } from "@solana/web3.js";

async function getAllProductsByAuth(authorityPk: PublicKey) {
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const response = await Products.productQuery(program).filterByAuthority(authorityPk).fetch();
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["authorityPk"], "npm run getAllProductsByAuthority");
getAllProductsByAuth(new PublicKey(args.authorityPk));
