import { useEffect, useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): {
  value: T;
  setValue: (value: T) => void;
  getValue: () => T;
  mounted: boolean;
} => {
  const [mounted, setMounted] = useState(false);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.log(error);
    }
    setMounted(true);
  }, [key]);

  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  };

  return {
    value: storedValue,
    setValue,
    getValue,
    mounted,
  };
};
