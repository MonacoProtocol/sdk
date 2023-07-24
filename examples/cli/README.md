# Getting Started

This repository contains a solana wallet keypair located in [/wallet/example.json](./wallet/example.json) in order to run the example scripts with minimal setup. Please be aware that this keypair is public and should never be used on `Mainnet`. Never include a keypair in your own repository.

The publicKey for this wallet is `5BZWY6XWPxuWFxs2jagkmUkCoBWmJ6c4YEArr83hYBWk`

To aid testing matching orders, a secondary wallet is included [/wallet/example_secondary.json](./wallet/example_secondary.json).

The publicKey for this wallet is `GJFYdSWwcVzpmAQastTpN8j16EKLUtC7mGvqeE5gszL4`

:warning: As a reminder, these wallet keyPairs are stored within the repository for educational purposes only. Never include a keypair in your own repository. :warning:

# Install

```
npm install
```

# Setting Environment

Environmental settings are configured in `.env` files in `.env/.env-*` there are three environments that you can connect to by exporting one of the following values:

```
export ENVIRONMENT=mainnet-release
export ENVIRONMENT=devnet-edge
export ENVIRONMENT=devnet-release
```

The examples in this repo use [anchor](https://github.com/coral-xyz/anchor) and each `.env` file sets an RPC-node with `ANCHOR_PROVIDER_URL`.

- The default one for `devnet` is a public example RPC-node subject to rate-limiting.
- The `mainnet` one is a placeholders and will need to be changed for a `mainnet` rpc node.
- For any development beyond casual call inspection on `devnet` you should set yourself up with your own RPC-node.

## RPC-Node

Make sure you have your own RPC Node set up, check out [Getting Started - RPC Node](../README.md#getting-started---rpc-node) for more info.

# Scripts

- All example scripts have been added to the [package.json](package.json) for execution, to list them - `npm run`
- Where arguments are needed, when you invoke a script, you will be informed what arguments are missing for example:

```
$ npm run getMarket

> @monaco-protocol/examples@1.0.0 getMarket
> ts-node src/get_market.ts

> Expected number of args: 1
> Example invocation: npm run getMarket marketPk
```

When you run a script you will also be presented with information for debugging purposes:

- The arguments provided
- The set environment
- The set RPC node
- The set wallet publicKey

## Match Orders & View Trades

To get a matching order and view trade accounts (trade accounts contain the details for matched orders), run the following against the same market:

```
npm run placeForOrder <marketPk>
```

```
npm run placeAgainstOrder <marketPk>
```

```
npm run getTradesForMarket
```
