/**
 * @fileoverview useDebounce hook - Debounces a value by a specified delay.
 * Commonly used for search inputs to avoid making API calls on every keystroke.
 */

import { useState, useEffect } from 'react';

/**
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in ms (default 300ms)
 * @returns The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timer if value changes before delay completes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
