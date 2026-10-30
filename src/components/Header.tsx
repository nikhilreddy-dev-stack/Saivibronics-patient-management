import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import {
  HeartHandshake,
  Menu,
  X,
  Search,
  User,
  Stethoscope,
  Building2,
  Home,
  ArrowRight,
  LogIn,
  UserPlus,
  Calendar
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on Escape key and prevent background scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    setDrawerOpen(false);
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 h-20">
            {/* Saivibronics Logo & Organisation Name on the left */}
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer shrink-0 min-h-[48px]"
              aria-label="Saivibronics Home"
            >
              <div className="w-10 h-10 rounded-xl bg-[#007F73] text-white flex items-center justify-center shadow-xs group-hover:bg-[#006b60] transition-colors shrink-0">
                <HeartHandshake className="w-5 h-5 text-teal-100" />
              </div>
              <div className="leading-tight">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#14243A] block font-['Plus_Jakarta_Sans',sans-serif]">
                  Saivibronics
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#007F73] tracking-wider uppercase block">
                  Sri Sathya Sai Organisation
                </span>
              </div>
            </button>

            {/* Primary Actions in a single, aligned row on the right */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
              {/* Install App (PWA) action */}
              <div className="hidden sm:flex items-center shrink-0">
                <PWAInstallButton variant="header" />
              </div>

              {/* Sign In action */}
              <button
                onClick={() => onNavigate('signin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#14243A] hover:text-[#007F73] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer min-h-[44px] shrink-0"
              >
                <User className="w-4 h-4 text-[#536579]" />
                <span>Sign In</span>
              </button>

              {/* Book Appointment action */}
              <button
                onClick={() => onNavigate('find-clinic')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-[#007F73] hover:bg-[#006b60] rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px] shrink-0 whitespace-nowrap"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>

              {/* Hamburger menu icon on the right (both desktop & mobile) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-[#007F73] hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0 border border-slate-200"
                aria-label="Open navigation menu"
                aria-expanded={drawerOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity flex justify-end"
          onClick={() => setDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Drawer"
        >
          <div
            className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#007F73] text-white flex items-center justify-center shadow-xs">
                  <HeartHandshake className="w-5 h-5 text-teal-100" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base leading-tight">
                    Saivibronics Menu
                  </div>
                  <div className="text-[10px] font-bold text-[#007F73] uppercase tracking-wider">
                    Sri Sathya Sai Organisation
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* Main Navigation Destinations */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                  Main Navigation
                </div>

                {/* 1. Home */}
                <button
                  onClick={() => handleNavigate('home')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 min-h-[44px] cursor-pointer ${
                    currentPage === 'home'
                      ? 'bg-[#E9F8F4] text-[#007F73] font-bold'
                      : 'text-[#14243A] hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentPage === 'home'
                        ? 'bg-[#007F73] text-white'
                        : 'bg-slate-100 text-[#007F73]'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block">Home</span>
                    <span className="text-xs text-slate-500 font-normal">
                      Platform overview & seva mission
                    </span>
                  </div>
                </button>

                {/* 2. Find a Clinic */}
                <button
                  onClick={() => handleNavigate('find-clinic')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 min-h-[44px] cursor-pointer ${
                    currentPage === 'find-clinic'
                      ? 'bg-[#E9F8F4] text-[#007F73] font-bold'
                      : 'text-[#14243A] hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentPage === 'find-clinic'
                        ? 'bg-[#007F73] text-white'
                        : 'bg-slate-100 text-[#007F73]'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block">Find a Clinic</span>
                    <span className="text-xs text-slate-500 font-normal">
                      Padmanabhanagar & multi-clinic network
                    </span>
                  </div>
                </button>

                {/* 3. Patient Portal */}
                <button
                  onClick={() => handleNavigate('patient-dashboard')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 min-h-[44px] cursor-pointer ${
                    currentPage === 'patient-dashboard'
                      ? 'bg-[#E9F8F4] text-[#007F73] font-bold'
                      : 'text-[#14243A] hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentPage === 'patient-dashboard'
                        ? 'bg-[#007F73] text-white'
                        : 'bg-slate-100 text-[#007F73]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block">Patient Portal</span>
                    <span className="text-xs text-slate-500 font-normal">
                      Senior-friendly dashboard & records
                    </span>
                  </div>
                </button>

                {/* 4. Practitioner */}
                <button
                  onClick={() => handleNavigate('practitioner-dashboard')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 min-h-[44px] cursor-pointer ${
                    currentPage === 'practitioner-dashboard'
                      ? 'bg-[#E9F8F4] text-[#007F73] font-bold'
                      : 'text-[#14243A] hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentPage === 'practitioner-dashboard'
                        ? 'bg-[#007F73] text-white'
                        : 'bg-slate-100 text-[#007F73]'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block">Practitioner</span>
                    <span className="text-xs text-slate-500 font-normal">
                      Consultation queue & remedies
                    </span>
                  </div>
                </button>

                {/* 5. Clinic Admin */}
                <button
                  onClick={() => handleNavigate('clinic-admin-dashboard')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 min-h-[44px] cursor-pointer ${
                    currentPage === 'clinic-admin-dashboard'
                      ? 'bg-[#E9F8F4] text-[#007F73] font-bold'
                      : 'text-[#14243A] hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentPage === 'clinic-admin-dashboard'
                        ? 'bg-[#007F73] text-white'
                        : 'bg-slate-100 text-[#007F73]'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block">Clinic Admin</span>
                    <span className="text-xs text-slate-500 font-normal">
                      Reception desk, tokens & schedule
                    </span>
                  </div>
                </button>
              </div>

              {/* Portal Access & Registration Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
                  Account & Registration
                </div>

                {/* 6. Sign In and 7. Register */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavigate('signin')}
                    className={`p-3 rounded-xl border text-left font-semibold text-sm transition-colors min-h-[44px] cursor-pointer flex items-center gap-2 ${
                      currentPage === 'signin'
                        ? 'border-[#007F73] bg-[#E9F8F4] text-[#007F73]'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#14243A]'
                    }`}
                  >
                    <LogIn className="w-4 h-4 text-[#007F73]" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('register')}
                    className={`p-3 rounded-xl border text-left font-semibold text-sm transition-colors min-h-[44px] cursor-pointer flex items-center gap-2 ${
                      currentPage === 'register'
                        ? 'border-[#007F73] bg-[#E9F8F4] text-[#007F73]'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#14243A]'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-[#007F73]" />
                    <span>Register</span>
                  </button>
                </div>

                {/* 8. Find a Clinic & Book Token */}
                <button
                  onClick={() => handleNavigate('find-clinic')}
                  className="w-full py-3.5 px-4 text-center text-sm font-bold text-white bg-[#007F73] hover:bg-[#006b60] rounded-xl shadow-xs min-h-[48px] cursor-pointer flex items-center justify-center gap-2 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Find a Clinic & Book Token</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progressive Web App Option */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  Offline & Mobile App
                </div>
                <PWAInstallButton variant="inline" />
              </div>

              {/* Pilot Footer Info */}
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Sri Sathya Sai Organisation</p>
                <p>Padmanabhanagar Pilot · Bengaluru, Karnataka</p>
                <p className="text-[11px] text-slate-400">Holistic Seva Healthcare Prototype</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
