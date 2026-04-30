/**
 * @fileoverview Footer — Formal academic-portal footer.
 */

import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiBookOpen, FiBarChart2, FiTarget, FiHome } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-secondary text-slate-300">
      {/* Top accent bar — gold/amber under-line, mirrors navbar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="w-full px-12 sm:px-24 lg:px-32 xl:px-48 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold text-white mb-3">
              College<span className="text-accent">Finder</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              A trusted higher-education portal to discover, compare and decide on
              India's premier institutes — with verified placement data and authentic reviews.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FiMapPin size={14} className="text-accent" /> India
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-accent transition-colors inline-flex items-center gap-2"><FiHome size={13} /> Home</Link></li>
              <li><Link to="/colleges" className="text-slate-400 hover:text-accent transition-colors inline-flex items-center gap-2"><FiBookOpen size={13} /> Browse Colleges</Link></li>
              <li><Link to="/compare" className="text-slate-400 hover:text-accent transition-colors inline-flex items-center gap-2"><FiBarChart2 size={13} /> Compare</Link></li>
              <li><Link to="/predictor" className="text-slate-400 hover:text-accent transition-colors inline-flex items-center gap-2"><FiTarget size={13} /> Predictor</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Engineering Colleges</li>
              <li>Management Schools</li>
              <li>Placement Reports</li>
              <li>Student Reviews</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-4">Get in touch</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Questions, feedback or partnership enquiries? We'd love to hear from you.
            </p>
            <a
              href="mailto:achintya26022006@gmail.com"
              className="inline-flex items-center gap-3 text-sm font-semibold text-white hover:text-accent transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-accent/20 transition-colors">
                <FiMail size={14} className="group-hover:scale-110 transition-transform" />
              </div>
              <span className="border-b border-transparent group-hover:border-accent pb-0.5">
                achintya26022006@gmail.com
              </span>
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs text-center sm:text-left">
            © {year} CollegeFinder. All rights reserved. Built as an academic-discovery MVP.
          </p>
          <p className="text-slate-500 text-xs">
            Data shown is illustrative for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
