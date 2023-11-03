export const getFromLocalStorage = (key: string, defaultValue: unknown) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};
