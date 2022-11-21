# Getting Started

This repository contains a solana wallet keypair located in [/wallet/example.json](./wallet/example.json) in order to run the example scripts with minimal setup. Please be aware that this keypair is public and should never be used on `Mainnet`. Never include a keypair in your own repository.

The publicKey for this wallet is `5BZWY6XWPxuWFxs2jagkmUkCoBWmJ6c4YEArr83hYBWk`

To aid testing matching orders, a secondary wallet is included [/wallet/example_secondary.json](./wallet/example_secondary.json).

The publicKey for this wallet is `GJFYdSWwcVzpmAQastTpN8j16EKLUtC7mGvqeE5gszL4`

:warning: As a reminder, these wallet keyPairs are stored within the repository for educational purposes only. Never include a keypair in your own repository. :warning:

These examples make use of the [anchor](https://github.com/coral-xyz/anchor) provider set on your environment, please note that the `ANCHOR_PROVIDER_URL` in the example is the public solana RPC node for Devnet. This node should be used sparingly and is subject to rate-limiting. If you are going to make multiple requests, please consider using your own node.

```
npm install
export ANCHOR_WALLET=./wallet/example.json
export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
export PROTOCOL_TYPE=stable
```

To connect to `mainnet` use `PROTOCOL_TYPE=release` and change your `ANCHOR_PROVIDER_URL` for a `mainnet` rpc node.

```
export ANCHOR_WALLET=./wallet/example_secondary.json
```

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
- The set protocol type
- The set RPC node
- The set wallet publicKey

## Match Orders & View Trades

To get a matching order and view trade accounts (trade accounts contain the details for matched orders), run the following against the same market:

```
export ANCHOR_WALLET=./wallet/example.json
npm run placeForOrder
```

```
export ANCHOR_WALLET=./wallet/example_secondary.json
npm run placeAgainstOrder
```

```
npm run getTradesForMarket
```
