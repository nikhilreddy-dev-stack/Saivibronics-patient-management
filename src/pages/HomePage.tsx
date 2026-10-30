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
  Users
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectClinic: (clinicId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectClinic }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-linear-to-b from-teal-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100/70 border border-teal-200 text-teal-800 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>Sri Sathya Sai Seva Pilot · Padmanabhanagar, Bengaluru</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                Compassionate Holistic Healing, Organized for Every Patient.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                The Saivibronics Patient Management Platform connects community members in Bengaluru with certified practitioners for holistic Vibronics consultations, simplified appointment tokens, and transparent care tracking.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('find-clinic')}
                  className="px-5 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a Clinic in Bengaluru</span>
                </button>

                <button
                  onClick={() => onNavigate('register')}
                  className="px-5 py-3 text-sm font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-teal-700" />
                  <span>Register Patient</span>
                </button>

                <button
                  onClick={() => onNavigate('signin')}
                  className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Sign In</span>
                </button>
              </div>

              {/* Academic Pilot Context Badge */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Designed by 4 CSE Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Senior-friendly Accessible Flow</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Multi-Clinic Ready Architecture</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 bg-slate-100">
                <img
                  src="/src/assets/images/hero_healthcare_clinic_1793209988820.jpg"
                  alt="Modern serene reception and consultation space of Saivibronics healthcare clinic"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs uppercase tracking-wider text-teal-300 font-semibold mb-1">
                    Pilot Headquarters
                  </div>
                  <div className="text-base font-bold">
                    Sri Sathya Sai Vibronics Seva Clinic
                  </div>
                  <div className="text-xs text-slate-200">
                    Padmanabhanagar, Bengaluru · Mon-Sat Seva Hours
                  </div>
                </div>
              </div>

              {/* Floating Quick Action Card */}
              <div className="hidden sm:block absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl shadow-lg border border-slate-200 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                    560070
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Padmanabhanagar Pilot</div>
                    <div className="text-[11px] text-slate-500">4 active practitioners on duty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive Seva Patient Management
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            A unified digital prototype engineered to streamline community health seva, minimize waiting times, and preserve accurate consultation history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Clinic Discovery */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Clinic Discovery & Localities
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explore participating Sri Sathya Sai clinics in Padmanabhanagar, Banashankari, Basavanagudi, and Jayanagar. Check operating schedules, accessibility ramps, and available practitioner specialties.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigate('find-clinic')}
                className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Find Nearby Clinics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Appointment Booking */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Streamlined Token Scheduling
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Book timed consultation tokens for yourself or elderly family members. Avoid crowded queues with transparent time slots and SMS/WhatsApp token reminders.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => {
                  onSelectClinic('clinic-padmanabhanagar');
                  onNavigate('clinic-details');
                }}
                className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book Demonstration Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Medical Records & Remedies */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <FileHeart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Holistic Records & Remedy History
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View documented consultation summaries, prescribed 108 potentised Vibronics remedy combinations (e.g., CC12.1, CC20.3), dietary lifestyle tips, and scheduled review dates.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigate('patient-dashboard')}
                className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Patient Records Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              Simple 4-Step Patient Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              How the Saivibronics Platform Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed for ease of access, whether you are booking for yourself or an elderly family member.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="text-xs font-bold text-teal-700">01. Step One</div>
              <h4 className="text-base font-bold text-slate-900">Locate Nearest Clinic</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search by PIN code or locality in Bengaluru. Review practitioner hours and accessibility features in Padmanabhanagar.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="text-xs font-bold text-teal-700">02. Step Two</div>
              <h4 className="text-base font-bold text-slate-900">Select Date & Token</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick a convenient morning or evening time slot. Receive an instant queue token with an estimated consultation window.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="text-xs font-bold text-teal-700">03. Step Three</div>
              <h4 className="text-base font-bold text-slate-900">Holistic Consultation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meet with a dedicated Sai Vibronics practitioner. Review health history, lifestyle factors, and receive potentised remedy globules.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="text-xs font-bold text-teal-700">04. Step Four</div>
              <h4 className="text-base font-bold text-slate-900">Care Plan & Follow-up</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access your consultation summary in the patient portal, track symptom improvement, and schedule timely review visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Project Pilot Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-800/80 border border-teal-600 rounded-lg text-xs font-medium text-teal-200">
              <Users className="w-3.5 h-3.5 text-teal-300" />
              <span>Academic Engineering Initiative · CSE Team</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Padmanabhanagar Pilot: Bridging Community Seva with Modern Software Engineering
            </h3>

            <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
              This system is being prototyped by four final-year Computer Science & Engineering students to assist the Sri Sathya Sai Organisation in digitizing patient records and queue management. The initial pilot targets the Padmanabhanagar seva unit, with a modular codebase designed to easily expand across Bengaluru and other Karnataka districts.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-teal-950/50 p-4 rounded-xl border border-teal-700/60">
                <div className="font-bold text-teal-300 text-sm">Padmanabhanagar (560070)</div>
                <div className="text-teal-100/80 mt-1">Pilot clinic location with full daily appointment workflow</div>
              </div>
              <div className="bg-teal-950/50 p-4 rounded-xl border border-teal-700/60">
                <div className="font-bold text-teal-300 text-sm">Role-Tailored Dashboards</div>
                <div className="text-teal-100/80 mt-1">Dedicated interfaces for Patients, Practitioners, and Administrators</div>
              </div>
              <div className="bg-teal-950/50 p-4 rounded-xl border border-teal-700/60">
                <div className="font-bold text-teal-300 text-sm">PostgreSQL-Ready</div>
                <div className="text-teal-100/80 mt-1">Prepared for future relational schema and server-enforced security</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('org-admin-dashboard')}
                className="px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Preview Multi-Clinic Organisation Network
              </button>
              <button
                onClick={() => onNavigate('practitioner-dashboard')}
                className="px-4 py-2.5 bg-teal-800 hover:bg-teal-700 text-white border border-teal-600 rounded-xl font-medium text-xs transition-colors cursor-pointer"
              >
                Preview Practitioner Consultation Flow
              </button>
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
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                  Featured Community Clinic
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Sri Sathya Sai Vibronics Seva Clinic - Padmanabhanagar
                </h3>
                <p className="text-xs text-slate-500">
                  14th Main, Near Carmel High School, Padmanabhanagar, Bengaluru, Karnataka 560070
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hours:</strong> Mon - Sat: 9:00 AM - 1:00 PM, 4:30 PM - 7:30 PM
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Practitioners:</strong> 4 certified senior volunteers on roster
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">Wheelchair Ramp & Elevator</span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">Free Potentised Remedies</span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">Elderly Priority Tokens</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onSelectClinic('clinic-padmanabhanagar');
                    onNavigate('clinic-details');
                  }}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>View Details & Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('find-clinic')}
                  className="px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-medium transition-colors cursor-pointer"
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
