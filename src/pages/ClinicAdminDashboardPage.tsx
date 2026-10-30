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
  Sparkles
} from 'lucide-react';

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

  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const waitingCount = appointments.filter((a) => a.status === 'Waiting').length;
  const inProgressCount = appointments.filter((a) => a.status === 'In Consultation').length;

  const handleUpdateLimit = (delta: number) => {
    setDailyTokenLimit((prev) => Math.max(10, prev + delta));
    setFeedback(`Daily token quota set to ${Math.max(10, dailyTokenLimit + delta)}`);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
          <span>/</span>
          <span className="text-slate-900 font-medium">Clinic Administrator</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Clinic Operations Console
              </span>
              <span className="text-xs text-slate-500 font-mono">Unit: SSSO-BLR-01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Padmanabhanagar Pilot Seva Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              14th Main, Near Carmel High School, Padmanabhanagar, Bengaluru 560070
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('org-admin-dashboard')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-teal-300" />
              <span>Organisation View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Clinic Admin Demonstration View:</strong> Operational figures, token volumes, and practitioner rosters reflect fictional pilot data for Sri Sathya Sai Seva Clinic Padmanabhanagar. Adjustments are kept in local session state.
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Appointments Today */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Today&apos;s Appointments</span>
            <CalendarCheck2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {appointments.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span className="text-teal-700 font-semibold">{completedCount} Completed</span>
            <span>·</span>
            <span className="text-amber-700 font-semibold">{waitingCount} In Waiting</span>
          </div>
        </div>

        {/* Card 2: Active Practitioners */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Practitioners on Roster</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {practitioners.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Certified Vibronics senior volunteers
          </div>
        </div>

        {/* Card 3: Registered Patients in Unit */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Registered Patients (Unit)</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            482
          </div>
          <div className="text-[11px] text-slate-500">
            Padmanabhanagar locality pilot registry
          </div>
        </div>

        {/* Card 4: Operating Status & Token Cap */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Daily Token Quota</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {dailyTokenLimit}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleUpdateLimit(-5)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                -
              </button>
              <button
                onClick={() => handleUpdateLimit(5)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            Capacity: <strong className="text-teal-800">{clinicStatus}</strong>
          </div>
        </div>
      </div>

      {/* Practitioner Shifts & Room Allocations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Practitioner Room Allocations & Schedules
            </h3>
            <p className="text-xs text-slate-500">
              Assigned consultation spaces at Padmanabhanagar Seva Clinic
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Day:</span>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 cursor-pointer"
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
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Practitioner</th>
                <th className="py-3 px-4">Assigned Room</th>
                <th className="py-3 px-4">Available Days</th>
                <th className="py-3 px-4">Consultation Shift</th>
                <th className="py-3 px-4">Primary Specialty</th>
                <th className="py-3 px-4 text-right">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {practitioners
                .filter((p) => filterShift === 'All' || p.availableDays.includes(filterShift))
                .map((prac, idx) => (
                  <tr key={prac.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {prac.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{prac.title}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                      Consultation Room {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {prac.availableDays.join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {prac.timing}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {prac.specialization}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active on Roster
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Queue Live Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Live Token Queue & Reception Dispensing
            </h3>
            <p className="text-xs text-slate-500">
              Real-time token distribution for Padmanabhanagar clinic
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('practitioner-dashboard')}
              className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Open Practitioner View
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Assigned Practitioner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes / Remedies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {apt.tokenNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {apt.patientName}
                    <span className="block text-[10px] text-slate-400 font-mono">{apt.patientId}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {apt.timeSlot}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {apt.practitionerName}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : apt.status === 'In Consultation'
                          ? 'bg-teal-600 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {apt.remedySummary || apt.reasonForVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
