# Commission

In order to help create sustainable business models, the Monaco Protocol allows for the charging of commission. Please note that **commission is only charged on winning orders.** 

There are two types of commission when we talk about the protocol:

- Protocol
  - A base-level commission charged on all winning orders placed on the protocol.
  - Set by The Monaco Protocol Foundation.
  - Funds from this commission are used support the development and maintenance of the protocol and ecosystem tooling.
  - This is **currently set to 0%**.
- Product
  - A commission level recorded on an order level.
  - Charged only on winning orders.
  - Charged in addition to protocol commission.
  - Funds from this commission go to the product operator.
  - Optional on all orders.
  - This can also **be set to 0%**.

## Product Authority

At the creation of a product account, an authority is set. This authority can:

- Update commission rate.
- Transfer authority.

It is advisable for this authority to be a multisig for additional security. You may wish to use a single authority for convenience when setting up the product, but then transfer authority immediately afterwards.

## Escrow Accounts

When a product is set up, an escrow account is provided - this is a wallet to which commission funds are sent at settlement.

- Products can share the same escrow account.
- Escrow accounts can be changed by the product authority.
- It is advisable for the account to be be controlled by a multisig for additional security.

# Protocol Commission

The level of protocol commission is set by the Monaco Protocol Foundation and can be viewed on chain at all times at the address `B2uE5XiUWh3W2euca55K9mhjcDnkjNADFUSb2f5v7RGC`

- [View on Solana Explorer](https://explorer.solana.com/address/B2uE5XiUWh3W2euca55K9mhjcDnkjNADFUSb2f5v7RGC/anchor-account)

# Product Commission

Anyone is able to set up product accounts to be able to charge commission. As commission is set on order placement, different operators can charge varying commission rates for the same market - regardless of the market authority. For example:

- PRODUCT_X may set a 1.5% commission rate
- PRODUCT_Y may set a 1.75% commission rate
- PRODUCT_Z may set a 1.45% commission rate

Commission rates can be changed at any time by the authority in charge of the product account.

## Commission Strategy

Passing through a product on order creation gives multiple benefits.

 - You can charge commission.
 - You can charge variable commission.
 - You can track what orders are being placed via your interface as they will have your productKey linked to them.

As commission can be set at 0%, it is advantageous for anyone interfacing with the Monaco Protocol to set up and pass through their own productKey should they wish to understand more about the levels of interaction with their product.

For variable commission, if we return to our original examples:

- PRODUCT_Z may set a 1.45% commission rate
- PRODUCT_Z may also set up a product account named PRODUCT_Z_PROMO with a commission rate at 0.45%
- And a PRODUCT_Z_ZERO product with a commission rate of 0%

With their interface they could then chose which product key to pass through at order placement in order to apply variable commission rates.

## Payout Structure

Product commission payout is based on three primary factors:

- The Protocol Commission rate.
- The amount of risk handled by a product for the market being paid out on.
  - This handles the case where a wallet may have placed orders via multiple products.
- The total profit on a winning market position for a wallet.

### Example 1

- $100 total profit on a market position.
- 1% Protocol commission.
- 5% PRODUCT_X commission.
- PRODUCT_X handled 100% of the risk.

#### PRODUCT_X Fees

- The fee pot is $100 as the product handled all the risk.
- The Protocol takes 1% of the $100: $1
-  PRODUCT_X takes 5% of the $100: $5

#### Wallet Payout

- After fees the wallet will receive: $94

### Example 2

- $1000 total profit on a market position.
- 1% Protocol commission.
- 1% PRODUCT_Z commission.
- 2% PRODUCT_Y commission.
- Both PRODUCT_Z and PRODUCT_Y handled 50% of the risk.

#### PRODUCT_Z Fees

- The fee pot would be $500 as the product handled 50% of the risk.
- The Protocol takes 1% of the $500: $5
- PRODUCT_Z takes 1% of the $500: $5


#### PRODUCT_Y Fees

- The fee pot would be $500 as the product handled 50% of the risk.
- The Protocol takes 1% of the $500: $5
- PRODUCT_Y takes 2% of the $500: $10

#### Wallet Payout

- After fees the wallet will receive: $975

## Passing Product on Order Placement

Assuming a product is using a client version `>=7.1.0` then the publicKey can be passed through as an argument on order creation, this is an optional field so if an operator does not wish to pass through any product at all, they do not have to.

### Using Product

```
const marketPk = new PublicKey('7o1PXyYZtBBDFZf9cEhHopn2C9R4G6GaPwFAxaNWM33D')
const marketOutcomeIndex = 0
const forOutcome = true
const price = 1.5
const stake = 20
const productPk = new PublicKey('exampleEXchAngePr0ductZf9cEhHopn2C9R4G6GaPwFAxaNWM33D')
const order = await createOrderUiStake(program, marketPk, marketOutcomeIndex, forOutcome, price, 20, productPk)
```

### Not Using Product

```
const marketPk = new PublicKey('7o1PXyYZtBBDFZf9cEhHopn2C9R4G6GaPwFAxaNWM33D')
const marketOutcomeIndex = 0
const forOutcome = true
const price = 1.5
const stake = 20
const order = await createOrderUiStake(program, marketPk, marketOutcomeIndex, forOutcome, price, 20)
```

Any product using the client `<7.1.0` pass through a `null` value by default.

# CLI Examples

Examples for all core interactions with the product program via CLI can be seen in [../examples/cli/src/products/](../examples/cli/src/products/) with the CLI `getProgram()` util containing a switcher to allow it to be used for either The Monaco Protocol or The Protocol Product Program.

The example also include a script that allows you to easily view the escrow balance for products for a given token.

# Protocol Product Program

The program that governs product is separate from the Monaco Protocol, like the protocol it is open-source. It is pending audit and is available at the address `mppFrYmM6A4Ud3AxRbGXsGisX1HUsbDfp1nrg9FQJEE`.

- https://github.com/MonacoProtocol/protocol-product
