# Protocol Fees

Participants of the Monaco protocol incur SOL fees during market operations. These fees can be characterised as follows.

## Gas Fees (Permanent)

All participants of the Solana blockchain (and thereby the Monaco Protocol) incur a fee every time a transaction occurs. This fee is known as a gas fee or a transaction fee and charged by the Solana network, the cost is 0.000005 SOL.



**These fees are non-refundable and are incurred on a network level.**

## Account Fees (Temporary and Refundable)

Like all programs on solana, data is stored in accounts. In order to operate, the Monaco Protocol needs to create accounts at various stages in the lifecycle of a market. These accounts incur temporary SOL fees to cover it's existence on-chain, this is called rent exemption. The fee incurred depends on the size (in terms of data stored) of the account - this is fixed per account type.&#x20;



**Once a market operator has settled a market, they can then mark it for closure**. The closure crank will then pick up the market and close all accounts. This will return all SOL to the original paying wallet, **refunding all rent fees to it**.

### Order Placement Fees

When placing an order, the protocol opens accounts in order to take and match that order. The wallet which places the order incurs temporary SOL fees to cover rent exemption (paying for the account to exist on-chain).&#x20;

* **Order Account**&#x20;
  * **Description -** Account created on-chain to store your order
  * **Frequency -** Occurs every time you place an order
  * **Cost -** 0.00231768 SOL
* **Market Position Account**
  * **Description -** An account opened up on-chain to hold your net position in a given market, i.e. if you place 3 backs and 2 lays in the same match winner market, this position will hold your net profit or loss
  * **Frequency -** One time per market, only charged the first time you place an order on that market
  * **Cost -** Varies with the size of the market (e.g. 2 way market is \~.0087 SOL, 4-way market is \~0.009 SOL)
* **Market Matching Pool Account**
  * **Description -** This is an account created on-chain to store the orders which are to be matched at a specific price point for a specific prediction, e.g. BACK USA at 2.0 will have a market matching pool account, LAY USA at 2.0 will have a different market matching pool account
  * **Frequency -** Variable but infrequent, the user is only charged if the market matching pool account is NOT already created, i.e. this only occurs if a specific order type has not been placed already across all users at a specific price point for a specific prediction (i.e. first order @ price @ outcome BACK/LAY)
  * **Cost -** 0.03500184

### Market Fees

Market creators also encounter fees to cover rent exemption.

* **Market Account**
  * **Description -** the base account for a betting market
  * **Frequency -** per market
  * **Cost** - 0.0061248 SOL
* **Market Outcome Account**
  * **Description -** account holding information about a possible outcome on a market, including the price ladder
  * **Frequency -** one account per outcome on a market
  * **Cost -** 0.02195184 SOL

### Crank Fees

In addition to gas fees for successful on-chain transactions, crank operators also incur fees for funding the creation of trade accounts.

* **Trade Account**
  * **Description -** an account holding information about one side of a matched order
  * **Frequency -** two per match, one for each side of the trade
  * **Cost -** 0.00224808 SOL x 2&#x20;
