/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '@/database/database';
import { getLastFetchTimestamp, updateFetchTime } from '@/database/endpoints/database';
import {
  getLocalEvents,
  removeLocalEventMarkets,
  removeLocalEvents,
} from '@/database/endpoints/events';
import { getStoredSettings } from '@/utils/settings';
import { hasElapsed } from '@/utils/time';

const CACHE_DURATION_MINUTES = getStoredSettings().active.cache_events;

export const storeEvents = async () => {
  const cache = await checkCache();
  if (cache) return;
  try {
    await Promise.all([removeLocalEvents(), removeLocalEventMarkets()]);
    const eventData = await fetch(
      'https://betdex-data.s3.eu-west-2.amazonaws.com/eventgroups-production.json',
    );
    const jsonData = await eventData.json();
    const flatEvents = flattenEvents(jsonData);
    const mappings = marketEventMapping(flatEvents);
    const eventsToStorePromises = flatEvents.map((event: any) => {
      eventForDb(event);
    });
    const marketMappingsToStorePromises = mappings.map((mapping: any) => {
      marketEventMappingForDb(mapping);
    });
    await Promise.all(eventsToStorePromises);
    await Promise.all(marketMappingsToStorePromises);
    await updateFetchTime('events');
    if (!eventData.ok) throw new Error(`Error returned from fetchEvents endpoint`);
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const fetchEvents = async () => {
  const cache = await checkCache();
  if (cache) return getLocalEvents();
  try {
    await storeEvents();
    return await getLocalEvents();
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

const checkCache = async () => {
  const lastUpdate = await getLastFetchTimestamp('events');
  if (lastUpdate && !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES)) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return true;
  }
};

const eventForDb = (event: any) => {
  const names = event.participants.map((participant: any) => participant.name);
  const participantIds = event.participants.map((participant: any) => participant.id);
  return db.events.put({
    publicKey: event.eventAccount,
    categoryId: '-',
    categoryTitle: '-',
    subcategoryId: event.category,
    subcategoryTitle: event.categoryTitle,
    eventGroupId: event.eventGroup,
    eventGroupTitle: event.eventGroupTitle,
    eventStartTimestamp: event.eventStart,
    eventEstimatedEndTimestamp: event.estimatedEnd,
    eventName: event.eventName,
    eventParticipantNames: names,
    eventParticipantIds: participantIds,
  });
};

const marketEventMappingForDb = (mapping: any) => {
  return db.marketEvents.put({
    marketPublicKey: mapping.marketPublicKey,
    eventPublicKey: mapping.eventPublicKey,
  });
};

const flattenEvents = (eventCategories: any) => {
  const events = [];
  for (const category of eventCategories.eventCategories) {
    for (const eventGroup of category.eventGroup) {
      for (const event of eventGroup.events) {
        events.push(event);
      }
    }
  }
  return events;
};

const marketEventMapping = (flatEvents: any) => {
  const mappings = [];
  for (const event of flatEvents) {
    for (const market of event.markets) {
      const mapping = {
        eventPublicKey: event.eventAccount,
        marketPublicKey: market.marketAccount,
      };
      mappings.push(mapping);
    }
  }
  return mappings;
};
