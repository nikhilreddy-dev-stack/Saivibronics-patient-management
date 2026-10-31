import React, { useState } from 'react';
import { PageId } from '../types';
import { Sparkles, Eye, X, ChevronRight, ShieldAlert, ArrowRight } from 'lucide-react';

interface DemoBannerProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ currentPage, onNavigate }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Demonstration mode is only displayed when explicitly enabled (e.g. ?demo=true or ?demo=evaluator)
  const isDemoMode = typeof window !== 'undefined' && 
    (new URLSearchParams(window.location.search).has('demo') ||
     new URLSearchParams(window.location.search).get('mode') === 'evaluator');

  if (!isDemoMode) {
    return null;
  }

  if (isDismissed) {
    return (
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-teal-400">Saivibronics Prototype</span>
          <span className="text-slate-500">·</span>
          <span>Padmanabhanagar, Bengaluru Pilot</span>
        </div>
        <button
          onClick={() => setShowRoleModal(true)}
          className="text-teal-300 hover:text-white font-bold underline transition-colors cursor-pointer min-h-[36px] flex items-center"
        >
          Switch Views / Roles
        </button>
      </div>
    );
  }

  return (
    <div className="bg-teal-950 text-white border-b border-teal-900 text-xs sm:text-sm py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <span className="bg-teal-800 text-teal-200 border border-teal-700 font-bold px-2.5 py-0.5 rounded-lg text-xs uppercase tracking-wider shrink-0">
            CSE Student Pilot
          </span>
          <span className="text-teal-100 leading-normal">
            Sri Sathya Sai Organisation <span className="text-teal-400 font-bold">·</span> Padmanabhanagar, Bengaluru (560070). Fictional demonstration data only.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-xl font-bold text-xs border border-teal-700 transition-colors cursor-pointer min-h-[38px]"
          >
            <Eye className="w-4 h-4 text-teal-300" />
            <span>Switch Role Preview</span>
            <ChevronRight className="w-3.5 h-3.5 text-teal-300" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="text-teal-300 hover:text-white p-1 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white text-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">Prototype Navigation & Role Previews</h3>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 min-h-[44px] min-w-[44px]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Prototype Notice:</strong> This is an interactive frontend demonstration. Switching roles lets you preview stakeholder interfaces without live database authentication or role enforcement.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Public Portal Pages</p>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <button
                    onClick={() => { onNavigate('home'); setShowRoleModal(false); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] ${
                      currentPage === 'home' ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    1. Home & Overview
                  </button>
                  <button
                    onClick={() => { onNavigate('find-clinic'); setShowRoleModal(false); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] ${
                      currentPage === 'find-clinic' ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    2. Find a Clinic
                  </button>
                  <button
                    onClick={() => { onNavigate('register'); setShowRoleModal(false); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] ${
                      currentPage === 'register' ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    3. Patient Registration
                  </button>
                  <button
                    onClick={() => { onNavigate('signin'); setShowRoleModal(false); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] ${
                      currentPage === 'signin' ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    4. Sign-in Portal
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dashboard Previews</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <button
                    onClick={() => { onNavigate('patient-dashboard'); setShowRoleModal(false); }}
                    className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer min-h-[48px] ${
                      currentPage === 'patient-dashboard' ? 'bg-teal-50 border-teal-500 text-teal-950 font-extrabold ring-1 ring-teal-200' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Patient Dashboard</div>
                    <div className="text-xs text-slate-500 mt-0.5">Senior-friendly 9-service grid</div>
                  </button>

                  <button
                    onClick={() => { onNavigate('practitioner-dashboard'); setShowRoleModal(false); }}
                    className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer min-h-[48px] ${
                      currentPage === 'practitioner-dashboard' ? 'bg-teal-50 border-teal-500 text-teal-950 font-extrabold ring-1 ring-teal-200' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Practitioner Dashboard</div>
                    <div className="text-xs text-slate-500 mt-0.5">Queue, notes & Vibronics remedies</div>
                  </button>

                  <button
                    onClick={() => { onNavigate('clinic-admin-dashboard'); setShowRoleModal(false); }}
                    className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer min-h-[48px] ${
                      currentPage === 'clinic-admin-dashboard' ? 'bg-teal-50 border-teal-500 text-teal-950 font-extrabold ring-1 ring-teal-200' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Clinic Admin Dashboard</div>
                    <div className="text-xs text-slate-500 mt-0.5">Padmanabhanagar clinic operations</div>
                  </button>

                  <button
                    onClick={() => { onNavigate('org-admin-dashboard'); setShowRoleModal(false); }}
                    className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer min-h-[48px] ${
                      currentPage === 'org-admin-dashboard' ? 'bg-teal-50 border-teal-500 text-teal-950 font-extrabold ring-1 ring-teal-200' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Organisation Admin</div>
                    <div className="text-xs text-slate-500 mt-0.5">Multi-clinic network & Add Clinic</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-xl transition-colors cursor-pointer min-h-[40px]"
              >
                Close Switcher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
