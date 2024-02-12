# Getting Started

This repository contains a solana wallet keypair located in [/wallet/example.json](./wallet/example.json) in order to run the example scripts with minimal setup. Please be aware that this keypair is public and should never be used on `Mainnet`. Never include a keypair in your own repository. You can read more about CLI wallets [here](https://docs.solana.com/wallet-guide/cli).

The publicKey for this wallet is `5BZWY6XWPxuWFxs2jagkmUkCoBWmJ6c4YEArr83hYBWk`

:warning: As a reminder, these wallet keyPairs are stored within the repository for educational purposes only. Never include a keypair in your own repository. :warning:

# Install

```
npm install
```

# Setting Environment

Environmental settings are configured in `.env` files in `.env/.env-*` there are three environments that you can connect to by exporting one of the following values:

```
export ENVIRONMENT=mainnet-release
export ENVIRONMENT=devnet-release
```

The examples in this repo use [anchor](https://github.com/coral-xyz/anchor) and each `.env` file sets an RPC-node with `ANCHOR_PROVIDER_URL`.

- The default one for `devnet` is a public example RPC-node subject to rate-limiting.
- The `mainnet` one is a placeholders and will need to be changed for a `mainnet` rpc node.
- For any development beyond casual call inspection on `devnet` you should set yourself up with your own RPC-node.

## RPC-Node

Make sure you have your own RPC Node set up, check out [Getting Started - RPC Node](../README.md#getting-started---rpc-node) for more info.
