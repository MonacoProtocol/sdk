import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, setProvider, Program } from "@project-serum/anchor";
import { ProtocolAddresses } from "@monaco-protocol/client";
import { Operator, ClientResponse } from "@monaco-protocol/admin-client"

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

export function logResponse(response: ClientResponse<{}>){
  if (!response.success){
      log(response.errors)
  }
  else{
      logJson(response)
  }
}

export function getProcessArgs(expectedArgs: string[], exampleInvocation: string): any{
  const defaultArgLength = 2
  if (process.argv.length != defaultArgLength+expectedArgs.length) {
    console.log(
      `Expected number of args: ${expectedArgs.length}\n` +
      `Example invocation: ${exampleInvocation} ${expectedArgs.toString().replace(/,/g, ' ')}`
    );
    process.exit(1);
  }
  const namedArgs = process.argv.slice(-expectedArgs.length)
  let values = {}
  expectedArgs.map(function (arg, i){
    return values[expectedArgs[i]] = namedArgs[i]
  })
  log("Supplied arguments:")
  logJson(values)
  return values
}

export function operatorTypeFromString(operatorType: string){
  switch (operatorType){
    case "market":
      return Operator.MARKET
    case "crank":
      return Operator.CRANK
    case "admin":
      return Operator.ADMIN
    default:
      throw "Available operator types: market, crank, admin"
  }
}
