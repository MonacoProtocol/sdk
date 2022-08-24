# Place bet flow

In order to place a bet we need data from different sources. The data follow looks like the following:

## Pre-bet creation data
Required Data for displaying essential includes the outcomes available for the market, and the odds ladder which informs which odds are available for each outcome.
- `getMarket` is used to get the data concerning the current market. We'll require the mintAccount public key to get token information and the marketOutcomes to see available outcomes for the given market.
- `getMarketOutcomeAccounts` is used to get the odds ladder, this is used to show the odds available for each outcome on a given market

## Place bet
In order to place a bet we require the mint info which will give us decimals for a given token to create a BN from the number supplied by the ui
- `getMintInfo` required call for converting a number to a BN