import dotenv = require("dotenv");
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, setProvider, Program } from "@coral-xyz/anchor";
import {
  ClientResponse,
  MarketStatusFilter,
  OrderStatusFilter
} from "@monaco-protocol/client";

enum ENVS {
  DEVNET_EDGE = "devnet-edge",
  DEVNET_RELEASE = "devnet-release",
  MAINNET_RELEASE = "mainnet-release"
}

function getConfig() {
  const environment = process.env.ENVIRONMENT;
  const envConfig = { path: "./.env/.env" };
  switch (environment) {
    case ENVS.DEVNET_EDGE:
      envConfig.path += `.${ENVS.DEVNET_EDGE}`;
      dotenv.config(envConfig);
      break;
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

export enum ProtocolTypes {
  MONACO_PROTOCOL = "monaco-protocol",
  MONACO_PRODUCT = "monaco-product"
}

export async function getProgram(protocolType: ProtocolTypes = ProtocolTypes.MONACO_PROTOCOL) {
  getConfig();
  const provider = AnchorProvider.env();
  setProvider(provider);

  let protocolAddress = new PublicKey(process.env.PROTOCOL_ADDRESS);

  if (protocolType === ProtocolTypes.MONACO_PRODUCT) protocolAddress = new PublicKey(process.env.PROTOCOL_PRODUCT_ADDRESS);

  const program = await Program.at(protocolAddress, provider);

  log(`Environment: ${process.env.ENVIRONMENT}`);
  log(`Protocol Type: ${protocolType}`);
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

export function logResponse(response: ClientResponse<{}>) {
  if (!response.success) {
    log(response.errors);
  } else {
    logJson(response);
  }
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

export const SDK_PRODUCT = new PublicKey('bwCvZn6Hs4v51tvwFdAtAyJXzLddjgUMnQn2SehXmhF')

export function marketStatusFromString(status: string) {
  switch (status) {
    case "open":
      return MarketStatusFilter.Open;
    case "locked":
      return MarketStatusFilter.Locked;
    case "settled":
      return MarketStatusFilter.Settled;
    case "readyToClose":
      return MarketStatusFilter.ReadyToClose;
    case "readyForSettlement":
      return MarketStatusFilter.ReadyForSettlement;
    default:
      throw "Available market statuses: open, locked, settled, readyToClose, readyForSettlement, initializing";
  }
}

export function orderStatusFromString(status: string) {
  switch (status) {
    case "open":
      return OrderStatusFilter.Open;
    case "matched":
      return OrderStatusFilter.Matched;
    case "settledWin":
      return OrderStatusFilter.SettledWin;
    case "settledLose":
      return OrderStatusFilter.SettledLose;
    case "cancelled":
      return OrderStatusFilter.Cancelled;
    default:
      throw "Available order statuses: open, matched, settledWin, settledLose, cancelled";
  }
}
