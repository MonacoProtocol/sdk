import {
  Event,
  confirmTransaction,
  signAndSendInstructions,
  updateEventActualEndTimestamp,
  updateEventActualStartTimestamp,
  updateEventExpectedStartTimestamp,
  updateEventName
} from "@monaco-protocol/event-client";
import { PublicKey } from "@solana/web3.js";
import {
  getConnectionAndSigner,
  getProcessArgs,
  log,
  logJson
} from "../utils/utils";
import { BN } from "bn.js";

const updateEvent = async () => {
  const eventPk = new PublicKey("HuvT6vC8u3g1Q6qY2ztiFJk3oeHAtP1sZcnh6rVSAQA7");
  const eventName = "Week 1 | 2025";
  const expectedStartTimestamp = 2524608001;
  const actualStartTimestamp = 2524608001;
  const actualEndTimestamp = 2524608001;

  const { connection, keypair } = await getConnectionAndSigner();

  const event = await Event.fetch(connection, eventPk);

  if (!event) {
    return log(`Event not found with pk: ${eventPk.toString()}`);
  }

  const accounts = {
    event: eventPk,
    subcategory: event.subcategory,
    authority: event.authority
  };

  const instructions = [];
  if (eventName !== event.name) {
    instructions.push(
      updateEventName({ code: event.code, updatedName: eventName }, accounts)
    );
  }
  if (
    !event.expectedStartTimestamp ||
    expectedStartTimestamp !== event.expectedStartTimestamp.toNumber()
  ) {
    instructions.push(
      updateEventExpectedStartTimestamp(
        { code: event.code, updatedTimestamp: new BN(expectedStartTimestamp) },
        accounts
      )
    );
  }
  if (
    !event.actualStartTimestamp ||
    actualStartTimestamp !== event.actualStartTimestamp.toNumber()
  ) {
    instructions.push(
      updateEventActualStartTimestamp(
        { code: event.code, updatedTimestamp: new BN(actualStartTimestamp) },
        accounts
      )
    );
  }
  if (
    !event.actualEndTimestamp ||
    actualEndTimestamp !== event.actualEndTimestamp.toNumber()
  ) {
    instructions.push(
      updateEventActualEndTimestamp(
        { code: event.code, updatedTimestamp: new BN(actualEndTimestamp) },
        accounts
      )
    );
  }

  if (instructions.length === 0) {
    return log(`No changes to update`);
  }

  const signature = await signAndSendInstructions(
    connection,
    keypair,
    instructions
  );
  await confirmTransaction(connection, signature);
  const updatedEvent = await Event.fetch(connection, eventPk);
  logJson(updatedEvent);
};

getProcessArgs([], "npm run updateEvent");
updateEvent();
