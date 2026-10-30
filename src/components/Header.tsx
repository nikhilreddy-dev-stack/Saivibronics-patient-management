import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: PageId; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Home', page: 'home', icon: Home },
    { label: 'Find a Clinic', page: 'find-clinic', icon: Search },
    { label: 'Patient Portal', page: 'patient-dashboard', icon: User },
    { label: 'Practitioner', page: 'practitioner-dashboard', icon: Stethoscope },
    { label: 'Clinic Admin', page: 'clinic-admin-dashboard', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Brand Element */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer shrink-0 min-h-[48px]"
            aria-label="Saivibronics Home"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-800 transition-colors">
              <HeartHandshake className="w-6 h-6 text-teal-100" />
            </div>
            <div className="leading-tight">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 block font-['Plus_Jakarta_Sans',sans-serif]">
                Saivibronics
              </span>
              <span className="text-xs font-bold text-teal-700 tracking-wide uppercase block">
                Sri Sathya Sai Organisation
              </span>
            </div>
          </button>

          {/* Nav Links with Labelled Icons and Readable Text */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'text-slate-600 hover:text-teal-800 hover:bg-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <PWAInstallButton variant="header" />

            <button
              onClick={() => onNavigate('signin')}
              className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => onNavigate('find-clinic')}
              className="px-5 py-2.5 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px] flex items-center gap-2"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-5 pt-4 pb-8 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-base font-bold transition-colors flex items-center gap-3 min-h-[48px] cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 text-teal-900 border border-teal-200 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigate('signin');
                  setMobileMenuOpen(false);
                }}
                className="py-3 text-center text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl min-h-[48px] cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onNavigate('register');
                  setMobileMenuOpen(false);
                }}
                className="py-3 text-center text-sm font-bold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-xl min-h-[48px] cursor-pointer"
              >
                Register
              </button>
            </div>

            <button
              onClick={() => {
                onNavigate('find-clinic');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 text-center text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs min-h-[48px] cursor-pointer"
            >
              Find a Clinic & Book Token
            </button>

            <div className="pt-1">
              <PWAInstallButton variant="inline" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
