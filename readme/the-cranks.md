# The Cranks

In order to find and submit an external process called a "crank" is used. A crank is an external, off-chain process that is responsible for loading the accounts that the program requires and submitting a request to the program to perform an on-chain process. The principle is that after a successful crank process the state of the program / data is updated to reflect a new state.

- Only authorized `CRANK` operators can run a crank
- An operator is represented by a wallet public key
- All cranks can be run on a single instance
- All cranks operate on all markets/orders
- The source code is publicly available at https://github.com/MonacoProtocol/crank
- All authorized operator keys can be queried and therefore publicly known

# Matching Crank

The matching crank is responsible for fetching the next available Order accounts to process and submitting those Orders to the on-chain matching process. The Orders are selected in the order they were created (oldest first) and this order is enforced by the on-chain program to ensure that a newer Order cannot skip ahead of an older one.

# Settlement Crank

The settlement crank is responsible for fetching unsettled Order accounts and submitting to the on-chain settlement process.

# Closure Crank

The closure crank watched for markets that have been set as complete, it will then close down all accounts associated with that market in order to return rent to the rent payer.
