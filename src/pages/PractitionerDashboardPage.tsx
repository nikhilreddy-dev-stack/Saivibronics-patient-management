import React, { useState, useMemo } from 'react';
import {
  Appointment,
  VibronicsRemedy,
  PageId,
  PrescriptionRecord,
  ChatMessage,
  HistoricalRecord,
  RemedyItem,
  ConversationThread,
  Practitioner,
  PractitionerSchedule,
  DailyWorkingHours
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
  Heart,
  Sliders,
  CalendarDays,
  Lock,
  Filter,
  CheckCheck,
  UserCheck
} from 'lucide-react';

interface PractitionerDashboardPageProps {
  practitioner?: Practitioner;
  appointments: Appointment[];
  prescriptions?: PrescriptionRecord[];
  conversations?: ConversationThread[];
  messages?: ChatMessage[];
  historicalRecords?: HistoricalRecord[];
  onNavigate: (page: PageId) => void;
  onUpdateAppointment: (updated: Appointment) => void;
  onCreatePrescription?: (prescription: PrescriptionRecord) => void;
  onSendMessage?: (conversationId: string, text: string) => void;
  onUpdatePractitionerSchedule?: (updatedSchedule: PractitionerSchedule) => void;
  onVerifyHistoricalRecord?: (recordId: string, status: 'Approved' | 'Returned', notes?: string) => void;
}

