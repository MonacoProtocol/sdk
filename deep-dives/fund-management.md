# Fund Management

## Context

This document will describe two techniques used by the Monaco protocol to manage funds covering user's risk: discounting at the time of order creation and refunds at the time of order matching. Both of those techniques are supposed to allow users to use their funds more efficiently.

This document does NOT cover network fees or account rent exemption fees native to the Solana block chain. Nor does it cover Monaco protocol commission deductions from the winnings.

## Total cost

Total cost for the user for a given market at any given point in time is defined as a max of all sums of value **unmatched** **exposures** and value of **market position** losses for a given outcome.

$$
market\_position\_loss[i] = \begin{cases}abs(market\_position[i])&\text{when }&market\_position[i]<0\\0\end{cases}
$$

$$
total\_cost = \max_{i=1}^{outcomes} ( unmatched\_exposure[i] + market\_position\_loss[i] )
$$

In code **unmatched** **exposures** are being tracked by `unmatched_exposures` array and **market position** is being tracked by `market_outcome_sums` array. Both are part of the `MarketPosition` account.

### Discounting on creation

We will refer to the reduction in funds required to cover the cost of order at creation as **discounting** because it happens before funds are being taken.

To perform **discounting** the Monaco protocol keeps a record of a sum of all the losses for a given outcome that users orders could cause. We will refer to this as **unmatched exposure**. Orders for an outcome <mark style="color:yellow;">increase</mark> the **unmatched** **exposure** value for all outcomes except the one they are for by the amount equal to the order's risk amount (`stake`). Orders against an outcome <mark style="color:yellow;">increase</mark> the **unmatched** **exposure** value only the outcome they are against by the amount equal to the order's risk amount (`stake * (price - 1)`).

This means that on occasion max value of all **unmatched** **exposures** for all outcomes does not change even if individual values do. When that happens discounted or even no payment is taken for the order. Since the **market position** is not being affected at this point it can be ignored.

### Refunding on matching

On order matching two things happen in proportion to the part of the order being matched:

* **unmatched exposure** gets reduced
* **market position** gets updated

Both of those happen at the same time and none happens without the other.

Orders for an outcome <mark style="color:yellow;">decrease</mark> the **unmatched** **exposure** value for all outcomes except the one they are for by the amount equal to the order's `stake`. Orders against an outcome <mark style="color:yellow;">decrease</mark> the **unmatched** **exposure** value only of the outcome they are against by the amount equal to the order's `stake * (price - 1)`.

Values **market position** are a little bit more complicated as they track both profit and loss for all matched orders. Matching order for an outcome <mark style="color:yellow;">increases</mark> the position's value for that outcome by the profit amount (`stake * (price - 1))` and <mark style="color:yellow;">decreases</mark> all other outcomes by the risk amount (`stake`). Matching order against an outcome <mark style="color:yellow;">decreases</mark> the position's value for that outcome by the risk amount (`stake * (price - 1))` and <mark style="color:yellow;">increases</mark> all other outcomes by the profit amount (`stake`).

This means that both max value of all **unmatched** **exposures** and max value of all **market position** losses can change affecting a **total cost** for the user. The refund occurs when the **total cost** after matching is lower than before matching and the refund amount is equal to the difference between the two.

## Example

Let's assume that we have a market with 3 outcomes (A, B and C) and there is a user that wants to make a series of bets of `$10.00 @ 3.00` for each of the outcomes.

If each order was treated individually the **total cost** to the user would be `$30.00,` but with the Monaco protocol tracking both **unmatched** **exposures** and **market position** the final **total cost** to user will be `$0.00`.

For a market with 3 outcomes the following funds are being taken during order creation:

```
  | outcome | stake @ odds | unmatched exposures | cost  |
  |         |              |     A,     B,     C |       |
----------------------------------------------------------
  |         |              |  0.00,  0.00,  0.00 |       |
1.|  for A  | 10.00 @ 3.00 |  0.00, 10.00, 10.00 | 10.00 |
2.|  for B  | 10.00 @ 3.00 | 10.00, 10.00, 20.00 | 10.00 |
3.|  for C  | 10.00 @ 3.00 | 20.00, 20.00, 20.00 |  0.00 |
----------------------------------------------------------
total cost                                       | 20.00 |
```

Let's assume that all orders were matched which leads to the following updates:

```

  
    
  | outcome | matched      | unmatched exposures | market position       | total  | refund |
  |         | stake @ odds |     A,     B,     C | (losses are negative) | cost   |        |
--------------------------------------------------------------------------------------------
  |         |              | 20.00, 20.00, 20.00 |  0.00,   0.00,   0.00 |  20.00 |        |
1.|  for A  | 10.00 @ 3.00 | 20.00, 10.00, 10.00 | 20.00, -10.00, -10.00 |  20.00 |   0.00 |
2.|  for B  | 10.00 @ 3.00 | 10.00, 10.00,  0.00 | 10.00,  10.00, -20.00 |  20.00 |   0.00 |
3.|  for C  | 10.00 @ 3.00 |  0.00,  0.00,  0.00 |  0.00,   0.00,   0.00 |   0.00 |  20.00 |
--------------------------------------------------------------------------------------------
total refund                                                                      |  20.00 |
```



