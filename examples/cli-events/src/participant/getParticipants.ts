import { Participants } from "@monaco-protocol/event-client";
import {
  getProcessArgs,
  getConnectionAndSigner,
  logJson
} from "../utils/utils";

const getAllParticipants = async () => {
  const { connection } = await getConnectionAndSigner();
  const participants = await Participants.participantQuery(connection).fetch();
  logJson(participants);
  console.log(participants.length);
};

getProcessArgs([], "npm run getParticipants");
getAllParticipants();
