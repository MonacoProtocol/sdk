import defaultSeederSettings from '@/config/seederSettings';

export const getStoredSeederSettings = (settingsName = 'seederSettings') => {
  if (typeof window === 'undefined') return defaultSeederSettings;
  else return JSON.parse(localStorage.getItem(settingsName)) || defaultSeederSettings;
};

export const saveSeederSettings = (settings, settingsName = 'seederSettings') => {
  localStorage.setItem(settingsName, JSON.stringify(settings));
};
