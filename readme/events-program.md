# Events Program

**Please note:** the following describes an in-development, un-audited program **protocol-event** that enhances the experience of working with The Monaco Protocol.

Repository: [protocol-event](https://github.com/MonacoProtocol/protocol-event)

The Monaco Protocol Events Program is a program deployed to Solana mainnet that provides additional context around betting markets. The program does not need to be used, but it does greatly enhance the experience by providing onchain data relating to the event against which a market is set.

The Events Program offers levels of categorization that are detailed below.


```
├── Category
│   ├── Sub Category
│   │   ├── Event Group
│   │   │   └── Event ────────────│
│   │   ├── Participant ──────────│
│   │   │   ├── Participant A ────│
│   │   │   ├── Participant B     │
│   │   │   └── Participant C ────│
```

# Category

A category is the highest level, and broadest level of grouping.

- Sports
- Politics
- Esports
- Television
- Movies

# Sub Category

A Sub Category is a high-level grouping for event groups.

- Soccer
- US State Politics
- CS:GO
- TV Award Shows
- Box Office Ratings

Sub categories are linked to **Category**.

# Event Group

Event groups are the lowest level groupings for events.

- The Champions League
- State Senate Elections
- BLAST Spring European Showdown
- The Golden Globes
- Weekly Chinese Box Office

Event Groups are linked to **Sub Category** and **Category**.

# Event

And event is the thing on which the outcome, or stats from, inform the result of a market.

- Manchester United vs Real Madrid
- New York State Senate Election
- Cloud9 vs Vitality
- Best Television Drama
- Box Office Week Ending 7th September

An event can have linked **Participants**, **Event Group**, **Sub Category**, and **Category**.

# Participant

These represent the entities (individual or collective) competing in the event.

- Team
- Player
- Politician
- TV Show
- Movie

Participants are linked to a **Sub Category** and multiple participants can be linked to a multiple events. It is possible to have individual and collective participants linked to an event.

# Creating, Updating, Closing

The program is trustless meaning that anyone can create their own accounts through the event service. The authority that performed creation is the only one that can perform updates.

Similarly, the authority has the ability to close their accounts should they wish to recover rent costs.
