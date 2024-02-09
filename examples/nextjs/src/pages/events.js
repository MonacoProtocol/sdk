import { useEffect, useState } from 'react';

import '../app/globals.css';
import EventComponent from '@/components/events/event';
import EventFilterComponent from '@/components/events/eventFilter';
import { LoadingComponent } from '@/components/navigation/loading';
import { useProgram } from '@/context/ProgramContext';
import { getLocalEventMarketMapping } from '@/database/endpoints/events';
import { fetchEvents } from '@/endpoints/events/fetchEvents';
import { fetchMarkets } from '@/endpoints/markets/fetchMarkets';
import useWalletRedirect from '@/hooks/walletRedirect';
import { marketPublicKeysForEvent } from '@/utils/events';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [eventMarkets, setEventMarkets] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const programContext = useProgram();
  useWalletRedirect();

  useEffect(() => {
    const fetchEventData = async () => {
      const [eventData, marketData, eventMarketData] = await Promise.all([
        fetchEvents(),
        fetchMarkets(programContext.program),
        getLocalEventMarketMapping(),
      ]);
      setMarkets(marketData);
      setEventMarkets(eventMarketData);
      setEvents(eventData);
      setLoading(false);
    };

    fetchEventData();
  }, [programContext.program]);

  const handleFilteredEvents = (filteredEvents) => {
    setFilteredEvents(filteredEvents);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="main-wrapper">
      <div className="left-container">
        {filteredEvents.length === 0 ? (
          <h1>No Events Found</h1>
        ) : (
          filteredEvents.map((event) => (
            <EventComponent
              key={`${event.publicKey}-component`}
              event={event}
              loading={loading}
              displayMarkets={true}
              markets={markets.filter((market) =>
                marketPublicKeysForEvent(eventMarkets, event.publicKey).includes(market.publicKey),
              )}
            />
          ))
        )}
      </div>
      <div className="right-container">
        <EventFilterComponent
          events={events}
          onFilteredEvents={handleFilteredEvents}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default EventsPage;
