import React from 'react';

import { ActiveSettingsProps } from '@/types/settings';
import { formatNumberForDisplay } from '@/utils/display';

function ActiveSettingsDisplay({ active }: ActiveSettingsProps) {
  return (
    <div>
      <h2>Active Settings</h2>
      <p>Active RPC Node: {active.rpcNode ? active.rpcNode.name : 'Not Set'}</p>
      <h3>Default Stake:</h3>
      <ul>
        <li key="active-settings-default-stake">{formatNumberForDisplay(active.default_stake)}</li>
      </ul>
      <h3>Caches (mins):</h3>
      <ul>
        <li key="active-settings-markets">Markets: {active.cache_markets}</li>
        <li key="active-settings-matching-pools">
          Matching Pools: {active.cache_market_matching_pools}
        </li>
        <li key="active-settings-market-outcomes">
          Market Outcomes: {active.cache_market_outcomes}
        </li>
        <li key="active-settings-market-positions">
          Market Positions: {active.cache_market_positions}
        </li>
        <li key="active-settings-orders">Orders: {active.cache_orders}</li>
        <li key="active-settings-events">Events: {active.cache_events}</li>
        <li key="active-settings-products">Products: {active.cache_products}</li>
      </ul>
    </div>
  );
}

export default ActiveSettingsDisplay;
