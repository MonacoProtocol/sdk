# The Client

## Introduction

The primary access point to the Protocol is the typeScript client. The client is published through the NPM package repository, with source code available on GitHub.

* [Monaco Protocol Client - NPM repository](https://www.npmjs.com/package/@monaco-protocol/client)
* [Monaco Protocol Client - GitHub repository](https://github.com/MonacoProtocol/client)

The client opens up consumer-facing functionality but not admin-functionality. A separate admin client will be available to interact with the protocol from an operations point of view (create, update, and settle markets)

* Get markets by status/event/wagering token
* Place bet orders for markets
* Cancel bet orders
* Get market position for wallets
* Get wallet token balances

## Documentation

Documentation for the client can be found in the client repository itself with the majority of documentation auto-generated from docstrings within the code itself. For convenience, the docs are also exposed via a GitBook linked to the repo.

## Examples

Examples for working with the client can be found in the Monaco Protocol SDK

* [Client Examples](https://github.com/MonacoProtocol/sdk/tree/main/examples)
