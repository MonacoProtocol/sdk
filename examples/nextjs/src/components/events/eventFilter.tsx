import React, { useEffect, useState } from 'react';

import { IEvent } from '@/database/types';
import {
  EventStatus,
  filterEventsByStatus,
  getUniqueCategoriesFromEvents,
  getUniqueEventGroupsForEvents,
} from '@/utils/events';

interface EventFilterProps {
  events: IEvent[];
  filterEvents: (events: IEvent[]) => IEvent[];
  onFilteredEvents: (events: IEvent[]) => void;
  loading: boolean;
}

const EventFilterComponent: React.FC<EventFilterProps> = ({
  events,
  onFilteredEvents,
  loading,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [eventGroups, setEventGroups] = useState<Record<string, string[]>>({});
  const [selectedEventGroup, setSelectedEventGroup] = useState<string[]>([]);
  const [eventGroupFilter, setEventGroupFilter] = useState<string>('');
  const [eventStatus, setEventStatus] = useState(EventStatus.ALL.valueOf());

  useEffect(() => {
    if (events.length > 0) {
      const uniqueCategories = getUniqueCategoriesFromEvents(events);
      const uniqueEventGroupsForCategories = getUniqueEventGroupsForEvents(events);
      setCategories(uniqueCategories);
      setSelectedCategory(uniqueCategories[0]);
      setEventGroups(uniqueEventGroupsForCategories);
      setSelectedEventGroup(uniqueEventGroupsForCategories[uniqueCategories[0]]);
    }
  }, [events]);

  useEffect(() => {
    if (selectedEventGroup.length > 0) {
      setEventGroupFilter(selectedEventGroup[0]);
    }
  }, [selectedEventGroup]);

  useEffect(() => {
    const filterEvents = () => {
      let filteredEvents = events;
      if (selectedCategory !== EventStatus.ALL)
        filteredEvents = events.filter((event) => event.subcategoryTitle === selectedCategory);
      filteredEvents = filterEventsByStatus(filteredEvents, eventStatus);
      if (eventGroupFilter && eventGroupFilter !== EventStatus.ALL) {
        filteredEvents = filteredEvents.filter(
          (event) => event.eventGroupTitle === eventGroupFilter,
        );
      }
      onFilteredEvents(filteredEvents);
    };

    if (events.length > 0) {
      filterEvents();
    }
  }, [selectedCategory, eventGroupFilter, eventStatus]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedEventGroup(eventGroups[e.target.value]);
    setEventGroupFilter(eventGroups[e.target.value][0]);
    setEventStatus(EventStatus.ALL.valueOf());
  };

  const handleEventGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventGroupFilter(e.target.value);
  };

  const handleEventStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventStatus(e.target.value);
  };

  if (loading) return null;
  return (
    <div>
      <h2>Filter</h2>
      <div>
        <label htmlFor="category">Categories: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => {
            handleCategoryChange(e);
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <p />
      <div>
        <label htmlFor="eventGroup-filter">Event Groups: </label>
        <select
          id="eventGroup-filter"
          value={eventGroupFilter}
          onChange={(e) => handleEventGroupChange(e)}
        >
          {selectedEventGroup.map((eventGroup) => (
            <option key={eventGroup} value={eventGroup}>
              {eventGroup}
            </option>
          ))}
        </select>
      </div>
      <p />
      <div>
        <label htmlFor="status-filter">Event Status: </label>
        <select id="status-filter" value={eventStatus} onChange={(e) => handleEventStatusChange(e)}>
          {Object.values(EventStatus).map((status) => (
            <option key={status} value={status.valueOf()}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventFilterComponent;
