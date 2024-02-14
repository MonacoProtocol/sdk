import dotenv = require("dotenv");
import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction
} from "@solana/web3.js";
import { AnchorProvider, setProvider, Program, web3 } from "@coral-xyz/anchor";

enum ENVS {
  DEVNET_RELEASE = "devnet-release",
  MAINNET_RELEASE = "mainnet-release"
}

function getConfig() {
  const environment = process.env.ENVIRONMENT;
  const envConfig = { path: "./.env/.env" };
  switch (environment) {
    case ENVS.DEVNET_RELEASE:
      envConfig.path += `.${ENVS.DEVNET_RELEASE}`;
      dotenv.config(envConfig);
      break;
    case ENVS.MAINNET_RELEASE:
      envConfig.path += `.${ENVS.MAINNET_RELEASE}`;
      dotenv.config(envConfig);
      break;
    default:
      log(`⚠️  ENVIRONMENT env variable not set ⚠️\n\nSet with:`);
      Object.keys(ENVS).map((env) => log(`export ENVIRONMENT=${ENVS[env]}`));
      process.exit(1);
  }
}

export async function getProgram() {
  getConfig();
  const provider = AnchorProvider.env();
  setProvider(provider);

  let protocolAddress = new PublicKey(process.env.PROTOCOL_ADDRESS);

  const program = await Program.at(protocolAddress, provider);

  log(`Environment: ${process.env.ENVIRONMENT}`);
  log(`Protocol version: ${program.idl.version}`);
  log(`RPC Node: ${program.provider.connection.rpcEndpoint}`);
  log(`Wallet PublicKey: ${program.provider.publicKey}`);

  return program;
}

export function log(log: any) {
  console.log(log);
}

export function logJson(json: object) {
  console.log(JSON.stringify(json, null, 2));
}

export function getProcessArgs(
  expectedArgs: string[],
  exampleInvocation: string
): any {
  const defaultArgLength = 2;
  if (process.argv.length != defaultArgLength + expectedArgs.length) {
    console.log(
      `Expected number of args: ${expectedArgs.length}\n` +
        `Example invocation: ${exampleInvocation} ${expectedArgs
          .toString()
          .replace(/,/g, " ")}`
    );
    process.exit(1);
  }
  const namedArgs = process.argv.slice(-expectedArgs.length);
  let values = {};
  expectedArgs.map(function (arg, i) {
    return (values[expectedArgs[i]] = namedArgs[i]);
  });
  log("Supplied arguments:");
  logJson(values);
  return values;
}
