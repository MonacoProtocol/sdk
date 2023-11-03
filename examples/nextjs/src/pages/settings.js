import { useState, useEffect } from 'react';

import SavedWalletsComponent from '@/components/settings/savedWallets';
import appSettings from '@/config/appSettings';
import { useProgram } from '@/context/ProgramContext';
import db from '@/database/database';
import useWalletRedirect from '@/hooks/walletRedirect';

import { LoadingComponent } from '../components/navigation/loading';
import ActiveSettingsDisplay from '../components/settings/activeSettings';
import RPCNodesDisplay from '../components/settings/rpcNodes';
import {
  getStoredSettings,
  saveSettings,
  addNewSetting,
  removeExistingSetting,
  setActive,
} from '../utils/settings';

function Settings() {
  const [currentSettings, setCurrentSettings] = useState(appSettings);
  const [loading, setLoading] = useState(true);
  const [selectedSetting, setSelectedSetting] = useState('defaultStake');
  const [settingValue, setSettingValue] = useState('');
  const { setRpcNodeUrl, setActiveProgramAddress } = useProgram();
  useWalletRedirect();

  useEffect(() => {
    const storedSettings = getStoredSettings(appSettings);
    setCurrentSettings(storedSettings);
    setLoading(false);
  }, []);

  const resetToDefaultSettings = () => {
    const defaultSettings = JSON.parse(JSON.stringify(appSettings));
    setCurrentSettings(defaultSettings);
    saveSettings(defaultSettings);
    setLoading(false);
  };

  const addSetting = (category, settingToAdd) => {
    const updatedSettings = addNewSetting(currentSettings, category, settingToAdd);

    setCurrentSettings(updatedSettings);
    saveSettings(updatedSettings);
    setLoading(false);
  };

  const removeSetting = (category, name) => {
    const updatedSettings = removeExistingSetting(currentSettings, category, name);

    setCurrentSettings(updatedSettings);
    saveSettings(updatedSettings);
    setLoading(false);
  };

  const setActiveSetting = (type, settingObject) => {
    const updatedSettings = setActive(currentSettings, type, settingObject);

    if (type === 'rpcNode') {
      setRpcNodeUrl(settingObject.url);
    }
    if (type === 'programAddress') {
      setActiveProgramAddress(settingObject.address);
    }

    setCurrentSettings(updatedSettings);
    saveSettings(updatedSettings);
    setLoading(false);
  };

  const handleAddSetting = () => {
    const cacheMapping = {
      defaultStake: 'default_stake',
      market: 'cache_markets',
      matchingPools: 'cache_market_matching_pools',
      outcomes: 'cache_market_outcomes',
      marketPositions: 'cache_market_positions',
      orders: 'cache_orders',
      events: 'cache_events',
      products: 'cache_products',
    };

    const type = cacheMapping[selectedSetting];

    if (type) {
      const updatedSettings = setActive(currentSettings, type, Number(settingValue));

      setCurrentSettings(updatedSettings);
      saveSettings(updatedSettings);
      setSettingValue('');
      setLoading(false);
    }
  };

  const handleClearAllTables = async () => {
    const userConfirmed = window.confirm(
      'Are you sure you want to clear the local DB? This action cannot be undone!',
    );

    if (userConfirmed) {
      await db
        .deleteDb()
        .then(() => {
          alert('All tables cleared successfully!');
        })
        .catch((err) => {
          console.error('Error clearing tables:', err);
          alert('There was an error clearing tables. Please check the console for details.');
        });
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="main-wrapper">
      <div className="left-container">
        <h1>Settings</h1>
        <RPCNodesDisplay
          rpcNodes={currentSettings.rpcNodes}
          onSetActive={(node) => setActiveSetting('rpcNode', node)}
          onRemove={(nodeName) => removeSetting('rpcNodes', nodeName)}
          onAddSetting={addSetting}
        />

        <SavedWalletsComponent
          savedWallets={currentSettings.savedWallets}
          onRemove={(walletName) => removeSetting('savedWallets', walletName)}
          onAddSetting={addSetting}
        />

        <h2>Update Settings</h2>

        <select value={selectedSetting} onChange={(e) => setSelectedSetting(e.target.value)}>
          <option value="defaultStake">Default Stake</option>
          <option value="market">Market Cache</option>
          <option value="matchingPools">Matching Pools Cache</option>
          <option value="marketPositions">Market Positions Cache</option>
          <option value="outcomes">Outcomes Cache</option>
          <option value="orders">Orders Cache</option>
          <option value="events">Events Cache</option>
          <option value="products">Products Cache</option>
        </select>

        <input
          type="number"
          value={settingValue}
          onChange={(e) => setSettingValue(e.target.value)}
          placeholder="Enter value..."
        />

        <button onClick={handleAddSetting}>Update</button>

        <p>
          <button onClick={resetToDefaultSettings}>Reset All to Default Settings</button>
        </p>
        <p>
          <button onClick={handleClearAllTables}>Clear Local Database</button>
        </p>
      </div>
      <div className="right-container">
        <ActiveSettingsDisplay active={currentSettings.active} />
      </div>
    </div>
  );
}

export default Settings;
