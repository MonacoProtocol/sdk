import { Subcategory } from "@monaco-protocol/event-client";
import {
  getConnectionAndSigner,
  getProcessArgs,
  logJson
} from "../utils/utils";
import { PublicKey } from "@solana/web3.js";

const getSubcategory = async (publicKey: PublicKey) => {
  const { connection } = await getConnectionAndSigner();

  const category = await Subcategory.fetch(connection, publicKey);
  logJson(category);
};

const args = getProcessArgs(["publicKey"], "npm run getSubcategory");
getSubcategory(new PublicKey(args.publicKey));
