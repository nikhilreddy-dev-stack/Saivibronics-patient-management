import React, { useState } from 'react';
import { Appointment, MedicalRecord, PageId } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  User,
  Heart,
  ShieldAlert,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  Activity,
  Droplet,
  Search,
  Pill,
  History,
  Stethoscope,
  Bell,
  HelpCircle,
  Phone,
  ZoomIn,
  Sun,
  Eye,
  Check,
  ChevronRight
} from 'lucide-react';

interface PatientDashboardPageProps {
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  onNavigate: (page: PageId) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

type ServiceSection =
  | 'overview'
  | 'appointments'
  | 'records'
  | 'prescriptions'
  | 'visits'
  | 'practitioner'
  | 'profile'
  | 'help';

export const PatientDashboardPage: React.FC<PatientDashboardPageProps> = ({
  appointments,
  medicalRecords,
  onNavigate,
  onCancelAppointment,
}) => {
  const [currentSection, setCurrentSection] = useState<ServiceSection>('overview');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Senior-Friendly Accessibility State
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'Scheduled' || apt.status === 'Waiting' || apt.status === 'In Consultation'
  );

  const primaryUpcoming = upcomingAppointments[0];

  const handleCancelClick = (aptId: string) => {
    onCancelAppointment(aptId);
    setActionFeedback('Your appointment token has been cancelled.');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Senior sizing classes
  const sizeClasses = {
    normal: {
      body: 'text-base',
      small: 'text-sm',
      title: 'text-xl sm:text-2xl',
      largeTitle: 'text-2xl sm:text-3xl font-extrabold',
    },
    large: {
      body: 'text-lg',
      small: 'text-base',
      title: 'text-2xl sm:text-3xl',
      largeTitle: 'text-3xl sm:text-4xl font-extrabold',
    },
    xlarge: {
      body: 'text-xl leading-relaxed',
      small: 'text-lg',
      title: 'text-3xl sm:text-4xl',
      largeTitle: 'text-4xl sm:text-5xl font-extrabold',
    },
  }[textSize];

  // Service grid definition (9 large, accessible cards with distinct icons)
  const serviceCards = [
    {
      id: 'find-clinic',
      title: 'Find a Clinic',
      desc: 'Browse centres in Padmanabhanagar & Bengaluru',
      icon: Search,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-700',
      borderColor: 'border-teal-200',
      action: () => onNavigate('find-clinic'),
    },
    {
      id: 'appointments',
      title: 'Appointments',
      desc: `${upcomingAppointments.length} upcoming visit tokens`,
      icon: Calendar,
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-700',
      borderColor: 'border-sky-200',
      action: () => setCurrentSection('appointments'),
      badge: upcomingAppointments.length > 0 ? `${upcomingAppointments.length} Active` : undefined,
    },
    {
      id: 'records',
      title: 'Medical Records',
      desc: 'Clinical notes & checkup summaries',
      icon: FileText,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      action: () => setCurrentSection('records'),
    },
    {
      id: 'prescriptions',
      title: 'Prescriptions',
      desc: 'Vibronics remedies & daily instructions',
      icon: Pill,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      action: () => setCurrentSection('prescriptions'),
    },
    {
      id: 'visits',
      title: 'My Visits',
      desc: 'Past completed consultation log',
      icon: History,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-700',
      borderColor: 'border-indigo-200',
      action: () => setCurrentSection('visits'),
    },
    {
      id: 'practitioner',
      title: 'My Practitioner',
      desc: 'Dr. K. S. Ramesh & seva volunteer roster',
      icon: Stethoscope,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-700',
      borderColor: 'border-teal-200',
      action: () => setCurrentSection('practitioner'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      desc: 'Reminders & queue announcements',
      icon: Bell,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      action: () => setShowNotificationsModal(true),
    },
    {
      id: 'profile',
      title: 'My Profile',
      desc: 'Emergency contacts & home address',
      icon: User,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-700',
      borderColor: 'border-slate-300',
      action: () => setCurrentSection('profile'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      desc: 'Senior assistance helpline & directions',
      icon: HelpCircle,
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-700',
      borderColor: 'border-rose-200',
      action: () => setShowHelpModal(true),
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors ${
        highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        
        {/* Senior-Friendly Accessibility Toolbar */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border ${
            highContrast
              ? 'bg-neutral-900 border-neutral-700 text-white'
              : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold flex items-center gap-1.5">
              <ZoomIn className="w-4 h-4 text-teal-600" />
              <span>Text Size:</span>
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setTextSize('normal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[40px] ${
                  textSize === 'normal'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Normal text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize('large')}
                className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[40px] ${
                  textSize === 'large'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Large text size"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setTextSize('xlarge')}
                className={`px-3 py-1.5 text-base font-bold rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[40px] ${
                  textSize === 'xlarge'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Extra large text size"
              >
                A++
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-bold transition-colors cursor-pointer min-h-[40px] ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500'
                  : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{highContrast ? 'Standard View' : 'High Contrast'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-sm font-bold transition-colors cursor-pointer min-h-[40px]"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              <span>Senior Seva Help</span>
            </button>
          </div>
        </div>

        {/* Welcoming Header (Reference 2: Welcoming patient hero) */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            highContrast
              ? 'bg-neutral-900 border-neutral-700'
              : 'bg-linear-to-r from-teal-50/80 via-white to-sky-50/60 border-teal-100/90 shadow-xs'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-sm shrink-0">
                AR
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-teal-100 text-teal-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Patient Portal
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-slate-500 font-semibold">
                    ID: SSSO-BLR-2026-0842
                  </span>
                </div>
                <h1 className={`${sizeClasses.largeTitle} text-slate-900 tracking-tight`}>
                  Namaskaram, Smt. Ananya Rao
                </h1>
                <p className={`${sizeClasses.small} text-slate-600`}>
                  Primary Center: <strong className="text-slate-900 font-bold">Padmanabhanagar Seva Clinic (560070)</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowNotificationsModal(true)}
                className="relative p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 shadow-2xs transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-teal-600 rounded-full border-2 border-white" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('find-clinic')}
                className="px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-sm sm:text-base transition-colors shadow-xs flex items-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Plus className="w-5 h-5" />
                <span>Book an Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prototype Demonstration Alert */}
        <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200 text-amber-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className={`${sizeClasses.small} leading-relaxed`}>
            <strong>Academic Pilot Demonstration:</strong> Patient data and appointments are stored in-memory for the Padmanabhanagar pilot. No real personal records are stored on a public server.
          </div>
        </div>

        {actionFeedback && (
          <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-teal-950 flex items-center gap-3 shadow-2xs">
            <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
            <span className={`${sizeClasses.body} font-semibold`}>{actionFeedback}</span>
          </div>
        )}

        {/* Section Navigation Breadcrumb / Reset */}
        {currentSection !== 'overview' && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <button
              onClick={() => setCurrentSection('overview')}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-teal-800 hover:text-teal-950 cursor-pointer min-h-[44px]"
            >
              <ChevronRight className="w-5 h-5 rotate-180 text-teal-700" />
              <span>Return to Main Services Grid</span>
            </button>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Viewing: {currentSection.toUpperCase()}
            </span>
          </div>
        )}

        {/* SECTION: MAIN OVERVIEW */}
        {currentSection === 'overview' && (
          <div className="space-y-10">
            {/* PROMINENT UPCOMING APPOINTMENT CARD (Design Requirement) */}
            <div
              className={`rounded-3xl border p-6 sm:p-8 transition-all ${
                highContrast
                  ? 'bg-neutral-900 border-neutral-700 text-white'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-teal-100 text-teal-900 font-bold rounded-lg text-xs sm:text-sm uppercase tracking-wider">
                      Next Confirmed Visit
                    </span>
                    {primaryUpcoming && (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded-lg text-xs">
                        Token #{primaryUpcoming.tokenNumber}
                      </span>
                    )}
                  </div>

                  {primaryUpcoming ? (
                    <div>
                      <h2 className={`${sizeClasses.title} font-bold text-slate-900`}>
                        {primaryUpcoming.clinicName}
                      </h2>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-5 h-5 text-teal-700 shrink-0" />
                          <span className={sizeClasses.body}>
                            <strong>Date:</strong> {primaryUpcoming.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-5 h-5 text-teal-700 shrink-0" />
                          <span className={sizeClasses.body}>
                            <strong>Slot:</strong> {primaryUpcoming.timeSlot}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Stethoscope className="w-5 h-5 text-teal-700 shrink-0" />
                          <span className={sizeClasses.body}>
                            <strong>Practitioner:</strong> {primaryUpcoming.practitionerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-5 h-5 text-teal-700 shrink-0" />
                          <span className={sizeClasses.body}>
                            Padmanabhanagar Seva Desk
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700">
                        <span className="font-bold">Reason for Visit: </span>
                        <span>{primaryUpcoming.reasonForVisit}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className={`${sizeClasses.title} font-bold text-slate-900`}>
                        No upcoming appointment scheduled
                      </h3>
                      <p className={`${sizeClasses.body} text-slate-600`}>
                        You do not have any pending consultation tokens. You can schedule a visit at the Padmanabhanagar clinic anytime.
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Large Booking Action & Cancel */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('find-clinic')}
                    className="px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-extrabold text-base sm:text-lg transition-colors shadow-sm flex items-center justify-center gap-3 cursor-pointer min-h-[52px]"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Book an Appointment</span>
                  </button>

                  {primaryUpcoming ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentSection('appointments')}
                        className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors text-center cursor-pointer min-h-[44px]"
                      >
                        All Visits ({upcomingAppointments.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelClick(primaryUpcoming.id)}
                        className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-sm transition-colors cursor-pointer min-h-[44px]"
                      >
                        Cancel Token
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentSection('records')}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-sm transition-colors cursor-pointer min-h-[48px] text-center"
                    >
                      View Past Records
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 9 LARGE SERVICE CARDS (Design Reference 2: Grid of large distinct service icons) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`${sizeClasses.title} font-extrabold text-slate-900`}>
                  Patient Services & Care Features
                </h3>
                <span className={`${sizeClasses.small} text-slate-500 font-medium`}>
                  Select any service card below
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {serviceCards.map((service) => {
                  const IconComponent = service.icon;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={service.action}
                      className={`p-5 sm:p-6 rounded-3xl border text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[170px] relative group ${
                        highContrast
                          ? 'bg-neutral-900 border-neutral-700 text-white hover:border-yellow-400'
                          : 'bg-white border-slate-200 hover:border-teal-400 shadow-2xs'
                      }`}
                      aria-label={`${service.title}: ${service.desc}`}
                    >
                      {service.badge && (
                        <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
                          {service.badge}
                        </span>
                      )}

                      <div className="space-y-3">
                        {/* Large Colored Icon Container */}
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${service.bgColor} ${service.iconColor} border ${service.borderColor} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}
                        >
                          <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>

                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                            {service.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {service.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:text-teal-900">
                        <span>Open</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Seva Guidelines note */}
            <div className="p-6 bg-teal-50/70 border border-teal-200 rounded-3xl space-y-2">
              <h4 className="text-base font-bold text-teal-950 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-teal-700" />
                <span>Senior Patient Guidance for Vibronics Remedies</span>
              </h4>
              <p className={`${sizeClasses.small} text-slate-700 leading-relaxed`}>
                Sai Vibronics remedies are gentle potentised sugar globules given as free seva. Keep the vial away from camphor, strong eucalyptus balm, and direct mobile radiation. Place 3 globules directly on a clean tongue without touching bare fingers.
              </p>
            </div>
          </div>
        )}

        {/* SECTION: APPOINTMENTS */}
        {currentSection === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`${sizeClasses.title} font-bold text-slate-900`}>
                  My Appointment Tokens ({upcomingAppointments.length})
                </h3>
                <p className={`${sizeClasses.small} text-slate-600`}>
                  Manage scheduled and waiting tokens at Padmanabhanagar
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('find-clinic')}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Book New Visit</span>
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">No active appointment tokens</h4>
                <p className={`${sizeClasses.body} text-slate-500 max-w-md mx-auto`}>
                  You do not have any pending appointments. Click below to book a consultation token at your nearest center.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('find-clinic')}
                  className="px-6 py-3 bg-teal-700 text-white rounded-2xl font-bold text-base hover:bg-teal-800 min-h-[48px]"
                >
                  Schedule Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono font-bold text-sm bg-teal-100 text-teal-900 px-3 py-1 rounded-lg">
                            Token #{apt.tokenNumber}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                            {apt.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{apt.clinicName}</h4>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-slate-700">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-5 h-5 text-teal-700 shrink-0" />
                        <span className={sizeClasses.body}>
                          {apt.date} · {apt.timeSlot}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Stethoscope className="w-5 h-5 text-teal-700 shrink-0" />
                        <span className={sizeClasses.body}>
                          {apt.practitionerName}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-800">
                        <strong>Reason:</strong> {apt.reasonForVisit}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Free Community Seva</span>
                      <button
                        type="button"
                        onClick={() => handleCancelClick(apt.id)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs sm:text-sm cursor-pointer min-h-[40px]"
                      >
                        Cancel Token
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION: MEDICAL RECORDS */}
        {currentSection === 'records' && (
          <div className="space-y-6">
            <div>
              <h3 className={`${sizeClasses.title} font-bold text-slate-900`}>
                Medical Records & Clinical Summaries
              </h3>
              <p className={`${sizeClasses.small} text-slate-600`}>
                Documented checkup history and holistic practitioner assessments
              </p>
            </div>

            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        Consultation on {record.date}
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                        {record.clinicName}
                      </h4>
                    </div>
                    <div className="text-sm text-slate-600">
                      Practitioner: <strong className="text-slate-900 font-bold">{record.practitionerName}</strong>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">
                        Diagnosis & Assessment:
                      </span>
                      <p className={`${sizeClasses.body} text-slate-700 leading-relaxed`}>
                        {record.diagnosisSummary}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 block mb-1">
                        Prescribed Remedies:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {record.prescribedRemedies.map((rem, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-900 font-bold rounded-xl text-sm"
                          >
                            {rem}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-700">
                      <div>
                        <strong>Blood Pressure:</strong> {record.vitals.bp}
                      </div>
                      <div>
                        <strong>Pulse:</strong> {record.vitals.pulse}
                      </div>
                      <div>
                        <strong>Weight:</strong> {record.vitals.weight}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(record)}
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold min-h-[44px]"
                    >
                      View Full Clinical Sheet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: PRESCRIPTIONS */}
        {currentSection === 'prescriptions' && (
          <div className="space-y-6">
            <div>
              <h3 className={`${sizeClasses.title} font-bold text-slate-900`}>
                Vibronics Remedies & Active Prescriptions
              </h3>
              <p className={`${sizeClasses.small} text-slate-600`}>
                Remedy instructions, schedule, and holistic precautions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    CC20.3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Arthritis & Joint Support</h4>
                    <span className="text-xs text-slate-500">6C Potentised Globules</span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl text-sm text-slate-700 space-y-1">
                  <div><strong>Dosage:</strong> 3 globules three times daily (TDS)</div>
                  <div><strong>Timing:</strong> 15 minutes before breakfast, lunch, and dinner</div>
                  <div><strong>Duration:</strong> 4 weeks until next review</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    CC12.1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Adult Tonic & General Vitality</h4>
                    <span className="text-xs text-slate-500">Holistic 108 Combination</span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl text-sm text-slate-700 space-y-1">
                  <div><strong>Dosage:</strong> 3 globules twice daily (BD)</div>
                  <div><strong>Timing:</strong> Morning and night with warm water</div>
                  <div><strong>Duration:</strong> Ongoing supportive care</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: MY VISITS (History) */}
        {currentSection === 'visits' && (
          <div className="space-y-6">
            <div>
              <h3 className={`${sizeClasses.title} font-bold text-slate-900`}>
                Past Completed Consultations
              </h3>
              <p className={`${sizeClasses.small} text-slate-600`}>
                Timeline of your holistic healing consultations at Sri Sathya Sai clinics
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                    SEP 24
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Monthly Joint Comfort Review</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Sri Sathya Sai Vibronics Seva Clinic - Padmanabhanagar · Dr. K. S. Ramesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                    AUG 16
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Sleep & Vitality Checkup</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Sri Sathya Sai Vibronics Seva Clinic - Padmanabhanagar · Smt. Radha V. Murthy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: MY PRACTITIONER */}
        {currentSection === 'practitioner' && (
          <div className="space-y-6">
            <div>
              <h3 className={`${sizeClasses.title} font-bold text-slate-900`}>
                Assigned Seva Practitioners
              </h3>
              <p className={`${sizeClasses.small} text-slate-600`}>
                Senior certified Vibronics volunteers at your registered Padmanabhanagar clinic
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold text-lg">
                    KR
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Dr. K. S. Ramesh, BAMS</h4>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      Senior Practitioner (24 yrs Seva)
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-700 space-y-1.5">
                  <div><strong>Focus:</strong> Chronic Digestive Care & Senior Mobility</div>
                  <div><strong>Timings:</strong> Mon, Wed, Fri & Sat: 9:30 AM - 12:30 PM</div>
                  <div><strong>Location:</strong> Padmanabhanagar Center, Room 01</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold text-lg">
                    RM
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Smt. Radha V. Murthy, M.Sc</h4>
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      Practitioner (14 yrs Seva)
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-700 space-y-1.5">
                  <div><strong>Focus:</strong> Sleep Alleviation & Vitality Tonics</div>
                  <div><strong>Timings:</strong> Tue, Thu, Sat & Sun: 10:00 AM - 1:00 PM</div>
                  <div><strong>Location:</strong> Padmanabhanagar Center, Room 02</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: PROFILE */}
        {currentSection === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
            <h3 className={`${sizeClasses.title} font-bold text-slate-900`}>
              Patient Profile & Emergency Contacts
            </h3>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Full Name</span>
                  <span className="font-bold text-slate-900 mt-1 block">Smt. Ananya Rao</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Patient Card ID</span>
                  <span className="font-mono font-bold text-teal-800 mt-1 block">SSSO-BLR-2026-0842</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Residential Address</span>
                <span className="font-bold text-slate-900 mt-1 block">
                  18th Cross, Padmanabhanagar, Bengaluru, Karnataka 560070
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Primary Contact Mobile</span>
                <span className="font-bold text-slate-900 mt-1 block">+91 98450 12345</span>
              </div>

              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200">
                <span className="text-xs text-rose-700 font-bold block">Emergency Attendant / Family</span>
                <span className="font-bold text-slate-900 mt-1 block">
                  Sri R. K. Rao (Spouse) · +91 98450 98765
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Clinical Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">Clinical Record</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-2 min-h-[44px] min-w-[44px]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-800">
              <div className="p-3.5 bg-teal-50 rounded-2xl">
                <div className="font-bold text-slate-900">{selectedRecord.clinicName}</div>
                <div className="text-teal-700 text-xs">Date: {selectedRecord.date} · Practitioner: {selectedRecord.practitionerName}</div>
              </div>

              <div>
                <strong>Assessment:</strong>
                <p className="mt-1 text-slate-700">{selectedRecord.diagnosisSummary}</p>
              </div>

              <div>
                <strong>Prescribed Vibronics Remedies:</strong>
                <div className="mt-1 space-y-1">
                  {selectedRecord.prescribedRemedies.map((r, i) => (
                    <div key={i} className="p-2.5 bg-slate-100 rounded-xl font-bold text-teal-900">{r}</div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                <strong>Dosage Advice:</strong> {selectedRecord.followUpAdvice}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-3 bg-teal-700 text-white rounded-xl font-bold text-sm hover:bg-teal-800 min-h-[44px]"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-700" />
                <h3 className="text-lg font-bold text-slate-900">Patient Notifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNotificationsModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 min-h-[44px] min-w-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-sm">
                <div className="font-bold text-teal-950">Padmanabhanagar Seva Center Update</div>
                <p className="text-slate-600 text-xs mt-1">
                  Queue token status: Your upcoming token P-04 is confirmed for October 30. Please arrive 10 minutes prior to your slot.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm">
                <div className="font-bold text-slate-900">Remedy Refill Alert</div>
                <p className="text-slate-600 text-xs mt-1">
                  Monthly refill of CC20.3 (Joint Support) will be prepared at the dispensing counter.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNotificationsModal(false)}
              className="w-full py-3 bg-teal-700 text-white font-bold rounded-2xl text-sm min-h-[48px]"
            >
              Dismiss Notifications
            </button>
          </div>
        </div>
      )}

      {/* Senior Seva Help & Directions Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-teal-700" />
                <h3 className="text-lg font-bold text-slate-900">Senior Seva Helpline</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 min-h-[44px] min-w-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <p>
                If you or an elderly family member need help booking an appointment, navigating stairs, or understanding remedy dosages:
              </p>
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
                <div className="font-bold text-teal-950">Padmanabhanagar Seva Volunteer Desk</div>
                <div className="text-base font-bold text-teal-800">+91 80 2669 4410 (Demo)</div>
                <div className="text-xs text-slate-500">Available Mon-Sat 9:00 AM - 1:00 PM, 4:30 PM - 7:30 PM</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <strong>Accessibility Ramp:</strong> Located at the front entrance of 14th Main, near Carmel High School with dedicated wheelchair support.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-teal-700 text-white font-bold rounded-2xl text-sm min-h-[48px]"
            >
              Close Help Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
