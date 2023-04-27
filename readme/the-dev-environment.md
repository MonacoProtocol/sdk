# The Dev Environment

## Summary

* Development environment: [Solana Devnet Cluster](https://docs.solana.com/clusters#devnet)
* Deployed protocol addresses:
  * `monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih` - `release`
  * `mpDEVnZKneBb4w1vQsoTgMkNqnFe1rwW8qjmf3NsrAU` - `bleeding-edge`
* `release` this version mirrors the current `mainnet` deploy and only changes in line with `mainnet` deploys
* `bleeding-edge` this version contains the most recently merged changes to allow clients to work against upcoming changes to the protocol

:warning: 
Only interact with protocol addresses shipped with the client as these are verified by the Monaco Protocol Foundation; or addresses of protocol instances you yourself have deployed. :warning: 

## Test Markets

Whilst an [admin client is available for you to make your own markets](https://www.npmjs.com/package/@monaco-protocol/admin-client), it is highly recommended that until you are at the point where you absolutely need to make your own markets, that you make use of the test markets created daily on the protocol.

Automated test markets are managed daily on `release` on `devnet`. Any destructive actions (settlement and closure) only occur for markets created by the automation authority.

### Creation

- Multiple sporting markets are created at `11:00 UTC` daily
- They are set to lock `24+ hours` after creation

### Seeding

- All open markets are seeded at `11:15 UTC` daily
- Prices are added for each outcome on a market to a depth of 3 price points both `FOR` and `AGAINST` outcomes
- Seeding includes adding trading activity (matched orders)

### Settlement

- Settlement occurs daily at `11:30 UTC`
- Settlement is for the previous days markets
- Markets will settle with a winning outcome index of `0`
  - This means the first outcome on a market will always win

### Closure

- Market accounts are closed daily at `11:45 UTC`
- Only markets that were settled `3+ days` ago are closed
- Closure returns SOl used for rent and removes all accounts associated with a market from chain

### Test Token

Markets are created to use the token `WINS` [Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH](https://solscan.io/token/Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH?cluster=devnet) this is used on Devnet in place of a token such as `USDT`

You can request an airdrop through the DevHub:

* [Airdrop Request](https://github.com/MonacoProtocol/sdk/discussions/8)

The protocol is built in such a way that for those with the admin role, markets can be created to use any token so that you may create your own test token through the recommended, [strata protocol](https://app.strataprotocol.com/launchpad/manual/new).

### Devnet Solana

To pay for transactions and account creation, you will need SOL in your development wallet.&#x20;

* [Airdrop via Solana CLI](https://docs.solana.com/cli/usage#airdrop-sollamports)
* [Sol Faucet Web Airdrop Tool](https://solfaucet.com/)
