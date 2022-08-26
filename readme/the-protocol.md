# The Monaco Protocol

The Monaco Protocol is a liquidity matching program to be deployed on the Solana blockchain. It is currently operating on Devnet during its testing phase.

# What The Protocol Does

The Monaco Protocol offers the ability to wager on binary-outcome event, it is agnostic to the nature of these events. Bet orders can be placed offering to either `BACK` the outcome (it will happen) or to `LAY` it (it won't happen) at a specific price (odds) and stake (wager).

## Markets

- Outcomes
  - Betting markets can be created on anything: from the outcome of a sporting event, the weather in Nantucket on a specific day, to the winner of the next election.
  - Outcomes on the protocol are represented by an index, in a market of `TEAM_A, DRAW, TEAM_B` a draw result will be a winning index of `1`.
- Price Ladder
  - These markets can have their own price ladder. A sporting event may wish to offer prices ranging from `1.001` to `1000` whilst another market may just offer prices from `1.2` to `5` - these are set by the market operator at time of creation.
- Token for Entry
  - Markets can be created specifying any [spl-token](https://spl.solana.com/token) as the entry currency, from USDT to an NFT projects native token.
- Market Lock
  - Markets are created with a lock time set by a unix timestamp - to the second - in `UTC`. Once this time has elapsed, bet orders can no longer be placed on the market.
- Market Title/Type
  - Each market has a human-readable title and a machine-readable type.
- Event
  - Markets can be linked with an event, this event is an on-chain record of the real-world event the market is associated with. The event will act as the source of truth for outcomes. **Note:** the service supporting events is yet to be released, but markets can still be created and settled independently of their existence. 

## Bet Orders

- Wallets are able to place bet orders one a market.
- The bet orders contain:
  - The market the order is to be placed against.
  - Price of the bet order.
  - Stake.
  - Index of the predicted winning outcome.
  - Whether or not the bet order is backing the outcome to happen or laying it not to.
- Once a bet order is place it is recorded in a market matching pool to allow for matching of orders.
- Fund are recorded in escrow until a bet order is matched.
- Bet orders can be cancelled until they are fully matched.
- Due to market position (see below) wallets can trade in and out of market positions on unmatched orders.

## Market Position

- Once a wallet places a bet order on a market, it will have a market position.
- This market position is used to track potential win/loss, maximum exposure, and leverage offset.
- This allows a wallet to trade in and out of positions where they have unmatched bet order funds.
- It also enables a wallet to see its current risk profile on the market.


## Matching

- The protocol will match bet orders on a market.
- Bet orders can be partially matched.
- Matching is designed to match at the best odds possible for those orders.
- Matching is facilitated by off-chain cranking.

## Settlement

- When an outcome is passed to a market, the protocol will then process bet orders for settlement.
- Winnings are sent directly to the winning bet order purchasing wallet.
- Settlement is facilitated by off-chain cranking.

## Off-Chain Cranking

- Due to the nature of the blockchain, it is necessary to facilitate on-chain actions with a crank.
- Cranks send regular commands to an on-chain program in order to make it perform an action.
- To ensure decentralization, multiple cranks will power the protocol. The tooling will be open-source and the process of cranking rewarded.
