import { Participants, Subcategory, confirmTransaction, createIndividualParticipant, findCategoryPda, findParticipantPda, findSubcategoryPda, signAndSendInstructions } from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner, logJson } from "../utils/utils"
import { SystemProgram } from "@solana/web3.js";

const createNewTeamParticipant = async () => {
    const { connection, keypair, program } = await getConnectionAndSigner();

    const categoryCode = "MOVIES"
    const subcategoryCode = "UKBOX"
    const name = "The Meg"
    const code = "MEG"

    const categoryPda = findCategoryPda(categoryCode, program);
    const subcategoryPda = findSubcategoryPda(categoryPda, subcategoryCode, program);

    const subcategory = await Subcategory.fetch(connection, subcategoryPda)
    const participantPda = findParticipantPda(subcategoryPda, subcategory.participantCount, program)
    
    const args = {code, name}
    const accounts = {
        participant: participantPda,
        subcategory: subcategoryPda,
        authority: keypair.publicKey,
        systemProgram: SystemProgram.programId
    }

    const instruction = createIndividualParticipant(args, accounts)
    const signature = await signAndSendInstructions(connection, keypair, [instruction])
    await confirmTransaction(connection, signature, "confirmed")

    const participants = await Participants.participantQuery(connection).filterBySubcategory(subcategoryPda).fetch()
    logJson(participants)
}

getProcessArgs([], "npm run createParticipant")
createNewTeamParticipant();
