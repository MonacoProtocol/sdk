import appSettings from '@/config/appSettings';
import { SettingCategory } from '@/types/settings';

export const getStoredSettings = () => {
  if (typeof window === 'undefined') return appSettings;
  else return JSON.parse(localStorage.getItem('settings')) || appSettings;
};

export const saveSettings = (settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

export const addNewSetting = (currentSettings, category, newSetting) => {
  let updatedSettings = { ...currentSettings };

  switch (category) {
    case SettingCategory.RPC_NODES:
      updatedSettings.rpcNodes.push(newSetting);
      break;
    case SettingCategory.PROGRAM_ADDRESSES:
      updatedSettings.programAddresses.push(newSetting);
      break;
    case SettingCategory.MINTS:
      updatedSettings.mints.push(newSetting);
      break;
    case SettingCategory.SAVED_WALLETS:
      updatedSettings.savedWallets.push(newSetting);
      break;
    default:
      console.log(`Category ${category} not found`);
      break;
  }

  return updatedSettings;
};

export const removeExistingSetting = (currentSettings, category, name) => {
  let updatedSettings = { ...currentSettings };

  switch (category) {
    case 'rpcNodes':
      updatedSettings.rpcNodes = updatedSettings.rpcNodes.filter((node) => node.name !== name);
      break;
    case 'programAddresses':
      updatedSettings.programAddresses = updatedSettings.programAddresses.filter(
        (program) => program.name !== name,
      );
      break;
    case 'mints':
      updatedSettings.mints = updatedSettings.mints.filter((mint) => mint.name !== name);
      break;
    default:
      break;
  }

  return updatedSettings;
};

export const setActive = (currentSettings, type, settingObject) => {
  const updatedSettings = { ...currentSettings };

  switch (type) {
    case 'rpcNode':
      updatedSettings.active.rpcNode = settingObject;
      break;
    case 'programAddress':
      updatedSettings.active.programAddress = settingObject;
      break;
    case 'default_stake':
      updatedSettings.active.default_stake = settingObject;
      break;
    case 'cache_orders':
      updatedSettings.active.cache_orders = settingObject;
      break;
    case 'cache_markets':
      updatedSettings.active.cache_markets = settingObject;
      break;
    case 'cache_market_matching_pools':
      updatedSettings.active.cache_market_matching_pools = settingObject;
      break;
    case 'cache_market_outcomes':
      updatedSettings.active.cache_market_outcomes = settingObject;
      break;
    case 'cache_market_positions':
      updatedSettings.active.cache_market_positions = settingObject;
      break;
    case 'cache_events':
      updatedSettings.active.cache_events = settingObject;
      break;
    case 'cache_products':
      updatedSettings.active.cache_products = settingObject;
      break;
    default:
      break;
  }

  return updatedSettings;
};
