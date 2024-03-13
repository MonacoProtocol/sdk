import {
  confirmTransaction,
  findEventPda,
  createEvent,
  signAndSendInstructions,
  Event,
  addEventParticipants,
  findAssociatedPdasForEventGroup
} from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner, logJson } from "../utils/utils";
import { BN } from "bn.js";
import { SystemProgram } from "@solana/web3.js";

const createNewEvent = async () => {
  const { connection, keypair, program } = await getConnectionAndSigner();

  const categoryCode = "MOVIES";
  const subcategoryCode = "UKBOX";
  const eventGroupCode = "WEEKBOX";
  const eventName = "Week 1 - 2025";
  const participantIds = [2, 1]

  const expectedStartTimestamp = 2524608000;
  const eventCode = `${subcategoryCode}-${eventGroupCode}-WEEK-1-2050`;

  const pdas = findAssociatedPdasForEventGroup(categoryCode, subcategoryCode, eventGroupCode, program)
  const eventPda = findEventPda(eventCode, program);

  const args = {
    eventInfo: {
      code: eventCode,
      name: eventName,
      expectedStartTimestamp: new BN(expectedStartTimestamp),
      actualStartTimestamp: null,
      actualEndTimestamp: null
    }
  };
  const accounts = {
    event: eventPda,
    eventGroup: pdas.eventGroupPda,
    subcategory: pdas.subcategoryPda,
    authority: keypair.publicKey,
    systemProgram: SystemProgram.programId
  };

  const argsParticipants = {
    code: eventCode,
    participantsToAdd: participantIds
  }
  
  const accountsParticipants = {
    event: eventPda,
    subcategory: pdas.subcategoryPda,
    authority: keypair.publicKey
  }

  const instruction = createEvent(args, accounts);
  const participantInstruction = addEventParticipants(argsParticipants, accountsParticipants);
  const signature = await signAndSendInstructions(connection, keypair, [instruction, participantInstruction]);
  await confirmTransaction(connection, signature);

  const event = await Event.fetch(connection, eventPda);
  logJson(event);
};

getProcessArgs([], "npm run createEvent");
createNewEvent();
