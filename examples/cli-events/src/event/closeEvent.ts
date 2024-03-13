import { Event, closeEvent, confirmTransaction, signAndSendInstructions } from "@monaco-protocol/event-client";
import { PublicKey } from "@solana/web3.js";
import { getConnectionAndSigner, getProcessArgs, log } from "../utils/utils";

const closeGivenEvent = async (eventPk: PublicKey) => {
    const { connection, keypair } = await getConnectionAndSigner();
    const event = await Event.fetch(connection, eventPk);
    if (!event) {
        log(`Event not found with pk: ${eventPk.toString()}`)
        return;
    }
    if (event.active) {
        // You can close an active event, this is just an example of a best practice you may wish to consider
        log(`Event is active, deactivate before closing`)
        return;
    }

    log(`Closing event with pk: ${eventPk.toString()}`)
    const accounts = {
        event: eventPk,
        authority: keypair.publicKey,
        payer: keypair.publicKey,
      };

    const instruction = closeEvent(accounts)
    const signature = await signAndSendInstructions(connection, keypair, [instruction]);
    await confirmTransaction(connection, signature);
    const confirmClosed = await Event.fetch(connection, eventPk);
    // if closed, event fetch returns null
    log(!confirmClosed ? `Event closed` : `Event not closed, please check the logs for errors`)
}

const args = getProcessArgs(["eventPk"], "npm run closeEvent");
closeGivenEvent(new PublicKey(args.eventPk))
