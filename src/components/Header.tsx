import React, { useState, useEffect } from 'react';
import { PageId, PatientProfile } from '../types';
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
  Calendar,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  authenticatedPatient?: PatientProfile | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  authenticatedPatient,
  onSignOut,
}) => {
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

  const handleScrollToHowItWorks = () => {
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
    setDrawerOpen(false);
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
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
                <HeartHandshake className="w-5 h-5 text-teal-200" />
              </div>
              <div className="leading-tight">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 block font-['Plus_Jakarta_Sans',sans-serif]">
                  Saivibronics
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-teal-700 tracking-wider uppercase block">
                  Sri Sathya Sai Organisation
                </span>
              </div>
            </button>

            {/* Concise Desktop Navigation Links in Center */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0 whitespace-nowrap"
              aria-label="Primary Navigation"
            >
              <button
                onClick={() => handleNavigate('home')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer min-h-[40px] flex items-center ${
                  currentPage === 'home'
                    ? 'text-blue-600 font-bold bg-blue-50'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigate('find-clinic')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer min-h-[40px] flex items-center ${
                  currentPage === 'find-clinic'
                    ? 'text-blue-600 font-bold bg-blue-50'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Find a Clinic
              </button>
              <button
                onClick={handleScrollToHowItWorks}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer min-h-[40px] flex items-center"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavigate('register')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer min-h-[40px] flex items-center ${
                  currentPage === 'register'
                    ? 'text-blue-600 font-bold bg-blue-50'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Patient Registration
              </button>
            </nav>

            {/* Primary Actions in a single, aligned row on the right */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
              {/* Install App (PWA) action */}
              <div className="hidden sm:flex items-center shrink-0">
                <PWAInstallButton variant="header" />
              </div>

              {/* Sign In / Patient Profile Action */}
              {authenticatedPatient ? (
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onNavigate('patient-dashboard')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer min-h-[44px]"
                    title="Open Patient Portal"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {authenticatedPatient.fullName.charAt(0)}
                    </span>
                    <span className="max-w-[120px] truncate">{authenticatedPatient.fullName.split(' ')[0]}</span>
                  </button>
                  {onSignOut && (
                    <button
                      onClick={onSignOut}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer min-h-[44px]"
                      title="Sign Out of Patient Account"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('signin')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer min-h-[44px] shrink-0"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Book Appointment action */}
              <button
                onClick={() => onNavigate('find-clinic')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px] shrink-0 whitespace-nowrap"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>

              {/* Hamburger menu icon on the right (both desktop & mobile) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0 border border-slate-200"
                aria-label="Open navigation menu"
                aria-expanded={drawerOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Drawer: Full Viewport Height from Top to Bottom */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs transition-opacity flex justify-end"
          onClick={() => setDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Drawer"
        >
          <div
            className="w-full sm:max-w-md h-screen h-[100dvh] fixed top-0 bottom-0 right-0 z-[101] bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header (Fixed at top of drawer) */}
            <div className="shrink-0 p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#007F73] text-white flex items-center justify-center shadow-xs shrink-0">
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
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body (Internal scroll if content exceeds viewport height) */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5">
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
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      currentPage === 'home'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-blue-600'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">Home</span>
                    <span className="text-xs text-slate-500 font-normal block truncate">
                      Platform overview & seva mission
                    </span>
                  </div>
                </button>

                {/* 2. Find a Clinic */}
                <button
                  onClick={() => handleNavigate('find-clinic')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 min-h-[44px] cursor-pointer ${
                    currentPage === 'find-clinic'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      currentPage === 'find-clinic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-blue-600'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">Find a Clinic</span>
                    <span className="text-xs text-slate-500 font-normal block truncate">
                      Padmanabhanagar & multi-clinic network
                    </span>
                  </div>
                </button>

                {/* 3. How It Works */}
                <button
                  onClick={handleScrollToHowItWorks}
                  className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors flex items-center gap-3 min-h-[44px] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-teal-600 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">How It Works</span>
                    <span className="text-xs text-slate-500 font-normal block truncate">
                      Holistic Vibronics consultation steps
                    </span>
                  </div>
                </button>
              </div>

              {/* Portal Access & Registration Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
                  Account & Registration
                </div>

                {/* Patient Session or Sign In and Register */}
                {authenticatedPatient ? (
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                        {authenticatedPatient.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {authenticatedPatient.fullName}
                        </div>
                        <div className="text-[11px] text-blue-700 font-mono flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          <span>{authenticatedPatient.patientId || authenticatedPatient.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleNavigate('patient-dashboard')}
                        className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center cursor-pointer transition-colors"
                      >
                        My Dashboard
                      </button>
                      <button
                        onClick={() => {
                          onSignOut?.();
                          setDrawerOpen(false);
                        }}
                        className="py-2 px-3 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-1"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavigate('signin')}
                      className={`p-3 rounded-xl border text-left font-semibold text-sm transition-colors min-h-[44px] cursor-pointer flex items-center gap-2 ${
                        currentPage === 'signin'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <LogIn className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">Sign In</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('register')}
                      className={`p-3 rounded-xl border text-left font-semibold text-sm transition-colors min-h-[44px] cursor-pointer flex items-center gap-2 ${
                        currentPage === 'register'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <UserPlus className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">Register</span>
                    </button>
                  </div>
                )}

                {/* Find a Clinic & Book Token */}
                <button
                  onClick={() => handleNavigate('find-clinic')}
                  className="w-full py-3.5 px-4 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs min-h-[48px] cursor-pointer flex items-center justify-center gap-2 transition-colors"
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
            </div>

            {/* Drawer Footer (Fixed at bottom of drawer) */}
            <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Sri Sathya Sai Organisation</p>
              <p>Padmanabhanagar Pilot · Bengaluru, Karnataka</p>
              <p className="text-[11px] text-slate-400">Holistic Seva Healthcare Platform Prototype</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
