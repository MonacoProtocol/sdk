# Market Management

## Market Management

## Lifecycle

* Initializing
  * Market is in a state of creation, outcomes can be added
* Open
  * Market is open to taking orders
* Locked
  * The market lock time has elapsed meaning orders can no longer be placed
* Ready for Settlement
  * An winning outcome has been added to the market, signalling that it can now be settled
* Settled
  * All winnings and refunds have been paid out
* Complete
  * The operator has concluded using the market, signalling that all associated market accounts can be closed for SOL recovery

### Suspend Flag

Markets can be flagged as suspended (`true/false`) so that they remain open but no orders can be placed.

### Published Flag

Markets can be flagged as published (`true/false`) this has no functionality beyond giving additional filter parameters for market operators as they may not have a CMS to determine what markets they want to show to end-users.

## Creation

Markets can be created by operators with the `MARKET` role, they can only admin markets that they have created. Markets can be created through the [Admin Client](../readme/the-admin-client.md) and require:

* Token type
  * The token being used for entry. Whilst SOL is used for transaction fees and rent, the token type determines what token orders are taken with (USDT, USDC, SAMO, FOXY etc)
* Market lock timestamp (in seconds)
  * Unix timestamp for when the market should cease taking orders
* Market title
  * Human-readable title to better distinguish the context of the market
* Market type
  * The Monaco Protocol currently supports only 4 market types, these currently operate as categorizations but in future should inform settlement rules
* Outcomes
  * Human-readable outcome strings `["TEAM 1", "DRAW", "TEAM 2]` representing the outcome choices on the market
  * These are then generated into outcome accounts with associated outcome indexes for entry
  * Markets must have at least two outcomes in order to settled for example `["Yes", "No"]` where the winning index would be either `0` or `1`
* Price ladder
  * The Monaco Protocol Admin Client contains an industry-standard 317 point `DEFAULT_PRICE_LADDER` for the majority of exchange application needs
  * A market creator can however, chose to specify their own custom price ladder for a market
  * Price ladders are stored per outcome
* Event account
  * In order to support event accounts, a public key must be supplied, this public key can be generated at time of market generation though to group multi markets under the same event, the same key must be used for each market.

In order to avoid splitting liquidity, only one market can exist per:

* Token type
* Market type
* Event account

This means that only one `fullTimeResult` market for event account `X` can be created for the `USDT` token.

## Settlement

* Settlement is triggered when the market operator adds a valid winning index to a market
  * The market operator is responsible for passing a valid and correct winning index
  * If the wrong winning index is passed, settlement will proceed with that index as the winning outcome
  * It is recommended that operators utilize an oracle service(s) to determine outcomes or at the very least operate a two-person verification system for results
* The market will then be picked up by the settlement crank for processing
* The settlement crank will iterate through matched orders and pay out winnings accordingly
* Additionally any unmatched orders will be refunded
* Once complete, the market will be set as `Settled`
  * Wallets with winning orders will receive their funds
  * Wallets with unmatched orders will receive their refunds
  * The market escrow account will no longer contain funds

## Closure

When a market has been settled, the operator can then mark it as complete, this will trigger the closure crank. The closure crank will iterate through each account associated with a market, closing them and returning rent to the payer.

:warning: It is recommended that operators ensure they have recorded any pertinent information relating to a market as once accounts are closed, only transactions stored on-chain will hold any sort of historical record of the market state. :warning:
