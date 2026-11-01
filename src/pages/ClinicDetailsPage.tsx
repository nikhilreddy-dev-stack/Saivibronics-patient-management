import React, { useState, useMemo } from 'react';
import { Clinic, Practitioner, PageId, Appointment, PatientProfile } from '../types';
import { calculatePractitionerAvailability, getDayOfWeekFromDate } from '../utils/scheduleUtils';
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
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ClinicDetailsPageProps {
  clinic: Clinic;
  practitioners: Practitioner[];
  appointments?: Appointment[];
  onNavigate: (page: PageId) => void;
  onBookAppointment: (appointment: Appointment) => void;
  authenticatedPatient?: PatientProfile | null;
}

export const ClinicDetailsPage: React.FC<ClinicDetailsPageProps> = ({
  clinic,
  practitioners,
  appointments = [],
  onNavigate,
  onBookAppointment,
  authenticatedPatient,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(
    clinic.specialties[0] || 'Vibronics 108 Holistic Consultation'
  );

  // Filter practitioners assigned to this clinic
  const clinicPractitioners = useMemo(() => {
    const list = practitioners.filter(
      (p) =>
        p.clinicId === clinic.id ||
        (p.assignedClinicIds && p.assignedClinicIds.includes(clinic.id))
    );
    return list.length > 0 ? list : practitioners;
  }, [practitioners, clinic.id]);

  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>(
    clinicPractitioners[0]?.id || ''
  );

  const currentPractitioner = useMemo(() => {
    return (
      clinicPractitioners.find((p) => p.id === selectedPractitionerId) ||
      clinicPractitioners[0]
    );
  }, [clinicPractitioners, selectedPractitionerId]);

  // Tomorrow's date formatted as YYYY-MM-DD
  const defaultDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [patientName, setPatientName] = useState(authenticatedPatient?.fullName || '');
  const [patientPhone, setPatientPhone] = useState(authenticatedPatient?.mobileNumber || '');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [needsAccessibility, setNeedsAccessibility] = useState(false);
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessToken, setBookingSuccessToken] = useState<Appointment | null>(null);

  // 9-Point availability calculation based on practitioner's working schedule
  const availability = useMemo(() => {
    if (!currentPractitioner) return null;
    return calculatePractitionerAvailability(
      currentPractitioner,
      clinic.id,
      selectedDate,
      appointments,
      selectedService
    );
  }, [currentPractitioner, clinic.id, selectedDate, appointments, selectedService]);

  const handleOpenBooking = () => {
    if (authenticatedPatient) {
      setPatientName(authenticatedPatient.fullName);
      setPatientPhone(authenticatedPatient.mobileNumber);
    }
    setBookingErrors({});
    setSelectedTimeSlot('');
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

    if (!selectedTimeSlot) {
      errs.selectedTimeSlot = 'Please select an available time slot.';
    }

    if (availability && (!availability.isWorkingDay || availability.isOnLeave || availability.isCapacityReached)) {
      errs.general = availability.unavailabilityReason || 'Selected practitioner is not available on this date.';
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
      const randomTokenCode = `P-${randomSeq}`;
      const patientId = authenticatedPatient?.id || `SSSO-BLR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newApt: Appointment = {
        id: `apt-token-${Date.now()}`,
        tokenNumber: randomTokenCode,
        patientName: patientName.trim(),
        patientId: patientId,
        clinicId: clinic.id,
        clinicName: clinic.name,
        practitionerName: currentPractitioner?.name || 'Dr. K. S. Ramesh, BAMS, MD (Ayu)',
        serviceName: selectedService,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: 'Scheduled',
        reasonForVisit: reasonForVisit.trim() || 'General holistic consultation',
        notes: needsAccessibility ? 'Patient requested priority senior citizen seating.' : undefined,
      };

      onBookAppointment(newApt);
      setIsSubmitting(false);
      setBookingSuccessToken(newApt);
    }, 500);
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
                Consultation slots are strictly managed per practitioner working schedule to ensure focused care.
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
              <span>Consulting Practitioners & Schedule</span>
            </h3>

            <div className="space-y-4">
              {clinicPractitioners.map((prac) => (
                <div key={prac.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{prac.name}</h4>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {prac.level || 'Certified'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{prac.qualification}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Room: <strong className="text-slate-700">{prac.roomNumber || 'Room 1'}</strong>
                  </p>
                  <div className="text-[11px] text-blue-700 font-semibold bg-blue-50/70 p-2 rounded-lg">
                    <span>Working Days: {prac.availableDays.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleOpenBooking}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Select Date & Book Token</span>
            </button>
          </div>
        </div>
      </div>

      {/* GUIDED APPOINTMENT BOOKING MODAL WITH SCHEDULE-BASED AVAILABILITY */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {bookingSuccessToken ? (
              /* Success Token Screen */
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Appointment Confirmed
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Your Seva Consultation Token
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your appointment has been reserved in the practitioner schedule.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <span className="text-slate-500">Consultation Token Number:</span>
                    <span className="font-mono font-extrabold text-blue-700 text-base">
                      {bookingSuccessToken.tokenNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-bold text-slate-900">{bookingSuccessToken.patientName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Practitioner:</span>
                    <span className="font-bold text-slate-900">{bookingSuccessToken.practitionerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-bold text-slate-900">
                      {bookingSuccessToken.date} ({bookingSuccessToken.timeSlot})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Clinic Desk:</span>
                    <span className="font-bold text-slate-900">{clinic.name}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeBookingFlow}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                      Book a Seva Consultation Token
                    </h3>
                    <p className="text-xs text-slate-500">{clinic.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeBookingFlow}
                    className="text-slate-400 hover:text-slate-700 p-1.5 cursor-pointer"
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
                      className="font-bold text-blue-600 underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Service Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                    1. Select Specialty Service
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
                    2. Select Certified Practitioner
                  </label>
                  <select
                    value={selectedPractitionerId}
                    onChange={(e) => {
                      setSelectedPractitionerId(e.target.value);
                      setSelectedTimeSlot('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {clinicPractitioners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ({p.availableDays.join(', ')})
                      </option>
                    ))}
                  </select>
                  {currentPractitioner && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Works on: <strong className="text-slate-700">{currentPractitioner.availableDays.join(', ')}</strong> · Room: {currentPractitioner.roomNumber || 'Room 1'}
                    </p>
                  )}
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                    3. Select Appointment Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTimeSlot('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Day: <strong>{getDayOfWeekFromDate(selectedDate)}</strong>
                  </p>
                </div>

                {/* Availability status banner */}
                {availability && (
                  <div>
                    {!availability.isWorkingDay || availability.isOnLeave || availability.isCapacityReached ? (
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block font-bold">No Appointments Available on this Date</strong>
                            <p>{availability.unavailabilityReason}</p>
                          </div>
                        </div>

                        {availability.nextAvailableDates.length > 0 && (
                          <div className="pt-2 border-t border-amber-200">
                            <span className="font-semibold block mb-1.5">Suggested Next Working Dates:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {availability.nextAvailableDates.map((d) => (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDate(d);
                                    setSelectedTimeSlot('');
                                  }}
                                  className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-900 hover:bg-amber-100 cursor-pointer"
                                >
                                  {d} ({getDayOfWeekFromDate(d)})
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Slots available */
                      <div className="space-y-2">
                        <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">
                          4. Select Available Time Slot ({availability.availableSlots.length} Slots Open)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl">
                          {/* Available Slots */}
                          {availability.availableSlots.map((slot) => {
                            const isSelected = selectedTimeSlot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={`p-2.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}

                          {/* Occupied Slots (Disabled) */}
                          {availability.occupiedSlots.map((slot) => (
                            <div
                              key={slot}
                              className="p-2.5 rounded-lg text-xs font-medium text-center bg-slate-100 text-slate-400 border border-slate-200 line-through cursor-not-allowed"
                              title="Already booked by another patient"
                            >
                              <span>{slot}</span>
                              <span className="block text-[9px] font-bold text-rose-500 uppercase">Booked</span>
                            </div>
                          ))}
                        </div>
                        {bookingErrors.selectedTimeSlot && (
                          <p className="text-rose-600 text-xs">{bookingErrors.selectedTimeSlot}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

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
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                    {bookingErrors.patientName && (
                      <p className="text-rose-600 text-xs mt-1">{bookingErrors.patientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="9845012345"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
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
                  <input
                    type="text"
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    placeholder="e.g. Knee joint stiffness review..."
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
                    Request wheelchair access or senior citizen priority escort
                  </label>
                </div>

                {bookingErrors.general && (
                  <p className="text-xs text-rose-600 font-semibold">{bookingErrors.general}</p>
                )}

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
                    disabled={isSubmitting || !availability || !availability.isWorkingDay || availability.isOnLeave || availability.isCapacityReached}
                    className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Reserving Token...</span>
                    ) : (
                      <>
                        <span>Confirm Seva Token</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
