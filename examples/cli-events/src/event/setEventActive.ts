import {
  Event,
  activateEvent,
  confirmTransaction,
  deactivateEvent,
  signAndSendInstructions
} from "@monaco-protocol/event-client";
import { PublicKey } from "@solana/web3.js";
import {
  getConnectionAndSigner,
  getProcessArgs,
  log,
  logJson
} from "../utils/utils";

const toggleActive = async (eventPk: PublicKey, setActive: boolean) => {
  const { connection, keypair } = await getConnectionAndSigner();
  const event = await Event.fetch(connection, eventPk);
  if (event.active === setActive) {
    log("Event is already in the desired state");
    logJson(event);
    return;
  }
  const args = {
    code: event.code
  };
  const accounts = {
    event: eventPk,
    subcategory: event.subcategory,
    authority: keypair.publicKey
  };

  let instruction = activateEvent(args, accounts);
  if (!setActive) {
    instruction = deactivateEvent(args, accounts);
  }
  const signature = await signAndSendInstructions(connection, keypair, [
    instruction
  ]);
  await confirmTransaction(connection, signature);
  const updatedEvent = await Event.fetch(connection, eventPk);
  logJson(updatedEvent);
};

const args = getProcessArgs(["eventPk", "setActive"], "npm run setEventActive");
toggleActive(new PublicKey(args.eventPk), args.setActive === "true");
