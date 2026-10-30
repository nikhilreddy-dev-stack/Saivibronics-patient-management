import React, { useState } from 'react';
import { PageId } from '../types';
import { LogIn, ShieldAlert, KeyRound, ArrowRight, ArrowLeft, UserCheck } from 'lucide-react';

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

    // Direct to the corresponding role dashboard preview
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portal Sign In
          </h1>
          <p className="text-sm text-slate-600">
            Access your patient appointments, practitioner consultations, or clinic administration.
          </p>
        </div>

        {/* Prototype Notice */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Prototype Authentication Notice</span>
          </div>
          <p className="leading-relaxed">
            Live authentication and password hashing are not connected in this frontend prototype. Submitting this form simulates sign-in locally to demonstrate the respective dashboard interfaces.
          </p>
        </div>

        {/* Quick Prototype Role Switcher Cards */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-700">
            Quick Preview by Role (Click to Launch):
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('patient')}
              className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-teal-900">Patient View</div>
              <div className="text-[11px] text-slate-500">Upcoming tokens & history</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('practitioner')}
              className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-teal-900">Practitioner View</div>
              <div className="text-[11px] text-slate-500">Today's patient queue</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('clinic-admin')}
              className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-teal-900">Clinic Admin</div>
              <div className="text-[11px] text-slate-500">Padmanabhanagar ops</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('org-admin')}
              className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-teal-900">Organisation Admin</div>
              <div className="text-[11px] text-slate-500">Network & Add Clinic</div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-2">
          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Role to Enter
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer"
            >
              <option value="patient">Patient Dashboard (Smt. Ananya Rao)</option>
              <option value="practitioner">Practitioner Dashboard (Dr. K. S. Ramesh)</option>
              <option value="clinic-admin">Clinic Administrator (Padmanabhanagar Unit)</option>
              <option value="org-admin">Organisation Administrator (Karnataka State)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
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
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
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
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-[11px] text-teal-800 hover:underline font-medium cursor-pointer"
            >
              Don't have an account? Register
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
