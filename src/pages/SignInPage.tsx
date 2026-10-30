import React, { useState } from 'react';
import { PageId } from '../types';
import { LogIn, ShieldAlert, KeyRound, ArrowRight, ArrowLeft, UserCheck, Stethoscope, Building2, Layers } from 'lucide-react';

interface SignInPageProps {
  onNavigate: (page: PageId) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('patient.demo@saivibronics.org');
  const [password, setPassword] = useState('demo1234');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'practitioner' | 'clinic-admin' | 'org-admin'>('patient');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (selectedRole === 'patient') {
      onNavigate('patient-dashboard');
    } else if (selectedRole === 'practitioner') {
      onNavigate('practitioner-dashboard');
    } else if (selectedRole === 'clinic-admin') {
      onNavigate('clinic-admin-dashboard');
    } else {
      onNavigate('org-admin-dashboard');
    }
  };

  const handleQuickRoleSelect = (role: 'patient' | 'practitioner' | 'clinic-admin' | 'org-admin') => {
    setSelectedRole(role);
    if (role === 'patient') {
      setEmail('ananya.rao@example.com');
      onNavigate('patient-dashboard');
    } else if (role === 'practitioner') {
      setEmail('dr.ramesh@saivibronics-seva.org');
      onNavigate('practitioner-dashboard');
    } else if (role === 'clinic-admin') {
      setEmail('admin.padmanabhanagar@saivibronics.org');
      onNavigate('clinic-admin-dashboard');
    } else {
      setEmail('state.coordinator@saivibronics.org');
      onNavigate('org-admin-dashboard');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-2">
          <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 mb-3">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portal Sign In
          </h1>
          <p className="text-base text-slate-600">
            Access your patient appointments, practitioner consultations, or clinic administration.
          </p>
        </div>

        {/* Prototype Notice */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-sm text-amber-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Prototype Authentication Notice</span>
          </div>
          <p className="leading-relaxed">
            Live authentication and database accounts are not connected in this frontend prototype. Submitting simulates sign-in locally to demonstrate the respective dashboard interfaces.
          </p>
        </div>

        {/* Quick Role Switcher Cards with high-contrast readable styling */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-800">
            Quick 1-Click Role Preview (Click to Launch):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('patient')}
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/60 text-left transition-all cursor-pointer group flex items-start gap-3 min-h-[48px]"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 group-hover:text-teal-900">Patient View</div>
                <div className="text-xs text-slate-500">Upcoming tokens & history</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('practitioner')}
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/60 text-left transition-all cursor-pointer group flex items-start gap-3 min-h-[48px]"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 group-hover:text-teal-900">Practitioner View</div>
                <div className="text-xs text-slate-500">Today&apos;s patient queue</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('clinic-admin')}
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/60 text-left transition-all cursor-pointer group flex items-start gap-3 min-h-[48px]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 group-hover:text-teal-900">Clinic Admin</div>
                <div className="text-xs text-slate-500">Padmanabhanagar ops</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('org-admin')}
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/60 text-left transition-all cursor-pointer group flex items-start gap-3 min-h-[48px]"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 group-hover:text-teal-900">Organisation Admin</div>
                <div className="text-xs text-slate-500">Network & Add Clinic</div>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-sm">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-sm font-semibold">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Select Role to Enter
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer min-h-[48px]"
            >
              <option value="patient">Patient Dashboard (Smt. Ananya Rao)</option>
              <option value="practitioner">Practitioner Dashboard (Dr. K. S. Ramesh)</option>
              <option value="clinic-admin">Clinic Administrator (Padmanabhanagar Unit)</option>
              <option value="org-admin">Organisation Administrator (Karnataka State)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Registered Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Password (Demo)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
            />
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-sm text-teal-800 hover:underline font-bold cursor-pointer"
            >
              Don&apos;t have an account? Register
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-base transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
