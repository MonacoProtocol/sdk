import Dexie from 'dexie';

const marketKeys = [
  'publicKey',
  'eventAccount',
  'marketLockTimestamp',
  'marketOutcomesCount',
  'marketSettleTimestamp',
  'marketStatus',
  'marketType',
  'marketWinningOutcomeIndex',
  'published',
  'suspended',
  'title',
  'inplay',
  'inplayEnabled',
  'eventStartTimestamp',
];

const marketOutcomeKeys = [
  'publicKey',
  'market',
  'index',
  'title',
  'latestMatchedPrice',
  'matchedTotal',
];

const marketMatchingPoolKeys = [
  'publicKey',
  `market`,
  `marketOutcomeIndex`,
  `forOutcome`,
  `price`,
  'liquidityAmount',
  'matchedAmount',
];

const orderKeys = [
  'publicKey',
  'purchaser',
  'market',
  'marketOutcomeIndex',
  'forOutcome',
  'orderStatus',
  'product',
  'stake',
  'voidedStake',
  'expectedPrice',
  'creationTimestamp',
  'delayExpirationTimestamp',
  'stakeUnmatched',
  'payout',
  'payer',
  'productCommissionRate',
];

const marketPositionKeys = [
  'publicKey',
  'purchaser',
  'market',
  'paid',
  'marketOutcomeSums',
  'unmatchedExposures',
  'payer',
  'matchedRisk',
  'matchedRiskedPerProduct',
];

const eventKeys = [
  'publicKey',
  'categoryId',
  'categoryTitle',
  'subcategoryId',
  'subcategoryTitle',
  'eventGroupId',
  'eventGroupTitle',
  'eventStartTimestamp',
  'eventEstimatedEndTimestamp',
  'eventName',
  'eventParticipantNames',
  'eventParticipantIds',
];

const marketEventKeys = ['marketPublicKey', 'eventPublicKey'];

const productKeys = [
  'publicKey',
  'authority',
  'payer',
  'commissionEscrow',
  'productTitle',
  'commissionRate',
];

class MonacoMarketsDB extends Dexie {
  markets;
  marketOutcomes;
  marketMatchingPools;
  orders;
  events;
  marketEvents;
  products;
  fetchTimestamps;

  constructor() {
    super('MonacoProtocolDB');
    this.version(8).stores({
      markets: marketKeys.join(','),
      marketOutcomes: marketOutcomeKeys.join(','),
      marketMatchingPools: marketMatchingPoolKeys.join(','),
      marketPositions: marketPositionKeys.join(','),
      orders: orderKeys.join(','),
      events: eventKeys.join(','),
      marketEvents: marketEventKeys.join(','),
      products: productKeys.join(','),
      fetchTimestamps: 'name,timestamp',
    });

    this.markets = this.table('markets');
    this.marketOutcomes = this.table('marketOutcomes');
    this.marketMatchingPools = this.table('marketMatchingPools');
    this.marketPositions = this.table('marketPositions');
    this.orders = this.table('orders');
    this.products = this.table('products');
    this.fetchTimestamps = this.table('fetchTimestamps');
  }

  async deleteDb() {
    await db.delete();
    await db.open();
  }

  async clearAllTables() {
    await this.transaction('rw', this.tables, async () => {
      for (let table of this.tables) {
        await table.clear();
      }
    });
  }
}

const db = new MonacoMarketsDB();
export default db;
