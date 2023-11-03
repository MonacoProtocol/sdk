import db from '@/database/database';

export const getLocalEvents = async () => {
  const events = await db.events.orderBy('eventStartTimestamp').toArray();
  return events;
};

export const getLocalEventMarketMapping = async () => {
  const marketEvents = await db.marketEvents.toArray();
  return marketEvents;
};

export const getLocalEventForMarket = async (marketPublicKey: string) => {
  const marketEvent = await db.marketEvents
    .where('marketPublicKey')
    .equals(marketPublicKey)
    .first();
  if (marketEvent) {
    const event = await db.events.where('publicKey').equals(marketEvent.eventPublicKey).first();
    return event;
  }
};

export const getLocalEventMarketMappingForMarkets = async (marketPublicKeys: string[]) => {
  return await db.marketEvents.where('marketPublicKey').anyOf(marketPublicKeys).toArray();
};

export const getLocalEventsForMarkets = async (marketPublicKeys: string[]) => {
  const marketEvents = await getLocalEventMarketMappingForMarkets(marketPublicKeys);
  const eventPublicKeys = marketEvents.map(
    (marketEvent: { eventPublicKey: string }) => marketEvent.eventPublicKey,
  );
  const events = await db.events.where('publicKey').anyOf(eventPublicKeys).toArray();
  return events;
};

export const removeLocalEvents = async () => {
  await db.events.clear();
};

export const removeLocalEventMarkets = async () => {
  await db.marketEvents.clear();
};
