# Introduction

The endpoint `getMarketPrices()` aggregates a lot of data for the given market and contains most of the information required to build an exchange interface. So let's break down what it gives us. 

:memo: If you haven't yet, you may wish to read over [working with BNs](working-with-bns.md) before continuing with this guide as all response examples have been parsed in order to present human-readable numbers instead of `BNs`.

# Market Account

Firstly we get the full market account returned, this contains all the key information about the market including:

- Status
- Title,
- Lock timestamp
- Outcome count

:memo: Note, at this point the `eventAccount` does not link to an on-chain account. Eventually it will link to a solana account containing details about the event the market is for - for example `Manchester United vs Manchester City`.

```
{
    "authority": "J2LqciLvyxVHMjMcda73459zWfFxw7rveDb5YAhSdGTe",
    "eventAccount": "2FGWnZEVEop5PfyJphQ6ijgemyJGXCxpqwuy4EcgEJsL",
    "mintAccount": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    "marketStatus": {
      "open": {}
    },
    "marketType": "EventResultFullTime",
    "decimalLimit": 3,
    "published": false,
    "suspended": false,
    "marketOutcomesCount": 3,
    "marketWinningOutcomeIndex": null,
    "marketLockTimestamp": 1673640000,
    "marketSettleTimestamp": null,
    "title": "Full Time Result",
    "escrowAccountBump": 255
}
```

# Outcome Accounts

As the outcomes for a market are stored in separate accounts, we return those account details too. These are presented as an array, ordered by outcome index. Key information here:

- Outcome index
  - For order creation and settlement
- Title
- Latest matched price
- Matched total
- The full price ladder associated with the outcome (truncated in the example)

```
[
    {
      "publicKey": "FVvEcvpayFVPbTR3YX4L3ZjX9ziMYh3hUyCSG5Za5N2o",
      "account": {
        "market": "3g2iCjNxZdPgTZFzg3WrcX1JG4WZ4K7aCi4c2WrsRGVB",
        "index": 0,
        "title": "Aston Villa",
        "latestMatchedPrice": 2.06,
        "matchedTotal": 20,
        "priceLadder": [
          1.001,
          1.002,
          1.003,
          800,
          900,
          1000
        ]
      }
    },
    ...
]
```

The sum of `matchedTotal` for each of the outcomes gives you the total currently traded on the market.

# Pending Orders

Pending orders are all open or partially matched orders (a partially matched order is currently represented as `matched` but with a value greater than 0 for `stakeUnmatched`). Key information here:

- Outcome index
- For or against outcome (back or lay)
- Stake amount
  - And stake unmatched
- Price of order (odds)
- Creation timestamp

```
[
    {
      "publicKey": "Gka6wa8pdWopYpti25DzJhwyBgjmjggPN7Y3P4BPQgnw",
      "account": {
        "purchaser": "37iY8P1WyGyakYmjH9qaeeg5w5opsYk4v53EKmwt18x5",
        "market": "3g2iCjNxZdPgTZFzg3WrcX1JG4WZ4K7aCi4c2WrsRGVB",
        "marketOutcomeIndex": 0,
        "forOutcome": false,
        "orderStatus": {
          "matched": {}
        },
        "stake": 120,
        "voidedStake": 0,
        "expectedPrice": 2.04,
        "creationTimestamp": 1673616743,
        "stakeUnmatched": 110,
        "payout": 20.4
      }
    },
    ...
        {
      "publicKey": "B9BuN8VAfARqH3r6xAyLeXBYBPzKKWf3EoqVDoAjd2x1",
      "account": {
        "purchaser": "37iY8P1WyGyakYmjH9qaeeg5w5opsYk4v53EKmwt18x5",
        "market": "3g2iCjNxZdPgTZFzg3WrcX1JG4WZ4K7aCi4c2WrsRGVB",
        "marketOutcomeIndex": 0,
        "forOutcome": true,
        "orderStatus": {
          "open": {}
        },
        "stake": 89,
        "voidedStake": 0,
        "expectedPrice": 2.12,
        "creationTimestamp": 1673616743,
        "stakeUnmatched": 89,
        "payout": 0
      }
    }
```