export const PractitionerDashboardPage: React.FC<PractitionerDashboardPageProps> = ({
  practitioner,
  appointments,
  prescriptions = [],
  conversations = [],
  messages = [],
  historicalRecords = [],
  onNavigate,
  onUpdateAppointment,
  onCreatePrescription,
  onSendMessage,
  onUpdatePractitionerSchedule,
  onVerifyHistoricalRecord,
}) => {
  const [activeTab, setActiveTab] = useState<
    'queue' | 'consultation' | 'prescriptions' | 'messages' | 'schedule' | 'historical'
  >('queue');

  // Selected patient for consultation
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(
    appointments.find((a) => a.status === 'In Consultation')?.id ||
    appointments.find((a) => a.status === 'Waiting')?.id ||
    appointments[0]?.id || ''
  );

  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId);

  // 6 Structured Consultation Form State
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
  const [selectedRemedyToAdd, setSelectedRemedyToAdd] = useState<string>('CC4.1');
  const [followUpDate, setFollowUpDate] = useState('2026-11-28');
  const [followUpInstructions, setFollowUpInstructions] = useState(
    'Return for review in 4 weeks. Continue gentle morning walking in warm sunlight.'
  );

  // Consultation preview modal
  const [previewPrescription, setPreviewPrescription] = useState<PrescriptionRecord | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // TWO-PANEL CHAT APPLICATION STATE (Section 7 Requirements)
  // -------------------------------------------------------------------------
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    conversations[0]?.id || 'conv-0842-prac1'
  );
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState<'All' | 'Unread' | 'Active' | 'Resolved'>('All');
  const [replyInputText, setReplyInputText] = useState('');

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const q = chatSearchQuery.toLowerCase();
      const matchesSearch =
        c.patientName.toLowerCase().includes(q) ||
        c.patientId.toLowerCase().includes(q) ||
        c.lastMessageText.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (chatFilter === 'Unread') return c.unreadCount > 0;
      if (chatFilter === 'Active') return c.status === 'Active';
      if (chatFilter === 'Resolved') return c.status === 'Resolved';
      return true;
    });
  }, [conversations, chatSearchQuery, chatFilter]);

  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === selectedConversationId) ||
      conversations[0]
    );
  }, [conversations, selectedConversationId]);

  const activeConversationMessages = useMemo(() => {
    return messages.filter((m) => m.conversationId === activeConversation?.id);
  }, [messages, activeConversation]);

  const handleSendChatReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInputText.trim() || !activeConversation) return;

    if (onSendMessage) {
      onSendMessage(activeConversation.id, replyInputText.trim());
    }
    setReplyInputText('');
    setFeedbackNotice(`Reply sent to ${activeConversation.patientName}.`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // -------------------------------------------------------------------------
  // SCHEDULE & AVAILABILITY STATE (Section 6 Requirements)
  // -------------------------------------------------------------------------
  const currentSchedule = practitioner?.schedule;
  const [workingScheduleState, setWorkingScheduleState] = useState<Record<string, DailyWorkingHours>>(
    currentSchedule?.weeklySchedule || {
      Monday: { day: 'Monday', isWorkingDay: true, morningStart: '09:30 AM', morningEnd: '01:00 PM', afternoonStart: '05:00 PM', afternoonEnd: '07:30 PM', maxCapacity: 15, slotDurationMinutes: 20, roomNumber: 'Room 1' },
      Tuesday: { day: 'Tuesday', isWorkingDay: false, maxCapacity: 0, slotDurationMinutes: 20 },
      Wednesday: { day: 'Wednesday', isWorkingDay: true, morningStart: '09:30 AM', morningEnd: '01:00 PM', afternoonStart: '05:00 PM', afternoonEnd: '07:30 PM', maxCapacity: 15, slotDurationMinutes: 20, roomNumber: 'Room 1' },
      Thursday: { day: 'Thursday', isWorkingDay: false, maxCapacity: 0, slotDurationMinutes: 20 },
      Friday: { day: 'Friday', isWorkingDay: true, morningStart: '09:30 AM', morningEnd: '01:00 PM', afternoonStart: '05:00 PM', afternoonEnd: '07:30 PM', maxCapacity: 15, slotDurationMinutes: 20, roomNumber: 'Room 1' },
      Saturday: { day: 'Saturday', isWorkingDay: true, morningStart: '09:30 AM', morningEnd: '01:00 PM', maxCapacity: 12, slotDurationMinutes: 20, roomNumber: 'Room 1' },
      Sunday: { day: 'Sunday', isWorkingDay: false, maxCapacity: 0, slotDurationMinutes: 20 },
    }
  );

  const [leaveDatesList, setLeaveDatesList] = useState<string[]>(
    currentSchedule?.leaveDates || ['2026-11-05', '2026-11-12']
  );
  const [newLeaveDateInput, setNewLeaveDateInput] = useState('');
  const [consultDurationInput, setConsultDurationInput] = useState(
    currentSchedule?.consultationDurationMinutes || 20
  );

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PractitionerSchedule = {
      practitionerId: practitioner?.id || 'prac-1',
      clinicId: practitioner?.clinicId || 'clinic-padmanabhanagar',
      weeklySchedule: workingScheduleState,
      leaveDates: leaveDatesList,
      consultationDurationMinutes: Number(consultDurationInput),
      servicesOffered: practitioner?.servicesOffered || [
        'Vibronics 108 Holistic Consultation',
        'Senior Citizen Wellness',
        'Joint & Mobility Support'
      ],
    };

    if (onUpdatePractitionerSchedule) {
      onUpdatePractitionerSchedule(updated);
    }
    setFeedbackNotice('Practitioner working schedule updated. Public appointment availability recalculated.');
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleAddLeaveDate = () => {
    if (newLeaveDateInput && !leaveDatesList.includes(newLeaveDateInput)) {
      setLeaveDatesList([...leaveDatesList, newLeaveDateInput]);
      setNewLeaveDateInput('');
    }
  };

  const handleRemoveLeaveDate = (date: string) => {
    setLeaveDatesList(leaveDatesList.filter((d) => d !== date));
  };

  // -------------------------------------------------------------------------
  // CONSULTATION HANDLERS
  // -------------------------------------------------------------------------
  const handleSelectPatientForConsultation = (apt: Appointment) => {
    setSelectedAppointmentId(apt.id);
    setStatedConcern(apt.reasonForVisit || 'General wellness consultation');
    setClinicalNotes(apt.notes || `Initial consultation observations for ${apt.patientName}. Vitals stable.`);
    if (apt.status === 'Waiting' || apt.status === 'Scheduled') {
      onUpdateAppointment({ ...apt, status: 'In Consultation' });
    }
    setActiveTab('consultation');
  };

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

  const handleFinaliseConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;

    const newRx: PrescriptionRecord = {
      id: `rx-${Date.now().toString().slice(-6)}`,
      appointmentId: selectedApt.id,
      patientId: selectedApt.patientId,
      patientName: selectedApt.patientName,
      practitionerId: practitioner?.id || 'prac-1',
      practitionerName: practitioner?.name || 'Dr. K. S. Ramesh, BAMS, MD (Ayu)',
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
      onUpdateAppointment({
        ...selectedApt,
        status: 'Completed',
        notes: clinicalNotes,
        remedySummary: selectedRemedies.map((r) => `${r.code} (${r.name})`).join(' + '),
      });
    }

    setPreviewPrescription(newRx);
    setFeedbackNotice(`Digital prescription finalised for ${selectedApt.patientName}. Token marked Completed.`);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const waitingApts = appointments.filter((a) => a.status === 'Waiting');
  const inConsultationApts = appointments.filter((a) => a.status === 'In Consultation');
  const completedApts = appointments.filter((a) => a.status === 'Completed');
  const pendingVerificationRecords = historicalRecords.filter(
    (r) => r.verificationStatus === 'Pending Verification'
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Clinical Header */}
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
                    {practitioner?.name || 'Dr. K. S. Ramesh, BAMS, MD (Ayu)'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                    {practitioner?.level || 'Sai Vibronics Level 3'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Reg No: <span className="font-mono font-semibold text-slate-700">{practitioner?.registrationNumber || 'KA-AYU-1988-42'}</span> · Padmanabhanagar Pilot Center ({practitioner?.roomNumber || 'Room 1'})
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

        {/* Clinical Tabs Bar */}
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
              <span>Digital Consultation Studio</span>
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
              <span>Patient Enquiries Chat ({conversations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>My Working Schedule & Availability</span>
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
              <span>Paper Dual Sign-Off</span>
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
        {feedbackNotice && (
          <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-teal-900 flex items-center gap-3 shadow-2xs">
            <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
            <span className="text-sm font-semibold">{feedbackNotice}</span>
          </div>
        )}

        {/* TAB 1: TODAY'S QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
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

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Today&apos;s Seva Roster & Queue</h3>
                  <p className="text-xs text-slate-500">Select any patient to start consultation</p>
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
                            <span>Room: {practitioner?.roomNumber || 'Room 1'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <button
                          onClick={() => handleSelectPatientForConsultation(apt)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>{apt.status === 'Completed' ? 'Review Consultation' : 'Start Consultation'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL CONSULTATION STUDIO (6 STRUCTURED SECTIONS) */}
        {activeTab === 'consultation' && (
          <div className="space-y-6">
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

            <form onSubmit={handleFinaliseConsultation} className="space-y-6">
              {/* SECTION 1: STATED CONCERN */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</span>
                  <h3 className="text-base font-bold">Patient Stated Chief Concern</h3>
                </div>
                <textarea
                  rows={2}
                  value={statedConcern}
                  onChange={(e) => setStatedConcern(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* SECTION 2: CLINICAL NOTES */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">2</span>
                  <h3 className="text-base font-bold">Clinical Examination & Observations</h3>
                </div>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* SECTION 3: VIBRONICS 108 REMEDIES */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">3</span>
                    <h3 className="text-base font-bold">Vibronics 108 Remedy Formulations</h3>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
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

                <div className="space-y-3">
                  {selectedRemedies.map((remedy, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
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
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Dosage</label>
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
                  ))}
                </div>
              </div>

              {/* SECTION 4: DOSAGE GUIDELINES */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">4</span>
                  <h3 className="text-base font-bold">Standard Dosage & Storage Guidelines</h3>
                </div>
                <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 space-y-1">
                  <p>• 3 potentised sugar globules dissolved slowly on clean tongue, 15 minutes before food.</p>
                  <p>• Store remedies away from strong camphor, perfumes, and electromagnetic radiation (mobile phones).</p>
                </div>
              </div>

              {/* SECTION 5: FOLLOW-UP */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">5</span>
                  <h3 className="text-base font-bold">Next Review & Follow-up Instructions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Follow-up Date</label>
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

              {/* SECTION 6: FINALISE */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Finalise Digital Consultation</h3>
                  <p className="text-xs text-slate-500">Generates official prescription document and marks token Completed.</p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Finalise & Sign Prescription</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PRESCRIPTIONS ARCHIVE */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Prescriptions Archive</h2>
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

        {/* TAB 4: TWO-PANEL PATIENT ENQUIRIES CHAT (Section 7 Requirements) */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Patient Enquiries & Care Inbox</h2>
                <p className="text-xs text-slate-500">
                  Multi-conversation messaging with patients under your clinical care.
                </p>
              </div>
            </div>

            {/* Two-Panel Messaging Studio */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[620px]">
              {/* LEFT PANEL: CONVERSATIONS LIST (col-span-5) */}
              <div className="lg:col-span-5 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
                {/* Search & Filter Bar */}
                <div className="p-4 border-b border-slate-200 bg-white space-y-3 shrink-0">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      placeholder="Search patient or message..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto">
                    {(['All', 'Unread', 'Active', 'Resolved'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setChatFilter(filter)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          chatFilter === filter
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation List Items */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {filteredConversations.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No matching conversations found.
                    </div>
                  ) : (
                    filteredConversations.map((thread) => {
                      const isSelected = thread.id === selectedConversationId;
                      return (
                        <div
                          key={thread.id}
                          onClick={() => setSelectedConversationId(thread.id)}
                          className={`p-3.5 sm:p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {thread.patientName.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {thread.patientName}
                              </h4>
                              <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-2">
                                {thread.lastMessageTime}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 truncate">
                              {thread.lastMessageText}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[10px] text-slate-400">
                                {thread.patientId}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                  thread.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {thread.status}
                              </span>
                              {thread.unreadCount > 0 && (
                                <span className="ml-auto w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                                  {thread.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT PANEL: INDIVIDUAL CHAT VIEW (col-span-7) */}
              <div className="lg:col-span-7 flex flex-col h-full bg-white">
                {activeConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {activeConversation.patientName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {activeConversation.patientName}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono">{activeConversation.patientId}</span>
                            <span>·</span>
                            <span>{activeConversation.clinicName}</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
                        {activeConversation.status} Thread
                      </span>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-slate-50/30">
                      {activeConversationMessages.map((msg) => {
                        const isMe = msg.senderRole === 'practitioner';
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                isMe
                                  ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                              }`}
                            >
                              <p>{msg.text}</p>
                              <div
                                className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                                  isMe ? 'text-blue-100' : 'text-slate-400'
                                }`}
                              >
                                <span>{msg.timestamp}</span>
                                {isMe && <CheckCheck className="w-3 h-3" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat Input */}
                    <form
                      onSubmit={handleSendChatReply}
                      className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
                    >
                      <input
                        type="text"
                        value={replyInputText}
                        onChange={(e) => setReplyInputText(e.target.value)}
                        placeholder={`Reply to ${activeConversation.patientName}...`}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                    Select a conversation from the left panel to begin.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WORKING SCHEDULE & AVAILABILITY MANAGER (Section 6 Requirements) */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Practitioner Working Schedule & Availability
              </h2>
              <p className="text-xs text-slate-500">
                Configure your weekly operating days, hours, and planned leave. All public appointment booking dynamically obeys this schedule.
              </p>
            </div>

            <form onSubmit={handleSaveSchedule} className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
              {/* Consultation Duration & Capacity Settings */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Default Consultation Slot Duration
                  </label>
                  <select
                    value={consultDurationInput}
                    onChange={(e) => setConsultDurationInput(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value={15}>15 Minutes (Fast-track Review)</option>
                    <option value={20}>20 Minutes (Standard Vibronics)</option>
                    <option value={30}>30 Minutes (Comprehensive Initial)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Assigned Clinic & Consultation Room
                  </label>
                  <div className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800">
                    Padmanabhanagar Pilot Center — {practitioner?.roomNumber || 'Room 1 (Ground Floor)'}
                  </div>
                </div>
              </div>

              {/* Weekly Working Days Configuration */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Weekly Operating Schedule (Monday to Sunday)
                </h3>

                <div className="space-y-3">
                  {Object.entries(workingScheduleState).map(([dayKey, dayConfig]) => (
                    <div
                      key={dayKey}
                      className={`p-4 rounded-2xl border transition-colors ${
                        dayConfig.isWorkingDay
                          ? 'bg-white border-blue-200 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`day-${dayKey}`}
                            checked={dayConfig.isWorkingDay}
                            onChange={(e) => {
                              setWorkingScheduleState({
                                ...workingScheduleState,
                                [dayKey]: {
                                  ...dayConfig,
                                  isWorkingDay: e.target.checked,
                                },
                              });
                            }}
                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <label htmlFor={`day-${dayKey}`} className="font-bold text-slate-900 cursor-pointer text-sm">
                            {dayKey}
                          </label>
                        </div>

                        {dayConfig.isWorkingDay ? (
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">Morning:</span>
                              <input
                                type="text"
                                value={dayConfig.morningStart || '09:30 AM'}
                                onChange={(e) => {
                                  setWorkingScheduleState({
                                    ...workingScheduleState,
                                    [dayKey]: { ...dayConfig, morningStart: e.target.value },
                                  });
                                }}
                                className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                              />
                              <span>to</span>
                              <input
                                type="text"
                                value={dayConfig.morningEnd || '01:00 PM'}
                                onChange={(e) => {
                                  setWorkingScheduleState({
                                    ...workingScheduleState,
                                    [dayKey]: { ...dayConfig, morningEnd: e.target.value },
                                  });
                                }}
                                className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">Max Capacity:</span>
                              <input
                                type="number"
                                value={dayConfig.maxCapacity || 15}
                                onChange={(e) => {
                                  setWorkingScheduleState({
                                    ...workingScheduleState,
                                    [dayKey]: { ...dayConfig, maxCapacity: Number(e.target.value) },
                                  });
                                }}
                                className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                              />
                              <span className="text-slate-400">patients</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            Not Consulting / Off-Duty
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temporary Leave Dates */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Planned Leave & Holidays (Appointments Blocked)
                </h3>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={newLeaveDateInput}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setNewLeaveDateInput(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddLeaveDate}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add Leave Date
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {leaveDatesList.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{d}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLeaveDate(d)}
                        className="text-rose-500 hover:text-rose-800 cursor-pointer font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Working Schedule & Availability</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: HISTORICAL RECORDS DUAL SIGN-OFF */}
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
                <div key={rec.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
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
