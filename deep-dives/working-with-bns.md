# Introduction

When working with the Monaco Protocol, one thing that you will notice is that fields you expect to be numbers (stake, timestamp) - aren't.

Instead, these numbers are represented as a `BNs`, or big numbers. - this is a convention of solana as javascript `number` will not be able to hold the full range of numbers supported by u64. So whilst `BNs` are excellent for brevity, they are not for readability as they need to be converted back into a `number`.


# The Client Approach

The Monaco Protocol Clients don't perform any conversion on `BNs` so that all consumers receive the `BN` rather than the `number` they represent. The reasons for this are:

- The client is built to be as-pure an interface as possible without manipulating data.
- The brevity of a BN helps reduce overall response size.
- When it comes representing token amounts (such as stakes/payouts) additional calculations are required in order to display the `number` you are expecting as not all tokens on the chain are calculated to the same decimal placing.

# Timestamps

Timestamps are the most simple `BN` representation, whereby the `BN` is converted into a `number` and the end result is the timestamp we are expecting. For example, if the `marketLockTimestamp` for a market may be returned like this:

```
marketLockTimestamp: <BN: 63c2a048>
```

To return the numbered timestamp, we perform the `toNumber()` function on the `BN` to give us the unix timestamp for the market lock.

```
marketLockTimestamp = marketLockTimestamp.toNumber()
marketLockTimestamp: 1673699400
```

# Token Amount Representation

To represent a token amount, we need to perform two actions on the `BN`. First we need to convert it to a `number`, then we need to divide it by 10 to the power of the decimal placing of the token used. For example:

- An order is placed with a stake of `10 USDT`
- As a `BN` this is represented as:

```
stake: <BN: 989680>
```

- Next we convert the `BN` to a `number`

```
stake = stake.toNumber()
stake: 10000000
```

- With the stake now returning as `10000000` we need to divide it by 10 to the power of USDTs decimal placing
- USDT operates to 6 decimal places
  - This can be observed [on solana explorer](https://explorer.solana.com/address/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB)
- This calculation returns our initial stake of `10`

```
stake = stake.toNumber()/ 10 ** 6
stake: 10
```

Now we have our expected stake of `10 USDT`.

## Getting the Decimal Amount for a Token

For convenience, The Monaco Protocol client provides a `getMintInfo()` function that takes in the initialised anchor program and the publicKey for the mint you are using - using USDT as an example, this would be `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`

```
const mintInfo = await getMintInfo(program, new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'))
const mintDecimals = mintInfo.data.decimals
```

The decimal amount of a token cannot change, so you may wish to map the amount for tokens you are using rather than making a request to `getMintInfo` every time you require it.

## Token Amount Representation on Order Creation

When placing an order on the protocol, you have two options for representing your stake:

- Using the UI (human-readable) amount `createOrderUiStake()`
  - Stake would be `10`
- Raw number taking into account the mint token decimal amount `createOrder()`
  - Stake would be `10000000`

The UI stake method makes a request to get the mint decimal (using the `mintAccount` on the `marketAccount`) and converts it into the amount that will be stored as a `BN` on chain. In the case of a `10 USDT` stake, it performs the action:

```
const mintInfo = await getMintInfo(program, new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'))
stake = stake * 10 ** mintInfo.data.decimals
```

Whereby the stake is multiplied by 10 to the power of the mint decimals.

# Parsing BNs

As numbers are an important part of an exchange protocol, examples for parsing response data can be found in the CLI examples at [../examples/cli/src/parsers](../examples/cli/src/parsers/). Each example request parses BNs by default to numbers. There is also an example script that parses the marketPrices response in [../examples/cli/src/get_market_summary.ts](../examples/cli/src/get_market_summary.ts) the market prices response returns all the data needed to generate a market page for an exchange:

- Market info
- Pending orders on the market
- Market prices available per outcome/for/against
- Outcomes with latest matched price and matched total
- Liquidity amount based on pending orders

# Further Reading

- [BN.js](https://github.com/indutny/bn.js/)
- [u64 in Rust](https://doc.rust-lang.org/std/primitive.u64.html)
  