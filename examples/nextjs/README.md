# Getting Started

This is an example of using the monaco-protocol to create a webapp using NextJS. In order to place bets you will need the phantom wallet plugin installed in your chosen web browser. The app uses Material UI only as an example layout. 

## Configure your environment
Set the required environment variables in your terminal instance.
```
export NEXT_PUBLIC_PROGRAM_ID=monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih
export NEXT_PUBLIC_NODE=https://api.devnet.solana.com/
```

## RPC-Node

For connecting to `mainnet` or making more requests on `devnet`, make sure you have your own RPC Node set up; check out [Getting Started - RPC Node](../README.md#getting-started---rpc-node) for more info. Replace the `NEXT_PUBLIC_NODE` value with your own node.

## Install dependancies

using yarn:

```
yarn
```

using npm:

```
npm install
```

## Running the app
Start the app in dev mode

using yarn:

```
yarn dev
```

using npm:

```
npm run dev
```