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
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  Save,
  Check
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

  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId);

  const handleSelectPatient = (apt: Appointment) => {
    setSelectedAppointmentId(apt.id);
    setConsultationNotes(apt.notes || `Initial consultation for ${apt.patientName}.`);
    setSavedSuccessNotice(false);
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
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
          <span>/</span>
          <span className="text-slate-900 font-medium">Practitioner Dashboard Preview</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Certified Practitioner Console
              </span>
              <span className="text-xs text-slate-500 font-medium">Padmanabhanagar Pilot Unit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dr. K. S. Ramesh, BAMS, MD (Ayu)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Senior Sai Vibronics Practitioner & Seva Coordinator
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white px-3.5 py-2 rounded-xl border border-slate-200">
            <Clock className="w-4 h-4 text-teal-700" />
            <span className="text-slate-700">Today&apos;s Seva Queue: <strong className="text-slate-900 font-bold">{appointments.length} Patients</strong></span>
          </div>
        </div>
      </div>

      {/* Safety Notice Banning Automated / AI Diagnosis */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">
            Clinical Safety & Prototype Boundary:
          </p>
          <p className="text-amber-900/90 leading-relaxed">
            This prototype does <strong>not</strong> provide automated AI diagnosis, algorithmically generated prescription dosages, or machine treatment recommendations. All consultation notes and potentised Vibronics remedy selections are strictly manually logged demonstration records by human volunteer practitioners.
          </p>
        </div>
      </div>

      {savedSuccessNotice && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Consultation summary saved to session! Patient status updated to &ldquo;Completed&rdquo;.</span>
        </div>
      )}

      {/* Two Column Layout: Patient Queue on Left, Consultation Desk on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Today's Queue */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Today&apos;s Patient Queue
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Padmanabhanagar (Desk 01)
            </span>
          </div>

          <div className="space-y-2.5">
            {appointments.map((apt) => (
              <button
                key={apt.id}
                type="button"
                onClick={() => handleSelectPatient(apt)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedAppointmentId === apt.id
                    ? 'bg-teal-50/70 border-teal-400 ring-1 ring-teal-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {apt.tokenNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {apt.patientName}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      apt.status === 'In Consultation'
                        ? 'bg-teal-600 text-white'
                        : apt.status === 'Completed'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Slot: {apt.timeSlot}</span>
                  <span className="font-mono text-[10px]">{apt.patientId}</span>
                </div>

                <div className="text-[11px] text-slate-600 mt-1 truncate">
                  Reason: {apt.reasonForVisit}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Consultation Summary Interface */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-6 shadow-2xs">
          {selectedApt ? (
            <form onSubmit={handleSaveConsultation} className="space-y-5 text-xs">
              {/* Patient Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-800 text-sm">
                      {selectedApt.tokenNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedApt.patientName}
                    </h3>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Patient ID: <span className="font-mono">{selectedApt.patientId}</span> · Slot: {selectedApt.timeSlot}
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                    Current Status: {selectedApt.status}
                  </span>
                </div>
              </div>

              {/* Stated Symptoms */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Patient Stated Concern / Reason for Visit
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {selectedApt.reasonForVisit}
                </div>
              </div>

              {/* Consultation Evaluation Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Practitioner Consultation & Assessment Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Record patient pulse quality, tongue observation, digestion status, sleep habits..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 leading-relaxed"
                />
              </div>

              {/* Vibronics Remedy Selector */}
              <div className="space-y-3">
                <label className="block font-semibold text-slate-700">
                  Prescribe Sai Vibronics Remedies (108 Common Combinations)
                </label>

                {/* Remedy addition row */}
                <div className="flex items-center gap-2">
                  <select
                    value={remedyToAdd}
                    onChange={(e) => setRemedyToAdd(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 cursor-pointer"
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
                    className="px-3 py-2 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Selected remedies list */}
                <div className="space-y-2">
                  {selectedRemedyCodes.map((code) => {
                    const remedy = VIBRONICS_REMEDIES.find((r) => r.code === code);
                    return (
                      <div
                        key={code}
                        className="flex items-center justify-between p-2.5 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs text-teal-950"
                      >
                        <div>
                          <strong className="font-mono text-teal-800">{code}</strong> ·{' '}
                          <span className="font-medium">{remedy?.name || code}</span>
                          <span className="text-[11px] text-slate-500 block">
                            Indications: {remedy?.commonUses}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRemedy(code)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dosage Instructions */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dosage & Administration Instructions
                </label>
                <input
                  type="text"
                  value={dosageInstructions}
                  onChange={(e) => setDosageInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                />
              </div>

              {/* Follow-up Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Recommended Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Save Consultation Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('clinic-admin-dashboard')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Switch to Admin View
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Complete Consultation</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a patient from the queue to start or review consultation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
