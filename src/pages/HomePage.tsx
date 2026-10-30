import React from 'react';
import { PageId } from '../types';
import {
  Search,
  UserPlus,
  LogIn,
  CalendarCheck2,
  FileHeart,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  MapPin,
  Heart,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectClinic: (clinicId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectClinic }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 bg-linear-to-b from-teal-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-100/80 border border-teal-200 text-teal-900 rounded-full text-xs sm:text-sm font-bold">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Sri Sathya Sai Seva Pilot · Padmanabhanagar, Bengaluru</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] text-balance">
                Compassionate Holistic Healing, Organized for Every Patient.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                The Saivibronics Patient Management Platform connects community members with certified seva practitioners for free holistic Vibronics consultations, simplified queue tokens, and transparent care history.
              </p>

              {/* Action Buttons with 48px+ touch targets */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('find-clinic')}
                  className="px-6 py-4 text-base font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-2xl shadow-sm transition-colors flex items-center gap-2.5 cursor-pointer min-h-[50px]"
                >
                  <Search className="w-5 h-5" />
                  <span>Find a Clinic in Bengaluru</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="px-6 py-4 text-base font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-2xl transition-colors flex items-center gap-2.5 cursor-pointer min-h-[50px]"
                >
                  <UserPlus className="w-5 h-5 text-teal-700" />
                  <span>Register Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  className="px-5 py-4 text-base font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors flex items-center gap-2 cursor-pointer min-h-[50px]"
                >
                  <LogIn className="w-5 h-5 text-slate-500" />
                  <span>Sign In</span>
                </button>
              </div>

              {/* Academic Pilot Context Badges */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Designed by 4 CSE Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Senior-Citizen Friendly Portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Multi-Clinic Architecture</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-4/3 sm:aspect-16/11 lg:aspect-4/3 bg-slate-100">
                <img
                  src="/src/assets/images/hero_healthcare_clinic_1793209988820.jpg"
                  alt="Modern serene reception and consultation space of Saivibronics healthcare clinic"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs uppercase tracking-wider text-teal-300 font-bold mb-1">
                    Pilot Headquarters
                  </div>
                  <div className="text-lg font-bold">
                    Sri Sathya Sai Vibronics Seva Clinic
                  </div>
                  <div className="text-xs text-slate-200">
                    Padmanabhanagar, Bengaluru · Mon-Sat Seva Hours
                  </div>
                </div>
              </div>

              {/* Pilot Card badge */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                    560070
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Padmanabhanagar Pilot</div>
                    <div className="text-xs text-slate-500">4 active practitioners on roster</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Clinic Discovery Quick Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-10">
        <div className="bg-white rounded-3xl border border-teal-200/90 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Looking for a Vibronics Clinic in Padmanabhanagar or Bengaluru?
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-0.5">
                  Check available volunteer timings, consultation tokens, and wheelchair accessibility ramps.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('find-clinic')}
              className="w-full md:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-base transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer min-h-[48px]"
            >
              <span>Search Clinics by Locality & PIN</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Feature Cards (Clinic Discovery, Appointment Booking, Medical Records) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Seva Patient Management
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            A unified healthcare prototype engineered to streamline community health seva, minimize waiting times, and preserve accurate consultation history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Clinic Discovery */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Clinic Discovery & Localities
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Explore participating Sri Sathya Sai clinics in Padmanabhanagar, Banashankari, Basavanagudi, and Jayanagar. Check operating schedules, accessibility ramps, and available practitioner specialties.
              </p>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={() => onNavigate('find-clinic')}
                className="text-base font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>Find Nearby Clinics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Appointment Booking */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                <CalendarCheck2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Streamlined Token Scheduling
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Book timed consultation tokens for yourself or elderly family members. Avoid crowded queues with transparent time slots and SMS/WhatsApp token reminders.
              </p>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  onSelectClinic('clinic-padmanabhanagar');
                  onNavigate('clinic-details');
                }}
                className="text-base font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>Book Demonstration Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Medical Records & Remedies */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <FileHeart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Holistic Records & Remedy History
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                View documented consultation summaries, prescribed 108 potentised Vibronics remedy combinations (e.g., CC12.1, CC20.3), dietary lifestyle tips, and scheduled review dates.
              </p>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={() => onNavigate('patient-dashboard')}
                className="text-base font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>View Patient Records Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white border-y border-slate-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-bold text-teal-700 tracking-wider uppercase">
              Simple 4-Step Patient Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How the Saivibronics Platform Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Designed for ease of access, whether you are booking for yourself or an elderly family member.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <div className="text-sm font-bold text-teal-700">01. Locate Center</div>
              <h4 className="text-lg font-bold text-slate-900">Find Nearest Clinic</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Search by PIN code or locality in Bengaluru. Review practitioner hours and accessibility features in Padmanabhanagar.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <div className="text-sm font-bold text-teal-700">02. Pick Slot</div>
              <h4 className="text-lg font-bold text-slate-900">Select Date & Token</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pick a convenient morning or evening time slot. Receive an instant queue token with an estimated consultation window.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <div className="text-sm font-bold text-teal-700">03. Consultation</div>
              <h4 className="text-lg font-bold text-slate-900">Holistic Care Seva</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Meet with a dedicated Sai Vibronics practitioner. Review health history, lifestyle factors, and receive potentised remedy globules.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <div className="text-sm font-bold text-teal-700">04. Follow-up</div>
              <h4 className="text-lg font-bold text-slate-900">Care Plan & Review</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Access your consultation summary in the patient portal, track symptom improvement, and schedule timely review visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pilot Clinic Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 h-64 lg:h-auto relative bg-slate-100">
              <img
                src="/src/assets/images/clinic_padmanabhanagar_1793209989692.jpg"
                alt="Exterior view of Sri Sathya Sai Vibronics Seva Clinic in Padmanabhanagar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-teal-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Pilot Center
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Featured Community Clinic
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Sri Sathya Sai Vibronics Seva Clinic - Padmanabhanagar
                </h3>
                <p className="text-sm text-slate-500">
                  14th Main, Near Carmel High School, Padmanabhanagar, Bengaluru, Karnataka 560070
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hours:</strong> Mon - Sat: 9:00 AM - 1:00 PM, 4:30 PM - 7:30 PM
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Practitioners:</strong> 4 certified senior volunteers on duty
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl">Wheelchair Ramp & Elevator</span>
                <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl">Free Potentised Remedies</span>
                <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl">Senior Priority Queue</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSelectClinic('clinic-padmanabhanagar');
                    onNavigate('clinic-details');
                  }}
                  className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <span>View Details & Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('find-clinic')}
                  className="px-5 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl text-sm font-bold transition-colors cursor-pointer min-h-[48px]"
                >
                  Browse all 5 Bengaluru clinics
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
