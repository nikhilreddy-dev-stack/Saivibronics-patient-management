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
  Droplet
} from 'lucide-react';

interface PatientDashboardPageProps {
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  onNavigate: (page: PageId) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

export const PatientDashboardPage: React.FC<PatientDashboardPageProps> = ({
  appointments,
  medicalRecords,
  onNavigate,
  onCancelAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'records' | 'profile'>('appointments');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'Scheduled' || apt.status === 'Waiting' || apt.status === 'In Consultation'
  );

  const handleCancelClick = (aptId: string) => {
    onCancelAppointment(aptId);
    setActionFeedback('Appointment token cancelled successfully in prototype session.');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner / Breadcrumb */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
          <span>/</span>
          <span className="text-slate-900 font-medium">Patient Dashboard Preview</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Patient Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: SSSO-BLR-2026-0842</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Namaskaram, Smt. Ananya Rao
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Primary Clinic: <strong className="text-slate-800">Padmanabhanagar Pilot Unit (560070)</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('find-clinic')}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Token</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Demonstration Portal Preview:</strong> You are viewing sample patient data for Smt. Ananya Rao. Changes made during this session are kept in local component memory and do not write to a live medical record server.
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Navigation Tabs (Single line segmented control) */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeTab === 'appointments'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming Visits ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeTab === 'records'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Medical Records ({medicalRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profile & Contacts
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active & Upcoming Appointments
            </h2>
            <span className="text-xs text-slate-500">
              Token Queue is managed by Padmanabhanagar Seva Desk
            </span>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No active appointments scheduled</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You currently do not have any pending tokens. You can schedule a visit at the Padmanabhanagar pilot center anytime.
              </p>
              <button
                onClick={() => onNavigate('find-clinic')}
                className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800 transition-colors"
              >
                Schedule Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded text-xs font-mono">
                          Token {apt.tokenNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {apt.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        {apt.clinicName}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-600 shrink-0" />
                      <span><strong>Practitioner:</strong> {apt.practitionerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                      <span><strong>Date & Time:</strong> {apt.date} · {apt.timeSlot}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                      <strong>Reason:</strong> {apt.reasonForVisit}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Free seva consultation</span>
                    <button
                      onClick={() => handleCancelClick(apt.id)}
                      className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer text-xs"
                    >
                      Cancel Token
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Remedy Guidance note */}
          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-5 text-xs text-teal-900 space-y-2">
            <h4 className="font-bold flex items-center gap-2 text-teal-950">
              <Droplet className="w-4 h-4 text-teal-700" />
              <span>Vibronics Remedy Care Instructions for Patients</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              Vibronics potentised remedies are sugar globules or purified water charged with subtle healing vibrations. Take globules directly on a clean tongue without touching with bare fingers. Avoid strong mint, camphor, coffee, or garlic 15 minutes before and after taking doses. Store away from intense mobile phone radiation.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: MEDICAL RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Consultation Summaries & Remedy Logs
            </h2>
            <span className="text-xs text-slate-500">
              Logged by certified Sri Sathya Sai practitioners
            </span>
          </div>

          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-teal-700">
                      Visit on {record.date}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {record.clinicName}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500">
                    Consultant: <strong className="text-slate-800">{record.practitionerName}</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">Consultation Evaluation:</span>
                    <p className="text-slate-800 mt-0.5">{record.diagnosisSummary}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700">Prescribed Vibronics Remedies:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-800 mt-1">
                      {record.prescribedRemedies.map((remedy, i) => (
                        <li key={i} className="font-medium text-teal-900">{remedy}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <strong>Follow-up Advice:</strong> {record.followUpAdvice}
                    </div>
                    <div>
                      <strong>Lifestyle & Dietary Notes:</strong> {record.lifestyleNotes}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>BP: <strong className="text-slate-800 font-mono">{record.vitals.bp}</strong></span>
                    <span>Pulse: <strong className="text-slate-800 font-mono">{record.vitals.pulse}</strong></span>
                    <span>Weight: <strong className="text-slate-800 font-mono">{record.vitals.weight}</strong></span>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer text-xs"
                  >
                    View Full Sheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs max-w-2xl">
          <h2 className="text-base font-bold text-slate-900">
            Patient Information & Preferences
          </h2>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Full Name</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">Smt. Ananya Rao</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Patient Card ID</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">SSSO-BLR-2026-0842</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Contact Mobile</span>
                <span className="font-bold text-slate-900 mt-0.5 block">+91 98450 12345 (Demo)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Registered Email</span>
                <span className="font-bold text-slate-900 mt-0.5 block">ananya.rao@example.com</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Residential Locality & PIN</span>
              <span className="font-bold text-slate-900 mt-0.5 block">18th Cross, Padmanabhanagar, Bengaluru 560070</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Emergency Attendant / Family Contact</span>
              <span className="font-bold text-slate-900 mt-0.5 block">Sri R. K. Rao (Spouse) · +91 98450 98765</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">Consultation Sheet</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-teal-50 rounded-xl">
                <div className="font-bold text-slate-900">{selectedRecord.clinicName}</div>
                <div className="text-teal-700 text-[11px]">Date: {selectedRecord.date} · Practitioner: {selectedRecord.practitionerName}</div>
              </div>

              <div>
                <strong>Clinical Notes:</strong>
                <p className="mt-1 text-slate-800">{selectedRecord.diagnosisSummary}</p>
              </div>

              <div>
                <strong>Prescribed Vibronics Remedies:</strong>
                <div className="mt-1 space-y-1">
                  {selectedRecord.prescribedRemedies.map((r, i) => (
                    <div key={i} className="p-2 bg-slate-100 rounded-lg text-slate-900 font-medium">{r}</div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Dosage Advice:</strong> {selectedRecord.followUpAdvice}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
