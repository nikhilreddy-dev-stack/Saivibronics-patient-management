import React, { useState } from 'react';
import { Appointment, Practitioner, PageId, HistoricalRecord } from '../types';
import {
  Building2,
  Users,
  CalendarCheck2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  FileUp,
  UploadCloud,
  FileText,
  Search,
  X,
  AlertTriangle,
  Paperclip,
  CheckCircle,
  FileCheck,
  Plus,
  Download,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface ClinicAdminDashboardPageProps {
  appointments: Appointment[];
  practitioners: Practitioner[];
  historicalRecords?: HistoricalRecord[];
  onNavigate: (page: PageId) => void;
  onBookAppointment?: (newAppointment: Appointment) => void;
  onDigitiseRecord?: (recordData: Omit<HistoricalRecord, 'id' | 'dateEntered' | 'verificationStatus'>) => void;
}

export const ClinicAdminDashboardPage: React.FC<ClinicAdminDashboardPageProps> = ({
  appointments,
  practitioners,
  historicalRecords = [],
  onNavigate,
  onBookAppointment,
  onDigitiseRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'roster' | 'digitise' | 'reports'>('queue');
  const [dailyTokenLimit, setDailyTokenLimit] = useState(45);
  const [clinicStatus, setClinicStatus] = useState<'Operational' | 'Paused for Seva Break'>('Operational');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Walk-in Token Modal state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInPatientName, setWalkInPatientName] = useState('');
  const [walkInMobile, setWalkInMobile] = useState('');
  const [walkInAge, setWalkInAge] = useState('68');
  const [walkInReason, setWalkInReason] = useState('Senior citizen walk-in for joint stiffness checkup');
  const [walkInPractitioner, setWalkInPractitioner] = useState(practitioners[0]?.name || 'Dr. K. S. Ramesh');

  // Paper Register Digitisation Form state
  const [patientIdInput, setPatientIdInput] = useState('SSSO-BLR-2026-0842');
  const [patientNameInput, setPatientNameInput] = useState('Smt. Ananya Rao');
  const [originalDateInput, setOriginalDateInput] = useState('2024-11-18');
  const [paperRegisterRefInput, setPaperRegisterRefInput] = useState('REG-PAD-2024-VOL-03-P28');
  const [remediesInput, setRemediesInput] = useState('CC20.3 (Joint Support) + CC12.1 (Adult Vitality Tonic)');
  const [notesInput, setNotesInput] = useState('Historical record: Bilateral knee stiffness following winter rains. Complementary holistic support provided.');
  const [fileNameInput, setFileNameInput] = useState('padmanabhanagar_scan_vol03_p28.pdf');

  const waitingTokens = appointments.filter((a) => a.status === 'Waiting');
  const inConsultationTokens = appointments.filter((a) => a.status === 'In Consultation');
  const completedTokens = appointments.filter((a) => a.status === 'Completed');

  const handleCreateWalkInToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInPatientName.trim()) return;

    const nextTokenNum = `P-${(appointments.length + 1).toString().padStart(2, '0')}`;
    const newApt: Appointment = {
      id: `apt-walkin-${Date.now()}`,
      tokenNumber: nextTokenNum,
      patientName: walkInPatientName.trim(),
      patientId: `SSSO-WALKIN-${Date.now().toString().slice(-4)}`,
      clinicId: 'clinic-padmanabhanagar',
      clinicName: 'Sri Sathya Sai Vibronics Seva Clinic - Padmanabhanagar',
      practitionerName: walkInPractitioner,
      date: new Date().toISOString().slice(0, 10),
      timeSlot: '11:45 AM - 12:05 PM',
      status: 'Waiting',
      reasonForVisit: walkInReason.trim(),
    };

    if (onBookAppointment) {
      onBookAppointment(newApt);
    }
    setShowWalkInModal(false);
    setWalkInPatientName('');
    setWalkInMobile('');
    setFeedbackNotice(`Walk-in Token #${nextTokenNum} issued successfully.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleSubmitDigitisedRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientNameInput.trim() || !paperRegisterRefInput.trim()) return;

    if (onDigitiseRecord) {
      onDigitiseRecord({
        patientId: patientIdInput.trim(),
        patientName: patientNameInput.trim(),
        originalVisitDate: originalDateInput,
        clinicName: 'Sri Sathya Sai Vibronics Seva Clinic - Padmanabhanagar',
        digitisedSummary: `${remediesInput} - ${notesInput}`,
        scannedDocRef: fileNameInput || paperRegisterRefInput,
        enteredBy: 'Clinic Reception Desk (Padmanabhanagar)',
      });
    }

    setFeedbackNotice('Paper register record submitted for practitioner dual sign-off.');
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Clinic Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                <Building2 className="w-6 h-6 text-indigo-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Padmanabhanagar Pilot Reception & Clinic Desk
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
                    Primary Pilot Center
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Center Code: <span className="font-mono font-semibold text-slate-700">SSSO-BLR-01</span> · Pincode: 560070 · 4 Active Practitioners
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowWalkInModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Walk-in Seva Token</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-1">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'queue'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Reception Token Queue ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'roster'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Doctor Roster & Rooms</span>
            </button>

            <button
              onClick={() => setActiveTab('digitise')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'digitise'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileUp className="w-4 h-4" />
              <span>Paper Register Digitisation</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'reports'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Daily Seva Metrics & Export</span>
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

        {/* TAB 1: RECEPTION TOKEN QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Queue Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase">Tokens Issued</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{appointments.length} / {dailyTokenLimit}</p>
                <span className="text-[11px] text-slate-400">{dailyTokenLimit - appointments.length} slots remaining</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-amber-700 uppercase">Waiting in Lounge</span>
                <p className="text-2xl font-bold text-amber-700 mt-1">{waitingTokens.length}</p>
                <span className="text-[11px] text-slate-400">Tokens ready for call</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-indigo-700 uppercase">In Consultation Rooms</span>
                <p className="text-2xl font-bold text-indigo-700 mt-1">{inConsultationTokens.length}</p>
                <span className="text-[11px] text-slate-400">Rooms 1 & 2 occupied</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-emerald-700 uppercase">Completed Today</span>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{completedTokens.length}</p>
                <span className="text-[11px] text-slate-400">Prescriptions dispensed</span>
              </div>
            </div>

            {/* Token Limit Controller */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">Daily Seva Token Quota:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDailyTokenLimit(Math.max(20, dailyTokenLimit - 5))}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-indigo-600 px-2">{dailyTokenLimit} tokens</span>
                  <button
                    onClick={() => setDailyTokenLimit(dailyTokenLimit + 5)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Clinic Status:</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-xs">
                  {clinicStatus}
                </span>
              </div>
            </div>

            {/* Tokens Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Live Reception Tokens List</h3>
                  <p className="text-xs text-slate-500">Real-time status updates across Padmanabhanagar rooms</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex flex-col items-center justify-center font-bold shrink-0">
                        <span className="text-[10px] text-indigo-400 uppercase">Token</span>
                        <span className="text-sm font-mono">{apt.tokenNumber}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                          <span className="text-xs font-mono text-slate-400">({apt.patientId})</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              apt.status === 'In Consultation'
                                ? 'bg-indigo-100 text-indigo-800'
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
                          <strong>Doctor:</strong> {apt.practitionerName} · <strong>Slot:</strong> {apt.timeSlot}
                        </p>
                        <p className="text-xs text-slate-500">
                          <strong>Reason:</strong> {apt.reasonForVisit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          setFeedbackNotice(`Calling Token #${apt.tokenNumber} to Consultation Room 1.`);
                          setTimeout(() => setFeedbackNotice(null), 3000);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call to Room</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCTOR ROSTER & ROOMS */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Practitioner Roster & Room Allocation</h2>
              <p className="text-xs text-slate-500">Padmanabhanagar Pilot Active Seva Doctors</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
                      R1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Dr. K. S. Ramesh, BAMS, MD (Ayu)</h4>
                      <p className="text-xs text-slate-500">Room 1 · Vibronics Level 3</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Active
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                  <p><strong>Timing:</strong> 09:30 AM - 01:00 PM</p>
                  <p><strong>Specialization:</strong> Chronic Arthritic & Joint Care, Vitality Tonics</p>
                  <p><strong>Queue:</strong> 3 patients waiting in reception</p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold">
                      R2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Smt. Radha V. Murthy, M.Sc</h4>
                      <p className="text-xs text-slate-500">Room 2 · Senior Vibronics Practitioner</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Active
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                  <p><strong>Timing:</strong> 10:00 AM - 01:00 PM</p>
                  <p><strong>Specialization:</strong> Stress, Insomnia, Neurological Calm & Immunity</p>
                  <p><strong>Queue:</strong> 1 patient waiting in reception</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAPER REGISTER DIGITISATION WORKFLOW */}
        {activeTab === 'digitise' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Paper Register Historical Record Digitisation</h2>
              <p className="text-xs text-slate-500">
                Enter legacy paper consultation cards into digital format for practitioner verification and dual sign-off.
              </p>
            </div>

            <form onSubmit={handleSubmitDigitisedRecord} className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Patient UHID / ID</label>
                  <input
                    type="text"
                    value={patientIdInput}
                    onChange={(e) => setPatientIdInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    value={patientNameInput}
                    onChange={(e) => setPatientNameInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Original Physical Visit Date</label>
                  <input
                    type="date"
                    value={originalDateInput}
                    onChange={(e) => setOriginalDateInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Paper Register Reference (Vol & Page #)</label>
                  <input
                    type="text"
                    value={paperRegisterRefInput}
                    onChange={(e) => setPaperRegisterRefInput(e.target.value)}
                    placeholder="e.g. REG-PAD-2024-VOL-03-P28"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Historical Prescribed Remedies (from paper card)</label>
                <input
                  type="text"
                  value={remediesInput}
                  onChange={(e) => setRemediesInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Clinical Notes & Findings</label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Scanned Document Attachment Reference</label>
                <input
                  type="text"
                  value={fileNameInput}
                  onChange={(e) => setFileNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Record will be marked &ldquo;Pending Verification&rdquo; for doctor review</span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit for Dual Sign-Off</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: DAILY SEVA METRICS & EXPORT */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Padmanabhanagar Daily Seva Summary</h2>
              <p className="text-xs text-slate-500">End-of-day statistics and voluntary service reporting</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase">Total Seva Beneficiaries</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">{appointments.length}</p>
                <p className="text-xs text-slate-400 mt-1">100% Free holistic consultations</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase">Senior Citizens Attended</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">7</p>
                <p className="text-xs text-slate-400 mt-1">Wheelchair / fast-track desk assistance</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase">Remedy Phials Dispensed</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">18</p>
                <p className="text-xs text-slate-400 mt-1">Free sugar globules potentised medicines</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Export Daily Consultation Log</h4>
                <p className="text-xs text-slate-500">Download formatted CSV with tokens, patient UHIDs, and remedies</p>
              </div>

              <button
                onClick={() => {
                  setFeedbackNotice('Daily Padmanabhanagar Seva CSV report generated and downloaded.');
                  setTimeout(() => setFeedbackNotice(null), 3000);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Daily Log (CSV)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WALK-IN SEVA TOKEN MODAL */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Issue Walk-in Seva Token</span>
              </h3>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkInToken} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={walkInPatientName}
                  onChange={(e) => setWalkInPatientName(e.target.value)}
                  placeholder="e.g. Sri Venkatesh Murthy"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={walkInMobile}
                    onChange={(e) => setWalkInMobile(e.target.value)}
                    placeholder="98801 12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={walkInAge}
                    onChange={(e) => setWalkInAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assign Doctor</label>
                <select
                  value={walkInPractitioner}
                  onChange={(e) => setWalkInPractitioner(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {practitioners.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.clinicId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Chief Reason for Consultation</label>
                <input
                  type="text"
                  value={walkInReason}
                  onChange={(e) => setWalkInReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirm Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
