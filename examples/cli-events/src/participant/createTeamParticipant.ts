import { Participants, Subcategory, confirmTransaction, createTeamParticipant, findCategoryPda, findParticipantPda, findSubcategoryPda, signAndSendInstructions } from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner, logJson } from "../utils/utils"
import { SystemProgram } from "@solana/web3.js";

const createNewTeamParticipant = async () => {
    const { connection, keypair, program } = await getConnectionAndSigner();

    const categoryCode = "MOVIES"
    const subcategoryCode = "UKBOX"
    const name = "Oppenheimer"
    const code = "OPP"

    const categoryPda = findCategoryPda(categoryCode, program);
    const subcategoryPda = findSubcategoryPda(categoryPda, subcategoryCode, program);

    const subcategory = await connection.getAccountInfo(subcategoryPda) as unknown as Subcategory

    const participantPda = await findParticipantPda(subcategoryPda, subcategory.participantCount, program)
    
    const args = {code, name}
    const accounts = {
        participant: participantPda,
        subcategory: subcategoryPda,
        authority: subcategory.authority,
        systemProgram: SystemProgram.programId
    }

    const instruction = createTeamParticipant(args, accounts)
    const signature = await signAndSendInstructions(connection, keypair, [instruction])
    await confirmTransaction(connection, signature)

    const participants = await Participants.participantQuery(connection).filterBySubcategory(subcategoryPda).fetch()
    logJson(participants)
}

getProcessArgs([], "npm run createTeamParticipant")
createNewTeamParticipant();
