import { EventGroup } from "@monaco-protocol/event-client";
import {
  getConnectionAndSigner,
  getProcessArgs,
  logJson
} from "../utils/utils";
import { PublicKey } from "@solana/web3.js";

const getEventGroup = async (publicKey: PublicKey) => {
  const { connection } = await getConnectionAndSigner();

  const category = await EventGroup.fetch(connection, publicKey);
  logJson(category);
};

const args = getProcessArgs(["publicKey"], "npm run getEventGroup");
getEventGroup(new PublicKey(args.publicKey));
