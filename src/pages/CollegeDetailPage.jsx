/**
 * @fileoverview CollegeDetailPage — Detailed view of a single college.
 * Banner + summary card, tabbed content for Overview, Courses, Placements, Reviews.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollegeById } from '../services/api';
import { useCompare } from '../context/CompareContext';
import Rating from '../components/ui/Rating';
import Loader from '../components/ui/Loader';
import {
  FiMapPin, FiCalendar, FiGlobe, FiBookOpen, FiTrendingUp,
  FiMessageSquare, FiPlus, FiCheck, FiArrowLeft, FiAward,
} from 'react-icons/fi';

export default function CollegeDetailPage() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { addToCompare, isInCompare, compareCount } = useCompare();

  useEffect(() => {
    const fetchCollege = async () => {
      setLoading(true);
      try {
        const res = await getCollegeById(id);
        setCollege(res.data);
      } catch (err) {
        console.error('Failed to fetch college:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader text="Loading college details…" />
      </div>
    );
  }
  if (!college) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-semibold text-text-primary mb-3">College not found</h2>
        <Link to="/colleges" className="text-primary hover:underline font-semibold">
          ← Back to colleges
        </Link>
      </div>
    );
  }

  const formatFees = (amt) => amt ? '₹' + Number(amt).toLocaleString('en-IN') : 'N/A';
  const inCompare = isInCompare(college.id);
  const latestPlacement = college.placements?.[0];

  const getAbbreviation = (name) => {
    if (name.startsWith('Indian Institute of Technology')) return 'IIT';
    if (name.startsWith('National Institute of Technology')) return 'NIT';
    if (name.startsWith('Indian Institute of Information')) return 'IIIT';
    if (name.includes('BITS')) return 'BITS';
    if (name.includes('Delhi Technological')) return 'DTU';
    if (name.includes('Vellore Institute')) return 'VIT';
    if (name.includes('SRM Institute')) return 'SRM';
    if (name.includes('Manipal Institute')) return 'MIT';
    if (name.includes('Jadavpur')) return 'JU';
    if (name.includes('College of Engineering Pune')) return 'COEP';
    if (name.includes('PES University')) return 'PES';
    if (name.includes('Thapar')) return 'TIET';
    return name.split(' ').filter(w => w.length > 2).slice(0, 3).map(w => w[0]).join('');
  };
  const abbreviation = getAbbreviation(college.name);

  const tabs = [
    { id: 'overview',   label: 'Overview',                                   icon: <FiBookOpen size={15} /> },
    { id: 'courses',    label: `Courses (${college.courses?.length || 0})`,  icon: <FiBookOpen size={15} /> },
    { id: 'placements', label: 'Placements',                                 icon: <FiTrendingUp size={15} /> },
    { id: 'reviews',    label: `Reviews (${college.reviews?.length || 0})`,  icon: <FiMessageSquare size={15} /> },
  ];

  const typeBadgeStyle = college.type === 'Government'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <div className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-8 lg:py-10">
      {/* Back link */}
      <Link
        to="/colleges"
        className="inline-flex items-center gap-2 text-text-muted hover:text-primary text-sm font-medium mb-6 transition-colors"
      >
        <FiArrowLeft size={15} /> Back to colleges
      </Link>

      {/* Hero */}
      <section className="card-elevated overflow-hidden mb-8">
        <div className="relative h-44 sm:h-52 md:h-60 bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
          <div className="absolute inset-0 campus-pattern opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-serif font-bold text-white/15 select-none
              ${abbreviation.length > 3 ? 'text-6xl sm:text-7xl' : 'text-7xl sm:text-9xl'}`}>
              {abbreviation}
            </span>
          </div>
          <div className="absolute top-4 left-4">
            <span className={`chip border ${typeBadgeStyle}`}>
              {college.type}
            </span>
          </div>
          {college.is_featured && (
            <div className="absolute top-4 right-4">
              <span className="chip bg-accent text-white border-accent">
                <FiAward size={11} /> Featured
              </span>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 leading-tight">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-text-secondary text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <FiMapPin size={14} className="text-primary" />
                  {college.city}, {college.state}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiCalendar size={14} className="text-primary" />
                  Established {college.established_year}
                </span>
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
                  >
                    <FiGlobe size={14} />
                    Official website
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <Rating value={college.rating} size="lg" />
                <p className="text-[11px] uppercase tracking-wider text-text-muted mt-1 font-semibold">
                  Overall rating
                </p>
              </div>
              <button
                onClick={() => addToCompare({ id: college.id, name: college.name })}
                disabled={inCompare || compareCount >= 3}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${inCompare
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'btn-primary disabled:opacity-50 disabled:cursor-not-allowed'}`}
              >
                {inCompare ? <><FiCheck size={14} /> Added</> : <><FiPlus size={14} /> Compare</>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-border mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative inline-flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-semibold whitespace-nowrap
                          transition-colors
                ${activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-primary'}`}
            >
              {tab.icon}{tab.label}
              {activeTab === tab.id && (
                <span className="absolute -bottom-[1px] left-3 right-3 h-[3px] rounded-t bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-6 sm:p-7">
              <h2 className="font-serif text-xl font-semibold text-text-primary mb-3">About</h2>
              <p className="text-text-secondary leading-relaxed">
                {college.description || 'No description available.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { label: 'Type', value: college.type },
                  { label: 'Affiliation', value: college.affiliation || 'N/A' },
                  { label: 'Min fees', value: formatFees(college.min_fees) },
                  { label: 'Max fees', value: formatFees(college.max_fees) },
                ].map((item) => (
                  <div key={item.label} className="bg-bg-soft rounded-lg p-3 border border-border">
                    <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1">
                      {item.label}
                    </p>
                    <p className="text-text-primary font-semibold text-sm break-words">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {latestPlacement && (
              <aside className="card p-6 sm:p-7">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4">
                  Latest placement highlights
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Placement %', value: `${Number(latestPlacement.placement_percentage).toFixed(1)}%`, color: 'text-emerald-700' },
                    { label: 'Avg package', value: `₹${Number(latestPlacement.avg_package_lpa).toFixed(1)} LPA`, color: 'text-primary' },
                    { label: 'Highest package', value: `₹${Number(latestPlacement.highest_package_lpa).toFixed(1)} LPA`, color: 'text-accent' },
                    { label: 'Median package', value: `₹${Number(latestPlacement.median_package_lpa).toFixed(1)} LPA`, color: 'text-text-primary' },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between items-center pb-2 border-b border-border last:border-0">
                      <span className="text-text-muted text-sm">{s.label}</span>
                      <span className={`font-bold ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-soft border-b border-border">
                  <tr>
                    {['Course name', 'Degree', 'Duration', 'Specialization', 'Fees', 'Seats'].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="compare-table">
                  {(college.courses || []).map((course) => (
                    <tr key={course.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 text-text-primary font-semibold">{course.name}</td>
                      <td className="px-5 py-4">
                        <span className="chip bg-primary/10 text-primary border-primary/20">
                          {course.degree_type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-text-secondary">{course.duration_years} yrs</td>
                      <td className="px-5 py-4 text-text-secondary">{course.specialization || '—'}</td>
                      <td className="px-5 py-4 text-emerald-700 font-semibold">{formatFees(course.fees)}</td>
                      <td className="px-5 py-4 text-text-secondary">{course.seats || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(!college.courses || college.courses.length === 0) && (
              <p className="text-center text-text-muted py-12">No course data available</p>
            )}
          </div>
        )}

        {activeTab === 'placements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(college.placements || []).map((p) => (
              <article key={p.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-semibold text-text-primary">Year {p.year}</h3>
                  <span className="chip bg-primary/10 text-primary border-primary/20">
                    {Number(p.placement_percentage).toFixed(1)}% placed
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Avg package',  value: `₹${Number(p.avg_package_lpa).toFixed(1)} LPA` },
                    { label: 'Highest',      value: `₹${Number(p.highest_package_lpa).toFixed(1)} LPA` },
                    { label: 'Median',       value: `₹${Number(p.median_package_lpa).toFixed(1)} LPA` },
                    { label: 'Placed %',     value: `${Number(p.placement_percentage).toFixed(1)}%` },
                  ].map((s) => (
                    <div key={s.label} className="bg-bg-soft border border-border rounded-lg p-3">
                      <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1">{s.label}</p>
                      <p className="text-text-primary font-bold">{s.value}</p>
                    </div>
                  ))}
                </div>
                {p.top_recruiters && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-2">
                      Top recruiters
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(typeof p.top_recruiters === 'string' ? JSON.parse(p.top_recruiters) : p.top_recruiters).map((r) => (
                        <span key={r} className="chip bg-bg-soft border-border text-text-secondary">{r}</span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
            {(!college.placements || college.placements.length === 0) && (
              <p className="text-text-muted text-center py-12 col-span-2">No placement data available</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {(college.reviews || []).map((review) => (
              <article key={review.id} className="card p-6">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div>
                    <h4 className="font-semibold text-text-primary">{review.author_name}</h4>
                    <p className="text-text-muted text-xs mt-0.5">
                      {review.course_studied} • Class of {review.graduation_year}
                    </p>
                  </div>
                  <Rating value={review.rating} size="sm" />
                </div>
                {review.title && (
                  <h5 className="font-serif italic text-text-primary text-base mb-2">"{review.title}"</h5>
                )}
                <p className="text-text-secondary text-sm leading-relaxed">{review.content}</p>
              </article>
            ))}
            {(!college.reviews || college.reviews.length === 0) && (
              <p className="text-text-muted text-center py-12">No reviews yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
