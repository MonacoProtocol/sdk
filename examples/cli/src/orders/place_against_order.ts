import { PublicKey } from "@solana/web3.js";
import { getProcessArgs } from "../utils/utils";
import { placeOrder } from "./place_for_order";

const args = getProcessArgs(["marketPk"], "npm run placeAgainstOrder");
placeOrder(new PublicKey(args.marketPk), false);
