import React, { useState } from 'react';
import { PageId, PatientProfile } from '../types';
import { DEMO_PATIENT } from '../data/mockData';
import {
  LogIn,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  Lock,
  Phone,
  HelpCircle,
  X
} from 'lucide-react';

interface SignInPageProps {
  onNavigate: (page: PageId) => void;
  onSignInSuccess: (patient: PatientProfile) => void;
  registeredPatients?: PatientProfile[];
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigate,
  onSignInSuccess,
  registeredPatients = [DEMO_PATIENT],
}) => {
  const [identifier, setIdentifier] = useState('ananya.rao@example.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      setErrorMessage('Please enter your registered mobile number or email address.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setLoading(true);

    // Simulate authenticating against registered patient accounts
    setTimeout(() => {
      setLoading(false);

      // Check against registered patient pool
      const matchedPatient = registeredPatients.find((p) => {
        const emailMatch = p.email.toLowerCase() === cleanIdentifier;
        const phoneMatch = p.mobileNumber.replace(/\D/g, '') === cleanIdentifier.replace(/\D/g, '');
        return emailMatch || phoneMatch;
      });

      if (matchedPatient) {
        setSuccessMessage(`Welcome back, ${matchedPatient.fullName}! Directing to your patient dashboard...`);
        setTimeout(() => {
          onSignInSuccess(matchedPatient);
          onNavigate('patient-dashboard');
        }, 600);
      } else if (cleanIdentifier.includes('ananya') || cleanIdentifier === '9845012345') {
        // Fallback demo patient
        setSuccessMessage('Welcome back, Smt. Ananya Rao! Directing to your patient dashboard...');
        setTimeout(() => {
          onSignInSuccess(DEMO_PATIENT);
          onNavigate('patient-dashboard');
        }, 600);
      } else {
        // Create session profile for entered credentials so patient can still access
        const newDemoPatient: PatientProfile = {
          id: `SSSO-BLR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          fullName: cleanIdentifier.includes('@')
            ? cleanIdentifier.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
            : 'Registered Patient',
          mobileNumber: cleanIdentifier.replace(/\D/g, '').slice(-10) || '9845012345',
          email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@patient.saivibronics.org`,
          preferredClinicId: 'clinic-padmanabhanagar',
          preferredClinicName: 'Sri Sathya Sai Vibronics Seva Clinic - Padmanabhanagar',
          registeredDate: new Date().toISOString().split('T')[0],
        };

        setSuccessMessage(`Account located. Welcome back, ${newDemoPatient.fullName}!`);
        setTimeout(() => {
          onSignInSuccess(newDemoPatient);
          onNavigate('patient-dashboard');
        }, 600);
      }
    }, 500);
  };

  const handleFillDemo = () => {
    setIdentifier('ananya.rao@example.com');
    setPassword('demo1234');
    setErrorMessage(null);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      {/* Return Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => onNavigate('find-clinic')}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#007F73] transition-colors"
        >
          Find a Clinic
        </button>
      </div>

      {/* Main Patient Sign In Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#007F73] text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-6 h-6 text-teal-100" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#14243A] block font-['Plus_Jakarta_Sans',sans-serif]">
                Saivibronics
              </span>
              <span className="text-[10px] font-bold text-[#007F73] tracking-wider uppercase block">
                Sri Sathya Sai Organisation
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14243A] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Patient Sign In
          </h1>
          <p className="text-sm sm:text-base text-[#536579] leading-relaxed">
            Access your scheduled consultation tokens, medical notes, and holistic Vibronics remedy instructions.
          </p>
        </div>

        {/* Feedback Alert Messages */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-sm font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-sm font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Patient Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-sm">
          {/* Mobile / Email Input */}
          <div>
            <label htmlFor="patient-identifier" className="block font-bold text-slate-800 mb-1.5 text-sm">
              Mobile Number or Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="patient-identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="e.g. 9845012345 or ananya.rao@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white transition-colors min-h-[48px]"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="patient-password" className="block font-bold text-slate-800 text-sm">
                Account Password <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-xs font-semibold text-[#007F73] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="patient-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter your password"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white transition-colors min-h-[48px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Demonstration Quick Fill Action */}
          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between text-xs text-[#007F73]">
            <span>Demo Patient: ananya.rao@example.com</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="font-bold underline hover:text-[#006b60] cursor-pointer"
            >
              Fill Demo Credentials
            </button>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#007F73] hover:bg-[#006b60] text-white font-bold text-base rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[50px] disabled:opacity-75"
            >
              <span>{loading ? 'Authenticating Patient...' : 'Sign In to Patient Portal'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Create Account Link */}
          <div className="pt-4 border-t border-slate-100 text-center text-sm text-slate-600">
            <span>New patient to Sri Sathya Sai Seva clinics? </span>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-bold text-[#007F73] hover:underline cursor-pointer"
            >
              Create Patient Account
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Helper Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <HelpCircle className="w-5 h-5 text-[#007F73]" />
                <span>Password Recovery Assistance</span>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              In this community pilot phase, passwords can be reset by providing your registered Indian mobile number at the clinic reception desk, or by contacting the Padmanabhanagar Seva helpline:
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold text-[#14243A] flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#007F73]" />
              <span>+91 80 2669 4410 (Seva Helpline)</span>
            </div>
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#007F73] text-white text-xs font-bold hover:bg-[#006b60] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