# Market Prices

Market prices are derived from pending orders. They represent all the unique combination of orders based on the criteria:

- The outcome
- For/Against that outcome
- The price of the order

For example a market may have the following pending orders:

- 3 orders @ price 10 for outcome A
- 1 order @ price 2 against outcome B
- 2 orders @ price 5 for outcome B

This translates to the market prices of:

- price @ 10 for outcome A
- price @ 2 against outcome b
- price @ 5 for outcome b

```
      {
        "marketOutcome": "Manchester United",
        "marketOutcomeIndex": 2,
        "price": 1.9,
        "forOutcome": true,
        "matchingPoolPda": "CMkfVXokrXqfbCZ6jCdL8AbnPSW3qmHEvMvN1Q4GzQ2a",
        "matchingPool": {
          "purchaser": "37iY8P1WyGyakYmjH9qaeeg5w5opsYk4v53EKmwt18x5",
          "liquidityAmount": 28,
          "matchedAmount": 0,
          "orders": {
            "front": 2,
            "len": 1,
            "items": [
              "C1i6k66ehKgq7TfeffZsakThYGdqPKWqhpfVdhhvK69J",
              "57P1LYTJbi9mbShXYSpvGnxzYeQL2SF15L2pbCWJ2Us3",
              "8yTCuvmaKKeouY2yTFXmS8NEpXdsHP7VbjuNQrHKyw6i"
            ]
          }
        }
      },
```

In addition to the market price summary, the matching pool account for that price point is also returned, offering `liquidityAmount` and `matchedAmount`. The sum of all the returned `liquidityAmount` values gives you all the liquidity available on the market.

This data can then be used to form a matrix of current available odds and liquidity for users to match against.

# In Practice

To help explain some of the concepts outlined in this guide, the script [get_market_summary.ts](../examples/cli/src/get_market_summary.ts) has been provided to demonstrate parsing and mapping the response into its key data points.

## Example 

```
  "pendingOrderSummary": [
    {
      "for": [
        {
          "outcome": "Crystal Palace",
          "expectedPrice": 5.1,
          "stake": 6
        },
        {
          "outcome": "Crystal Palace",
          "expectedPrice": 5.2,
          "stake": 6
        }
      ],
      "against": [
        {
          "outcome": "Crystal Palace",
          "expectedPrice": 4.4,
          "stake": 9
        },
        {
          "outcome": "Crystal Palace",
          "expectedPrice": 4.3,
          "stake": 9
        }
      ]
    },
    ...
],
  "marketPriceSummary": [
    {
      "for": [
        {
          "outcome": "Crystal Palace",
          "price": 5.1,
          "liquidity": 5.6
        },
        {
          "outcome": "Crystal Palace",
          "price": 5.2,
          "liquidity": 6
        }
      ],
      "against": [
        {
          "outcome": "Crystal Palace",
          "price": 4.4,
          "liquidity": 8.6
        },
        {
          "outcome": "Crystal Palace",
          "price": 4.3,
          "liquidity": 9
        }
      ]
    },
    ...
]
  "marketOutcomesSummary": [
    {
      "outcome": "Crystal Palace",
      "latestMatchedPrice": 5.1,
      "matchedTotal": 0.9
    },
    {
      "outcome": "Draw",
      "latestMatchedPrice": 0,
      "matchedTotal": 0
    },
    {
      "outcome": "Manchester United",
      "latestMatchedPrice": 1.77,
      "matchedTotal": 88
    }
  ],
  "marketTitle": "Full Time Result",
  "marketLock": "2023-01-18T20:00:00.000Z",
  "liquidityTotal": 186.2,
  "matchedTotal": 88.9,
  "totalUnmatchedOrders": 9
```
