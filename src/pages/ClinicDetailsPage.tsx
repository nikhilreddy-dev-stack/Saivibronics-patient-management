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
  LogIn
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
    '09:30 AM - 10:00 AM (Morning Seva)',
    '10:00 AM - 10:30 AM (Morning Seva)',
    '10:30 AM - 11:00 AM (Morning Seva)',
    '11:30 AM - 12:00 PM (Morning Seva)',
    '05:00 PM - 05:30 PM (Evening Seva)',
    '06:00 PM - 06:30 PM (Evening Seva)',
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
      setIsSubmitting(false);
      const tokenNumber = `TK-${Math.floor(10 + Math.random() * 90)}`;
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        tokenNumber,
        patientName: patientName.trim(),
        patientId: authenticatedPatient?.id || 'GUEST-PATIENT',
        clinicId: clinic.id,
        clinicName: clinic.name,
        practitionerName: selectedPractitioner,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: 'Scheduled',
        reasonForVisit: reasonForVisit.trim() || `${selectedService} consultation`,
        notes: `Service: ${selectedService}. ${needsAccessibility ? 'Wheelchair / Senior priority requested.' : ''} Please arrive 10 minutes prior.`,
      };

      onBookAppointment(newAppointment);
      setBookingSuccessToken(newAppointment);
    }, 450);
  };

  const closeBookingFlow = () => {
    setShowBookingModal(false);
    setBookingSuccessToken(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Route Back to Search */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('find-clinic')}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to All Clinics</span>
        </button>

        <div className="text-sm text-slate-500 font-medium">
          Clinic ID: <span className="font-mono font-bold text-slate-900">{clinic.code}</span>
        </div>
      </div>

      {/* Main Clinic Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Banner with Image */}
        <div className="relative h-72 sm:h-96 bg-slate-100">
          <img
            src={clinic.image}
            alt={clinic.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-teal-600 text-white font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                {clinic.status}
              </span>
              {clinic.isPilotCenter && (
                <span className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                  Pilot Headquarters
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {clinic.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{clinic.address}</span>
            </p>
          </div>
        </div>

        {/* Quick Information Strip */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-sm">Operating Hours</div>
              <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {clinic.operatingHours}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-sm">Clinic Seva Contact</div>
              <div className="text-xs text-slate-600 mt-0.5">{clinic.phone}</div>
              <div className="text-[11px] text-slate-400">Trained volunteer reception</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Accessibility className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-sm">Accessibility & Senior Care</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {clinic.seniorAccessible ? 'Wheelchair ramp, priority seating' : 'Standard clinic access'}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-teal-50/50">
          <div>
            <div className="font-bold text-slate-900 text-base">Schedule a Consultation Slot</div>
            <div className="text-xs text-slate-600 mt-0.5">
              Available slots for this week. Free seva consultation and potentised remedies.
            </div>
          </div>
          <button
            onClick={handleOpenBooking}
            className="w-full sm:w-auto px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-base shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Appointment Token</span>
          </button>
        </div>
      </div>

      {/* Practitioners & Facilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Practitioners Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-teal-700" />
              <span>Certified Vibronics Practitioners</span>
            </h2>
            <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">
              {practitioners.length} Volunteer Doctors
            </span>
          </div>

          <div className="space-y-4">
            {practitioners.map((prac) => (
              <div
                key={prac.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{prac.name}</h3>
                    <div className="text-xs text-teal-700 font-semibold">{prac.title}</div>
                  </div>
                  <span className="text-xs font-mono bg-teal-50 text-teal-900 border border-teal-200 px-2.5 py-1 rounded-lg self-start sm:self-auto font-bold">
                    {prac.experienceYears} yrs seva experience
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong className="text-slate-800">Specialization:</strong> {prac.specialization}</div>
                  <div><strong className="text-slate-800">Consultation Timings:</strong> {prac.timing}</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prac.availableDays.map((day) => (
                      <span key={day} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities & Services Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-700" />
              <span>Services Offered</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {clinic.specialties.map((spec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-teal-700" />
              <span>Clinic Seva Facilities</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {clinic.facilities.map((fac, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{fac}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Booking Modal with Accessible Form Fields */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            {!bookingSuccessToken ? (
              <form onSubmit={handleBookingSubmit} noValidate className="space-y-5 text-sm">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-teal-700" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        Book Consultation Token
                      </h3>
                      <p className="text-xs text-slate-500">
                        {clinic.name}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeBookingFlow}
                    className="text-slate-400 hover:text-slate-700 p-2 min-h-[44px] min-w-[44px]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Authentication Status Notice */}
                {!authenticatedPatient ? (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                    <span>You are booking as a guest patient.</span>
                    <button
                      type="button"
                      onClick={() => {
                        closeBookingFlow();
                        onNavigate('signin');
                      }}
                      className="font-bold text-[#007F73] underline hover:text-[#006b60] flex items-center gap-1 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In with ID</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-950 flex items-center justify-between">
                    <span className="font-bold">Booking for account: {authenticatedPatient.fullName}</span>
                    <span className="font-mono text-teal-800 text-[11px]">{authenticatedPatient.id}</span>
                  </div>
                )}

                {/* Seva Service */}
                <div>
                  <label htmlFor="book-service" className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                    Consultation Specialty / Service
                  </label>
                  <select
                    id="book-service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer min-h-[48px]"
                  >
                    {clinic.specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Practitioner */}
                <div>
                  <label htmlFor="book-practitioner" className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                    Preferred Certified Practitioner
                  </label>
                  <select
                    id="book-practitioner"
                    value={selectedPractitioner}
                    onChange={(e) => setSelectedPractitioner(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer min-h-[48px]"
                  >
                    {practitioners.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — {p.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="book-date" className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                      Consultation Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="book-date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px] ${
                        bookingErrors.selectedDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {bookingErrors.selectedDate && (
                      <p className="text-rose-600 text-xs font-semibold mt-1">{bookingErrors.selectedDate}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="book-time" className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                      Seva Time Slot
                    </label>
                    <select
                      id="book-time"
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer min-h-[48px]"
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Patient Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="book-patientName" className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                      Patient Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="book-patientName"
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Smt. Ananya Rao"
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px] ${
                        bookingErrors.patientName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {bookingErrors.patientName && (
                      <p className="text-rose-600 text-xs font-semibold mt-1">{bookingErrors.patientName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="book-patientPhone" className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                      Contact Mobile <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="book-patientPhone"
                      type="tel"
                      maxLength={10}
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="9845012345"
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px] ${
                        bookingErrors.patientPhone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {bookingErrors.patientPhone && (
                      <p className="text-rose-600 text-xs font-semibold mt-1">{bookingErrors.patientPhone}</p>
                    )}
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label htmlFor="book-reason" className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                    Reason for Consultation / Health Concerns
                  </label>
                  <textarea
                    id="book-reason"
                    rows={2}
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    placeholder="Briefly describe symptoms or wellness goals..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                  />
                </div>

                {/* Accessibility Request */}
                <div className="flex items-center gap-2.5 text-xs text-slate-700">
                  <input
                    id="book-access"
                    type="checkbox"
                    checked={needsAccessibility}
                    onChange={(e) => setNeedsAccessibility(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600 cursor-pointer"
                  />
                  <label htmlFor="book-access" className="cursor-pointer">
                    Request wheelchair ramp or senior citizen volunteer escort assistance
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeBookingFlow}
                    className="px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[48px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 text-base font-bold text-white bg-[#007F73] hover:bg-[#006b60] rounded-2xl shadow-xs transition-colors cursor-pointer min-h-[48px] disabled:opacity-75"
                  >
                    {isSubmitting ? 'Recording Token...' : 'Confirm Seva Appointment'}
                  </button>
                </div>
              </form>
            ) : (
              /* Confirmation Result Screen */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-[#E9F8F4] text-[#007F73] rounded-3xl flex items-center justify-center mx-auto border border-teal-200 shadow-xs">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold text-[#007F73] uppercase tracking-wider">
                    Appointment Token Confirmed
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14243A] mt-1">
                    Token #{bookingSuccessToken.tokenNumber}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#536579] mt-1">
                    Your seva consultation slot at {bookingSuccessToken.clinicName} has been recorded in the prototype session.
                  </p>
                </div>

                {/* Token Summary Card */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs sm:text-sm space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-bold text-[#14243A]">{bookingSuccessToken.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Practitioner:</span>
                    <span className="font-bold text-[#14243A]">{bookingSuccessToken.practitionerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultation Date:</span>
                    <span className="font-bold text-[#14243A]">{bookingSuccessToken.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time Shift:</span>
                    <span className="font-bold text-[#007F73]">{bookingSuccessToken.timeSlot}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      closeBookingFlow();
                      onNavigate('patient-dashboard');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#007F73] hover:bg-[#006b60] text-white rounded-2xl text-sm font-bold min-h-[48px] shadow-xs cursor-pointer"
                  >
                    View in Patient Dashboard
                  </button>
                  <button
                    onClick={closeBookingFlow}
                    className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold min-h-[48px] cursor-pointer"
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
