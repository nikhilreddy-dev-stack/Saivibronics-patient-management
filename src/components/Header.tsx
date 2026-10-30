import React, { useState } from 'react';
import { PageId } from '../types';
import { Menu, X, HeartHandshake, User, ArrowRight } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: PageId }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Find a Clinic', page: 'find-clinic' },
    { label: 'Patient Portal', page: 'patient-dashboard' },
    { label: 'Practitioner', page: 'practitioner-dashboard' },
    { label: 'Admin', page: 'clinic-admin-dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single Brand element */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
            aria-label="Saivibronics Home"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-800 transition-colors">
              <HeartHandshake className="w-5 h-5 text-teal-100" />
            </div>
            <div className="leading-tight">
              <span className="text-xl font-bold tracking-tight text-slate-900 block font-['Plus_Jakarta_Sans',sans-serif]">
                Saivibronics
              </span>
              <span className="text-[11px] font-medium text-teal-700 tracking-wide uppercase block">
                Sri Sathya Sai Organisation
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 single-line clean text links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`whitespace-nowrap transition-colors hover:text-teal-700 cursor-pointer py-1 ${
                  currentPage === item.page
                    ? 'text-teal-800 font-semibold border-b-2 border-teal-600'
                    : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <PWAInstallButton variant="header" />
            
            <button
              onClick={() => onNavigate('signin')}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => onNavigate('find-clinic')}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <span>Find a Clinic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onNavigate('signin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onNavigate('register');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 text-center text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors"
              >
                Register
              </button>
            </div>

            <button
              onClick={() => {
                onNavigate('find-clinic');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-teal-700 rounded-xl hover:bg-teal-800 transition-colors shadow-xs"
            >
              Find a Clinic in Padmanabhanagar
            </button>

            <div className="pt-2">
              <PWAInstallButton variant="inline" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
