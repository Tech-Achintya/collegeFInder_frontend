/**
 * @fileoverview CollegesPage — Listing with search, filters and pagination.
 * Sidebar filters on desktop; toggleable filter panel on mobile.
 * Same API contracts as before.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getColleges } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import CollegeCard from '../components/college/CollegeCard';
import CollegeFilters from '../components/college/CollegeFilters';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function CollegesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, total_pages: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    state: searchParams.get('state') || '',
    course: searchParams.get('course') || '',
    max_fees: searchParams.get('max_fees') || '',
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const params = {
          page: parseInt(searchParams.get('page')) || 1,
          limit: 12,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(filters.state && { state: filters.state }),
          ...(filters.course && { course: filters.course }),
          ...(filters.max_fees && { max_fees: filters.max_fees }),
          sort_by: 'rating',
          sort_order: 'desc',
        };

        const res = await getColleges(params);
        setColleges(res.data || []);
        setPagination(res.pagination || { page: 1, total: 0, total_pages: 1 });
      } catch (err) {
        console.error('Failed to fetch colleges:', err);
        setColleges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, [debouncedSearch, filters, searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('search', e.target.value);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setFilters({ state: '', course: '', max_fees: '' });
    setSearch('');
    setSearchParams({});
  };

  const activeFilterCount =
    (filters.state ? 1 : 0) +
    (filters.course ? 1 : 0) +
    (filters.max_fees ? 1 : 0);

  return (
    <div className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-10 lg:py-14">
      {/* Page header */}
      <header className="mb-8 lg:mb-12">
        <span className="eyebrow mb-3">Discover</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
              Browse <span className="text-primary">Colleges</span>
            </h1>
            <p className="text-text-secondary mt-2 text-base sm:text-lg">
              {loading
                ? 'Loading institutes…'
                : `Navigate ${pagination.total} institutions across India`}
            </p>
          </div>
          <div className="inline-flex items-center gap-3 self-start text-xs font-semibold uppercase tracking-wider
                          text-text-muted bg-white border border-border rounded-full px-4 py-2 shadow-sm">
            <span>Page {pagination.page}</span>
            <span className="w-px h-3 bg-border" />
            <span>of {pagination.total_pages}</span>
          </div>
        </div>
      </header>

      {/* Search + mobile filter button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, city, state or course…"
            className="input-base pl-11 py-3.5 text-base"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden btn-outline justify-center sm:justify-start relative"
        >
          <FiFilter size={16} /> Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                             rounded-full bg-primary text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Layout: sidebar + grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <CollegeFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-bg-dark p-4 overflow-y-auto fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-text-primary">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-lg hover:bg-bg-soft text-text-secondary"
                  aria-label="Close filters"
                >
                  <FiX size={20} />
                </button>
              </div>
              <CollegeFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary w-full mt-4"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Main results */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader text="Fetching colleges…" />
            </div>
          ) : colleges.length === 0 ? (
            <div className="card-elevated py-20 text-center px-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-bg-soft flex items-center justify-center mb-5">
                <FiSearch size={28} className="text-text-muted" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-text-primary mb-2">
                No colleges found
              </h3>
              <p className="text-text-secondary max-w-md mx-auto mb-6">
                We couldn't find any matches for your current criteria.
                Try widening your search or resetting filters.
              </p>
              <button onClick={resetFilters} className="btn-primary">
                Reset all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
              <Pagination
                page={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
