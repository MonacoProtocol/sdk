# The Dev Environment

## Summary

* Development environment: [Solana Devnet Cluster](https://docs.solana.com/clusters#devnet)
* Deployed protocol addresses: [Protocol Addresses](https://github.com/MonacoProtocol/client/blob/main/types/protocol.ts)

The primary protocol for development is listed as `DEVNET_STABLE` in the client. This is the most stable in-development version of the protocol. As the protocol evolves, more protocol deployments will be added for convenience, for example `DEV` and `RELEASE`

{% hint style="danger" %}
Only interact with protocol addresses shipped with the client as these are verified by the Monaco Protocol Foundation; or addresses of protocol instances you yourself have deployed.&#x20;
{% endhint %}

## Test Markets

Whilst an [admin client is available for you to make your own markets](https://www.npmjs.com/package/@monaco-protocol/admin-client), it is highly encouraged that until you are at the point where you absolutely need to make your own markets, that you make use of the test markets created daily on the protocol.

### Creation

- Two test markets are created each day at `12:30 UTC`
- These test markets have 2 outcomes each

### Settlement

- The previous days markets will settle daily at `12:30 UTC`
- Markets will settle with a winning outcome index of `0` meaning the first outcome on a marketAccount will always win

### Test Token

Markets are created to use the token [Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH](https://solscan.io/token/Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH?cluster=devnet) this is used on Devnet in place of a token such as USDT.&#x20;

You can request an airdrop through the DevHub:

* [Airdrop Request](https://github.com/MonacoProtocol/sdk/discussions/8)

The protocol is built in such a way that, once admin-functionality is available, markets can be created to use any token so that you may create your own test token through the recommended, [strata protocol](https://app.strataprotocol.com/launchpad/manual/new).

### Devnet Solana

To pay for transactions and account creation, you will need SOL in your development wallet.&#x20;

* [Airdrop via Solana CLI](https://docs.solana.com/cli/usage#airdrop-sollamports)
* [Sol Faucet Web Airdrop Tool](https://solfaucet.com/)
