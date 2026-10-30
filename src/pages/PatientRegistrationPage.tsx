import React, { useState } from 'react';
import { PageId } from '../types';
import { UserPlus, ShieldAlert, CheckCircle2, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface PatientRegistrationPageProps {
  onNavigate: (page: PageId) => void;
}

export const PatientRegistrationPage: React.FC<PatientRegistrationPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    preferredLocality: 'Padmanabhanagar',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter at least 3 characters.';
    }

    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanMobile) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (cleanMobile.length !== 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit Indian mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmittedData({ ...formData });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Back button */}
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
        {/* Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Registration
          </h1>
          <p className="text-sm text-slate-600">
            Create a prototype patient profile for Sri Sathya Sai Vibronics clinics in Bengaluru.
          </p>
        </div>

        {/* Prototype Privacy & Security Notice */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Prototype Demonstration Notice</span>
          </div>
          <p className="leading-relaxed">
            This platform is an academic engineering prototype. <strong>It does not create a real account or store submitted personal information in a live database.</strong> Form entries remain entirely local to your active browser view. Do not enter confidential real-world credentials.
          </p>
        </div>

        {!submittedData ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-5 text-xs">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Smt. Ananya Rao"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 transition-colors ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.fullName && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Mobile Number & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobileNumber" className="block font-semibold text-slate-700 mb-1">
                  Mobile Number (India) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                    +91
                  </span>
                  <input
                    id="mobileNumber"
                    type="tel"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="9845012345"
                    className={`w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 transition-colors ${
                      errors.mobileNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-rose-600 text-[11px] mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="age" className="block font-semibold text-slate-700 mb-1">
                  Age (Optional)
                </label>
                <input
                  id="age"
                  type="number"
                  min={1}
                  max={120}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 58"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ananya.rao@example.com"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 transition-colors ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.email && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Preferred Locality */}
            <div>
              <label htmlFor="preferredLocality" className="block font-semibold text-slate-700 mb-1">
                Preferred Seva Clinic Locality
              </label>
              <select
                id="preferredLocality"
                value={formData.preferredLocality}
                onChange={(e) => setFormData({ ...formData, preferredLocality: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer"
              >
                <option value="Padmanabhanagar">Padmanabhanagar (Pilot Center)</option>
                <option value="Banashankari 2nd Stage">Banashankari 2nd Stage</option>
                <option value="Basavanagudi">Basavanagudi</option>
                <option value="Jayanagar 4th Block">Jayanagar 4th Block</option>
                <option value="Malleshwaram">Malleshwaram</option>
              </select>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 transition-colors ${
                    errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-rose-600 text-[11px] mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 transition-colors ${
                    errors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-rose-600 text-[11px] mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-slate-500 text-center sm:text-left">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  className="font-semibold text-teal-700 hover:underline cursor-pointer"
                >
                  Sign In to Portal
                </button>
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Submit Demo Registration
              </button>
            </div>
          </form>
        ) : (
          /* Submission Success State */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-3xl flex items-center justify-center mx-auto border border-teal-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Registration Form Validated
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome, {submittedData.fullName}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your demonstration patient profile has been simulated. You can now explore the Patient Dashboard preview with upcoming appointments and consultation histories.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Identifier:</span>
                <span className="font-mono font-bold text-slate-900">SSSO-BLR-2026-0842</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Locality:</span>
                <span className="font-semibold text-slate-900">{submittedData.preferredLocality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Contact:</span>
                <span className="font-semibold text-slate-900">+91 {submittedData.mobileNumber}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('patient-dashboard')}
                className="w-full sm:w-auto px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Patient Dashboard Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSubmittedData(null)}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                Back to Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
