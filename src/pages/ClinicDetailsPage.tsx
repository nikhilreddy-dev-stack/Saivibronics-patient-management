import React, { useState } from 'react';
import { Clinic, Practitioner, PageId, Appointment, PatientProfile } from '../types';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  User,
  Heart,
  Accessibility,
  Check,
  X,
  Sparkles,
  Stethoscope,
  AlertCircle,
  LogIn,
  ChevronRight,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

interface ClinicDetailsPageProps {
  clinic: Clinic;
  practitioners: Practitioner[];
  onNavigate: (page: PageId) => void;
  onBookAppointment: (appointment: Appointment) => void;
  authenticatedPatient?: PatientProfile | null;
}

export const ClinicDetailsPage: React.FC<ClinicDetailsPageProps> = ({
  clinic,
  practitioners,
  onNavigate,
  onBookAppointment,
  authenticatedPatient,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(clinic.specialties[0] || 'Vibronics 108 Holistic Consultation');
  const [selectedPractitioner, setSelectedPractitioner] = useState(
    practitioners[0]?.name || 'Dr. K. S. Ramesh, BAMS, MD (Ayu)'
  );
  
  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [patientName, setPatientName] = useState(authenticatedPatient?.fullName || '');
  const [patientPhone, setPatientPhone] = useState(authenticatedPatient?.mobileNumber || '');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [needsAccessibility, setNeedsAccessibility] = useState(false);
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessToken, setBookingSuccessToken] = useState<Appointment | null>(null);

  const availableSlots = [
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:30 AM - 12:00 PM',
    '05:00 PM - 05:30 PM',
    '06:00 PM - 06:30 PM',
  ];

  const handleOpenBooking = () => {
    if (authenticatedPatient) {
      setPatientName(authenticatedPatient.fullName);
      setPatientPhone(authenticatedPatient.mobileNumber);
    }
    setBookingErrors({});
    setShowBookingModal(true);
  };

  const validateBooking = () => {
    const errs: Record<string, string> = {};
    if (!patientName.trim()) {
      errs.patientName = 'Patient full name is required.';
    } else if (patientName.trim().length < 3) {
      errs.patientName = 'Please enter at least 3 characters.';
    }

    const cleanPhone = patientPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.patientPhone = 'Contact mobile number is required.';
    } else if (cleanPhone.length !== 10) {
      errs.patientPhone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!selectedDate) {
      errs.selectedDate = 'Consultation date is required.';
    }

    setBookingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBooking()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const randomSeq = Math.floor(10 + Math.random() * 90);
      const randomTokenCode = `T-2026-PAD-${randomSeq}`;
      const patientId = authenticatedPatient?.id || `SSSO-BLR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newApt: Appointment = {
        id: `apt-token-${Date.now()}`,
        tokenNumber: randomTokenCode,
        patientName: patientName.trim(),
        patientId: patientId,
        clinicId: clinic.id,
        clinicName: clinic.name,
        practitionerName: selectedPractitioner,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: 'Scheduled',
        reasonForVisit: reasonForVisit.trim() || 'General holistic consultation',
        notes: needsAccessibility ? 'Patient requested priority senior citizen seating.' : undefined,
      };

      onBookAppointment(newApt);
      setIsSubmitting(false);
      setBookingSuccessToken(newApt);
    }, 600);
  };

  const closeBookingFlow = () => {
    setShowBookingModal(false);
    setBookingSuccessToken(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button onClick={() => onNavigate('find-clinic')} className="hover:text-blue-600 cursor-pointer">
          Clinics
        </button>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">{clinic.name}</span>
      </div>

      {/* Main Clinic Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 uppercase tracking-wider font-mono">
                {clinic.code}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 uppercase tracking-wider">
                {clinic.status}
              </span>
              {clinic.isPilotCenter && (
                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 uppercase tracking-wider">
                  Pilot Center
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              {clinic.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{clinic.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{clinic.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleOpenBooking}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Calendar className="w-4.5 h-4.5" />
              <span>Book Appointment Slot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Operating Schedule & Practitioner Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Timing, Facilities, Specialties */}
        <div className="lg:col-span-7 space-y-6">
          {/* Operating Hours Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Operating & Seva Consultation Hours</span>
            </h3>
            <p className="text-xs text-slate-500">
              Consultations and potentised Vibronics remedies are offered free of charge by qualified seva volunteers.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-800 space-y-2">
              <div className="font-semibold">{clinic.operatingHours}</div>
              <div className="text-xs text-slate-500">
                Morning Session: 09:30 AM – 01:00 PM IST | Evening Session: 04:30 PM – 07:30 PM IST
              </div>
            </div>
          </div>

          {/* Specialties Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <span>Available Seva Specialties</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clinic.specialties.map((spec, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities & Senior Accessibility Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-emerald-600" />
              <span>Center Facilities & Accessibility</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {clinic.facilities.map((fac, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{fac}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Practitioner Roster */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Consulting Practitioners</span>
            </h3>
            <p className="text-xs text-slate-500">
              Certified practitioners providing voluntary clinical consultations.
            </p>

            <div className="space-y-3">
              {practitioners.map((prac) => (
                <div key={prac.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{prac.name}</div>
                      <div className="text-xs text-blue-600 font-medium">{prac.title}</div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <div><span className="font-semibold">Specialization:</span> {prac.specialization}</div>
                    <div><span className="font-semibold">Available:</span> {prac.availableDays.join(', ')}</div>
                    <div><span className="font-semibold">Hours:</span> {prac.timing}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 10-Step Guided Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            {!bookingSuccessToken ? (
              <form onSubmit={handleBookingSubmit} noValidate className="space-y-4 text-sm">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Book Seva Appointment
                    </h3>
                    <p className="text-xs text-slate-500">
                      {clinic.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeBookingFlow}
                    className="text-slate-400 hover:text-slate-700 p-1.5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Patient Session Indicator */}
                {authenticatedPatient ? (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                    <span className="font-semibold">Booking for: {authenticatedPatient.fullName}</span>
                    <span className="font-mono text-blue-700 font-bold">{authenticatedPatient.id}</span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span>Booking as guest patient.</span>
                    <button
                      type="button"
                      onClick={() => {
                        closeBookingFlow();
                        onNavigate('signin');
                      }}
                      className="font-bold text-blue-600 underline"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Service Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                    Select Specialty Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {clinic.specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Practitioner Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                    Select Certified Practitioner
                  </label>
                  <select
                    value={selectedPractitioner}
                    onChange={(e) => setSelectedPractitioner(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {practitioners.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — {p.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                      Appointment Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                      Select Available Time Slot
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                      Patient Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Smt. Ananya Rao"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                    {bookingErrors.patientName && (
                      <p className="text-rose-600 text-xs mt-1">{bookingErrors.patientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                      Mobile (10 digits) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="9845012345"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                    {bookingErrors.patientPhone && (
                      <p className="text-rose-600 text-xs mt-1">{bookingErrors.patientPhone}</p>
                    )}
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                    Reason for Consultation
                  </label>
                  <textarea
                    rows={2}
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    placeholder="Briefly describe symptoms or wellness goals..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Accessibility Needs */}
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    id="access-check"
                    type="checkbox"
                    checked={needsAccessibility}
                    onChange={(e) => setNeedsAccessibility(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="access-check" className="cursor-pointer">
                    Request ground floor access or senior citizen priority escort
                  </label>
                </div>

                {/* Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={closeBookingFlow}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming Token...' : 'Confirm Appointment'}
                  </button>
                </div>
              </form>
            ) : (
              /* Confirmation Screen with Token */
              <div className="space-y-5 text-center py-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Appointment Successfully Confirmed
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Token #{bookingSuccessToken.tokenNumber}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Recorded in clinic schedule for {bookingSuccessToken.clinicName}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-bold text-slate-800">{bookingSuccessToken.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Practitioner:</span>
                    <span className="font-bold text-slate-800">{bookingSuccessToken.practitionerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-bold text-blue-600">{bookingSuccessToken.date} · {bookingSuccessToken.timeSlot}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      closeBookingFlow();
                      onNavigate('patient-dashboard');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    View in Patient Portal
                  </button>
                  <button
                    onClick={closeBookingFlow}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
