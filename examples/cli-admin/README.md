# Getting Started

Unlike the examples for the primary client, no example wallet is included in with these admin-function examples. To get started, you will want to generate your own wallet for admin functionality.

```
mkdir wallet
solana-keygen new -o wallet/example.json
```

To help ensure this wallet isn't accidentally committed, the path to the example wallet dir `**/cli-admin/wallet/` is included in the [.gitignore](../../.gitignore) file for this repository.

```
npm install
export ANCHOR_WALLET=./wallet/example.json
export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
```

- All example scripts have been added to the [package.json](package.json) for execution, to list them - `npm run`
- Where arguments are needed, when you invoke a script, you will be informed what arguments are missing for example:

```
$ npm run getOperatorsByType

> @monaco-protocol/admin-examples@0.0.1 getOperatorsByType
> ts-node src/operator_get_operators.ts

> Expected number of args: 1
> Example invocation: npm run getOperatorsByType operatorType
```
