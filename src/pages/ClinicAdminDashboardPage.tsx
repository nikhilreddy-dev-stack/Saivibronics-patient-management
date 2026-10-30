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
  ChevronRight
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

          <div className="flex items-center gap-3">
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
    </div>
  );
};
