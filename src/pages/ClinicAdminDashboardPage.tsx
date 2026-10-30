import React, { useState } from 'react';
import { Appointment, Practitioner, PageId } from '../types';
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
  FileCheck
} from 'lucide-react';

export interface DigitisedRecord {
  id: string;
  patientId: string;
  patientName: string;
  originalDate: string;
  paperRegisterRef: string;
  practitionerName: string;
  notes: string;
  remedies: string;
  fileName: string;
  status: 'Pending Verification' | 'Approved' | 'Returned';
}

const INITIAL_DIGITISED_RECORDS: DigitisedRecord[] = [
  {
    id: 'DIG-2026-001',
    patientId: 'SSSO-BLR-2026-0842',
    patientName: 'Smt. Ananya Rao',
    originalDate: '2024-11-18',
    paperRegisterRef: 'REG-PAD-2024-VOL-03-P28',
    practitionerName: 'Dr. K. S. Ramesh',
    notes: 'Historical record: Chronic lower back stiffness following winter season. Prescribed complementary joint support.',
    remedies: 'CC20.3 (Joint Support) + CC12.1 (Vitality)',
    fileName: 'ananya_rao_paper_scan_nov2024.pdf',
    status: 'Approved',
  },
  {
    id: 'DIG-2026-002',
    patientId: 'SSSO-BLR-2026-0843',
    patientName: 'Sri. Gopalakrishna Bhat',
    originalDate: '2025-01-12',
    paperRegisterRef: 'REG-PAD-2025-VOL-01-P05',
    practitionerName: 'Dr. Meera N. Murthy',
    notes: 'Paper register entry: Acidity and mild digestive disturbance during pilgrimage travel.',
    remedies: 'CC4.2 (Digestive Balance) TDS',
    fileName: 'gopalakrishna_paper_scan_jan2025.jpg',
    status: 'Pending Verification',
  },
];

interface ClinicAdminDashboardPageProps {
  appointments: Appointment[];
  practitioners: Practitioner[];
  onNavigate: (page: PageId) => void;
}

