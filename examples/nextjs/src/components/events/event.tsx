import React from 'react';

import { IEvent, IMarket } from '@/database/types';
import { convertTimestampToDateString } from '@/utils/time';

import MarketComponent from '../markets/market';

interface EventProps {
  event: IEvent;
  isLoading: boolean;
  markets?: IMarket[];
}

const EventComponent: React.FC<EventProps> = ({ event, isLoading, markets }) => {
  const eventStart = event ? convertTimestampToDateString(event.eventStartTimestamp) : `Unknown`;
  const eventEnd = event
    ? convertTimestampToDateString(event.eventEstimatedEndTimestamp)
    : 'Unknown';
  if (isLoading) return null;
  if (markets?.length === 0) return null;
  return (
    <>
      {event ? (
        <div className="eventHeader">
          <p>
            {event.subcategoryTitle} | {event.eventGroupTitle}
          </p>
          <h3>{event.eventName}</h3>
          {eventStart} - {eventEnd}
          <p />
        </div>
      ) : (
        <div className="eventHeader">Unknown Event</div>
      )}
      <div>
        {markets?.map((market) =>
          market ? (
            <MarketComponent
              key={market.publicKey}
              market={market}
              isLoading={isLoading}
              viewMore={true}
            />
          ) : null,
        )}
      </div>
    </>
  );
};

export default EventComponent;
