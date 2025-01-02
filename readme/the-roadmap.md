# The Roadmap

## Coming Up ⚒️

* **Monaco Protocol API:** industry-standard API for integrating with the protocol; making it faster, and easier, to tap into global liqduitiy

## 2024 - Done ✅

* **SOL recovery with account closures:** Return rent to the wallet that opened the account (order, market position, matching pools etc)
* **Market authority lockdown:** Allow only the market authority the ability to manage their own markets
* **Ability to void a market:** Return all funds to their original wallet and mark the market as voided
* **In-play markets with bet delay:** Cancel all unmatched orders on event start and allow orders to be taken until market lock, with a specified matching delay
* **Operator and protocol fees:** Ability to set a % commission on winning market positions
* **Events Service v1:** New protocol to store event data (Team Red vs Team Blue) to link to markets
* **Additional market types:** Ability for operators to create more than 4 market types linked to a single event account
* **Matching optimisations:** Matching orders on creation and improving wallet risk management
* **Operational cost reductions:** Reduce rent overhead for creating and managing markets
* **Client order management optimisations:** Optimally reduce on-chain requests when creating and cancelling orders
* **Instruction builder in the client:** Ability to send multiple creation and cancel instructions in the same transaction
* **Cancel unmatched orders on market lock:** When a market locks, return unused funds to wallets rather than waiting for market settlement
* **Gasless Transactions:** Abstract away the concept of gas from users to allow for easier onboarding and user experience
* **User cost reductions:** Reduced accounts used in order creation/management
