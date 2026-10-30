import React, { useState } from 'react';
import { PageId } from '../types';
import { Sparkles, Eye, X, ChevronRight, ShieldAlert } from 'lucide-react';

interface DemoBannerProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ currentPage, onNavigate }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  if (isDismissed) {
    return (
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-300">Demo Prototype</span>
          <span className="text-emerald-400/80">·</span>
          <span>Padmanabhanagar Pilot (Bengaluru)</span>
        </div>
        <button
          onClick={() => setShowRoleModal(true)}
          className="underline hover:text-white transition-colors cursor-pointer"
        >
          Switch View / Roles
        </button>
      </div>
    );
  }

  return (
    <div className="bg-teal-900 text-white border-b border-teal-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2">
          <span className="bg-teal-800/90 text-teal-200 border border-teal-700/60 font-semibold px-2 py-0.5 rounded text-[11px] shrink-0 uppercase tracking-wider">
            Academic Prototype
          </span>
          <span className="text-teal-100 leading-tight">
            Sri Sathya Sai Organisation <span className="text-teal-300">·</span> Padmanabhanagar, Bengaluru Pilot Project (CSE Student Engineering Team). Fictional demonstration data only.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-white rounded-md font-medium text-xs border border-teal-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-teal-300" />
            <span>Switch Dashboard Preview</span>
            <ChevronRight className="w-3 h-3 text-teal-300" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="text-teal-300 hover:text-white p-0.5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white text-slate-900 p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Prototype Navigation & Role Previews</h3>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Prototype Notice:</strong> This is an interactive frontend demonstration. Switching roles lets you preview stakeholder interfaces without live database authentication or role enforcement.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Public Portal Pages</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => { onNavigate('home'); setShowRoleModal(false); }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentPage === 'home' ? 'bg-teal-50 border-teal-300 text-teal-900 font-medium' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    1. Home & Overview
                  </button>
                  <button
                    onClick={() => { onNavigate('find-clinic'); setShowRoleModal(false); }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentPage === 'find-clinic' ? 'bg-teal-50 border-teal-300 text-teal-900 font-medium' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    2. Find a Clinic
                  </button>
                  <button
                    onClick={() => { onNavigate('register'); setShowRoleModal(false); }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentPage === 'register' ? 'bg-teal-50 border-teal-300 text-teal-900 font-medium' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    3. Patient Registration
                  </button>
                  <button
                    onClick={() => { onNavigate('signin'); setShowRoleModal(false); }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentPage === 'signin' ? 'bg-teal-50 border-teal-300 text-teal-900 font-medium' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    4. Sign-in Portal
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dashboard Previews</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => { onNavigate('patient-dashboard'); setShowRoleModal(false); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentPage === 'patient-dashboard' ? 'bg-teal-50 border-teal-400 text-teal-900 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Patient Dashboard</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Appointments, records & visits</div>
                  </button>

                  <button
                    onClick={() => { onNavigate('practitioner-dashboard'); setShowRoleModal(false); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentPage === 'practitioner-dashboard' ? 'bg-teal-50 border-teal-400 text-teal-900 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Practitioner Dashboard</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Queue, notes & Vibronics remedies</div>
                  </button>

                  <button
                    onClick={() => { onNavigate('clinic-admin-dashboard'); setShowRoleModal(false); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentPage === 'clinic-admin-dashboard' ? 'bg-teal-50 border-teal-400 text-teal-900 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Clinic Admin Dashboard</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Padmanabhanagar clinic operations</div>
                  </button>

                  <button
                    onClick={() => { onNavigate('org-admin-dashboard'); setShowRoleModal(false); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentPage === 'org-admin-dashboard' ? 'bg-teal-50 border-teal-400 text-teal-900 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Organisation Admin</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Multi-clinic network & Add Clinic</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
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
