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
export PROTOCOL_TYPE=stable
```

To connect to `mainnet` use `PROTOCOL_TYPE=release` and change your `ANCHOR_PROVIDER_URL` for a `mainnet` rpc node.

- All example scripts have been added to the [package.json](package.json) for execution, to list them - `npm run`
- Where arguments are needed, when you invoke a script, you will be informed what arguments are missing for example:

```
$ npm run getOperatorsByType

> @monaco-protocol/admin-examples@0.0.1 getOperatorsByType
> ts-node src/operator_get_operators.ts

> Expected number of args: 1
> Example invocation: npm run getOperatorsByType operatorType
```

When you run a script you will also be presented with information for debugging purposes:

- The arguments provided
- The set protocol type
- The set RPC node
- The set wallet publicKey

# Operators

In order to create a market, an authorised wallet is required. It is recommended that you create a new CLI wallet for this purpose. You can then make a request to be added as an authorised market operator on the [dev hub](https://github.com/MonacoProtocol/sdk/discussions). The `checkOperatorRoles` function included with the admin client allows you to check what operator roles a given wallet has.

The example script, `checkRoles` returns roles for your set `ANCHOR_WALLET`.

```
npm run checkRoles

> @monaco-protocol/admin-examples@0.0.1 checkRoles
> ts-node src/operator_check_roles.ts

Supplied arguments:
{}
{
  "success": true,
  "errors": [],
  "data": {
    "operatorPk": "98CVwMftrhm6zutmV29frqRPfXsocbFnwjXVxYo7xbHX",
    "admin": true,
    "market": true,
    "crank": false
  }
}
```
