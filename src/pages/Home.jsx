/**
 * @fileoverview Home — Formal academic-portal landing page.
 * Sections: Hero with search, Trust strip, Why-us features,
 * Featured colleges, How-it-works, CTA banner.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedColleges } from '../services/api';
import CollegeCard from '../components/college/CollegeCard';
import {
  FiSearch, FiBarChart2, FiTarget, FiBookOpen, FiArrowRight,
  FiAward, FiShield, FiUsers, FiCheckCircle,
} from 'react-icons/fi';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedColleges();
        setFeatured(res.data || []);
      } catch (err) {
        console.error('Failed to fetch featured colleges:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: <FiBookOpen size={22} />,
      title: 'Browse Colleges',
      desc: 'Explore detailed profiles of leading engineering and management institutes — courses, fees, infrastructure and more.',
      link: '/colleges',
      tone: 'primary',
    },
    {
      icon: <FiBarChart2 size={22} />,
      title: 'Side-by-Side Comparison',
      desc: 'Pick up to three colleges and weigh them across placements, fees, ratings and academic strengths in one view.',
      link: '/compare',
      tone: 'accent',
    },
    {
      icon: <FiTarget size={22} />,
      title: 'College Predictor',
      desc: 'Enter your entrance-exam rank to instantly see institutes where your admission chances are realistic.',
      link: '/predictor',
      tone: 'success',
    },
  ];

  const trustItems = [
    { icon: <FiShield size={16} />, label: 'Verified data' },
    { icon: <FiUsers size={16} />, label: 'Real student reviews' },
    { icon: <FiAward size={16} />, label: 'Updated annually' },
    { icon: <FiCheckCircle size={16} />, label: 'Independent platform' },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 campus-pattern opacity-40 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative w-full px-12 sm:px-24 lg:px-32 xl:px-48 pt-32 sm:pt-40 lg:pt-56 pb-32 lg:pb-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-40 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <span className="eyebrow mb-5">Higher Education Portal</span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary
                             leading-[1.08] tracking-tight mb-5">
                Find the right <span className="ribbon-underline text-primary">college</span><br className="hidden sm:block" />
                for your future.
              </h1>

              <p className="text-base sm:text-lg text-text-secondary mb-8 leading-relaxed">
                Discover, compare and decide on India's premier engineering and management
                institutes — with verified placement data, transparent fees and authentic
                student reviews, all in one trusted portal.
              </p>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="bg-white border border-border-light rounded-2xl shadow-lg p-2
                           flex flex-col sm:flex-row items-stretch gap-2 mb-8"
              >
                <div className="flex items-center flex-1 gap-3 px-3 sm:px-4">
                  <FiSearch className="text-text-muted shrink-0" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search IIT, NIT, BITS, course or city…"
                    className="w-full py-3 bg-transparent text-text-primary placeholder:text-text-muted
                               focus:outline-none text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary px-6 py-3 sm:px-7 text-base shrink-0"
                >
                  <FiSearch size={16} /> Search
                </button>
              </form>

              {/* Trust strip */}
              <ul className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-text-muted">
                {trustItems.map((t) => (
                  <li key={t.label} className="inline-flex items-center gap-1.5">
                    <span className="text-primary">{t.icon}</span>
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: stats card */}
            <div>
              <div className="card-elevated p-6 sm:p-8 relative">
                {/* decorative corner ribbon */}
                <div className="absolute -top-3 left-6 right-6 h-1 rounded-b-md bg-gradient-to-r from-primary via-accent to-primary" />
                <h3 className="font-serif text-xl font-semibold text-text-primary mb-1">
                  At a glance
                </h3>
                <p className="text-sm text-text-muted mb-6">
                  India's most trusted college discovery experience.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { num: '20+', label: 'Institutes' },
                    { num: '100+', label: 'Programmes' },
                    { num: '14k+', label: 'Reviews' },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-lg bg-bg-soft">
                      <div className="font-serif text-2xl sm:text-3xl font-bold text-primary">{s.num}</div>
                      <div className="text-[11px] uppercase tracking-wider text-text-muted mt-1 font-semibold">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/colleges" className="btn-primary flex-1">
                    <FiBookOpen size={16} /> Browse colleges
                  </Link>
                  <Link to="/predictor" className="btn-outline flex-1">
                    <FiTarget size={16} /> Predict admission
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-white border-y border-border">
        <div className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-32 lg:py-48">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow mb-3">What we offer</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-3 mb-3">
              Built for confident, informed decisions.
            </h2>
            <p className="text-text-secondary text-base sm:text-lg">
              Three focused tools that take the guesswork out of choosing a college.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 stagger-children">
            {features.map((feat) => {
              const toneStyles = {
                primary: 'bg-primary/10 text-primary',
                accent:  'bg-accent/10 text-accent',
                success: 'bg-emerald-100 text-emerald-700',
              }[feat.tone];

              return (
                <Link key={feat.title} to={feat.link} className="block group">
                  <article className="card lift-on-hover p-7 h-full flex flex-col">
                    <div className={`w-12 h-12 mb-5 rounded-xl flex items-center justify-center ${toneStyles}`}>
                      {feat.icon}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">{feat.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-1">{feat.desc}</p>
                    <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm
                                     group-hover:gap-3 transition-all">
                      Get started <FiArrowRight size={14} />
                    </span>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED COLLEGES ===== */}
      <section className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-32 lg:py-48">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow mb-3">Featured</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-3">
              Premier institutions
            </h2>
            <p className="text-text-secondary mt-2 text-base sm:text-lg">
              Hand-picked colleges with strong placements and academic reputation.
            </p>
          </div>
          <Link to="/colleges" className="btn-outline self-start md:self-auto">
            View all colleges <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card h-[360px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 stagger-children">
            {featured.slice(0, 8).map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}

        <div className="md:hidden text-center mt-8">
          <Link to="/colleges" className="btn-primary">
            Explore more <FiArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-bg-soft border-t border-border">
        <div className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-32 lg:py-48">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow mb-3">How it works</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-3">
              Three steps to your shortlist
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
            {[
              { step: '01', title: 'Search & explore', desc: 'Use search and filters to discover colleges that match your interests, budget and location.' },
              { step: '02', title: 'Compare side-by-side', desc: 'Add up to three to your comparison view and analyse them across the metrics that matter.' },
              { step: '03', title: 'Predict & decide', desc: 'Use your entrance rank to see realistic admission chances and finalise your choices.' },
            ].map((s) => (
              <div key={s.step} className="card p-7 relative">
                <div className="font-serif text-5xl font-bold text-primary/15 mb-3">{s.step}</div>
                <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-32 lg:py-48">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-white p-8 sm:p-12 lg:p-16
                        shadow-xl">
          <div className="absolute inset-0 campus-pattern opacity-15 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Ready to take the next step?
              </h2>
              <p className="text-white/80 text-base sm:text-lg max-w-xl">
                Use the predictor to discover colleges where your rank truly fits — and turn
                possibilities into a confident plan.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                to="/predictor"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary
                           rounded-lg font-semibold hover:bg-bg-soft transition-colors shadow-md"
              >
                <FiTarget size={16} /> Predict colleges
              </Link>
              <Link
                to="/colleges"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/30
                           rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                <FiBookOpen size={16} /> Browse list
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
