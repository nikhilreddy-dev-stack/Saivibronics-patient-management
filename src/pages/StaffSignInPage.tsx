import React, { useState } from 'react';
import { PageId } from '../types';
import { Stethoscope, Building2, Layers, ArrowLeft, ArrowRight, ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

interface StaffSignInPageProps {
  onNavigate: (page: PageId) => void;
}

export const StaffSignInPage: React.FC<StaffSignInPageProps> = ({ onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<'practitioner' | 'clinic-admin' | 'org-admin'>('practitioner');
  const [staffEmail, setStaffEmail] = useState('dr.ramesh@saivibronics-seva.org');
  const [staffPassword, setStaffPassword] = useState('seva1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: 'practitioner' | 'clinic-admin' | 'org-admin') => {
    setSelectedRole(role);
    if (role === 'practitioner') {
      setStaffEmail('dr.ramesh@saivibronics-seva.org');
    } else if (role === 'clinic-admin') {
      setStaffEmail('admin.padmanabhanagar@saivibronics.org');
    } else {
      setStaffEmail('state.coordinator@saivibronics.org');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmail.trim() || !staffPassword.trim()) {
      setError('Please provide staff email and credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      if (selectedRole === 'practitioner') {
        onNavigate('practitioner-dashboard');
      } else if (selectedRole === 'clinic-admin') {
        onNavigate('clinic-admin-dashboard');
      } else {
        onNavigate('org-admin-dashboard');
      }
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('signin')}
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Patient Sign In</span>
        </button>

        <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Staff Portal
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-2">
          <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Staff & Volunteer Seva Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Dedicated administrative entry point for certified Vibrionics practitioners, clinic reception coordinators, and state coordinators.
          </p>
        </div>

        {/* Operational Security Notice */}
        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 text-xs sm:text-sm text-teal-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-teal-900">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
            <span>Authorised Personnel Access Only</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            Patients should use the <button onClick={() => onNavigate('signin')} className="text-teal-800 font-bold underline">Patient Portal</button>. This console manages clinical consultation queues, potentised remedy preparation, and multi-clinic operations.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Staff Responsibility:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <button
              type="button"
              onClick={() => handleRoleSelect('practitioner')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] flex flex-col justify-between ${
                selectedRole === 'practitioner'
                  ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-600/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-2">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Practitioner</div>
                <div className="text-xs text-slate-500">Patient queue & remedies</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('clinic-admin')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] flex flex-col justify-between ${
                selectedRole === 'clinic-admin'
                  ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-600/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Clinic Admin</div>
                <div className="text-xs text-slate-500">Tokens & reception desk</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('org-admin')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] flex flex-col justify-between ${
                selectedRole === 'org-admin'
                  ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-600/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Org Admin</div>
                <div className="text-xs text-slate-500">State network & clinics</div>
              </div>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-sm">
          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Staff Email Address
            </label>
            <input
              type="email"
              required
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Volunteer Access Key / Password
            </label>
            <input
              type="password"
              required
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
            />
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onNavigate('signin')}
              className="text-sm text-teal-800 hover:underline font-bold cursor-pointer"
            >
              Looking for Patient Portal? Click here
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#007F73] hover:bg-[#006b60] text-white font-bold rounded-2xl text-base transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px] disabled:opacity-75"
            >
              <span>{loading ? 'Authenticating Staff...' : 'Enter Staff Console'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
