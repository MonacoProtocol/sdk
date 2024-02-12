import { Events } from "@monaco-protocol/event-client";
import { getProcessArgs, getProgram, logJson } from "../utils/utils";

const getAllEvents = async () => {
    const program = await getProgram();
    const connection = program.provider.connection;
    const events = await Events.eventQuery(connection).fetch();
    logJson(events)
};

getProcessArgs([], 'npm run getAllEvents')
getAllEvents();