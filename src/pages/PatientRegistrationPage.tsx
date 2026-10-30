import React, { useState } from 'react';
import { PageId, PatientProfile, Clinic } from '../types';
import { INITIAL_CLINICS } from '../data/mockData';
import {
  UserPlus,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  Accessibility,
  Globe,
  MapPin
} from 'lucide-react';

interface PatientRegistrationPageProps {
  onNavigate: (page: PageId) => void;
  onRegisterSuccess?: (patient: PatientProfile) => void;
  clinics?: Clinic[];
}

export const PatientRegistrationPage: React.FC<PatientRegistrationPageProps> = ({
  onNavigate,
  onRegisterSuccess,
  clinics = INITIAL_CLINICS,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Female',
    preferredLanguage: 'Kannada / English',
    accessibilityNeeds: 'None',
    mobileNumber: '',
    email: '',
    locality: 'Padmanabhanagar',
    pincode: '560070',
    emergencyContactName: '',
    emergencyContactPhone: '',
    preferredClinicId: clinics[0]?.id || 'clinic-padmanabhanagar',
    password: '',
    confirmPassword: '',
    consentAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState<PatientProfile | null>(null);

  const selectedClinic = clinics.find((c) => c.id === formData.preferredClinicId) || clinics[0];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter at least 3 characters.';
    }

    // Mobile Number (Indian mobile validation: 10 digits starting with 6, 7, 8, or 9)
    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanMobile) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (cleanMobile.length !== 10) {
      newErrors.mobileNumber = 'Please enter a 10-digit mobile number.';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      newErrors.mobileNumber = 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.';
    }

    // Email Address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. name@example.com).';
    }

    // PIN Code
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN code is required.';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit Bengaluru PIN code (e.g. 560070).';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Consent
    if (!formData.consentAccepted) {
      newErrors.consentAccepted = 'Consent is required to create a patient profile.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);

        // Generate clean patient ID
        const generatedId = `SSSO-BLR-2026-${Math.floor(2000 + Math.random() * 8000)}`;

        const newProfile: PatientProfile = {
          id: generatedId,
          fullName: formData.fullName.trim(),
          mobileNumber: formData.mobileNumber.replace(/\D/g, ''),
          email: formData.email.trim(),
          age: formData.age ? parseInt(formData.age, 10) : undefined,
          gender: formData.gender,
          preferredLanguage: formData.preferredLanguage,
          preferredClinicId: formData.preferredClinicId,
          preferredClinicName: selectedClinic.name,
          address: `${formData.locality}, Bengaluru`,
          pincode: formData.pincode.trim(),
          emergencyContactName: formData.emergencyContactName.trim() || undefined,
          emergencyContactPhone: formData.emergencyContactPhone.trim() || undefined,
          accessibilityNeeds: formData.accessibilityNeeds !== 'None' ? formData.accessibilityNeeds : undefined,
          registeredDate: new Date().toISOString().split('T')[0],
        };

        setRegisteredPatient(newProfile);
        if (onRegisterSuccess) {
          onRegisterSuccess(newProfile);
        }
      }, 500);
    } else {
      // Scroll to the first error
      const firstError = document.querySelector('.border-rose-400');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      {/* Return to Home / Sign In */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="text-xs sm:text-sm text-slate-500 font-medium">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('signin')}
            className="text-[#007F73] font-bold hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Header with Saivibronics Branding */}
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
            Patient Registration
          </h1>
          <p className="text-sm sm:text-base text-[#536579] leading-relaxed">
            Register your profile to book consultation tokens, receive personalized Sai Vibrionics seva remedies, and view your consultation history.
          </p>
        </div>

        {!registeredPatient ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-8 text-sm">
            {/* SECTION A: BASIC PATIENT INFORMATION */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#14243A] uppercase tracking-wider">
                <User className="w-4.5 h-4.5 text-[#007F73]" />
                <span>Section A: Basic Patient Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="reg-fullName" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Full Name (As per Identification) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Smt. Ananya Rao"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white transition-colors min-h-[48px] ${
                      errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-rose-600 text-xs font-semibold mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="reg-age" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Age in Years (Optional)
                  </label>
                  <input
                    id="reg-age"
                    type="number"
                    min={1}
                    max={120}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 58"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white min-h-[48px]"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="reg-gender" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Gender
                  </label>
                  <select
                    id="reg-gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white cursor-pointer min-h-[48px]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Preferred Language */}
                <div>
                  <label htmlFor="reg-language" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Preferred Consultation Language
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="reg-language"
                      value={formData.preferredLanguage}
                      onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white cursor-pointer min-h-[48px]"
                    >
                      <option value="Kannada / English">ಕನ್ನಡ / English (Kannada & English)</option>
                      <option value="Kannada">ಕನ್ನಡ (Kannada Only)</option>
                      <option value="English">English</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Tamil">தமிழ் (Tamil)</option>
                    </select>
                  </div>
                </div>

                {/* Accessibility Assistance Preference */}
                <div>
                  <label htmlFor="reg-accessibility" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Accessibility Preference
                  </label>
                  <div className="relative">
                    <Accessibility className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="reg-accessibility"
                      value={formData.accessibilityNeeds}
                      onChange={(e) => setFormData({ ...formData, accessibilityNeeds: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white cursor-pointer min-h-[48px]"
                    >
                      <option value="None">None / Independent Mobility</option>
                      <option value="Wheelchair ramp & elevator">Wheelchair Ramp & Elevator Access</option>
                      <option value="Senior citizen priority escort">Senior Citizen Volunteer Priority Escort</option>
                      <option value="Large-print instructions">Large-Print Instructions</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: CONTACT INFORMATION */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#14243A] uppercase tracking-wider">
                <Phone className="w-4.5 h-4.5 text-[#007F73]" />
                <span>Section B: Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Number */}
                <div>
                  <label htmlFor="reg-mobile" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Mobile Number (India) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                      +91
                    </span>
                    <input
                      id="reg-mobile"
                      type="tel"
                      maxLength={10}
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="9845012345"
                      className={`w-full pl-13 pr-4 py-3 bg-slate-50 border rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white transition-colors min-h-[48px] ${
                        errors.mobileNumber ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-rose-600 text-xs font-semibold mt-1">{errors.mobileNumber}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="reg-email" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white transition-colors min-h-[48px] ${
                      errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-rose-600 text-xs font-semibold mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Locality in Bengaluru */}
                <div>
                  <label htmlFor="reg-locality" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Locality / Area
                  </label>
                  <input
                    id="reg-locality"
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Padmanabhanagar, Banashankari"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white min-h-[48px]"
                  />
                </div>

                {/* PIN Code */}
                <div>
                  <label htmlFor="reg-pincode" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    PIN Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-pincode"
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="560070"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white min-h-[48px] ${
                      errors.pincode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-rose-600 text-xs font-semibold mt-1">{errors.pincode}</p>
                  )}
                </div>

                {/* Emergency Contact Name */}
                <div>
                  <label htmlFor="reg-emergencyName" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Emergency Contact Name (Optional)
                  </label>
                  <input
                    id="reg-emergencyName"
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="Family member / Caregiver"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white min-h-[48px]"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label htmlFor="reg-emergencyPhone" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Emergency Contact Phone (Optional)
                  </label>
                  <input
                    id="reg-emergencyPhone"
                    type="tel"
                    maxLength={10}
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white min-h-[48px]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION C: PREFERRED SEVA CLINIC */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#14243A] uppercase tracking-wider">
                <Building2 className="w-4.5 h-4.5 text-[#007F73]" />
                <span>Section C: Preferred Seva Clinic</span>
              </div>

              <div>
                <label htmlFor="reg-clinic" className="block font-bold text-slate-800 mb-1.5 text-sm">
                  Primary Seva Center
                </label>
                <select
                  id="reg-clinic"
                  value={formData.preferredClinicId}
                  onChange={(e) => setFormData({ ...formData, preferredClinicId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white cursor-pointer min-h-[48px]"
                >
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.locality} - {c.pincode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Clinic Confirmation Display Box */}
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#007F73] shrink-0 mt-0.5" />
                <div className="text-xs text-[#536579] space-y-1">
                  <div className="font-bold text-[#14243A] text-sm">
                    {selectedClinic.name}
                  </div>
                  <div>{selectedClinic.address}</div>
                  <div className="text-[#007F73] font-semibold">
                    Operating Hours: {selectedClinic.operatingHours}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION D: ACCOUNT SECURITY */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#14243A] uppercase tracking-wider">
                <Lock className="w-4.5 h-4.5 text-[#007F73]" />
                <span>Section D: Account Security</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Account Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className={`w-full pl-4 pr-11 py-3 bg-slate-50 border rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white transition-colors min-h-[48px] ${
                        errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-rose-600 text-xs font-semibold mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reg-confirmPassword" className="block font-bold text-slate-800 mb-1.5 text-sm">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Re-enter same password"
                      className={`w-full pl-4 pr-11 py-3 bg-slate-50 border rounded-2xl text-base text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:bg-white transition-colors min-h-[48px] ${
                        errors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-rose-600 text-xs font-semibold mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION E: CONSENT & SEVA DECLARATION */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#14243A] uppercase tracking-wider">
                <ShieldCheck className="w-4.5 h-4.5 text-[#007F73]" />
                <span>Section E: Consent & Seva Declaration</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    id="reg-consent"
                    type="checkbox"
                    checked={formData.consentAccepted}
                    onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
                    className="mt-0.5 h-5 w-5 rounded border-slate-300 text-[#007F73] focus:ring-[#007F73] cursor-pointer"
                  />
                  <label htmlFor="reg-consent" className="cursor-pointer font-medium leading-relaxed">
                    I consent to Sri Sathya Sai Organisation seva volunteers maintaining my consultation and appointment records for holistic Vibrionics care and wellness tracking.
                  </label>
                </div>
                {errors.consentAccepted && (
                  <p className="text-rose-600 text-xs font-semibold">{errors.consentAccepted}</p>
                )}

                <div className="text-[11px] text-slate-500 leading-normal pt-1 border-t border-slate-200">
                  Data Privacy Commitment: Your consultation records are held in accordance with Sri Sathya Sai Seva medical volunteer principles. We do not sell or transmit your information to third-party commercial entities.
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Fields marked with <span className="text-rose-500 font-bold">*</span> are required.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#007F73] hover:bg-[#006b60] text-white font-bold text-base rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[50px] disabled:opacity-75"
              >
                <span>{isSubmitting ? 'Creating Patient Profile...' : 'Complete Registration'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS SCREEN */
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 bg-[#E9F8F4] text-[#007F73] rounded-3xl flex items-center justify-center mx-auto border border-teal-200 shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#007F73] uppercase tracking-wider">
                Registration Successful
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14243A]">
                Welcome, {registeredPatient.fullName}!
              </h2>
              <p className="text-sm sm:text-base text-[#536579] max-w-md mx-auto">
                Your Saivibronics patient account has been created and registered with the Padmanabhanagar seva network.
              </p>
            </div>

            {/* Structured Patient Identity Card */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-sm space-y-3 max-w-md mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assigned Patient ID:
                </span>
                <span className="font-mono font-bold text-base text-[#007F73] bg-white px-2.5 py-1 rounded-lg border border-teal-200">
                  {registeredPatient.id}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500">Primary Center:</span>
                <span className="font-bold text-[#14243A] text-right">{registeredPatient.preferredClinicName}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-bold text-[#14243A]">+91 {registeredPatient.mobileNumber}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500">Consultation Language:</span>
                <span className="font-bold text-[#14243A]">{registeredPatient.preferredLanguage}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('patient-dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#007F73] hover:bg-[#006b60] text-white font-bold text-sm sm:text-base rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Proceed to Patient Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('find-clinic')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-[#14243A] font-bold text-sm sm:text-base rounded-2xl transition-colors cursor-pointer min-h-[48px]"
              >
                <span>Book a Consultation Slot</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
