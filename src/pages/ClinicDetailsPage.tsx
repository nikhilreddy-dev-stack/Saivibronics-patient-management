import React, { useState } from 'react';
import { Clinic, Practitioner, PageId, Appointment } from '../types';
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
  Stethoscope
} from 'lucide-react';

interface ClinicDetailsPageProps {
  clinic: Clinic;
  practitioners: Practitioner[];
  onNavigate: (page: PageId) => void;
  onBookAppointment: (appointment: Appointment) => void;
}

export const ClinicDetailsPage: React.FC<ClinicDetailsPageProps> = ({
  clinic,
  practitioners,
  onNavigate,
  onBookAppointment,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState(
    practitioners[0]?.name || 'Senior Vibronics Practitioner'
  );
  const [selectedDate, setSelectedDate] = useState('2026-10-31');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [patientName, setPatientName] = useState('Smt. Ananya Rao');
  const [patientPhone, setPatientPhone] = useState('9845012345');
  const [reasonForVisit, setReasonForVisit] = useState('Holistic consultation for digestive comfort and vitality');
  const [bookingSuccessToken, setBookingSuccessToken] = useState<Appointment | null>(null);

  const availableSlots = [
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:30 AM - 12:00 PM',
    '05:00 PM - 05:30 PM',
    '06:00 PM - 06:30 PM',
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenNumber = `TK-${Math.floor(10 + Math.random() * 90)}`;
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      tokenNumber,
      patientName: patientName.trim() || 'Demonstration Patient',
      patientId: 'SSSO-BLR-2026-0842',
      clinicId: clinic.id,
      clinicName: clinic.name,
      practitionerName: selectedPractitioner,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      status: 'Scheduled',
      reasonForVisit: reasonForVisit.trim() || 'General health consultation',
      notes: 'Initial token booked via prototype. Please arrive 10 minutes prior.',
    };

    onBookAppointment(newAppointment);
    setBookingSuccessToken(newAppointment);
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
            <p className="text-sm sm:text-base text-slate-200 mt-1 max-w-2xl">
              {clinic.address}
            </p>
          </div>
        </div>

        {/* Content & CTAs */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 bg-teal-50/60 rounded-3xl border border-teal-100 text-slate-800">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block text-base">Operating Timings</span>
                <span className="text-sm text-slate-600">{clinic.operatingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block text-base">Helpline / Reception</span>
                <span className="text-sm text-slate-600">{clinic.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Accessibility className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block text-base">Senior Accessibility</span>
                <span className="text-sm text-slate-600">
                  {clinic.seniorAccessible ? 'Wheelchair ramp & senior priority queue' : 'Ground floor access'}
                </span>
              </div>
            </div>
          </div>

          {/* Prototype Demonstration Alert */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Demonstration Clinic Profile:</strong> Roster schedules and addresses reflect realistic fictional data for the Padmanabhanagar pilot.
            </div>
          </div>

          {/* Large Booking CTA Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-teal-700 text-white rounded-3xl shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold">Ready to schedule a consultation?</h2>
              <p className="text-sm sm:text-base text-teal-100">
                Book a demonstration time token for Dr. K. S. Ramesh or Smt. Radha Murthy.
              </p>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-teal-900 hover:bg-teal-50 font-extrabold rounded-2xl text-base transition-colors shadow-xs shrink-0 cursor-pointer min-h-[50px]"
            >
              Book Appointment Token
            </button>
          </div>

          {/* Two-Column Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Services and Facilities */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                  Offered Seva Services & Specialties
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clinic.specialties.map((spec) => (
                    <div
                      key={spec}
                      className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-sm font-semibold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                  Clinic Facilities & Support
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clinic.facilities.map((fac) => (
                    <div
                      key={fac}
                      className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-sm font-semibold"
                    >
                      <Heart className="w-5 h-5 text-teal-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Practitioners on Duty */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Practitioners at this Seva Center
              </h3>

              <div className="space-y-4">
                {practitioners.map((prac) => (
                  <div
                    key={prac.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-base">{prac.name}</span>
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                        {prac.experienceYears} yrs seva
                      </span>
                    </div>
                    <p className="text-slate-600">{prac.title}</p>
                    <p className="text-xs text-slate-500">
                      <strong>Focus:</strong> {prac.specialization}
                    </p>
                    <div className="pt-1 text-xs text-teal-800 font-bold">
                      <strong>Consultation Hours:</strong> {prac.timing}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal with Accessible Form Fields */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            {!bookingSuccessToken ? (
              <form onSubmit={handleBookingSubmit} className="space-y-5 text-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-teal-700" />
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Book Consultation Token
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeBookingFlow}
                    className="text-slate-400 hover:text-slate-700 p-2 min-h-[44px] min-w-[44px]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4 bg-teal-50 rounded-2xl text-teal-950 border border-teal-200">
                  <p className="font-bold text-base text-slate-900">{clinic.name}</p>
                  <p className="text-xs text-teal-700 mt-0.5">Padmanabhanagar, Bengaluru</p>
                </div>

                {/* Patient Name */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Contact Mobile Number (Demo)
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                  />
                </div>

                {/* Practitioner */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Preferred Certified Practitioner
                  </label>
                  <select
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

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Consultation Date
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Time Slot
                    </label>
                    <select
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

                {/* Reason */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Reason for Consultation / Health Concerns
                  </label>
                  <textarea
                    rows={2}
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    placeholder="Briefly describe health concerns..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                  />
                </div>

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
                    className="px-6 py-3 text-base font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-2xl transition-colors cursor-pointer min-h-[48px]"
                  >
                    Confirm Demo Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-3xl flex items-center justify-center mx-auto border border-teal-200">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Appointment Token Confirmed
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Token #{bookingSuccessToken.tokenNumber}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Your consultation slot at {bookingSuccessToken.clinicName} has been recorded in the prototype session.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-sm space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-bold text-slate-900">{bookingSuccessToken.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Practitioner:</span>
                    <span className="font-bold text-slate-900">{bookingSuccessToken.practitionerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-bold text-slate-900">{bookingSuccessToken.date} · {bookingSuccessToken.timeSlot}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      closeBookingFlow();
                      onNavigate('patient-dashboard');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-sm font-bold min-h-[48px]"
                  >
                    View in Patient Dashboard Preview
                  </button>
                  <button
                    onClick={closeBookingFlow}
                    className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold min-h-[48px]"
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
