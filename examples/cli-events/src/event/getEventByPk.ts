import { Event } from "@monaco-protocol/event-client";
import {
  getConnectionAndSigner,
  getProcessArgs,
  logJson
} from "../utils/utils";
import { PublicKey } from "@solana/web3.js";

const getEvent = async (publicKey: PublicKey) => {
  const { connection } = await getConnectionAndSigner();

  const category = await Event.fetch(connection, publicKey);
  logJson(category);
};

const args = getProcessArgs(["publicKey"], "npm run getEvent");
getEvent(new PublicKey(args.publicKey));
