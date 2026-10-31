import React, { useState, useMemo } from 'react';
import { PageId, Clinic } from '../types';
import { INITIAL_CLINICS, ALL_SERVICES } from '../data/mockData';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  X,
  Stethoscope,
  Building2,
  Navigation,
  FileText,
  User,
  ShieldCheck,
  HeartHandshake,
  UserCheck,
  AlertCircle,
  Accessibility
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectClinic: (clinicId: string) => void;
  onSearchClinics?: (query: string, service?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectClinic,
  onSearchClinics,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('All Services');
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  // Filter preview clinics based on current query and service
  const previewClinics = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const srv = selectedService;

    return INITIAL_CLINICS.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q) ||
        c.pincode.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.specialties.some((s) => s.toLowerCase().includes(q));

      const matchesService =
        srv === 'All Services' ||
        c.specialties.some((s) => s.toLowerCase().includes(srv.toLowerCase()));

      return matchesQuery && matchesService;
    });
  }, [searchQuery, selectedService]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchClinics) {
      onSearchClinics(searchQuery, selectedService);
    } else {
      onNavigate('find-clinic');
    }
  };

  const handleQuickLocalityClick = (locality: string) => {
    setSearchQuery(locality);
    if (onSearchClinics) {
      onSearchClinics(locality, selectedService);
    }
  };

  const handleRequestLocation = () => {
    setShowLocationDialog(true);
  };

  const confirmLocationAccess = () => {
    setShowLocationDialog(false);
    if ('geolocation' in navigator) {
      setLocationNotice('Locating nearest participating seva center...');
      navigator.geolocation.getCurrentPosition(
        () => {
          setSearchQuery('Padmanabhanagar');
          setLocationNotice('Showing clinics near your location (Padmanabhanagar, Bengaluru).');
          setTimeout(() => setLocationNotice(null), 5000);
        },
        () => {
          setLocationNotice('Location permission not granted. Showing Padmanabhanagar pilot center.');
          setSearchQuery('Padmanabhanagar');
          setTimeout(() => setLocationNotice(null), 5000);
        },
        { timeout: 7000 }
      );
    } else {
      setLocationNotice('Geolocation is not supported by your browser. Showing Padmanabhanagar pilot center.');
      setSearchQuery('Padmanabhanagar');
      setTimeout(() => setLocationNotice(null), 5000);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800">
      
      {/* 1. COMPACT SERVICE-FIRST HERO SECTION */}
      <section className="relative bg-white border-b border-slate-200 pt-8 sm:pt-12 pb-14 sm:pb-16 overflow-hidden">
        {/* Soft background tint for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4 text-left">
            {/* Introductory Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <span>Sri Sathya Sai Seva</span>
              <span className="text-blue-300">|</span>
              <span className="text-teal-700">Patient Care Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.15] font-['Plus_Jakarta_Sans',sans-serif]">
              Holistic Vibronics Healthcare for Your Community
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Discover participating Sri Sathya Sai Vibronics seva clinics, book consultation slots, connect with certified volunteer practitioners, and access your personal medical records.
            </p>

            {/* Prominent Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('find-clinic')}
                className="px-5 sm:px-6 py-3 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Search className="w-4.5 h-4.5 text-blue-100" />
                <span>Find a Clinic</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectClinic('clinic-padmanabhanagar');
                  onNavigate('clinic-details');
                }}
                className="px-5 sm:px-6 py-3 text-sm sm:text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Calendar className="w-4.5 h-4.5 text-blue-600" />
                <span>Book an Appointment</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="px-4.5 py-3 text-sm sm:text-base font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer min-h-[48px]"
              >
                <User className="w-4 h-4" />
                <span>Patient Sign In</span>
              </button>
            </div>
          </div>

          {/* 2. PROMINENT CLINIC SEARCH EXPERIENCE (Travel-Booking Inspired Discovery Card) */}
          <div className="mt-8 sm:mt-10 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Search Clinics & Availability</span>
              </div>
              <button
                type="button"
                onClick={handleRequestLocation}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer self-start sm:self-auto py-1 px-2.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Use My Location</span>
              </button>
            </div>

            {/* Location Notice Banner if active */}
            {locationNotice && (
              <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>{locationNotice}</span>
                </div>
                <button
                  onClick={() => setLocationNotice(null)}
                  className="text-blue-700 hover:text-blue-900 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Main Search Inputs Grid */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
              {/* Location Input (6 cols on desktop) */}
              <div className="md:col-span-6 relative">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Location / PIN / Clinic Name
                </label>
                <div className="relative">
                  <MapPin className="w-4.5 h-4.5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter locality, PIN code, or clinic name"
                    className="w-full pl-10 pr-9 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px] bg-slate-50/50"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Clear location search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Service Filter (4 cols on desktop) */}
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Service Category
                </label>
                <div className="relative">
                  <Stethoscope className="w-4.5 h-4.5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px] cursor-pointer"
                  >
                    {ALL_SERVICES.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button (2 cols on desktop) */}
              <div className="md:col-span-2 flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-xs transition-colors cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Clinics</span>
                </button>
              </div>
            </form>

            {/* Quick Locality Shortcut Chips */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500">Popular Localities:</span>
              {['Padmanabhanagar', 'Banashankari', 'Basavanagudi', 'Jayanagar', 'Malleshwaram'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleQuickLocalityClick(loc)}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                    searchQuery.toLowerCase() === loc.toLowerCase()
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {loc} {loc === 'Padmanabhanagar' && '(Pilot)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A: DISCOVER CLINICS */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              Participating Clinics
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] mt-1">
              Explore Seva Clinics Near You
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Showing active community seva centers with dedicated practitioners and volunteer schedules.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('find-clinic')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer self-start sm:self-auto py-2"
          >
            <span>View All Clinics ({INITIAL_CLINICS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Clinic Cards Grid */}
        {previewClinics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewClinics.slice(0, 3).map((clinic: Clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Status & Locality Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {clinic.status}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      PIN {clinic.pincode}
                    </span>
                  </div>

                  {/* Clinic Name */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {clinic.name}
                  </h3>

                  {/* Locality & Address */}
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{clinic.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{clinic.operatingHours}</span>
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {clinic.specialties.slice(0, 2).map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                    {clinic.specialties.length > 2 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-500">
                        +{clinic.specialties.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Senior Accessibility Indicator */}
                  {clinic.seniorAccessible && (
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                      <Accessibility className="w-3.5 h-3.5" />
                      <span>Senior-Friendly & Wheelchair Accessible</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectClinic(clinic.id);
                      onNavigate('clinic-details');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors cursor-pointer text-center"
                  >
                    View Clinic
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectClinic(clinic.id);
                      onNavigate('clinic-details');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <span>Book Slot</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">
              No participating clinics found matching &ldquo;{searchQuery}&rdquo; in {selectedService}.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedService('All Services');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 rounded-xl"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* SECTION B: HOW THE SERVICE WORKS */}
      <section id="how-it-works" className="py-12 sm:py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left sm:text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              Simple & Dignified Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              How Saivibronics Seva Works
            </h2>
            <p className="text-sm text-slate-600">
              Four organized steps from discovering a nearby clinic to receiving care and follow-up consultation records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-blue-600 font-mono">01</span>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                  <Search className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900">Find a Clinic</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover participating centers by locality or PIN code, review operating timings, and check accessibility.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-blue-600 font-mono">02</span>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                  <Stethoscope className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900">Review Practitioners</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View certified Vibrionics volunteers, their seva consultation shifts, and available holistic specialties.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-blue-600 font-mono">03</span>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900">Book or Obtain Token</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule a consultation time slot or obtain a transparent daily seva queue token without unnecessary waiting.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-blue-600 font-mono">04</span>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900">Care History & Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access permitted visit notes, potentised remedy instructions, dosage schedules, and lifestyle advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: PATIENT ACCESS */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs font-bold text-blue-600 tracking-wider uppercase">
            Patient Portal Access
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] mt-1">
            Manage Your Care & Follow-Up
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Practical self-service access designed for senior citizens, family caregivers, and seva patients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tile 1: Appointments */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">My Appointments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View scheduled consultation slots, token numbers, and practitioner assignments.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('patient-dashboard')}
              className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-xs font-bold text-blue-600 transition-colors cursor-pointer text-center"
            >
              Open Appointments
            </button>
          </div>

          {/* Tile 2: Medical Records */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Care Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review documented consultation history, vitals check records, and remedy guidance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('patient-dashboard')}
              className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-xs font-bold text-blue-600 transition-colors cursor-pointer text-center"
            >
              View Records
            </button>
          </div>

          {/* Tile 3: Patient Profile */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Patient Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check registered contact numbers, emergency caregiver details, and accessibility preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('patient-dashboard')}
              className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-xs font-bold text-blue-600 transition-colors cursor-pointer text-center"
            >
              Check Profile
            </button>
          </div>

          {/* Tile 4: Clinic Info */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Find Clinic Info</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Locate clinic addresses, telephone contact hours, and wheelchair accessibility details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('find-clinic')}
              className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-xs font-bold text-blue-600 transition-colors cursor-pointer text-center"
            >
              Browse Centers
            </button>
          </div>
        </div>
      </section>

      {/* SECTION D: SERVICE AND ORGANISATION INFORMATION */}
      <section id="trust-principles" className="py-12 sm:py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                Sri Sathya Sai Organisation Seva Mission
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Compassionate Holistic Care Grounded in Seva
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Guided by the principle &ldquo;Love All, Serve All &bull; Help Ever, Hurt Never,&rdquo; Sai Vibrionics is a voluntary community healthcare initiative. Practitioners offer consultations free of charge to promote balance, natural vitality, and compassionate patient care in Padmanabhanagar and across Bengaluru.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <HeartHandshake className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block">100% Voluntary Seva:</strong>
                    All consultations and Vibrionics remedies are provided as selfless service without commercial charges.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block">Complementary Care:</strong>
                    Vibrionics remedies work harmoniously alongside conventional medical care and ongoing prescriptions.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs text-slate-600">
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Padmanabhanagar Pilot Center</span>
              </div>
              <p className="leading-relaxed">
                The pilot center in Padmanabhanagar serves as the demonstration hub for multi-clinic patient scheduling and senior-friendly record keeping.
              </p>
              <div className="pt-2 border-t border-slate-200 space-y-1 font-medium">
                <div>Timings: Mon - Sat 9:00 AM - 1:00 PM, 4:30 PM - 7:30 PM</div>
                <div>Location: 14th Main, Near Carmel High School, Bengaluru 560070</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Access Confirmation Dialog */}
      {showLocationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-600">
              <Navigation className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-base">Find Nearby Clinic</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We will use your approximate location solely inside your browser to suggest the closest clinic in Bengaluru (e.g. Padmanabhanagar). We do not record or transmit your GPS coordinates.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLocationDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLocationAccess}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Allow & Detect
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
