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
  Sparkles
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Clinics</span>
        </button>

        <div className="text-xs text-slate-500">
          Clinic ID: <span className="font-mono text-slate-800">{clinic.code}</span>
        </div>
      </div>

      {/* Main Clinic Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Banner with Image */}
        <div className="relative h-64 sm:h-80 bg-slate-100">
          <img
            src={clinic.image}
            alt={clinic.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-teal-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs">
                {clinic.status}
              </span>
              {clinic.isPilotCenter && (
                <span className="bg-amber-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-xs">
                  Pilot Center
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {clinic.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              {clinic.address}
            </p>
          </div>
        </div>

        {/* Clinic Content & CTAs */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-teal-50/50 rounded-2xl border border-teal-100 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Operating Timings</span>
                <span>{clinic.operatingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Helpline / Reception</span>
                <span>{clinic.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Accessibility className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Senior Accessibility</span>
                <span>{clinic.seniorAccessible ? 'Wheelchair ramp & priority assistance available' : 'Standard ground floor access'}</span>
              </div>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Demonstration Clinic Profile:</strong> Timings, practitioner rosters, and addresses are fictionalized for the Padmanabhanagar academic pilot.
            </div>
          </div>

          {/* Book Appointment CTA Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-teal-700 text-white rounded-2xl">
            <div>
              <h2 className="text-base font-bold">Ready to schedule a holistic consultation?</h2>
              <p className="text-xs text-teal-100 mt-0.5">
                Book a demonstration time token for Dr. K. S. Ramesh or Smt. Radha Murthy.
              </p>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl text-xs transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              Book Appointment Token
            </button>
          </div>

          {/* Two-Column Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Services and Facilities */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Offered Seva Services & Specialties
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {clinic.specialties.map((spec) => (
                    <div
                      key={spec}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Clinic Facilities & Support
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {clinic.facilities.map((fac) => (
                    <div
                      key={fac}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-800"
                    >
                      <Heart className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Practitioners on Duty */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Practitioners at this Seva Center
              </h3>

              <div className="space-y-3">
                {practitioners.map((prac) => (
                  <div
                    key={prac.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{prac.name}</span>
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {prac.experienceYears} yrs seva
                      </span>
                    </div>
                    <p className="text-slate-600">{prac.title}</p>
                    <p className="text-slate-500 text-[11px]">
                      <strong>Focus:</strong> {prac.specialization}
                    </p>
                    <div className="pt-1 text-[11px] text-teal-800">
                      <strong>Hours:</strong> {prac.timing}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            {!bookingSuccessToken ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-700" />
                    <h3 className="text-base font-bold text-slate-900">
                      Book Demonstration Consultation
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeBookingFlow}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 bg-teal-50 rounded-xl text-teal-900 border border-teal-200">
                  <p className="font-semibold text-slate-900">{clinic.name}</p>
                  <p className="text-[11px] text-teal-700">Padmanabhanagar, Bengaluru</p>
                </div>

                {/* Patient Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                  />
                </div>

                {/* Patient Mobile */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Mobile Number (Demo)
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                  />
                </div>

                {/* Practitioner Select */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preferred Certified Practitioner
                  </label>
                  <select
                    value={selectedPractitioner}
                    onChange={(e) => setSelectedPractitioner(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer"
                  >
                    {practitioners.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — {p.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time Slot */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Consultation Date
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer"
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reason for visit */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Reason for Consultation / Symptoms
                  </label>
                  <textarea
                    rows={2}
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    placeholder="Briefly describe health concerns..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200">
                  <strong>Prototype notice:</strong> No real patient data is stored. Submitting adds this demonstration token to the local prototype session.
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeBookingFlow}
                    className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Confirm Demo Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-center py-2">
                <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto border border-teal-200">
                  <Check className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Appointment Token Confirmed
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Token #{bookingSuccessToken.tokenNumber}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your consultation slot at {bookingSuccessToken.clinicName} has been recorded in the prototype session.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-semibold text-slate-900">{bookingSuccessToken.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Practitioner:</span>
                    <span className="font-semibold text-slate-900">{bookingSuccessToken.practitionerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-semibold text-slate-900">{bookingSuccessToken.date} · {bookingSuccessToken.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-semibold text-teal-800">{bookingSuccessToken.status}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      closeBookingFlow();
                      onNavigate('patient-dashboard');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    View in Patient Dashboard Preview
                  </button>
                  <button
                    onClick={closeBookingFlow}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
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
