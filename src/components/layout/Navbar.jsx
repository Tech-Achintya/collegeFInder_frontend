/**
 * @fileoverview Navbar — Formal academic-portal top bar.
 * Logo on the left, primary nav in the centre (desktop), CTA + mobile toggle on the right.
 * Sticky, white, with a subtle bottom hairline. Mobile menu collapses cleanly.
 */

import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { FiHome, FiBookOpen, FiBarChart2, FiTarget, FiMenu, FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import logo from '../../assets/favicon.png';

export default function Navbar() {
  const { compareCount } = useCompare();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: <FiHome size={16} /> },
    { to: '/colleges', label: 'Colleges', icon: <FiBookOpen size={16} /> },
    { to: '/compare', label: 'Compare', icon: <FiBarChart2 size={16} />, badge: compareCount },
    { to: '/predictor', label: 'Predictor', icon: <FiTarget size={16} /> },
  ];

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      {/* Thin gold accent strip — subtle academic touch */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="w-full px-12 sm:px-24 lg:px-32 xl:px-48">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden bg-primary/5 border border-primary/10
                            flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <img src={logo} alt="CollegeFinder" className="w-full h-full object-contain p-1" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-primary tracking-tight">
                College<span className="text-accent">Finder</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted hidden sm:block">
                Higher Education Portal
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-lg text-sm font-semibold
                  transition-all duration-200
                  ${isActive(link.to)
                    ? 'text-primary bg-primary/8'
                    : 'text-text-secondary hover:text-primary hover:bg-bg-soft'}`}
              >
                {link.icon}
                {link.label}
                {link.badge > 0 && (
                  <span className="ml-1 min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center
                                   rounded-full bg-accent text-white text-[10px] font-bold pulse-badge">
                    {link.badge}
                  </span>
                )}
                {isActive(link.to) && (
                  <span className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-accent rounded-full" />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side — desktop CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/predictor"
              className="hidden md:inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 bg-primary text-white
                         rounded-lg text-sm font-semibold shadow-sm hover:bg-primary-dark transition-colors"
            >
              <FiTarget size={15} /> Predict My College
            </Link>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation"
              className="md:hidden p-2.5 rounded-lg text-text-primary hover:bg-bg-soft border border-border transition-colors"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 fade-in">
            <nav className="flex flex-col gap-1 pt-2 border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors
                    ${isActive(link.to)
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-bg-soft hover:text-primary'}`}
                >
                  <span className={`p-1.5 rounded-md ${isActive(link.to) ? 'bg-white/15' : 'bg-bg-soft'}`}>
                    {link.icon}
                  </span>
                  {link.label}
                  {link.badge > 0 && (
                    <span className="ml-auto min-w-[22px] h-5 px-1.5 inline-flex items-center justify-center
                                     rounded-full bg-accent text-white text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                to="/predictor"
                className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white
                           rounded-lg text-sm font-semibold shadow-sm"
              >
                <FiTarget size={15} /> Predict My College
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
