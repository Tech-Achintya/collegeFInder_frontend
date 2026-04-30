/**
 * @fileoverview CompareContext - Global state for college comparison feature.
 * 
 * Allows users to add/remove colleges to compare from anywhere in the app.
 * The compare list persists across page navigation using React Context.
 * Maximum 3 colleges can be selected for comparison.
 */

import { createContext, useContext, useState, useCallback } from 'react';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  // Stores the selected colleges for comparison (max 3)
  const [compareList, setCompareList] = useState([]);

  /**
   * Add a college to the comparison list.
   * Prevents duplicates and enforces max limit of 3.
   * @param {Object} college - College object with at least {id, name}
   * @returns {boolean} true if added, false if limit reached or duplicate
   */
  const addToCompare = useCallback((college) => {
    setCompareList((prev) => {
      if (prev.length >= 3) return prev; // Max 3 colleges
      if (prev.find((c) => c.id === college.id)) return prev; // No duplicates
      return [...prev, college];
    });
  }, []);

  /**
   * Remove a college from the comparison list by ID.
   */
  const removeFromCompare = useCallback((collegeId) => {
    setCompareList((prev) => prev.filter((c) => c.id !== collegeId));
  }, []);

  /**
   * Check if a specific college is already in the compare list.
   */
  const isInCompare = useCallback(
    (collegeId) => compareList.some((c) => c.id === collegeId),
    [compareList]
  );

  /** Clear all colleges from comparison */
  const clearCompare = useCallback(() => setCompareList([]), []);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount: compareList.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

/**
 * Custom hook to access the compare context.
 * Must be used within a CompareProvider.
 */
export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
