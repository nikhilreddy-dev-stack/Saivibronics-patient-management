import React, { useState, useMemo } from 'react';
import { PageId } from '../types';
import { INITIAL_CLINICS } from '../data/mockData';
import {
  Search,
  Calendar,
  UserCheck,
  FileText,
  MapPin,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  User,
  UserPlus,
  FolderHeart,
  Eye,
  Pill,
  History,
  BookOpen,
  ChevronRight,
  X,
  Stethoscope
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectClinic: (clinicId: string) => void;
  onSearchClinics?: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectClinic,
  onSearchClinics,
}) => {
  const [clinicQuery, setClinicQuery] = useState('');

  // Filter preview clinics based on search input
  const previewClinics = useMemo(() => {
    const q = clinicQuery.toLowerCase().trim();
    if (!q) {
      // Default: show the top 3 clinics
      return INITIAL_CLINICS.slice(0, 3);
    }
    const filtered = INITIAL_CLINICS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q) ||
        c.pincode.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.specialties.some((s) => s.toLowerCase().includes(q))
    );
    return filtered.slice(0, 3);
  }, [clinicQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchClinics) {
      onSearchClinics(clinicQuery);
    } else {
      onNavigate('find-clinic');
    }
  };

  return (
    <div className="bg-[#F7FAFC] text-[#14243A] selection:bg-[#E9F8F4] selection:text-[#007F73]">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column (55% content width) */}
            <div className="lg:col-span-7 space-y-6 lg:space-y-7">
              
              {/* Quiet, unboxed eyebrow */}
              <div className="text-xs sm:text-sm font-bold tracking-wider text-[#007F73] uppercase flex items-center gap-2">
                <span>COMMUNITY CARE</span>
                <span className="text-slate-300">·</span>
                <span>PADMANABHANAGAR, BENGALURU</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-[#14243A] tracking-tight leading-[1.12] text-balance font-['Plus_Jakarta_Sans',sans-serif]">
                Compassionate Care. <br className="hidden sm:inline" />
                Simpler Patient Management.
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-base sm:text-lg text-[#536579] leading-relaxed max-w-xl">
                Discover participating clinics, book your visit, and access your care information through one simple platform built to serve the community.
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('find-clinic')}
                  className="px-6 py-3.5 text-base font-bold text-white bg-[#007F73] hover:bg-[#006b60] rounded-xl shadow-xs transition-colors inline-flex items-center gap-2.5 cursor-pointer min-h-[50px]"
                >
                  <Search className="w-5 h-5 text-teal-100" />
                  <span>Find a Clinic</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  className="px-6 py-3.5 text-base font-bold text-[#14243A] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer min-h-[50px]"
                >
                  <User className="w-4.5 h-4.5 text-[#536579]" />
                  <span>Patient Sign In</span>
                </button>
              </div>

              {/* Restrained Reassurance Line */}
              <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#536579] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#007F73] shrink-0" />
                <span>Designed for accessible, community-centred care.</span>
              </div>
            </div>

            {/* Right Column (45% content width) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-white">
                <div className="aspect-4/3 sm:aspect-16/11 lg:aspect-4/3 bg-slate-100 relative">
                  <img
                    src="/src/assets/images/consultation_wellness_1793209990719.jpg"
                    alt="Warm, compassionate healthcare consultation with elderly patient and practitioner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#14243A]/80 via-transparent to-transparent" />
                  
                  {/* Subtle, non-sensitive feature badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-md text-left">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-bold text-[#007F73] uppercase tracking-wider">
                          Pilot Location
                        </div>
                        <div className="text-sm font-bold text-[#14243A]">
                          Padmanabhanagar Seva Clinic
                        </div>
                        <div className="text-xs text-[#536579] mt-0.5">
                          14th Main, Bengaluru 560070 · Ground Floor Access
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectClinic('clinic-padmanabhanagar');
                          onNavigate('clinic-details');
                        }}
                        className="p-2 rounded-lg bg-[#E9F8F4] text-[#007F73] hover:bg-teal-100 transition-colors shrink-0 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                        title="View clinic details"
                        aria-label="View Padmanabhanagar Clinic details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. QUICK-ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Action 1 */}
          <button
            type="button"
            onClick={() => onNavigate('find-clinic')}
            className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#007F73]/40 transition-all text-left flex items-start gap-4 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E9F8F4] text-[#007F73] flex items-center justify-center shrink-0 border border-teal-100 group-hover:bg-[#007F73] group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-base font-bold text-[#14243A] group-hover:text-[#007F73] transition-colors flex items-center gap-1.5">
                <span>Find a Clinic</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs sm:text-sm text-[#536579]">
                Explore participating locations across Bengaluru.
              </p>
            </div>
          </button>

          {/* Action 2 */}
          <button
            type="button"
            onClick={() => {
              onSelectClinic('clinic-padmanabhanagar');
              onNavigate('clinic-details');
            }}
            className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#007F73]/40 transition-all text-left flex items-start gap-4 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E9F8F4] text-[#007F73] flex items-center justify-center shrink-0 border border-teal-100 group-hover:bg-[#007F73] group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-base font-bold text-[#14243A] group-hover:text-[#007F73] transition-colors flex items-center gap-1.5">
                <span>Book an Appointment</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs sm:text-sm text-[#536579]">
                Choose a suitable available slot and token.
              </p>
            </div>
          </button>

          {/* Action 3 */}
          <button
            type="button"
            onClick={() => onNavigate('patient-dashboard')}
            className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#007F73]/40 transition-all text-left flex items-start gap-4 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E9F8F4] text-[#007F73] flex items-center justify-center shrink-0 border border-teal-100 group-hover:bg-[#007F73] group-hover:text-white transition-colors">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-base font-bold text-[#14243A] group-hover:text-[#007F73] transition-colors flex items-center gap-1.5">
                <span>Access Patient Portal</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs sm:text-sm text-[#536579]">
                View your permitted care information and visits.
              </p>
            </div>
          </button>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2.5">
          <div className="text-xs font-bold text-[#007F73] tracking-wider uppercase">
            PATIENT JOURNEY
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14243A] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Your care journey, made simpler.
          </h2>
          <p className="text-sm sm:text-base text-[#536579] leading-relaxed">
            Follow four organized steps from discovering a nearby clinic to accessing follow-up consultation records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 01 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-[#007F73] font-mono">01</span>
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#536579] flex items-center justify-center border border-slate-100">
                  <Search className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#14243A]">Find a Clinic</h3>
              <p className="text-xs sm:text-sm text-[#536579] leading-relaxed">
                Search by clinic name, locality, or PIN code. Check opening hours and wheelchair facilities.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('find-clinic')}
              className="text-xs font-bold text-[#007F73] hover:text-[#006b60] inline-flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Explore Centers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 02 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-[#007F73] font-mono">02</span>
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#536579] flex items-center justify-center border border-slate-100">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#14243A]">Register or Sign In</h3>
              <p className="text-xs sm:text-sm text-[#536579] leading-relaxed">
                Access the appropriate patient account workflow to view past tokens and manage contact info.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('signin')}
              className="text-xs font-bold text-[#007F73] hover:text-[#006b60] inline-flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Account Workflows</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 03 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-[#007F73] font-mono">03</span>
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#536579] flex items-center justify-center border border-slate-100">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#14243A]">Book Your Visit</h3>
              <p className="text-xs sm:text-sm text-[#536579] leading-relaxed">
                Choose an available appointment or follow the clinic&apos;s supported booking process.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectClinic('clinic-padmanabhanagar');
                onNavigate('clinic-details');
              }}
              className="text-xs font-bold text-[#007F73] hover:text-[#006b60] inline-flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Schedule Visit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 04 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-[#007F73] font-mono">04</span>
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#536579] flex items-center justify-center border border-slate-100">
                  <FolderHeart className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#14243A]">Stay Organised</h3>
              <p className="text-xs sm:text-sm text-[#536579] leading-relaxed">
                Access permitted appointment information and care records through the patient portal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('patient-dashboard')}
              className="text-xs font-bold text-[#007F73] hover:text-[#006b60] inline-flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>View Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. CLINIC DISCOVERY FEATURE */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-bold text-[#007F73] tracking-wider uppercase">
                PARTICIPATING LOCATIONS
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14243A] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Find care closer to you.
              </h2>
              <p className="text-sm sm:text-base text-[#536579]">
                Explore participating clinics and find the location that suits your needs.
              </p>
            </div>

            {/* Interactive Clinic Search Field */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto shrink-0 flex items-center gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="w-4 h-4 text-[#536579] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Locality, clinic name, or PIN..."
                  value={clinicQuery}
                  onChange={(e) => setClinicQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#007F73] focus:border-transparent min-h-[44px] bg-slate-50/50"
                  aria-label="Search clinics by name, locality, or PIN code"
                />
                {clinicQuery && (
                  <button
                    type="button"
                    onClick={() => setClinicQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4.5 py-2.5 bg-[#007F73] hover:bg-[#006b60] text-white text-sm font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer min-h-[44px]"
              >
                Search Clinics
              </button>
            </form>
          </div>

          {/* Compact Clinic Cards Preview */}
          {previewClinics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previewClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[#007F73] uppercase tracking-wider">
                        {clinic.locality}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        PIN {clinic.pincode}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#14243A] leading-snug">
                      {clinic.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#536579] line-clamp-2">
                      {clinic.address}
                    </p>

                    {/* Supported Services Preview */}
                    <div className="pt-1 flex flex-wrap gap-1.5 text-xs text-[#536579]">
                      {clinic.specialties.slice(0, 2).map((spec, i) => (
                        <span key={i} className="bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700">
                          {spec}
                        </span>
                      ))}
                      {clinic.specialties.length > 2 && (
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] font-medium text-slate-500">
                          +{clinic.specialties.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {clinic.activePractitionersCount} volunteer practitioners
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectClinic(clinic.id);
                        onNavigate('clinic-details');
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#E9F8F4] hover:bg-teal-100 text-[#007F73] text-xs font-bold transition-colors cursor-pointer min-h-[36px] flex items-center gap-1.5"
                    >
                      <span>View Clinic</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <p className="text-sm font-semibold text-[#14243A]">
                No participating clinics found matching &ldquo;{clinicQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setClinicQuery('')}
                className="px-4 py-2 bg-white border border-slate-300 text-xs font-bold text-[#14243A] rounded-lg hover:bg-slate-100"
              >
                Reset Search Filter
              </button>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 font-medium">
              * Demonstration clinic records representative of Sri Sathya Sai Seva centers in Bengaluru.
            </div>
            <button
              type="button"
              onClick={() => onNavigate('find-clinic')}
              className="text-sm font-bold text-[#007F73] hover:text-[#006b60] inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span>Browse All Clinics in Clinic Finder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. PATIENT PORTAL PROMOTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold text-[#007F73] tracking-wider uppercase">
              PATIENT DASHBOARD PREVIEW
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14243A] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Your care information, organised in one place.
            </h2>
            <p className="text-sm sm:text-base text-[#536579] leading-relaxed">
              Designed especially for senior citizens and family caregivers, the patient portal helps you keep track of your upcoming visits, past records, and holistic health instructions in a clear, readable environment.
            </p>

            {/* Genuine Capabilities List */}
            <div className="space-y-3.5 pt-1 text-sm text-[#14243A]">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-[#E9F8F4] text-[#007F73] flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-bold">Appointment overview:</strong>
                  <span className="text-[#536579] ml-1">
                    Check your token number, consultation shift, and assigned seva practitioner.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-[#E9F8F4] text-[#007F73] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-bold">Medical records:</strong>
                  <span className="text-[#536579] ml-1">
                    Review documented consultation notes and previous visit summaries.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-[#E9F8F4] text-[#007F73] flex items-center justify-center shrink-0 mt-0.5">
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-bold">Prescriptions & remedies:</strong>
                  <span className="text-[#536579] ml-1">
                    View recommended Vibronics remedies (e.g., CC12.1, CC20.3) and daily dosage guidance.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-[#E9F8F4] text-[#007F73] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-bold">Profile management:</strong>
                  <span className="text-[#536579] ml-1">
                    Keep primary phone numbers, home address, and emergency contacts current.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-[#E9F8F4] text-[#007F73] flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-bold">Accessibility options:</strong>
                  <span className="text-[#536579] ml-1">
                    Adjust text scaling (A / A+ / A++) and toggle high-contrast display for enhanced readability.
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('patient-dashboard')}
                className="px-6 py-3.5 bg-[#007F73] hover:bg-[#006b60] text-white font-bold text-sm sm:text-base rounded-xl shadow-xs transition-colors cursor-pointer min-h-[48px] flex items-center gap-2"
              >
                <span>Explore Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-[#14243A] font-bold text-sm sm:text-base rounded-xl transition-colors cursor-pointer min-h-[48px]"
              >
                <span>Sign In with ID</span>
              </button>
            </div>
          </div>

          {/* Right Column: Faithful Interface Preview Mockup */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg p-5 sm:p-6 space-y-4">
              
              {/* Mockup Header: Patient Profile & Accessibility */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#007F73] text-white flex items-center justify-center font-bold text-sm">
                    AR
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#14243A]">Smt. Ananya Rao</div>
                    <div className="text-xs text-slate-500 font-mono">ID: SSSO-BLR-2026-0842</div>
                  </div>
                </div>

                {/* Text Sizer Preview */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold text-slate-600">
                  <span className="px-1.5 py-0.5 bg-white text-[#007F73] rounded shadow-2xs">A</span>
                  <span className="px-1.5 py-0.5">A+</span>
                  <span className="px-1.5 py-0.5">A++</span>
                </div>
              </div>

              {/* Mockup Upcoming Appointment Card */}
              <div className="p-4 rounded-xl bg-[#E9F8F4] border border-teal-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#007F73]">
                    Next Confirmed Token
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white text-[#007F73] rounded border border-teal-200">
                    Token #TK-04
                  </span>
                </div>
                <div className="text-sm font-bold text-[#14243A]">
                  Padmanabhanagar Seva Clinic
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#536579]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#007F73]" />
                    <span>09:30 AM Slot</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#007F73]" />
                    <span>Dr. K. S. Ramesh</span>
                  </div>
                </div>
              </div>

              {/* Mockup 6-Tile Care Portfolio */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Care Portfolio Quick Actions
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                    <MapPin className="w-5 h-5 text-[#007F73] mx-auto" />
                    <div className="text-xs font-bold text-[#14243A]">Clinics</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                    <Calendar className="w-5 h-5 text-sky-700 mx-auto" />
                    <div className="text-xs font-bold text-[#14243A]">Visits</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                    <FileText className="w-5 h-5 text-emerald-700 mx-auto" />
                    <div className="text-xs font-bold text-[#14243A]">Records</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                    <Pill className="w-5 h-5 text-amber-700 mx-auto" />
                    <div className="text-xs font-bold text-[#14243A]">Remedies</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                    <History className="w-5 h-5 text-indigo-700 mx-auto" />
                    <div className="text-xs font-bold text-[#14243A]">History</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                    <BookOpen className="w-5 h-5 text-purple-700 mx-auto" />
                    <div className="text-xs font-bold text-[#14243A]">Guidance</div>
                  </div>
                </div>
              </div>

              <div className="pt-1 text-center">
                <span className="text-[11px] text-slate-400">
                  Fictional patient demonstration preview · Real medical data is not transmitted
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TRUST AND ACCESSIBILITY SECTION */}
      <section id="trust-principles" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2.5">
            <div className="text-xs font-bold text-[#007F73] tracking-wider uppercase">
              DESIGN PRINCIPLES
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14243A] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Built with care, designed for accessibility.
            </h2>
            <p className="text-sm sm:text-base text-[#536579] leading-relaxed">
              Guided by Sri Sathya Sai Organisation&apos;s commitment to selfless service, the platform prioritizes simplicity, dignity, and accessibility for patients of all ages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Principle 1 */}
            <div className="bg-[#F7FAFC] p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#E9F8F4] text-[#007F73] flex items-center justify-center border border-teal-100">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#14243A]">
                Community-Centred Service
              </h3>
              <p className="text-xs sm:text-sm text-[#536579] leading-relaxed">
                Offered in the spirit of selfless service (Seva) to support community wellness and assist patients across Bengaluru.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="bg-[#F7FAFC] p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#E9F8F4] text-[#007F73] flex items-center justify-center border border-teal-100">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#14243A]">
                Clear & Accessible Interfaces
              </h3>
              <p className="text-xs sm:text-sm text-[#536579] leading-relaxed">
                Senior-friendly typography, high-contrast visibility options, and 48px+ touch targets designed for low-vision ease.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="bg-[#F7FAFC] p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#E9F8F4] text-[#007F73] flex items-center justify-center border border-teal-100">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#14243A]">
                Organised Workflows
              </h3>
              <p className="text-xs sm:text-sm text-[#536579] leading-relaxed">
                Structured consultation token scheduling to minimize waiting times and provide transparent clinic operations.
              </p>
            </div>

            {/* Principle 4 */}
            <div className="bg-[#F7FAFC] p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#E9F8F4] text-[#007F73] flex items-center justify-center border border-teal-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#14243A]">
                Respect for Privacy
              </h3>
              <p className="text-xs sm:text-sm text-[#536579] leading-relaxed">
                Transparent prototype architecture with strictly in-memory session data, without advertising or third-party trackers.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
