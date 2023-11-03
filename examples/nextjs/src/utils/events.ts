import { IEvent, IMarketEvent } from '@/database/types';

import { nowTimestamp } from './time';

export enum EventStatus {
  ALL = 'All',
  NOT_STARTED = 'Not Started',
  LIVE = 'Live',
  FINISHED = 'Finished',
}

export const getUniqueCategoriesFromEvents = (events: IEvent[]): string[] => {
  const uniqueCategories = [...new Set(events.map((event) => event.subcategoryTitle))].sort(
    (a, b) => (a > b ? 1 : -1),
  );
  uniqueCategories.unshift(EventStatus.ALL);
  return uniqueCategories;
};

export const getUniqueEventGroupsForEvents = (events: IEvent[]): Record<string, string[]> => {
  const categories = getUniqueCategoriesFromEvents(events);
  const mapping: Record<string, string[]> = {};
  categories.forEach((category) => {
    mapping[category] = [];
    mapping[category] = [
      ...new Set(
        events
          .filter((event) => event.subcategoryTitle === category)
          .map((event) => event.eventGroupTitle),
      ),
    ].sort((a, b) => (a > b ? 1 : -1));
  });
  const allEventGroups = Object.values(mapping).reduce((acc, curr) => {
    return acc.concat(curr).sort((a, b) => (a > b ? 1 : -1));
  }, []);
  allEventGroups.unshift(EventStatus.ALL);
  mapping[EventStatus.ALL] = allEventGroups;
  return mapping;
};

export const marketPublicKeysForEvent = (eventMarkets: IMarketEvent[], eventPublicKey: string) => {
  const mapping = eventMarkets
    .filter((eventMarket) => eventMarket.eventPublicKey === eventPublicKey)
    .map((eventMarket) => eventMarket.marketPublicKey);
  return mapping;
};

export const filterEventsByStatus = (events: IEvent[], status: string) => {
  const now = nowTimestamp();
  switch (status) {
    case EventStatus.NOT_STARTED:
      return events.filter((event) => event.eventStartTimestamp > now);
    case EventStatus.LIVE:
      return events.filter(
        (event) => event.eventStartTimestamp < now && event.eventEstimatedEndTimestamp > now,
      );
    case EventStatus.FINISHED:
      return events.filter((event) => event.eventEstimatedEndTimestamp < now);
    default:
      return events;
  }
};
