# Monaco Protocol App

This is an example Next.js app that runs against [The Monaco Protocol](https://github.com/MonacoProtocol/protocol). The app makes direct RPC requests to populate market states, given that these requests can be large in size and volume, it also relies on local caching with [Dexie.js](https://dexie.org/). This allows you to browse data without running through your RPC development credits. The app is currently:

- Built for mainnet only
- Parses token values to a static 6 decimal places (for USDC)
- In active development and refinement
- Does not have error handling beyond console logs
- Has large loading times (due to number of RPC request) and not always loading indicators
- Not production ready - it is an example only and attempting to use it as a consumer product would most likely incur upon you massive, unsustainable RPC bills

Additionally, please don't take this example of good front-end coding practices as it has been built as a learning exercise in itself.

## App Features

### Events

View all events published by BetDEX utilizing their static API. BetDEX are the only mainnet operator at the moment and their API is used in place of the soon-to-be-used Monaco Protocol Events Service. Events provide context around markets such as sport, league, and start times. Events are filterable.

### Markets

View all published markets on the protocol, filterable by market status. These statuses slightly differ from the onchain statuses as they include:

- Standard (An OPEN non-inplay market)
- In Play (An OPEN inplay market)
- Live Now (An OPEN inplay market that is current in the inplay phase)
- Waiting For Settlement (An OPEN market with an elapsed market lock time)

### Market

A single view for a market containing:

- An order matrix
  - Current prices
  - Current liquidity at price points
  - Last traded price
- All orders and market positions on the market broken down by purchaser
  - The connected wallet details are displayed first
- The ability to cancel cancellable orders for the connected wallet
- The winning outcome of a market
- Settlement time of the market
- A warning if the market is suspended

### Order Placement

Accessible from within market given the market is taking orders meaning:

- In an OPEN status, but market lock hasn't elapsed
- Not suspended

Order placement allows:

- View SOL and USDC balance
- Automatic selection by selecting a price-point on the market order matrix
- Select outcome
- Select for/against
- Select stake
  - The app has a default stake that you can set in settings; useful for testing
- Select price
- View risk (money taken) based on stake, price, and for/against
- View potential profit
- Select product to enter via and view potential commission rates of that product

### Wallet Insight

A view to see all orders for the provided wallet this view gives:

- Live wallet summary (current risk, winnings, losses, returns, number of markets)
- Each event/market/position/orders for the wallet
- Filterable by event
- Ability to cancel orders if using connected wallet
- Ability to select known wallets (saved in settings)

### Transactions

View transactions on an account in a human-readable format. Any account on the protocol can be added (market, order, trade etc) to view all of the transactions on that account (limited by settings to 1000).

### Products

See all products set up via the monaco protocol product program. Products are specified on order placement and allow operators to charge a % fee on winning market positions. Read more about commission [here](https://docs.monacoprotocol.xyz/readme/commission).

### Settings

- The ability to set a new RPC endpoint on the deployed app, useful if your current endpoint provider is experiencing issues and you wish to check the state of the protocol without redeploying the app
- The ability to save known wallet, useful if there are wallets you wish to monitor the performance of in Wallet Insights. These wallets are saved locally. They can be added to a deployed version of the app so they appear across all instances.
- The ability to change cache times for each of the cached endpoints. If you make a request to an endpoint before the cache time has expired, the results will be pulled from the local indexerDB.
- The ability to edit the default stake used for order placement
- The ability to clear the local DB

### Misc

- Current UTC time as all times on the protocol are in UTC
- All accounts referenced in the app appear as links to solana explorer. Depending on the account, the link will be to the most relevant second of explorer:
  - Protocol accounts will go to anchor data to view the data in the account
  - Wallets will go to the token section to view balances
  - Transactions will go the transactions
- As soon as data is fetched from chain, it is immediately parsed before it is stored in the db, so publicKeys are stored as string, BNs as numbers, and token values that were BNs are converted for their decimal placing.

### Roadmap

- Market seeder
- Market management

# Getting Started

## RPC Node

To get started you will first need an RPC node. Checkout out our [guide in the SDK](https://github.com/MonacoProtocol/sdk/tree/main/examples#getting-started---rpc-node) to get started.

Once you have an RPC node you will want to add it to `DEFAULT_RPC` in [src/config/appSettings.ts](/src/config/appSettings.ts) before running your local server.

## Approved Wallets

This feature is so that, if you deploy the app, you have some rudimentary control over who can access and therefore protect your RPC endpoint from overuse. If you are using approved wallets, then a user has to connect one of the wallets through their wallet browser extension. If they do not then they will always be redirected to the home page before any requests are made.

- Set `USE_APPROVED_WALLETS` in [src/config/appSettings.ts](/src/config/appSettings.ts) to false
- Add your wallet public key (as a string) to [src/config/approvedWallets.ts](/src/config/approvedWallets.ts)

## Running Your Server

After installing the project requirements:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to get going.

# More About Next.js

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
