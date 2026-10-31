import React, { useState } from 'react';
import { Appointment, MedicalRecord, PageId, PatientProfile, PrescriptionRecord, ChatMessage } from '../types';
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
  ChevronRight,
  BookOpen,
  Globe,
  Sliders,
  LogOut,
  Lock,
  LogIn,
  Printer,
  Download,
  MessageSquare,
  Send,
  Sparkles,
  QrCode
} from 'lucide-react';

interface PatientDashboardPageProps {
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  prescriptions?: PrescriptionRecord[];
  messages?: ChatMessage[];
  onSendMessage?: (text: string) => void;
  onNavigate: (page: PageId) => void;
  onCancelAppointment: (appointmentId: string) => void;
  authenticatedPatient?: PatientProfile | null;
  onSignOut?: () => void;
  onLoginAsDemo?: () => void;
}

type ServiceSection =
  | 'overview'
  | 'appointments'
  | 'records'
  | 'prescriptions'
  | 'messages'
  | 'visits'
  | 'practitioner'
  | 'profile'
  | 'help';

export const PatientDashboardPage: React.FC<PatientDashboardPageProps> = ({
  appointments,
  medicalRecords,
  prescriptions = [],
  messages = [],
  onSendMessage,
  onNavigate,
  onCancelAppointment,
  authenticatedPatient,
  onSignOut,
  onLoginAsDemo,
}) => {
  const [currentSection, setCurrentSection] = useState<ServiceSection>('overview');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionRecord | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHealthInfoModal, setShowHealthInfoModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'kn' | 'hi'>('en');

  // Interactive Message input
  const [newMessageText, setNewMessageText] = useState('');

  // Appointments sub-tab
  const [appointmentTab, setAppointmentTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  // Senior-Friendly Accessibility State
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Filter appointments for the authenticated patient if logged in
  const patientAppointments = authenticatedPatient
    ? appointments.filter(
        (apt) =>
          apt.patientId === authenticatedPatient.id ||
          apt.patientName.toLowerCase() === authenticatedPatient.fullName.toLowerCase() ||
          authenticatedPatient.id === 'SSSO-BLR-2026-0842'
      )
    : [];

  const upcomingAppointments = patientAppointments.filter(
    (apt) => apt.status === 'Scheduled' || apt.status === 'Waiting' || apt.status === 'In Consultation'
  );
  const completedAppointments = patientAppointments.filter((apt) => apt.status === 'Completed');
  const cancelledAppointments = patientAppointments.filter((apt) => apt.status === 'Cancelled');

  const primaryUpcoming = upcomingAppointments[0];

  const patientPrescriptions = prescriptions.filter(
    (p) =>
      !authenticatedPatient ||
      p.patientId === authenticatedPatient.id ||
      authenticatedPatient.id === 'SSSO-BLR-2026-0842'
  );

  const patientInitials = authenticatedPatient?.fullName
    ? authenticatedPatient.fullName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'PT';

  const handleCancelClick = (aptId: string) => {
    onCancelAppointment(aptId);
    setActionFeedback('Your appointment token has been cancelled.');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleSendPatientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    if (onSendMessage) {
      onSendMessage(newMessageText.trim());
    }
    setNewMessageText('');
    setActionFeedback('Your message has been sent to Dr. K. S. Ramesh.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Senior sizing classes
  const sizeClasses = {
    normal: {
      body: 'text-sm sm:text-base leading-relaxed',
      small: 'text-xs sm:text-sm',
      title: 'text-lg sm:text-xl font-bold',
      largeTitle: 'text-2xl sm:text-3xl font-extrabold',
    },
    large: {
      body: 'text-base sm:text-lg leading-relaxed',
      small: 'text-sm sm:text-base',
      title: 'text-xl sm:text-2xl font-bold',
      largeTitle: 'text-3xl sm:text-4xl font-extrabold',
    },
    xlarge: {
      body: 'text-lg sm:text-xl leading-relaxed',
      small: 'text-base sm:text-lg',
      title: 'text-2xl sm:text-3xl font-bold',
      largeTitle: 'text-4xl sm:text-5xl font-extrabold',
    },
  }[textSize];

  // Service Navigation Cards
  const serviceCards = [
    {
      id: 'appointments',
      title: 'My Appointments',
      desc: `${upcomingAppointments.length} upcoming visit tokens`,
      icon: Calendar,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      action: () => setCurrentSection('appointments'),
      badge: upcomingAppointments.length > 0 ? `${upcomingAppointments.length} Active` : undefined,
    },
    {
      id: 'prescriptions',
      title: 'Prescriptions & Remedies',
      desc: `${patientPrescriptions.length} digital vibronics slips`,
      icon: Pill,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-700',
      borderColor: 'border-teal-200',
      action: () => setCurrentSection('prescriptions'),
      badge: patientPrescriptions.length > 0 ? `${patientPrescriptions.length} Records` : undefined,
    },
    {
      id: 'records',
      title: 'Medical Records',
      desc: 'Clinical checkups & vitals history',
      icon: FileText,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-700',
      borderColor: 'border-slate-200',
      action: () => setCurrentSection('records'),
    },
    {
      id: 'messages',
      title: 'Doctor Messages',
      desc: 'Direct consultation inquiries',
      icon: MessageSquare,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      action: () => setCurrentSection('messages'),
      badge: 'Live Care',
    },
    {
      id: 'practitioner',
      title: 'My Practitioner',
      desc: 'Dr. K. S. Ramesh & seva roster',
      icon: Stethoscope,
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-700',
      borderColor: 'border-sky-200',
      action: () => setCurrentSection('practitioner'),
    },
    {
      id: 'find-clinic',
      title: 'Find Seva Clinics',
      desc: 'Padmanabhanagar & Bengaluru centers',
      icon: Search,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      action: () => onNavigate('find-clinic'),
    },
    {
      id: 'profile',
      title: 'My Profile & UHID',
      desc: 'Emergency contact & address',
      icon: User,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-700',
      borderColor: 'border-slate-200',
      action: () => setCurrentSection('profile'),
    },
    {
      id: 'help',
      title: 'Help & Senior Care',
      desc: 'Free helpline & remedy guidance',
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
            <span className="text-sm font-bold flex items-center gap-1.5 text-slate-700">
              <ZoomIn className="w-4 h-4 text-blue-600" />
              <span>Text Size:</span>
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setTextSize('normal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[38px] ${
                  textSize === 'normal'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Normal text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize('large')}
                className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[38px] ${
                  textSize === 'large'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Large text size"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setTextSize('xlarge')}
                className={`px-3 py-1.5 text-base font-bold rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[38px] ${
                  textSize === 'xlarge'
                    ? 'bg-white text-blue-700 shadow-xs'
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
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[38px] ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{highContrast ? 'Standard View' : 'High Contrast'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[38px]"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Senior Helpline</span>
            </button>
          </div>
        </div>

        {!authenticatedPatient ? (
          /* Privacy Shield Screen for Unauthenticated Visitors */
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-6 max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Protected Patient Health Records
              </span>
              <h2 className={`${sizeClasses.largeTitle} text-slate-900`}>
                Patient Sign In Required
              </h2>
              <p className={`${sizeClasses.body} text-slate-600 max-w-lg mx-auto`}>
                To protect your confidential medical history, please sign in with your registered mobile number or email to view consultation tokens, medical notes, and prescribed Vibronics remedies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm sm:text-base shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In to Patient Portal</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl text-sm sm:text-base transition-colors cursor-pointer min-h-[46px]"
              >
                <span>Register as New Patient</span>
              </button>
            </div>

            {onLoginAsDemo && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onLoginAsDemo}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Quick Demo: Sign In as Smt. Ananya Rao (Padmanabhanagar Pilot Patient)
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Welcoming Patient Header (HealthCare+ Style) */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                highContrast
                  ? 'bg-neutral-900 border-neutral-700'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-sm shrink-0">
                    {patientInitials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                        Patient Health Portal
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">
                        UHID: {authenticatedPatient.id}
                      </span>
                    </div>
                    <h1 className={`${sizeClasses.largeTitle} text-slate-900 tracking-tight`}>
                      Namaskaram, {authenticatedPatient.fullName}
                    </h1>
                    <p className={`${sizeClasses.small} text-slate-600`}>
                      Primary Center: <strong className="text-slate-900 font-semibold">{authenticatedPatient.preferredClinicName || 'Padmanabhanagar Seva Clinic'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowNotificationsModal(true)}
                    className="relative p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('find-clinic')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>

                  {onSignOut && (
                    <button
                      type="button"
                      onClick={onSignOut}
                      className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                      title="Sign Out of Patient Account"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* In-Memory Notice */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Padmanabhanagar Pilot:</strong> Your medical records, appointments, and Vibronics prescription tokens are secured for clinical seva continuity. Free community healthcare provided with love.
              </div>
            </div>

            {actionFeedback && (
              <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-teal-900 flex items-center gap-3 shadow-2xs">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
                <span className={`${sizeClasses.body} font-semibold`}>{actionFeedback}</span>
              </div>
            )}

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
              <button
                onClick={() => setCurrentSection('overview')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  currentSection === 'overview'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setCurrentSection('appointments')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  currentSection === 'appointments'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Appointments ({upcomingAppointments.length})
              </button>
              <button
                onClick={() => setCurrentSection('prescriptions')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  currentSection === 'prescriptions'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Prescriptions & Remedies ({patientPrescriptions.length})
              </button>
              <button
                onClick={() => setCurrentSection('records')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  currentSection === 'records'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Medical Records ({medicalRecords.length})
              </button>
              <button
                onClick={() => setCurrentSection('messages')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  currentSection === 'messages'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Messages ({messages.length})
              </button>
              <button
                onClick={() => setCurrentSection('profile')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  currentSection === 'profile'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                My Profile
              </button>
            </div>

            {/* SECTION 1: MAIN OVERVIEW */}
            {currentSection === 'overview' && (
              <div className="space-y-8">
                {/* PROMINENT UPCOMING APPOINTMENT CARD */}
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
                        <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-lg text-xs uppercase tracking-wider">
                          Next Confirmed Visit
                        </span>
                        {primaryUpcoming && (
                          <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 font-bold rounded-lg text-xs">
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
                              <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                              <span className={sizeClasses.body}>
                                <strong>Date:</strong> {primaryUpcoming.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                              <span className={sizeClasses.body}>
                                <strong>Slot:</strong> {primaryUpcoming.timeSlot}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Stethoscope className="w-5 h-5 text-blue-600 shrink-0" />
                              <span className={sizeClasses.body}>
                                <strong>Practitioner:</strong> {primaryUpcoming.practitionerName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                              <span className={sizeClasses.body}>
                                Padmanabhanagar Seva Desk
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm">
                            <span className="font-bold text-slate-900">Chief Reason for Consultation: </span>
                            <span>{primaryUpcoming.reasonForVisit}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h3 className={`${sizeClasses.title} font-bold text-slate-900`}>
                            No upcoming appointment scheduled
                          </h3>
                          <p className={`${sizeClasses.body} text-slate-600`}>
                            You currently have no pending consultation tokens. You can schedule a visit at the Padmanabhanagar clinic anytime free of charge.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => onNavigate('find-clinic')}
                        className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm sm:text-base transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Book an Appointment</span>
                      </button>

                      {primaryUpcoming ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCurrentSection('appointments')}
                            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm transition-colors text-center cursor-pointer min-h-[40px]"
                          >
                            All Visits ({upcomingAppointments.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelClick(primaryUpcoming.id)}
                            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer min-h-[40px]"
                          >
                            Cancel Token
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCurrentSection('appointments')}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm transition-colors text-center cursor-pointer min-h-[40px]"
                        >
                          View Past Visits ({completedAppointments.length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Services Grid */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Patient Care & Self-Service
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {serviceCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={card.action}
                          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm text-left transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between">
                            <div className={`w-11 h-11 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center border ${card.borderColor}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            {card.badge && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {card.badge}
                              </span>
                            )}
                          </div>
                          <div className="mt-4">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {card.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {card.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Latest Prescription & Remedy Instructions Preview */}
                {patientPrescriptions.length > 0 && (
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            Current Active Vibronics Remedies
                          </h3>
                          <p className="text-xs text-slate-500">
                            Prescribed by {patientPrescriptions[0].practitionerName} on {patientPrescriptions[0].date}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPrescription(patientPrescriptions[0])}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Consultation Slip</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {patientPrescriptions[0].remedies.map((remedy, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 text-xs font-mono font-bold">
                                {remedy.code}
                              </span>
                              <span>{remedy.name}</span>
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {remedy.duration}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700">
                            <strong>Dosage:</strong> {remedy.dosage} · <strong>Frequency:</strong> {remedy.frequency}
                          </p>
                          <p className="text-xs text-slate-500 italic">
                            {remedy.instructions}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: APPOINTMENTS */}
            {currentSection === 'appointments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      My Consultation Appointments
                    </h2>
                    <p className="text-sm text-slate-500">
                      Track your token queue, upcoming seva dates, and past visits.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('find-clinic')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Book New Token</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    onClick={() => setAppointmentTab('upcoming')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                      appointmentTab === 'upcoming'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Upcoming ({upcomingAppointments.length})
                  </button>
                  <button
                    onClick={() => setAppointmentTab('completed')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                      appointmentTab === 'completed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Completed ({completedAppointments.length})
                  </button>
                  <button
                    onClick={() => setAppointmentTab('cancelled')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                      appointmentTab === 'cancelled'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Cancelled ({cancelledAppointments.length})
                  </button>
                </div>

                {/* Tab content */}
                {appointmentTab === 'upcoming' && (
                  <div className="space-y-4">
                    {upcomingAppointments.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                        No upcoming appointments. Click &ldquo;Book New Token&rdquo; to reserve a slot.
                      </div>
                    ) : (
                      upcomingAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                                Token #{apt.tokenNumber}
                              </span>
                              <span className="text-xs text-slate-500 font-semibold">
                                Status: {apt.status}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                              {apt.clinicName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                {apt.date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-blue-600" />
                                {apt.timeSlot}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Stethoscope className="w-4 h-4 text-blue-600" />
                                {apt.practitionerName}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              <strong>Concern:</strong> {apt.reasonForVisit}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 sm:self-center shrink-0">
                            <button
                              onClick={() => handleCancelClick(apt.id)}
                              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
                            >
                              Cancel Token
                            </button>
                            <button
                              onClick={() => onNavigate('find-clinic')}
                              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {appointmentTab === 'completed' && (
                  <div className="space-y-4">
                    {completedAppointments.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                        No completed appointments yet.
                      </div>
                    ) : (
                      completedAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                              Completed · Token #{apt.tokenNumber}
                            </span>
                            <span className="text-xs text-slate-500">{apt.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{apt.clinicName}</h4>
                          <p className="text-xs text-slate-600">
                            <strong>Practitioner:</strong> {apt.practitionerName}
                          </p>
                          {apt.remedySummary && (
                            <p className="text-xs text-teal-700 bg-teal-50/60 p-2.5 rounded-xl border border-teal-100">
                              <strong>Prescription:</strong> {apt.remedySummary}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {appointmentTab === 'cancelled' && (
                  <div className="space-y-4">
                    {cancelledAppointments.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                        No cancelled appointments on record.
                      </div>
                    ) : (
                      cancelledAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-4 bg-white rounded-2xl border border-slate-200 opacity-70 space-y-1"
                        >
                          <span className="text-xs text-rose-600 font-bold">Cancelled Token #{apt.tokenNumber}</span>
                          <h4 className="text-sm font-bold text-slate-800">{apt.clinicName}</h4>
                          <p className="text-xs text-slate-500">{apt.date} · {apt.timeSlot}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: PRESCRIPTIONS & REMEDIES */}
            {currentSection === 'prescriptions' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Digital Prescriptions & Vibronics Remedies
                  </h2>
                  <p className="text-sm text-slate-500">
                    Official Sri Sathya Sai Vibronics remedy formulations prescribed during consultations.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {patientPrescriptions.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                      No prescriptions recorded yet. Your doctor will issue a digital prescription upon consultation completion.
                    </div>
                  ) : (
                    patientPrescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
                              Rx Ref: {rx.id}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-1">
                              {rx.clinicName}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Prescribed by {rx.practitionerName} on {rx.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedPrescription(rx)}
                              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Printer className="w-4 h-4" />
                              <span>View & Print Slip</span>
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-slate-700 space-y-1">
                          <p>
                            <strong>Patient Stated Concern:</strong> {rx.patientConcern}
                          </p>
                          <p>
                            <strong>Clinical Notes:</strong> {rx.clinicalNotes}
                          </p>
                        </div>

                        {/* Remedies list */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Prescribed Remedies ({rx.remedies.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rx.remedies.map((remedy, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                              >
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                  <span className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[11px]">
                                      {remedy.code}
                                    </span>
                                    <span>{remedy.name}</span>
                                  </span>
                                  <span className="text-slate-500">{remedy.frequency}</span>
                                </div>
                                <p className="text-slate-700">
                                  <strong>Dosage:</strong> {remedy.dosage} ({remedy.duration})
                                </p>
                                <p className="text-slate-500 italic">
                                  {remedy.instructions}
                                </p>
                                {remedy.precautions && (
                                  <p className="text-amber-800 text-[11px]">
                                    ⚠️ {remedy.precautions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {rx.followUpInstructions && (
                          <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-teal-900">
                            <strong>Follow-up Advice: </strong> {rx.followUpInstructions}
                            {rx.followUpDate && (
                              <span> · Next suggested review: {rx.followUpDate}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SECTION 4: MEDICAL RECORDS */}
            {currentSection === 'records' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Medical & Checkup Records
                  </h2>
                  <p className="text-sm text-slate-500">
                    Consultation logs, vitals (BP, pulse, weight), and holistic lifestyle advice.
                  </p>
                </div>

                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {record.id}
                            </span>
                            <span className="text-xs text-slate-500">{record.date}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {record.clinicName}
                          </h3>
                        </div>

                        {record.vitals && (
                          <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
                            <span>BP: <strong>{record.vitals.bp}</strong></span>
                            <span>Pulse: <strong>{record.vitals.pulse}</strong></span>
                            <span>Weight: <strong>{record.vitals.weight}</strong></span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm text-slate-700 space-y-2">
                        <p>
                          <strong>Diagnosis Summary:</strong> {record.diagnosisSummary}
                        </p>
                        <p>
                          <strong>Prescribed Remedies:</strong> {record.prescribedRemedies.join(', ')}
                        </p>
                        <p className="text-slate-500">
                          <strong>Lifestyle Advice:</strong> {record.lifestyleNotes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: MESSAGES WITH PRACTITIONER */}
            {currentSection === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Doctor Messages & Follow-up Inquiries
                  </h2>
                  <p className="text-sm text-slate-500">
                    Communicate directly with your assigned seva practitioner regarding remedy dosage or reaction.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
                  {/* Chat Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        DR
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Dr. K. S. Ramesh, BAMS</h4>
                        <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Sai Vibronics Seva Desk Active</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">Padmanabhanagar Pilot</span>
                  </div>

                  {/* Message History */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                    {messages.map((msg) => {
                      const isMe = msg.senderRole === 'patient';
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-br-xs'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span
                              className={`block text-[10px] mt-1 text-right ${
                                isMe ? 'text-blue-100' : 'text-slate-400'
                              }`}
                            >
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input Box */}
                  <form
                    onSubmit={handleSendPatientMessage}
                    className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="Type your question or symptom update for Dr. Ramesh..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* SECTION 6: MY PROFILE */}
            {currentSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Patient Profile & Registration Card
                  </h2>
                  <p className="text-sm text-slate-500">
                    Universal Health ID (UHID) and emergency contact records.
                  </p>
                </div>

                <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold block">Full Name</span>
                      <span className="text-slate-900 font-bold text-base">{authenticatedPatient.fullName}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold block">Universal Health ID (UHID)</span>
                      <span className="text-blue-600 font-mono font-bold text-base">{authenticatedPatient.id}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold block">Registered Mobile</span>
                      <span className="text-slate-900 font-bold">{authenticatedPatient.mobileNumber}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold block">Email Address</span>
                      <span className="text-slate-900 font-bold">{authenticatedPatient.email || 'Not provided'}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold block">Preferred Seva Clinic</span>
                      <span className="text-slate-900 font-bold">{authenticatedPatient.preferredClinicName || 'Padmanabhanagar Seva Clinic'}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold block">Emergency Contact</span>
                      <span className="text-slate-900 font-bold">
                        {authenticatedPatient.emergencyContactName || 'Sri K. Rao'} ({authenticatedPatient.emergencyContactPhone || '+91 94481 22334'})
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-teal-900 text-xs sm:text-sm space-y-1">
                    <strong>Accessibility / Senior Citizen Assistance:</strong>
                    <p className="text-teal-800">
                      {authenticatedPatient.accessibilityNeeds || 'Ground floor wheelchair accessibility preference registered with Padmanabhanagar desk.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* PRINTABLE DIGITAL CONSULTATION SLIP MODAL */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sri Sathya Sai Vibronics Seva</h3>
                  <p className="text-xs text-slate-500">Official Complementary Healthcare Consultation Slip</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Content */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50 text-xs sm:text-sm font-sans">
              <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-500 block text-xs">Patient Name</span>
                  <span className="font-bold text-slate-900">{selectedPrescription.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">UHID</span>
                  <span className="font-mono font-bold text-blue-600">{selectedPrescription.patientId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Clinic Centre</span>
                  <span className="font-bold text-slate-800">{selectedPrescription.clinicName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Date of Visit</span>
                  <span className="font-bold text-slate-800">{selectedPrescription.date}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block text-xs">Clinical Evaluation</span>
                <p className="text-slate-800 italic">{selectedPrescription.clinicalNotes}</p>
              </div>

              {/* Remedies */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Prescribed 108 Vibronics Remedy Formulations
                </span>
                <div className="space-y-2">
                  {selectedPrescription.remedies.map((rem, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{rem.code} - {rem.name}</span>
                        <span className="text-blue-600">{rem.frequency}</span>
                      </div>
                      <p className="text-slate-700 text-xs">
                        <strong>Dosage:</strong> {rem.dosage} ({rem.duration})
                      </p>
                      <p className="text-slate-500 text-xs italic">{rem.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage instructions */}
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 text-xs space-y-1">
                <strong>Remedy Handling Seva Instructions:</strong>
                <p>1. Keep away from strong perfumes, camphor, menthol, and mobile phone radiation.</p>
                <p>2. Do not handle sugar globules with bare fingers; use clean phial cap.</p>
                <p>3. Provided strictly as seva with love — completely free of cost.</p>
              </div>

              {/* Signature */}
              <div className="flex items-end justify-between pt-4 border-t border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Digital Signature Hash</span>
                  <p className="font-mono text-xs text-slate-500">SSSO-VERIFIED-{selectedPrescription.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">{selectedPrescription.practitionerName}</div>
                  <div className="text-[11px] text-slate-500">Reg: KA-AYU-1988-42</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPrescription(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Senior Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span>Senior Citizen Seva Helpline</span>
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If you or an elder in your family need assistance with booking a token, wheelchair assistance at the Padmanabhanagar clinic, or instructions on taking potentised globules, please contact:
            </p>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Padmanabhanagar Desk:</span>
                <span className="text-blue-600">+91 80 2669 1108</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Operating Hours:</span>
                <span>Mon - Sat: 9:00 AM - 1:00 PM</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs sm:text-sm cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span>Clinic Announcements</span>
              </h3>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                <strong className="block text-blue-900 font-bold">Upcoming Seva Camp</strong>
                <p className="text-slate-600 mt-0.5">
                  Special Joint & Senior Mobility checkup scheduled at Padmanabhanagar Samithi hall next Saturday.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-bold">Remedy Refill Tip</strong>
                <p className="text-slate-600 mt-0.5">
                  Remember to bring your empty glass phials along for eco-friendly refill and sanitisation.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotificationsModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
