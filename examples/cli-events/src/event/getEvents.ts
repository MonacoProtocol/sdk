import { Events } from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner, logJson } from "../utils/utils";

const getAllEvents = async () => {
  const { connection } = await getConnectionAndSigner();
  const events = await Events.eventQuery(connection).fetch();
  logJson(events);
};

getProcessArgs([], "npm run getEvents");
getAllEvents();
