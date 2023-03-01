# Monaco Protocol

Everything you need know about the Monaco Protocol can be found here. This is also the home of the developer community where you can find information about the latest updates, showcase what you've been building, and, most importantly, ask any questions if you're looking for some help.

- [Documentation](SUMMARY.md)
- [DevHub](https://github.com/MonacoProtocol/sdk/discussions/6)
- [Client Examples](examples/README.md)
- [Q&A](https://github.com/MonacoProtocol/sdk/discussions/categories/q-a)

Any troubles, issues, questions, ideas you have - anything - raise them in discussions and the community will help you out.

# Introduction

The Monaco Protocol is a decentralized liquidity network for exchange-based applications built on the Solana blockchain. It serves as crucial infrastructure upon which third-party applications for wagering on binary outcome events can be built while accessing a shared liquidity pool.

## Benefits of The Monaco Protocol

- Fully non-custodial.
  - Funds are held in escrow and paid out to the trader wallet on settlement.
- Streamlines the wagering process.
  - Traders can specify the highest price that they are willing to take on a particular market outcome.
  - Incorporates the concept of smart matching / exposure in directly correlated outcomes to ensure that the smart contract only takes the minimum amount necessary from a given trader’s wallet to safely cover that trader’s maximum exposure across all of the trades that trader has placed in a set of directly correlated outcomes.
  - Traders can cancel unmatched or partially matches orders at any given moment.
- Helps provide greater liquidity for participants, reduce spreads, and offer lower prices.
- Lowers the take rates of institutions and intermediary.
- Reduces settlement times, increases transparency, and improves capital efficiency.
  - Incorporates the ability to determine the outcome of events in a decentralised fashion based upon third party oracles.

## Why Solana?

- High throughput and low costs are key pillars for any exchange-based mechanism.
  - These are the foundation for building amazing user experiences.
- The chain offers theoretical TPS speeds of up to 50,000/s which cost a fraction of a cent.
- Counter-party risk is eliminated as funds are controlled by the fully-audited protocol program.

## Is the Protocol audited?

- Every protocol release is audited by [sec3](https://www.sec3.dev/).
- Full reports are available in the protocol repository at https://github.com/MonacoProtocol/protocol/tree/main/audit/sec3/

## The Protocol on Mainnet

- The protocol launched on mainnet in Q4 2022
- The program address is [monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih](https://explorer.solana.com/address/monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih)
- The authority is [HVirxFBMqTcZjW6b8g5gDRGfDfPaRMF8uGvtwLiLSsC6](https://explorer.solana.com/address/HVirxFBMqTcZjW6b8g5gDRGfDfPaRMF8uGvtwLiLSsC6)

⚠️ Please be vigilant when interacting with any program claiming to be the Monaco Protocol. Program addresses and authorities will always be shared by the Monaco Protocol Foundation and publicized through official channels such as these docs. ⚠️

## How to contribute to the Protocol?

- The Protocol is open-sourced and available at https://github.com/MonacoProtocol/protocol
- Share ideas over on the [DevHub](https://github.com/MonacoProtocol/sdk/discussions)

## What is the relationship between BetDEX Labs, Inc. and the Monaco Protocol?

- BetDEX Labs, Inc. is an early and key contributor to the Monaco Protocol.
