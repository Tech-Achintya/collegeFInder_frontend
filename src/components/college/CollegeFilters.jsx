/**
 * @fileoverview CollegeFilters — Filter panel (sidebar on desktop, modal/drawer on mobile).
 * State, course-type, max-fees range. All API contracts unchanged.
 */

import { useState, useEffect } from 'react';
import { getFilterLocations, getFilterCourses } from '../../services/api';
import { FiFilter, FiRefreshCcw, FiChevronDown } from 'react-icons/fi';

export default function CollegeFilters({ filters, onFilterChange, onReset }) {
  const [locations, setLocations] = useState({ states: [], cities: [] });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [locRes, courseRes] = await Promise.all([
          getFilterLocations(),
          getFilterCourses(),
        ]);
        setLocations(locRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        console.error('Failed to load filters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  const hasActiveFilters = filters.state || filters.course || filters.min_fees || filters.max_fees;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-lg font-semibold text-text-primary flex items-center gap-2">
          <FiFilter size={16} className="text-primary" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-danger hover:text-white hover:bg-danger px-2.5 py-1.5
                       rounded-md border border-danger/30 transition-all inline-flex items-center gap-1.5"
          >
            <FiRefreshCcw size={11} /> Reset
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-bg-soft rounded animate-pulse" />
              <div className="h-11 bg-bg-soft rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {/* State Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              State / Location
            </label>
            <div className="relative">
              <select
                value={filters.state || ''}
                onChange={(e) => onFilterChange('state', e.target.value)}
                className="input-base appearance-none pr-10 cursor-pointer text-sm font-medium"
              >
                <option value="">All States</option>
                {locations.states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <FiChevronDown size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Programme
            </label>
            <div className="relative">
              <select
                value={filters.course || ''}
                onChange={(e) => onFilterChange('course', e.target.value)}
                className="input-base appearance-none pr-10 cursor-pointer text-sm font-medium"
              >
                <option value="">All Programmes</option>
                {courses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <FiChevronDown size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Max Fees */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Max annual fees
              </label>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {filters.max_fees ? `₹${(Number(filters.max_fees) / 100000).toFixed(1)}L` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="600000"
              step="50000"
              value={filters.max_fees || 600000}
              onChange={(e) => onFilterChange('max_fees', e.target.value === '600000' ? '' : e.target.value)}
              className="w-full accent-primary h-1.5 bg-bg-soft rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-2">
              <span>₹0</span>
              <span>₹6L+</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
