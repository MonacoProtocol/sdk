import { Category } from "@monaco-protocol/event-client";
import {
  getConnectionAndSigner,
  getProcessArgs,
  logJson
} from "../utils/utils";
import { PublicKey } from "@solana/web3.js";

const getCategory = async (publicKey: PublicKey) => {
  const { connection } = await getConnectionAndSigner();

  const category = await Category.fetch(connection, publicKey);
  logJson(category);
};

const args = getProcessArgs(["publicKey"], "npm run getCategory");
getCategory(new PublicKey(args.publicKey));
