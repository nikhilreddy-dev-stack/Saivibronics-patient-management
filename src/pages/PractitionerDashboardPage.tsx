import React, { useState } from 'react';
import {
  Appointment,
  VibronicsRemedy,
  PageId,
  PrescriptionRecord,
  ChatMessage,
  HistoricalRecord,
  RemedyItem
} from '../types';
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
  AlertCircle,
  Printer,
  MessageSquare,
  Send,
  FileCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Heart
} from 'lucide-react';

interface PractitionerDashboardPageProps {
  appointments: Appointment[];
  prescriptions?: PrescriptionRecord[];
  messages?: ChatMessage[];
  historicalRecords?: HistoricalRecord[];
  onNavigate: (page: PageId) => void;
  onUpdateAppointment: (updated: Appointment) => void;
  onCreatePrescription?: (prescription: PrescriptionRecord) => void;
  onSendMessage?: (text: string) => void;
  onVerifyHistoricalRecord?: (recordId: string, status: 'Approved' | 'Returned', notes?: string) => void;
}

export const PractitionerDashboardPage: React.FC<PractitionerDashboardPageProps> = ({
  appointments,
  prescriptions = [],
  messages = [],
  historicalRecords = [],
  onNavigate,
  onUpdateAppointment,
  onCreatePrescription,
  onSendMessage,
  onVerifyHistoricalRecord,
}) => {
  const [activeTab, setActiveTab] = useState<
    'queue' | 'consultation' | 'prescriptions' | 'messages' | 'historical' | 'roster'
  >('queue');

  // Selected patient for consultation
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(
    appointments.find((a) => a.status === 'In Consultation')?.id ||
    appointments.find((a) => a.status === 'Waiting')?.id ||
    appointments[0]?.id || ''
  );

  // Digital Consultation form state (The 6 structured sections)
  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId);

  const [statedConcern, setStatedConcern] = useState(
    selectedApt?.reasonForVisit || 'Follow-up for knee joint comfort and general vitality.'
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient reports steady 60% reduction in morning joint stiffness. Appetite normal. Tongue pink and clean. Pulse 74 bpm rhythmic.'
  );
  const [selectedRemedies, setSelectedRemedies] = useState<RemedyItem[]>([
    {
      code: 'CC20.3',
      name: 'Arthritis & Joint Support',
      dosage: '3 globules dry on clean tongue',
      frequency: 'Three times daily (TDS)',
      duration: '30 Days',
      instructions: 'Take 15 minutes before meals. Avoid touching globules with wet hands.',
      precautions: 'Store away from camphor, eucalyptus, and electronics.'
    },
    {
      code: 'CC12.1',
      name: 'Adult Tonic',
      dosage: '3 globules in lukewarm water',
      frequency: 'Twice daily (BD)',
      duration: '30 Days',
      instructions: 'Take morning and night for sustained vitality and immunity.',
    }
  ]);
  const [remedySearchQuery, setRemedySearchQuery] = useState('');
  const [remedyCategoryFilter, setRemedyCategoryFilter] = useState('All');
  const [selectedRemedyToAdd, setSelectedRemedyToAdd] = useState<string>('CC4.1');
  const [followUpDate, setFollowUpDate] = useState('2026-11-28');
  const [followUpInstructions, setFollowUpInstructions] = useState(
    'Return for review in 4 weeks. Continue gentle morning walking in warm sunlight.'
  );

  // Consultation preview modal
  const [previewPrescription, setPreviewPrescription] = useState<PrescriptionRecord | null>(null);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState<string | null>(null);

  // Practitioner message input
  const [replyText, setReplyText] = useState('');

  // Queue counts
  const waitingApts = appointments.filter((a) => a.status === 'Waiting');
  const inConsultationApts = appointments.filter((a) => a.status === 'In Consultation');
  const completedApts = appointments.filter((a) => a.status === 'Completed');
  const scheduledApts = appointments.filter((a) => a.status === 'Scheduled');

  // Handle patient selection from queue
  const handleSelectPatientForConsultation = (apt: Appointment) => {
    setSelectedAppointmentId(apt.id);
    setStatedConcern(apt.reasonForVisit || 'General wellness consultation');
    setClinicalNotes(apt.notes || `Initial consultation observations for ${apt.patientName}. Vitals stable.`);
    // Automatically set status to In Consultation if Waiting
    if (apt.status === 'Waiting' || apt.status === 'Scheduled') {
      onUpdateAppointment({ ...apt, status: 'In Consultation' });
    }
    setActiveTab('consultation');
  };

  // Add remedy to prescription
  const handleAddRemedy = () => {
    const remedyDef = VIBRONICS_REMEDIES.find((r) => r.code === selectedRemedyToAdd);
    if (!remedyDef) return;
    if (selectedRemedies.some((r) => r.code === remedyDef.code)) return;

    setSelectedRemedies([
      ...selectedRemedies,
      {
        code: remedyDef.code,
        name: remedyDef.name,
        dosage: '3 globules dry on clean tongue',
        frequency: 'Three times daily (TDS)',
        duration: '30 Days',
        instructions: 'Take 15 minutes before meals. Dissolve gently in mouth.',
        precautions: 'Keep away from direct sunlight, camphor, and mobile radiation.',
      },
    ]);
  };

  const handleRemoveRemedy = (code: string) => {
    setSelectedRemedies(selectedRemedies.filter((r) => r.code !== code));
  };

  // Finalise consultation & generate prescription record
  const handleFinaliseConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;

    const newRx: PrescriptionRecord = {
      id: `rx-${Date.now().toString().slice(-6)}`,
      appointmentId: selectedApt.id,
      patientId: selectedApt.patientId,
      patientName: selectedApt.patientName,
      practitionerId: 'prac-1',
      practitionerName: 'Dr. K. S. Ramesh, BAMS, MD (Ayu)',
      clinicName: selectedApt.clinicName,
      date: new Date().toISOString().slice(0, 10),
      patientConcern: statedConcern,
      clinicalNotes: clinicalNotes,
      remedies: selectedRemedies,
      followUpDate: followUpDate,
      followUpInstructions: followUpInstructions,
      status: 'Finalised',
      createdAt: new Date().toISOString(),
      finalisedAt: new Date().toISOString(),
    };

    if (onCreatePrescription) {
      onCreatePrescription(newRx);
    } else {
      // Fallback: update appointment status
      onUpdateAppointment({
        ...selectedApt,
        status: 'Completed',
        notes: clinicalNotes,
        remedySummary: selectedRemedies.map((r) => `${r.code} (${r.name})`).join(' + '),
      });
    }

    setPreviewPrescription(newRx);
    setSavedSuccessNotice(`Digital prescription finalised for ${selectedApt.patientName}. Token marked Completed.`);
    setTimeout(() => setSavedSuccessNotice(null), 5000);
  };

  // Send message to patient
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onSendMessage) {
      onSendMessage(replyText.trim());
    }
    setReplyText('');
    setSavedSuccessNotice('Message reply sent to patient.');
    setTimeout(() => setSavedSuccessNotice(null), 3000);
  };

  const pendingVerificationRecords = historicalRecords.filter(
    (r) => r.verificationStatus === 'Pending Verification'
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Clinical Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                <Stethoscope className="w-6 h-6 text-teal-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Dr. K. S. Ramesh, BAMS, MD (Ayu)
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                    Sai Vibronics Level 3
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Reg No: <span className="font-mono font-semibold text-slate-700">KA-AYU-1988-42</span> · Padmanabhanagar Pilot Center (Room 1)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Seva Session Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-1">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'queue'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Today&apos;s Queue ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('consultation')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'consultation'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Digital Consultation Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'prescriptions'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Prescriptions Archive ({prescriptions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'messages'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Patient Inquiries ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('historical')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'historical'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Paper Register Dual Sign-Off</span>
              {pendingVerificationRecords.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {pendingVerificationRecords.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Success Feedback Alert */}
        {savedSuccessNotice && (
          <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-teal-900 flex items-center gap-3 shadow-2xs">
            <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
            <span className="text-sm font-semibold">{savedSuccessNotice}</span>
          </div>
        )}

        {/* TAB 1: TODAY'S QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Real-time stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Tokens</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{appointments.length}</p>
                <span className="text-[11px] text-slate-400">Padmanabhanagar Desk</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-amber-700 uppercase">Waiting in Reception</span>
                <p className="text-2xl font-bold text-amber-700 mt-1">{waitingApts.length}</p>
                <span className="text-[11px] text-slate-400">Next in line</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-blue-700 uppercase">In Consultation</span>
                <p className="text-2xl font-bold text-blue-700 mt-1">{inConsultationApts.length}</p>
                <span className="text-[11px] text-slate-400">Active session</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-emerald-700 uppercase">Completed</span>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{completedApts.length}</p>
                <span className="text-[11px] text-slate-400">Remedies dispensed</span>
              </div>
            </div>

            {/* Queue Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Today&apos;s Seva Roster & Queue</h3>
                  <p className="text-xs text-slate-500">Select any patient to open their clinical consultation form</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {appointments.map((apt) => {
                  const isCurrent = apt.id === selectedAppointmentId;
                  return (
                    <div
                      key={apt.id}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isCurrent ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex flex-col items-center justify-center font-bold shrink-0">
                          <span className="text-[10px] text-slate-400 uppercase">Token</span>
                          <span className="text-sm text-blue-700 font-mono">{apt.tokenNumber}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                            <span className="text-xs font-mono text-slate-400">({apt.patientId})</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                apt.status === 'In Consultation'
                                  ? 'bg-blue-100 text-blue-800'
                                  : apt.status === 'Waiting'
                                  ? 'bg-amber-100 text-amber-800'
                                  : apt.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            <strong>Reason:</strong> {apt.reasonForVisit}
                          </p>
                          <div className="text-[11px] text-slate-400 flex items-center gap-3">
                            <span>Slot: {apt.timeSlot}</span>
                            <span>·</span>
                            <span>Desk: Room 1</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <button
                          onClick={() => handleSelectPatientForConsultation(apt)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>{apt.status === 'Completed' ? 'Review Form' : 'Start Consultation'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL CONSULTATION WORKSPACE (THE 6 STRUCTURED SECTIONS) */}
        {activeTab === 'consultation' && (
          <div className="space-y-6">
            {/* Active Patient Bar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
                  {selectedApt?.tokenNumber || 'PT'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Active Patient:</span>
                    <strong className="text-sm text-slate-900 font-bold">{selectedApt?.patientName}</strong>
                    <span className="text-xs font-mono text-slate-500">({selectedApt?.patientId})</span>
                  </div>
                  <p className="text-xs text-slate-500">Token #{selectedApt?.tokenNumber} · Slot: {selectedApt?.timeSlot}</p>
                </div>
              </div>

              {/* Patient Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Switch Patient:</span>
                <select
                  value={selectedAppointmentId}
                  onChange={(e) => {
                    const apt = appointments.find((a) => a.id === e.target.value);
                    if (apt) handleSelectPatientForConsultation(apt);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                >
                  {appointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.tokenNumber} - {a.patientName} ({a.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Structured 6-Section Consultation Form */}
            <form onSubmit={handleFinaliseConsultation} className="space-y-6">
              {/* SECTION 1: STATED CONCERN */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-base font-bold">Patient Stated Chief Concern</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Record the patient&apos;s symptoms, duration, and personal description of discomfort.
                </p>
                <textarea
                  rows={2}
                  value={statedConcern}
                  onChange={(e) => setStatedConcern(e.target.value)}
                  placeholder="e.g. Knee joint stiffness upon waking, aggravated by cold weather..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* SECTION 2: CLINICAL EXAMINATION & NOTES */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-base font-bold">Clinical Examination & Observations</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Ayurvedic / Vibronics diagnostic assessment (Pulse examination, tongue, vital warmth, past remedy response).
                </p>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Record clinical assessment findings..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* SECTION 3: REMEDY SELECTOR FROM VIBRONICS 108 CATALOGUE */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h3 className="text-base font-bold">Vibronics 108 Remedy Formulations</h3>
                      <p className="text-xs text-slate-500">Select potentised remedies to include in this consultation</p>
                    </div>
                  </div>
                </div>

                {/* Remedy Search & Add Bar */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select
                      value={selectedRemedyToAdd}
                      onChange={(e) => setSelectedRemedyToAdd(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                    >
                      {VIBRONICS_REMEDIES.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.code} - {r.name} ({r.category})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAddRemedy}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Rx</span>
                    </button>
                  </div>
                </div>

                {/* Selected remedies list */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    Selected Remedies for this Patient ({selectedRemedies.length})
                  </span>
                  {selectedRemedies.length === 0 ? (
                    <div className="p-4 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                      No remedies added yet. Choose a remedy above and click &ldquo;Add to Rx&rdquo;.
                    </div>
                  ) : (
                    selectedRemedies.map((remedy, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-mono font-bold text-xs">
                              {remedy.code}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{remedy.name}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveRemedy(remedy.code)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Remove remedy"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Dosage Format</label>
                            <input
                              type="text"
                              value={remedy.dosage}
                              onChange={(e) => {
                                const updated = [...selectedRemedies];
                                updated[idx].dosage = e.target.value;
                                setSelectedRemedies(updated);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Frequency</label>
                            <select
                              value={remedy.frequency}
                              onChange={(e) => {
                                const updated = [...selectedRemedies];
                                updated[idx].frequency = e.target.value;
                                setSelectedRemedies(updated);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                            >
                              <option>Three times daily (TDS)</option>
                              <option>Twice daily (BD)</option>
                              <option>Once daily at bedtime (OD)</option>
                              <option>Acute: hourly in water</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Duration</label>
                            <input
                              type="text"
                              value={remedy.duration}
                              onChange={(e) => {
                                const updated = [...selectedRemedies];
                                updated[idx].duration = e.target.value;
                                setSelectedRemedies(updated);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 4: DOSAGE & STORAGE INSTRUCTIONS */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-base font-bold">Standard Dosage & Storage Guidelines</h3>
                </div>
                <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 space-y-1">
                  <p><strong>Universal Sai Vibronics Protocol:</strong></p>
                  <p>• 3 potentised sugar globules dissolved slowly on clean tongue, 15 minutes before food.</p>
                  <p>• Store remedies away from strong camphor, perfumes, and electromagnetic radiation (mobile phones).</p>
                  <p>• Clean glass phials provided free as voluntary service.</p>
                </div>
              </div>

              {/* SECTION 5: FOLLOW-UP DATE & INSTRUCTIONS */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    5
                  </span>
                  <h3 className="text-base font-bold">Next Review & Follow-up Instructions</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Suggested Follow-up Date</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Lifestyle & Diet Recommendations</label>
                    <input
                      type="text"
                      value={followUpInstructions}
                      onChange={(e) => setFollowUpInstructions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: SAVE DRAFT / FINALISE CONSULTATION */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Finalise Digital Consultation</h3>
                  <p className="text-xs text-slate-500">
                    Generates the official prescription document, updates the patient&apos;s records, and completes token.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Finalise & Sign Prescription</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PRESCRIPTIONS ARCHIVE */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Consultation Prescriptions Archive</h2>
              <p className="text-xs text-slate-500">History of digital prescriptions issued at Padmanabhanagar</p>
            </div>

            <div className="space-y-4">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{rx.id}</span>
                      <span className="text-xs text-slate-500">· {rx.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{rx.patientName} ({rx.patientId})</h4>
                    <p className="text-xs text-slate-600">
                      <strong>Remedies:</strong> {rx.remedies.map((r) => `${r.code} (${r.name})`).join(', ')}
                    </p>
                  </div>

                  <button
                    onClick={() => setPreviewPrescription(rx)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PATIENT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Patient Care Inbox</h2>
              <p className="text-xs text-slate-500">Respond to dosage questions and recovery updates from registered patients</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Smt. Ananya Rao (SSSO-BLR-2026-0842)</h4>
                  <p className="text-xs text-slate-500">Padmanabhanagar Pilot · Taking CC20.3 & CC12.1</p>
                </div>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active Care Thread
                </span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {messages.map((msg) => {
                  const isPractitioner = msg.senderRole === 'practitioner';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isPractitioner ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isPractitioner
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`block text-[10px] mt-1 text-right ${
                            isPractitioner ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type clinical advice or encouragement for the patient..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: HISTORICAL RECORDS DUAL SIGN-OFF */}
        {activeTab === 'historical' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Paper Register Digitisation Dual Sign-Off</h2>
              <p className="text-xs text-slate-500">
                Verify historical paper records entered by reception volunteers against scanned physical books.
              </p>
            </div>

            <div className="space-y-4">
              {historicalRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">{rec.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rec.verificationStatus === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.verificationStatus}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {rec.patientName} ({rec.patientId})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Original Visit: {rec.originalVisitDate} · Scanned Doc: <span className="font-mono text-blue-600">{rec.scannedDocRef}</span>
                      </p>
                    </div>

                    {rec.verificationStatus === 'Pending Verification' && onVerifyHistoricalRecord && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onVerifyHistoricalRecord(rec.id, 'Approved', 'Verified with paper volume.')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Sign-Off</span>
                        </button>
                        <button
                          onClick={() => onVerifyHistoricalRecord(rec.id, 'Returned', 'Clarification needed on dosage.')}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Return for Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700">
                    <strong>Digitised Summary:</strong> {rec.digitisedSummary}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-4">
                    <span>Entered by: {rec.enteredBy} on {rec.dateEntered}</span>
                    {rec.verifiedBy && (
                      <span>Verified by: {rec.verifiedBy} ({rec.dateVerified})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PRESCRIPTION PREVIEW MODAL */}
      {previewPrescription && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sri Sathya Sai Vibronics Seva</h3>
                  <p className="text-xs text-slate-500">Digital Consultation Record</p>
                </div>
              </div>

              <button
                onClick={() => setPreviewPrescription(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                <div>
                  <span className="text-slate-400 block text-xs">Patient</span>
                  <span className="font-bold text-slate-900">{previewPrescription.patientName} ({previewPrescription.patientId})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Date</span>
                  <span className="font-bold text-slate-800">{previewPrescription.date}</span>
                </div>
              </div>

              <p><strong>Clinical Assessment:</strong> {previewPrescription.clinicalNotes}</p>

              <div className="space-y-1.5 pt-1">
                <strong>Prescribed Formulations:</strong>
                {previewPrescription.remedies.map((rem, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{rem.code} - {rem.name}</span>
                      <span className="text-blue-600">{rem.frequency}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{rem.dosage} · {rem.duration}</p>
                  </div>
                ))}
              </div>

              {previewPrescription.followUpDate && (
                <p className="text-teal-800 bg-teal-50 p-2.5 rounded-xl border border-teal-200 text-xs">
                  <strong>Follow-up: </strong> {previewPrescription.followUpInstructions} ({previewPrescription.followUpDate})
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewPrescription(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
