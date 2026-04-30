/**
 * @fileoverview CollegeCard — Formal academic listing card.
 * Crest-style header with college abbreviation, white body with name, location,
 * rating, fees range and a compare-toggle button.
 */

import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import Rating from '../ui/Rating';
import { FiMapPin, FiPlus, FiCheck, FiAward, FiCalendar } from 'react-icons/fi';

export default function CollegeCard({ college }) {
  const { addToCompare, removeFromCompare, isInCompare, compareCount } = useCompare();
  const inCompare = isInCompare(college.id);

  const formatFees = (amount) => {
    if (!amount) return 'N/A';
    return '₹' + Number(amount).toLocaleString('en-IN');
  };

  const getAbbreviation = (name) => {
    const upperName = name.toUpperCase();
    if (upperName.includes('IIIT')) return 'IIIT';
    if (upperName.includes('IIT') || name.startsWith('Indian Institute of Technology')) return 'IIT';
    if (upperName.includes('NIT') || name.startsWith('National Institute of Technology')) return 'NIT';
    if (upperName.includes('BITS')) return 'BITS';
    if (upperName.includes('DTU') || name.includes('Delhi Technological')) return 'DTU';
    if (upperName.includes('VIT') || name.includes('Vellore Institute')) return 'VIT';
    if (upperName.includes('SRM')) return 'SRM';
    if (upperName.includes('MIT') || name.includes('Manipal Institute')) return 'MIT';
    if (upperName.includes('COEP') || name.includes('College of Engineering Pune')) return 'COEP';
    if (upperName.includes('PES')) return 'PES';
    return name.split(' ').filter(w => w.length > 2).slice(0, 3).map(w => w[0]).join('');
  };

  const abbreviation = getAbbreviation(college.name);

  const gradients = [
    'from-blue-800 to-indigo-900',
    'from-slate-800 to-blue-900',
    'from-emerald-800 to-teal-900',
    'from-rose-800 to-red-900',
    'from-amber-700 to-orange-900',
    'from-violet-800 to-indigo-900',
    'from-cyan-800 to-blue-900',
    'from-fuchsia-800 to-rose-900',
  ];
  const gradientIdx = college.name.charCodeAt(0) % gradients.length;

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(college.id);
    } else {
      addToCompare({ id: college.id, name: college.name });
    }
  };

  const typeBadgeStyle = college.type === 'Government'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : college.type === 'Private'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <Link to={`/colleges/${college.id}`} className="block group h-full">
      <article className="card lift-on-hover overflow-hidden h-full flex flex-col">
        {/* Crest-style header */}
        <div className={`relative h-32 sm:h-36 bg-gradient-to-br ${gradients[gradientIdx]} overflow-hidden`}>
          <div className="absolute inset-0 campus-pattern opacity-15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-serif font-bold text-white/90 select-none drop-shadow-md
                              ${abbreviation.length > 3 ? 'text-3xl sm:text-4xl' : 'text-5xl sm:text-6xl'}`}>
              {abbreviation}
            </span>
          </div>

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={`chip backdrop-blur-sm ${typeBadgeStyle}`}>
              {college.type}
            </span>
          </div>

          {/* Compare toggle */}
          <button
            onClick={handleCompareToggle}
            disabled={!inCompare && compareCount >= 3}
            aria-label={inCompare ? 'Remove from comparison' : 'Add to comparison'}
            title={inCompare ? 'Remove from compare' : compareCount >= 3 ? 'Max 3 colleges' : 'Add to compare'}
            className={`absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-lg
                        transition-all duration-200 backdrop-blur-sm border
              ${inCompare
                ? 'bg-white text-primary border-white shadow-md'
                : compareCount >= 3
                ? 'bg-white/30 text-white/60 border-white/30 cursor-not-allowed'
                : 'bg-white/20 text-white border-white/40 hover:bg-white hover:text-primary'
              }`}
          >
            {inCompare ? <FiCheck size={16} /> : <FiPlus size={16} />}
          </button>

          {/* Featured ribbon (top-right corner) */}
          {college.is_featured && (
            <div className="absolute bottom-3 right-3">
              <span className="chip bg-accent text-white border-accent shadow-sm">
                <FiAward size={11} /> Featured
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-lg font-semibold text-text-primary mb-2 line-clamp-2
                         group-hover:text-primary transition-colors leading-snug min-h-[3.25rem]">
            {college.name}
          </h3>

          <div className="flex items-center gap-1.5 text-text-muted text-sm mb-3">
            <FiMapPin size={14} className="text-primary/70 shrink-0" />
            <span className="line-clamp-1">{college.city}, {college.state}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Rating value={college.rating} />
            {college.established_year && (
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <FiCalendar size={12} /> Est. {college.established_year}
              </span>
            )}
          </div>

          {/* Fees range — pinned to bottom */}
          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-0.5">Fees / year</p>
                <p className="text-text-primary font-semibold">
                  {formatFees(college.min_fees)}
                  <span className="text-text-muted font-normal mx-1">–</span>
                  {formatFees(college.max_fees)}
                </p>
              </div>
              <span className="text-primary text-xs font-semibold inline-flex items-center gap-1
                               opacity-0 group-hover:opacity-100 transition-opacity">
                View details →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