export const ClinicAdminDashboardPage: React.FC<ClinicAdminDashboardPageProps> = ({
  appointments,
  practitioners,
  onNavigate,
}) => {
  const [filterShift, setFilterShift] = useState('All');
  const [dailyTokenLimit, setDailyTokenLimit] = useState(45);
  const [clinicStatus, setClinicStatus] = useState<'Operational' | 'Paused for Seva Break'>('Operational');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Historical Paper Records State
  const [digitisedRecords, setDigitisedRecords] = useState<DigitisedRecord[]>(INITIAL_DIGITISED_RECORDS);
  const [showDigitiseModal, setShowDigitiseModal] = useState(false);
  const [digPatientId, setDigPatientId] = useState('SSSO-BLR-2026-0845');
  const [digPatientName, setDigPatientName] = useState('Sri. Venkatesh Murthy');
  const [digOriginalDate, setDigOriginalDate] = useState('2024-08-14');
  const [digPaperRef, setDigPaperRef] = useState('REG-PAD-2024-VOL-02-P19');
  const [digPractitioner, setDigPractitioner] = useState('Dr. K. S. Ramesh');
  const [digNotes, setDigNotes] = useState('General weakness and knee strain while walking.');
  const [digRemedies, setDigRemedies] = useState('CC12.1 (Adult Tonic) + CC20.4 (Muscles & Joints)');
  const [digUploadedFile, setDigUploadedFile] = useState<string | null>('venkatesh_register_scan_p19.pdf');
  const [recordFilterStatus, setRecordFilterStatus] = useState<'All' | 'Pending Verification' | 'Approved' | 'Returned'>('All');

  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const waitingCount = appointments.filter((a) => a.status === 'Waiting').length;
  const inProgressCount = appointments.filter((a) => a.status === 'In Consultation').length;

  const handleUpdateLimit = (delta: number) => {
    setDailyTokenLimit((prev) => Math.max(10, prev + delta));
    setFeedback(`Daily token quota updated to ${Math.max(10, dailyTokenLimit + delta)}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Title & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-teal-700 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Clinic Administrator</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Clinic Operations Console
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-mono font-bold">Unit: SSSO-BLR-01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Padmanabhanagar Pilot Seva Desk
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              14th Main, Near Carmel High School, Padmanabhanagar, Bengaluru 560070
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowDigitiseModal(true)}
              className="px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer min-h-[44px] shadow-2xs"
            >
              <FileUp className="w-4 h-4 text-teal-200" />
              <span>Digitise Paper Record</span>
            </button>

            <button
              onClick={() => onNavigate('org-admin-dashboard')}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Layers className="w-4 h-4 text-teal-300" />
              <span>Organisation View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Clinic Admin Demonstration View:</strong> Operational figures, token volumes, and practitioner rosters reflect fictional pilot data for Sri Sathya Sai Seva Clinic Padmanabhanagar. Adjustments are kept in local session state.
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-sm text-teal-950 flex items-center gap-2 font-bold shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 4 KPI Summary Cards (Desktop Dashboard style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Today&apos;s Appointments</span>
            <CalendarCheck2 className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {appointments.length}
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-2 font-medium">
            <span className="text-teal-700 font-bold">{completedCount} Completed</span>
            <span>·</span>
            <span className="text-amber-700 font-bold">{waitingCount} Waiting</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Practitioners on Duty</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {practitioners.length}
          </div>
          <div className="text-xs text-slate-500">
            Certified senior volunteers
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Registered Patients</span>
            <Building2 className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            482
          </div>
          <div className="text-xs text-slate-500">
            Padmanabhanagar registry
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Daily Token Quota</span>
            <Clock className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {dailyTokenLimit}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleUpdateLimit(-5)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 flex items-center justify-center cursor-pointer min-h-[32px] min-w-[32px]"
                aria-label="Decrease daily quota"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleUpdateLimit(5)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 flex items-center justify-center cursor-pointer min-h-[32px] min-w-[32px]"
                aria-label="Increase daily quota"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-600">
            Capacity: <strong className="text-teal-800">{clinicStatus}</strong>
          </div>
        </div>
      </div>

      {/* Practitioner Schedules & Allocations */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Practitioner Room Allocations & Schedules
            </h3>
            <p className="text-sm text-slate-500">
              Assigned consultation rooms at Padmanabhanagar Seva Clinic
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 font-bold">Filter Day:</span>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 cursor-pointer min-h-[40px]"
            >
              <option value="All">All Days</option>
              <option value="Monday">Monday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-xs border-y border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Practitioner</th>
                <th className="py-3.5 px-4 font-bold">Assigned Room</th>
                <th className="py-3.5 px-4 font-bold">Available Days</th>
                <th className="py-3.5 px-4 font-bold">Consultation Shift</th>
                <th className="py-3.5 px-4 font-bold">Primary Specialty</th>
                <th className="py-3.5 px-4 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {practitioners
                .filter((p) => filterShift === 'All' || p.availableDays.includes(filterShift))
                .map((prac, idx) => (
                  <tr key={prac.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {prac.name}
                      <span className="block text-xs text-slate-400 font-normal">{prac.title}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-700">
                      Room 0{idx + 1}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {prac.availableDays.join(', ')}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {prac.timing}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {prac.specialization}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active on Roster
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Reception Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Live Token Queue & Reception Dispensing
            </h3>
            <p className="text-sm text-slate-500">
              Real-time token distribution for Padmanabhanagar clinic
            </p>
          </div>

          <button
            onClick={() => onNavigate('practitioner-dashboard')}
            className="px-5 py-2.5 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-sm font-bold rounded-xl transition-colors cursor-pointer min-h-[44px]"
          >
            Open Practitioner View
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-xs border-y border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Token #</th>
                <th className="py-3.5 px-4 font-bold">Patient Name</th>
                <th className="py-3.5 px-4 font-bold">Time Slot</th>
                <th className="py-3.5 px-4 font-bold">Assigned Practitioner</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Notes / Remedies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    {apt.tokenNumber}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {apt.patientName}
                    <span className="block text-xs text-slate-400 font-mono font-normal">{apt.patientId}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-mono">
                    {apt.timeSlot}
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {apt.practitionerName}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        apt.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : apt.status === 'In Consultation'
                          ? 'bg-teal-700 text-white'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                    {apt.remedySummary || apt.reasonForVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Paper Record Digitisation & Verification Section (Requirement 7) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-6 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider">
                Phase 2 Clinical Archiving
              </span>
              <span className="text-xs text-slate-500 font-semibold">Dual Sign-Off Protocol</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Historical Paper Records & Verification Queue
            </h3>
            <p className="text-sm text-slate-500">
              Digitised entries from physical clinic registers prior to digital platform launch
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Pending Verification', 'Approved', 'Returned'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setRecordFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[36px] ${
                  recordFilterStatus === st
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-xs border-y border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Record / Paper Ref</th>
                <th className="py-3.5 px-4 font-bold">Patient Details</th>
                <th className="py-3.5 px-4 font-bold">Original Date</th>
                <th className="py-3.5 px-4 font-bold">Reviewing Practitioner</th>
                <th className="py-3.5 px-4 font-bold">Remedies / Clinical Notes</th>
                <th className="py-3.5 px-4 font-bold">Scan Attachment</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 text-right font-bold">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {digitisedRecords
                .filter((r) => recordFilterStatus === 'All' || r.status === recordFilterStatus)
                .map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      <div>{rec.id}</div>
                      <span className="text-xs text-slate-400 font-normal">{rec.paperRegisterRef}</span>
                    </td>
                    <td className="py-4 px-4">
                      <strong className="text-slate-900 block font-bold">{rec.patientName}</strong>
                      <span className="text-xs text-slate-400 font-mono">{rec.patientId}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                      {rec.originalDate}
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {rec.practitionerName}
                    </td>
                    <td className="py-4 px-4 max-w-xs text-slate-600 text-xs">
                      <div className="font-bold text-teal-900">{rec.remedies}</div>
                      <div className="truncate mt-0.5">{rec.notes}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200">
                        <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                        <span className="max-w-[100px] truncate">{rec.fileName}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          rec.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : rec.status === 'Pending Verification'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {rec.status === 'Pending Verification' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setDigitisedRecords((prev) =>
                                prev.map((r) => (r.id === rec.id ? { ...r, status: 'Approved' } : r))
                              );
                              setFeedback(`Record ${rec.id} approved and merged into patient history.`);
                              setTimeout(() => setFeedback(null), 3000);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer min-h-[32px]"
                            title="Approve digitized entry"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDigitisedRecords((prev) =>
                                prev.map((r) => (r.id === rec.id ? { ...r, status: 'Returned' } : r))
                              );
                              setFeedback(`Record ${rec.id} returned to receptionist for correction.`);
                              setTimeout(() => setFeedback(null), 3000);
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-bold transition-colors cursor-pointer min-h-[32px]"
                            title="Return for revision"
                          >
                            Return
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Verified by Staff</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 text-xs text-teal-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Human Auditor Assurance:</strong> In accordance with Sri Sathya Sai Seva medical compliance, all scanned paper consultations require human review and approval by a certified practitioner before appearing in the patient&apos;s active medical records.
          </div>
        </div>
      </div>

      {/* Digitisation Entry Modal */}
      {showDigitiseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <FileUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Digitise Historical Paper Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    Extract physical register entry & attach scanned PDF / Image
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDigitiseModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 min-h-[44px] min-w-[44px] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!digPatientName.trim() || !digPaperRef.trim()) return;

                const newRec: DigitisedRecord = {
                  id: `DIG-2026-00${digitisedRecords.length + 1}`,
                  patientId: digPatientId.trim(),
                  patientName: digPatientName.trim(),
                  originalDate: digOriginalDate,
                  paperRegisterRef: digPaperRef.trim(),
                  practitionerName: digPractitioner,
                  notes: digNotes.trim(),
                  remedies: digRemedies.trim(),
                  fileName: digUploadedFile || 'scanned_paper_entry.pdf',
                  status: 'Pending Verification',
                };

                setDigitisedRecords([newRec, ...digitisedRecords]);
                setShowDigitiseModal(false);
                setFeedback(`Historical record ${newRec.id} for ${newRec.patientName} submitted for verification.`);
                setTimeout(() => setFeedback(null), 4000);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    required
                    value={digPatientId}
                    onChange={(e) => setDigPatientId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={digPatientName}
                    onChange={(e) => setDigPatientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Original Paper Visit Date
                  </label>
                  <input
                    type="date"
                    required
                    value={digOriginalDate}
                    onChange={(e) => setDigOriginalDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Physical Paper Register Ref / Volume
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. REG-PAD-2024-VOL-02-P19"
                    value={digPaperRef}
                    onChange={(e) => setDigPaperRef(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Attending / Reviewing Practitioner
                </label>
                <select
                  value={digPractitioner}
                  onChange={(e) => setDigPractitioner(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none min-h-[44px]"
                >
                  {practitioners.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Extracted Vibronics Remedies Written in Register
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CC12.1 + CC20.3 (Joint Support)"
                  value={digRemedies}
                  onChange={(e) => setDigRemedies(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Extracted Clinical Observations & Symptoms
                </label>
                <textarea
                  rows={3}
                  required
                  value={digNotes}
                  onChange={(e) => setDigNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Scanned Document Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Attach Scanned Paper Sheet (PDF / JPEG / PNG)
                </label>
                <div className="border-2 border-dashed border-teal-200 rounded-2xl p-6 text-center bg-teal-50/40 hover:bg-teal-50/70 transition-colors">
                  <UploadCloud className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {digUploadedFile ? (
                      <span className="text-teal-800 flex items-center justify-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>Ready: {digUploadedFile}</span>
                      </span>
                    ) : (
                      'Drag & drop scanned file here, or click to browse'
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Maximum scan file size: 10 MB (Prototype stores reference in session)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDigitiseModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm cursor-pointer min-h-[44px] shadow-sm flex items-center gap-2"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Submit for Verification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
