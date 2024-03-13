import { Participants, Subcategory, confirmTransaction, createTeamParticipant, findAssociatedPdasForSubcategory, findCategoryPda, findParticipantPda, findSubcategoryPda, signAndSendInstructions } from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner, logJson } from "../utils/utils"
import { SystemProgram } from "@solana/web3.js";

const createNewTeamParticipant = async () => {
    const { connection, keypair, program } = await getConnectionAndSigner();

    const categoryCode = "MOVIES"
    const subcategoryCode = "UKBOX"
    const name = "Oppenheimer"
    const code = "OPP"

    const pdas = findAssociatedPdasForSubcategory(categoryCode, subcategoryCode, program)

    const subcategory = await Subcategory.fetch(connection, pdas.subcategoryPda);

    const participantPda = findParticipantPda(pdas.subcategoryPda, subcategory.participantCount, program)
    
    const args = {code, name}
    const accounts = {
        participant: participantPda,
        subcategory: pdas.subcategoryPda,
        authority: subcategory.authority,
        systemProgram: SystemProgram.programId
    }

    const instruction = createTeamParticipant(args, accounts)
    const signature = await signAndSendInstructions(connection, keypair, [instruction])
    await confirmTransaction(connection, signature)

    const participants = await Participants.participantQuery(connection).filterBySubcategory(pdas.subcategoryPda).fetch()
    logJson(participants)
}

getProcessArgs([], "npm run createTeamParticipant")
createNewTeamParticipant();
