/**
 * @fileoverview PredictorPage — College predictor based on entrance exam + rank.
 */

import { useState, useEffect } from 'react';
import { getExams, predictColleges } from '../services/api';
import { Link } from 'react-router-dom';
import Rating from '../components/ui/Rating';
import Loader from '../components/ui/Loader';
import {
  FiTarget, FiTrendingUp, FiMapPin, FiArrowRight,
  FiChevronDown, FiCheckCircle, FiAlertCircle,
} from 'react-icons/fi';

export default function PredictorPage() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [examsLoading, setExamsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await getExams();
        setExams(res.data || []);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      } finally {
        setExamsLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!selectedExam || !rank) return;

    setLoading(true);
    setError('');
    try {
      const res = await predictColleges(selectedExam, parseInt(rank));
      setResults(res.data);
    } catch (err) {
      setError('Failed to predict colleges. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chanceConfig = {
    High:     { dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <FiCheckCircle size={11} /> },
    Moderate: { dot: 'bg-amber-500',   chip: 'bg-amber-50 text-amber-700 border-amber-200',       icon: <FiTrendingUp size={11} /> },
    Low:      { dot: 'bg-red-500',     chip: 'bg-red-50 text-red-700 border-red-200',             icon: <FiAlertCircle size={11} /> },
  };

  const formatFees = (amt) => amt ? '₹' + Number(amt).toLocaleString('en-IN') : 'N/A';

  return (
    <div className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-10 lg:py-14">
      {/* Header */}
      <header className="mb-8 lg:mb-10">
        <span className="eyebrow mb-3" style={{ color: 'var(--color-accent)' }}>Decision tool</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight flex items-center gap-3">
              <FiTarget className="text-accent shrink-0" />
              College <span className="text-accent">predictor</span>
            </h1>
            <p className="text-text-secondary mt-2 text-base sm:text-lg">
              Enter your entrance-exam rank to find institutes where your admission chances are realistic.
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <section className="card-elevated p-5 sm:p-7 lg:p-8 mb-10">
        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Exam */}
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Entrance exam
            </label>
            {examsLoading ? (
              <div className="h-12 bg-bg-soft rounded-lg animate-pulse" />
            ) : (
              <div className="relative">
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  required
                  className="input-base appearance-none pr-10 cursor-pointer text-sm font-medium"
                >
                  <option value="">Choose an exam…</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name} — {exam.full_name}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
            )}
          </div>

          {/* Rank */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              All India rank (AIR)
            </label>
            <input
              type="number"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              min="1"
              required
              placeholder="e.g. 2500"
              className="input-base text-sm font-medium"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading || !selectedExam || !rank}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg
                         bg-accent text-white font-semibold text-sm shadow-md hover:bg-accent-light
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Analysing…' : <><FiTrendingUp size={16} /> Predict colleges</>}
            </button>
          </div>
        </form>
        <p className="text-xs text-text-muted mt-4">
          Predictions use historical cutoff data and are indicative — final admissions depend on official counselling.
        </p>
      </section>

      {/* Results */}
      <div className="min-h-[300px]">
        {loading ? (
          <Loader text="Matching your rank with historical cutoffs…" />
        ) : results ? (
          <div className="fade-in">
            {results.results && results.results.length > 0 ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-text-primary">
                    {results.total} <span className="text-text-muted font-normal">probable matches</span>
                  </h2>
                  <div className="inline-flex items-center gap-3 self-start text-xs font-semibold uppercase tracking-wider
                                  text-text-muted bg-white border border-border rounded-full px-4 py-2 shadow-sm">
                    <span>Your AIR</span>
                    <span className="w-px h-3 bg-border" />
                    <span className="text-accent text-sm">{results.rank}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {results.results.map((result) => {
                    const cfg = chanceConfig[result.admission_chance] || chanceConfig.Moderate;
                    return (
                      <article
                        key={result.college.id}
                        className="card lift-on-hover p-5 sm:p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`chip border ${cfg.chip}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {cfg.icon} {result.admission_chance} chance
                              </span>
                              <span className="chip bg-bg-soft border-border text-text-secondary">
                                Cutoff rank: {result.cutoff.max_rank}
                              </span>
                            </div>

                            <Link
                              to={`/colleges/${result.college.id}`}
                              className="font-serif text-xl sm:text-2xl font-semibold text-text-primary hover:text-primary
                                         transition-colors block mb-3 leading-tight"
                            >
                              {result.college.name}
                            </Link>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary text-sm">
                              <span className="inline-flex items-center gap-1.5">
                                <FiMapPin size={14} className="text-primary/70" />
                                {result.college.city}, {result.college.state}
                              </span>
                              <Rating value={result.college.rating} size="sm" />
                              <span className="text-text-muted">
                                Fees: {formatFees(result.college.min_fees)}
                                <span className="mx-1">–</span>
                                {formatFees(result.college.max_fees)}
                              </span>
                            </div>
                          </div>

                          <div className="md:shrink-0">
                            <Link
                              to={`/colleges/${result.college.id}`}
                              className="btn-outline w-full md:w-auto justify-center"
                            >
                              View details <FiArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="card-elevated text-center py-20 px-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-bg-soft flex items-center justify-center mb-5">
                  <FiAlertCircle size={28} className="text-text-muted" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-text-primary mb-2">No matches found</h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  Try a different rank range or another entrance examination.
                </p>
              </div>
            )}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-danger font-semibold bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        ) : (
          <div className="card-elevated text-center py-20 px-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-5">
              <FiTarget size={28} className="text-accent" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-text-primary mb-2">Ready when you are</h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Choose your exam and enter your rank above to see colleges where your admission chances are realistic.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
