'use client';

import { useEffect, useState } from 'react';

/**
 * A hook to keep a piece of state in sync with localStorage.
 *
 * Every time you call setValue, the hook updates both:
 *   - The in-memory React state
 *   - The item in localStorage (so it's remembered on refresh)
 *
 * @param key The localStorage key to read from/write to.
 * @param initialValue The default value if key doesn't exist in localStorage yet.
 * @returns [value, setValue, mounted]
 *   - value: T - your current state
 *   - setValue: React.Dispatch<React.SetStateAction<T>> - updates the state & localStorage
 *   - mounted: boolean - indicates if we've completed reading from localStorage
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [mounted, setMounted] = useState(false);

  // Load from localStorage (or use the initialValue).
  // We use lazy initialization so it only runs once.
  const [value, setValue] = useState<T>(() => {
    try {
      const storedItem = window.localStorage.getItem(key);
      return storedItem ? JSON.parse(storedItem) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Mark as mounted once on component mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Whenever value changes, save it to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue, mounted];
}
