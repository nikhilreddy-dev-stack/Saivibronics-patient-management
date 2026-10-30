import React, { useState } from 'react';
import { Appointment, VibronicsRemedy, PageId } from '../types';
import { VIBRONICS_REMEDIES } from '../data/mockData';
import {
  Stethoscope,
  Clock,
  User,
  CheckCircle,
  FileEdit,
  ShieldAlert,
  Plus,
  Trash2,
  Calendar,
  Save,
  Check,
  Activity,
  Users,
  ChevronRight,
  Droplet,
  Search,
  FileText,
  AlertCircle
} from 'lucide-react';

interface PractitionerDashboardPageProps {
  appointments: Appointment[];
  onNavigate: (page: PageId) => void;
  onUpdateAppointment: (updated: Appointment) => void;
}

export const PractitionerDashboardPage: React.FC<PractitionerDashboardPageProps> = ({
  appointments,
  onNavigate,
  onUpdateAppointment,
}) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(
    appointments[1]?.id || appointments[0]?.id || ''
  );
  const [consultationNotes, setConsultationNotes] = useState(
    'Patient reports noticeable reduction in morning joint stiffness. Appetite normal. Recommending continuation of vitality tonic.'
  );
  const [selectedRemedyCodes, setSelectedRemedyCodes] = useState<string[]>(['CC20.3', 'CC12.1']);
  const [remedyToAdd, setRemedyToAdd] = useState('CC15.1');
  const [dosageInstructions, setDosageInstructions] = useState('3 globules TDS (dry on clean tongue 15 mins before meals)');
  const [followUpDate, setFollowUpDate] = useState('2026-11-28');
  const [savedSuccessNotice, setSavedSuccessNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'consultation' | 'queue' | 'remedies'>('consultation');

  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId);

  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const waitingCount = appointments.filter((a) => a.status === 'Waiting').length;
  const inConsultationCount = appointments.filter((a) => a.status === 'In Consultation').length;

  const handleSelectPatient = (apt: Appointment) => {
    setSelectedAppointmentId(apt.id);
    setConsultationNotes(apt.notes || `Initial consultation for ${apt.patientName}.`);
    setSavedSuccessNotice(false);
    setActiveTab('consultation');
  };

  const handleAddRemedy = () => {
    if (remedyToAdd && !selectedRemedyCodes.includes(remedyToAdd)) {
      setSelectedRemedyCodes([...selectedRemedyCodes, remedyToAdd]);
    }
  };

  const handleRemoveRemedy = (code: string) => {
    setSelectedRemedyCodes(selectedRemedyCodes.filter((c) => c !== code));
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;

    const remedySummary = selectedRemedyCodes
      .map((code) => {
        const found = VIBRONICS_REMEDIES.find((r) => r.code === code);
        return found ? `${found.code} (${found.name})` : code;
      })
      .join(' + ') + ` | ${dosageInstructions}`;

    const updated: Appointment = {
      ...selectedApt,
      status: 'Completed',
      notes: consultationNotes,
      remedySummary,
    };

    onUpdateAppointment(updated);
    setSavedSuccessNotice(true);
    setTimeout(() => setSavedSuccessNotice(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-teal-700 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Practitioner Clinical Console</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Certified Practitioner Console
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-semibold">
                Padmanabhanagar Pilot Headquarters
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dr. K. S. Ramesh, BAMS, MD (Ayu)
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Senior Sai Vibronics Practitioner & Seva Coordinator · Room 01
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('clinic-admin-dashboard')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px]"
            >
              Switch to Clinic Admin
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Healthcare KPI Cards (Design Reference 1: Desktop summary cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Patients Today</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">{appointments.length}</div>
          <span className="text-xs text-teal-700 font-bold">Scheduled queue</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">In Consultation</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono tabular-nums">{inConsultationCount}</div>
          <span className="text-xs text-slate-500">Active inside Room 01</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Waiting in Hall</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tabular-nums">{waitingCount}</div>
          <span className="text-xs text-amber-800 font-bold">Next in line</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Completed Consultations</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">{completedCount}</div>
          <span className="text-xs text-emerald-800 font-bold">Remedies dispensed</span>
        </div>
      </div>

      {/* Safety Notice Banning Automated / AI Diagnosis */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold text-amber-950">
            Clinical Safety & Prototype Boundary:
          </p>
          <p>
            This prototype does <strong>not</strong> provide automated AI diagnosis, algorithmically generated prescription dosages, or machine treatment recommendations. All consultation notes and potentised Vibronics remedy selections are strictly manually logged demonstration records by human volunteer practitioners.
          </p>
        </div>
      </div>

      {savedSuccessNotice && (
        <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-sm text-teal-950 flex items-center gap-3 shadow-2xs">
          <Check className="w-5 h-5 text-teal-600 shrink-0" />
          <span className="font-bold">Consultation summary saved to session! Patient status updated to &ldquo;Completed&rdquo;.</span>
        </div>
      )}

      {/* Two Column Layout: Patient Queue on Left, Clinical Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Today's Queue Sidebar */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-700" />
              <span>Today&apos;s Seva Queue</span>
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">
              Desk 01 (Padmanabhanagar)
            </span>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <button
                key={apt.id}
                type="button"
                onClick={() => handleSelectPatient(apt)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer min-h-[48px] ${
                  selectedAppointmentId === apt.id
                    ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                      {apt.tokenNumber}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {apt.patientName}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      apt.status === 'In Consultation'
                        ? 'bg-teal-700 text-white'
                        : apt.status === 'Completed'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>Slot: <strong className="text-slate-700">{apt.timeSlot}</strong></span>
                  <span className="font-mono text-slate-400">{apt.patientId}</span>
                </div>

                <div className="text-xs text-slate-600 mt-1.5 line-clamp-1">
                  Reason: {apt.reasonForVisit}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Clinical Consultation Workspace */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          {selectedApt ? (
            <form onSubmit={handleSaveConsultation} className="space-y-6 text-sm">
              
              {/* Patient Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-teal-50/70 rounded-2xl border border-teal-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-teal-800 text-base bg-white px-2.5 py-1 rounded-lg border border-teal-200">
                      {selectedApt.tokenNumber}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {selectedApt.patientName}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Card ID: <span className="font-mono font-semibold">{selectedApt.patientId}</span> · Slot: {selectedApt.timeSlot}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-teal-900 bg-white px-3 py-1.5 rounded-xl border border-teal-200">
                    Status: {selectedApt.status}
                  </span>
                </div>
              </div>

              {/* Patient Stated Concern */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Patient Stated Concern / Reason for Visit
                </label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-sm">
                  {selectedApt.reasonForVisit}
                </div>
              </div>

              {/* Practitioner Consultation Notes */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Practitioner Clinical Assessment & Lifestyle Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Record patient pulse observation, tongue diagnosis, digestion status, sleep habits..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 leading-relaxed"
                />
              </div>

              {/* Vibronics Remedy Selector */}
              <div className="space-y-3">
                <label className="block font-bold text-slate-800">
                  Prescribe Sai Vibronics Remedies (108 Common Combinations)
                </label>

                {/* Add Remedy Row */}
                <div className="flex items-center gap-2">
                  <select
                    value={remedyToAdd}
                    onChange={(e) => setRemedyToAdd(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 cursor-pointer min-h-[48px]"
                  >
                    {VIBRONICS_REMEDIES.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.code} — {r.name} ({r.category})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddRemedy}
                    className="px-5 py-3 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 font-bold rounded-2xl text-sm transition-colors flex items-center gap-1.5 cursor-pointer min-h-[48px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Remedy</span>
                  </button>
                </div>

                {/* Selected Remedies List */}
                <div className="space-y-2.5">
                  {selectedRemedyCodes.map((code) => {
                    const remedy = VIBRONICS_REMEDIES.find((r) => r.code === code);
                    return (
                      <div
                        key={code}
                        className="flex items-center justify-between p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200 text-teal-950"
                      >
                        <div>
                          <strong className="font-mono text-teal-800 text-sm">{code}</strong> ·{' '}
                          <span className="font-bold text-slate-900">{remedy?.name || code}</span>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            Indications: {remedy?.commonUses}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRemedy(code)}
                          className="text-slate-400 hover:text-rose-600 p-2 min-h-[36px] min-w-[36px]"
                          aria-label={`Remove remedy ${code}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dosage Instructions */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Dosage & Administration Instructions
                </label>
                <input
                  type="text"
                  value={dosageInstructions}
                  onChange={(e) => setDosageInstructions(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Recommended Follow-up Review Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full sm:w-64 px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                />
              </div>

              {/* Save Consultation Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-2xl text-base transition-colors flex items-center gap-2 cursor-pointer shadow-xs min-h-[48px]"
                >
                  <Save className="w-5 h-5" />
                  <span>Save & Complete Consultation</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-16 text-slate-500 text-sm">
              Select a patient from the queue to start or review consultation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
