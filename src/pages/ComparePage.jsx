/**
 * @fileoverview ComparePage — Side-by-side comparison of 2-3 colleges.
 * Selection bar with quick-add search + a sticky-header comparison table.
 */

import { useState, useEffect } from 'react';
import { useCompare } from '../context/CompareContext';
import { compareColleges, getColleges } from '../services/api';
import Loader from '../components/ui/Loader';
import Rating from '../components/ui/Rating';
import { FiX, FiPlus, FiBarChart2, FiSearch, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function ComparePage() {
  const { compareList, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (compareList.length < 2) {
      setComparisonData(null);
      return;
    }
    const fetchComparison = async () => {
      setLoading(true);
      setError('');
      try {
        const ids = compareList.map((c) => c.id);
        const res = await compareColleges(ids);
        setComparisonData(res.data);
      } catch (err) {
        setError('Failed to load comparison data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [compareList]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) { setSearchResults([]); return; }
    try {
      const res = await getColleges({ search: query, limit: 5 });
      setSearchResults(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const formatFees = (amt) => amt ? '₹' + Number(amt).toLocaleString('en-IN') : 'N/A';

  const metrics = comparisonData ? [
    { label: 'Location',          key: 'location' },
    { label: 'Type',              key: 'type' },
    { label: 'Established',       key: 'established_year', format: (v) => v || 'N/A' },
    { label: 'Rating',            key: 'rating', render: (v) => <Rating value={v} /> },
    { label: 'Min fees (₹/yr)',   key: 'min_fees', format: formatFees },
    { label: 'Max fees (₹/yr)',   key: 'max_fees', format: formatFees },
    { label: 'Placement %',       key: 'placement_percentage', format: (v) => v ? `${Number(v).toFixed(1)}%` : 'N/A', highlight: true },
    { label: 'Avg package',       key: 'avg_package_lpa',     format: (v) => v ? `₹${Number(v).toFixed(1)} LPA` : 'N/A', highlight: true },
    { label: 'Highest package',   key: 'highest_package_lpa', format: (v) => v ? `₹${Number(v).toFixed(1)} LPA` : 'N/A' },
    { label: 'Median package',    key: 'median_package_lpa',  format: (v) => v ? `₹${Number(v).toFixed(1)} LPA` : 'N/A' },
    { label: 'Review rating',     key: 'avg_review_rating',   render: (v) => v ? <Rating value={v} /> : <span className="text-text-muted">N/A</span> },
    { label: 'Total courses',     key: 'total_courses' },
    { label: 'Courses offered',   key: 'courses', format: (v) => Array.isArray(v) ? v.join(', ') : 'N/A' },
    { label: 'Top recruiters',    key: 'top_recruiters', format: (v) => Array.isArray(v) && v.length > 0 ? (typeof v[0] === 'string' ? v.join(', ') : JSON.parse(v).join(', ')) : 'N/A' },
  ] : [];

  const getBestIndex = (key) => {
    if (!comparisonData) return -1;
    const vals = comparisonData.map(c => Number(c[key]) || 0);
    return vals.indexOf(Math.max(...vals));
  };

  return (
    <div className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-10 lg:py-14">
      {/* Header */}
      <header className="mb-8 lg:mb-10">
        <span className="eyebrow mb-3">Decision tool</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight flex items-center gap-3">
              <FiBarChart2 className="text-primary shrink-0" />
              Compare <span className="text-primary">colleges</span>
            </h1>
            <p className="text-text-secondary mt-2 text-base sm:text-lg">
              Place 2 or 3 institutions side-by-side and weigh them on the metrics that matter.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 self-start text-xs font-semibold uppercase tracking-wider
                          text-text-muted bg-white border border-border rounded-full px-4 py-2 shadow-sm">
            <span>Selected: {compareList.length}/3</span>
          </div>
        </div>
      </header>

      {/* Selection bar */}
      <section className="card-elevated p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Your selection
          </h3>
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-danger hover:text-white hover:bg-danger px-3 py-1.5
                         rounded-md border border-danger/30 transition-all"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {compareList.map((college) => (
            <div
              key={college.id}
              className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg
                         hover:border-primary/40 transition-all"
            >
              <span className="text-sm font-semibold text-text-primary">{college.name}</span>
              <button
                onClick={() => removeFromCompare(college.id)}
                aria-label={`Remove ${college.name}`}
                className="text-text-muted hover:text-danger transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}

          {compareList.length < 3 && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border-light
                         rounded-lg text-text-muted hover:text-primary hover:border-primary
                         transition-all text-sm font-semibold"
            >
              <FiPlus size={16} /> Add college
            </button>
          )}
        </div>

        {/* Quick-add search */}
        {showSearch && (
          <div className="mt-5 fade-in">
            <div className="relative max-w-xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type a college name to add…"
                autoFocus
                className="input-base pl-11 py-3"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-3 max-w-xl card overflow-hidden">
                {searchResults.map((c) => {
                  const already = compareList.some((cl) => cl.id === c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        addToCompare({ id: c.id, name: c.name });
                        setShowSearch(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      disabled={already}
                      className="w-full text-left px-5 py-3 hover:bg-bg-soft text-sm text-text-primary font-semibold
                                 border-b border-border last:border-0 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">
                        {c.name}
                        <span className="text-text-muted text-xs font-normal ml-2">{c.city}, {c.state}</span>
                      </span>
                      {already ? (
                        <span className="text-xs text-text-muted">Added</span>
                      ) : (
                        <FiPlus size={16} className="text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Comparison area */}
      {compareList.length < 2 ? (
        <div className="card-elevated text-center py-20 px-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-bg-soft flex items-center justify-center mb-5">
            <FiBarChart2 size={28} className="text-text-muted" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-text-primary mb-2">
            Add at least two colleges
          </h3>
          <p className="text-text-secondary max-w-md mx-auto mb-6">
            Pick 2 or 3 institutes from the directory to enable side-by-side comparison.
          </p>
          <Link to="/colleges" className="btn-primary">
            Browse directory <FiPlus size={14} />
          </Link>
        </div>
      ) : loading ? (
        <Loader text="Building your comparison…" />
      ) : error ? (
        <div className="text-center py-12 text-danger font-semibold bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      ) : comparisonData ? (
        <div className="card-elevated overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left compare-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted bg-bg-soft min-w-[180px]">
                    Metric
                  </th>
                  {comparisonData.map((c) => (
                    <th key={c.id} className="px-6 py-5 bg-bg-soft min-w-[260px] align-top">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                          Institute
                        </span>
                        <Link
                          to={`/colleges/${c.id}`}
                          className="font-serif text-lg font-semibold text-text-primary hover:text-primary transition-colors leading-snug"
                        >
                          {c.name}
                        </Link>
                        <span className="text-xs text-text-muted">
                          {c.city}, {c.state}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.label} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary bg-bg-soft/50 align-top">
                      {metric.label}
                    </td>
                    {comparisonData.map((c, idx) => {
                      const value = c[metric.key];
                      const isBest = metric.highlight && getBestIndex(metric.key) === idx;
                      return (
                        <td
                          key={c.id}
                          className={`px-6 py-4 align-top text-sm ${isBest ? 'bg-emerald-50/60' : ''}`}
                        >
                          <div className="flex flex-col gap-1.5">
                            <span className={`${isBest ? 'text-emerald-800 font-bold' : 'text-text-primary font-medium'}`}>
                              {metric.render
                                ? metric.render(value)
                                : metric.format
                                ? metric.format(value)
                                : (value ?? 'N/A')}
                            </span>
                            {isBest && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                               bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider w-fit">
                                <FiAward size={10} /> Best
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
