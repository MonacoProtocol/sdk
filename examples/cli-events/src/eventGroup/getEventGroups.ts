import { EventGroups } from "@monaco-protocol/event-client";
import { getProcessArgs, getProgram, logJson } from "../utils/utils";

const getAllEventGroups = async () => {
  const program = await getProgram();
  const connection = program.provider.connection;
  const eventGroups = await EventGroups.eventGroupQuery(connection).fetch();
  logJson(eventGroups);
};

getProcessArgs([], "npm run getEventGroups");
getAllEventGroups();
