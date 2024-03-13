import { EventGroups } from "@monaco-protocol/event-client";
import {
  getProcessArgs,
  getConnectionAndSigner,
  logJson
} from "../utils/utils";

const getAllEventGroups = async () => {
  const { connection } = await getConnectionAndSigner();
  const eventGroups = await EventGroups.eventGroupQuery(connection).fetch();
  logJson(eventGroups);
};

getProcessArgs([], "npm run getEventGroups");
getAllEventGroups();
