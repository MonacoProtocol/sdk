import { Events } from "@monaco-protocol/event-client";
import {
  getProcessArgs,
  getConnectionAndSigner,
  logJson
} from "../utils/utils";

const getAllEvents = async () => {
  const { connection, keypair } = await getConnectionAndSigner();
  const events = await Events.eventQuery(connection)
    .filterByAuthority(keypair.publicKey)
    .fetch();
  logJson(events);
};

getProcessArgs([], "npm run getEvents");
getAllEvents();
