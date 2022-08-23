# The Dev Environment

## Summary

* Development environment: [Solana DevNet Cluster](https://docs.solana.com/clusters#devnet)
* Deployed protocol addresses: [Protocol Addresses](https://github.com/MonacoProtocol/client/blob/main/types/protocol.ts)

The primary protocol for development is listed as `DEVNET_STABLE` in the client. This is the most stable in-development version of the protocol. As the protocol evolves, more protocol deployments will be added for convenience, for example `DEV` and `RELEASE`

{% hint style="danger" %}
Only interact with protocol addresses shipped with the client as these are verified by the Monaco Protocol Foundation; or addresses of protocol instances you yourself have deployed.&#x20;
{% endhint %}

## Test Markets

Currently there is no admin client to allow for developers to create their own markets. Until this client is shipped, markets will be regularly added to the protocol to enable development. Similarly, the token used to enter the market can be obtained via an airdrop whilst we work on a faucet.

### Test Token

Markets will be created using the token `TOKEN_MINT` this is used on DevNet in place of a token such as USDT.&#x20;

You can request an airdrop through the DevHub:

* [Airdrop Request](https://github.com/MonacoProtocol/sdk/discussions/8)

### DevNet Solana

To pay for transactions and account creation, you will need SOL in your development wallet.&#x20;

* [Airdrop via Solana CLI](https://docs.solana.com/cli/usage#airdrop-sollamports)
* [Sol Faucet Web Airdrop Tool](https://solfaucet.com/)