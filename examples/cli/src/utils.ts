import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, setProvider, Program } from "@project-serum/anchor";
import { ProtocolAddresses } from "@monaco-protocol/client";

export async function getProgram() {
  const provider = AnchorProvider.env();
  setProvider(provider);
  const protocolAddress = new PublicKey(ProtocolAddresses.DEVNET_STABLE)

  return Program.at(protocolAddress, provider);
}

export function log(log: any){
  console.log(log)
}

export function logJson(json: object){
  console.log(JSON.stringify(json, null, 2))
}
