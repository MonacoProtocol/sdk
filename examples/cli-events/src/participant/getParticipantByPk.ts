import { Participant } from "@monaco-protocol/event-client";
import {
  getConnectionAndSigner,
  getProcessArgs,
  logJson
} from "../utils/utils";
import { PublicKey } from "@solana/web3.js";

const getParticipant = async (publicKey: PublicKey) => {
  const { connection } = await getConnectionAndSigner();

  const category = await Participant.fetch(connection, publicKey);
  logJson(category);
};

const args = getProcessArgs(["publicKey"], "npm run getParticipant");
getParticipant(new PublicKey(args.publicKey));
