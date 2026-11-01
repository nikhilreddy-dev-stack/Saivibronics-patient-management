import React, { useState, useMemo } from 'react';
import { Clinic, PageId, AuditLogEntry, Practitioner, PatientProfile } from '../types';
import {
  Building2,
  Plus,
  ShieldAlert,
  Search,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Hospital,
  ShieldCheck,
  Users,
  FileText,
  Download,
  Filter,
  CheckCircle,
  Activity,
  Edit,
  UserCheck,
  Eye,
  KeyRound,
  Sliders
} from 'lucide-react';

interface OrgAdminDashboardPageProps {
  clinics: Clinic[];
  practitioners?: Practitioner[];
  patients?: PatientProfile[];
  auditLogs?: AuditLogEntry[];
  onNavigate: (page: PageId) => void;
  onAddClinic: (newClinic: Clinic) => void;
  onAddPractitioner?: (newPractitioner: Practitioner) => void;
  onUpdatePatient?: (updated: PatientProfile, reason?: string) => void;
  onUpdatePractitioner?: (updated: Practitioner, reason?: string) => void;
}

export const OrgAdminDashboardPage: React.FC<OrgAdminDashboardPageProps> = ({
  clinics,
  practitioners = [],
  patients = [],
  auditLogs = [],
  onNavigate,
  onAddClinic,
  onAddPractitioner,
  onUpdatePatient,
  onUpdatePractitioner,
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'patients' | 'practitioners' | 'impact' | 'audit'>('directory');
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddClinicModal, setShowAddClinicModal] = useState(false);
  const [showAddPractitionerModal, setShowAddPractitionerModal] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // New clinic form state
  const [clinicName, setClinicName] = useState('');
  const [clinicLocality, setClinicLocality] = useState('Whitefield');
  const [clinicPincode, setClinicPincode] = useState('560066');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicOperatingHours, setClinicOperatingHours] = useState('Mon - Sat: 9:30 AM - 1:00 PM');
  const [clinicPractitionersCount, setClinicPractitionersCount] = useState(2);
  const [clinicStatus, setClinicStatus] = useState<'Operational' | 'Upcoming' | 'Active Pilot'>('Operational');
  const [specialtiesText, setSpecialtiesText] = useState('Vibronics 108 Holistic Care, Senior Wellness');

  // New practitioner form state
  const [newPracName, setNewPracName] = useState('');
  const [newPracTitle, setNewPracTitle] = useState('Certified Sai Vibronics Practitioner');
  const [newPracQual, setNewPracQual] = useState('BAMS, Sai Vibronics Level 2');
  const [newPracReg, setNewPracReg] = useState('KA-AYU-2026-');
  const [newPracLevel, setNewPracLevel] = useState<'Level 1' | 'Level 2' | 'Level 3'>('Level 2');
  const [newPracClinicId, setNewPracClinicId] = useState(clinics[0]?.id || 'clinic-padmanabhanagar');
  const [newPracSpecialization, setNewPracSpecialization] = useState('General Holistic Wellness & Senior Care');

  // Patient editing state
  const [editingPatient, setEditingPatient] = useState<PatientProfile | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [editReasonInput, setEditReasonInput] = useState('');

  // Audit log filter
  const [auditFilter, setAuditFilter] = useState('All');

  const filteredClinics = clinics.filter((c) => {
    const q = searchFilter.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.locality.toLowerCase().includes(q) ||
      c.pincode.includes(q)
    );
  });

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = patientSearch.toLowerCase();
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.mobileNumber.includes(q)
      );
    });
  }, [patients, patientSearch]);

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === 'All') return true;
    return log.action.toLowerCase().includes(auditFilter.toLowerCase());
  });

  const handleAddClinicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName.trim() || !clinicAddress.trim()) return;

    const newCode = `SSSO-BLR-0${clinics.length + 1}`;
    const newClinicObj: Clinic = {
      id: `clinic-${Date.now()}`,
      name: clinicName.trim(),
      code: newCode,
      locality: clinicLocality,
      pincode: clinicPincode,
      address: clinicAddress.trim(),
      phone: '+91 80 2669 1108',
      operatingHours: clinicOperatingHours,
      specialties: specialtiesText.split(',').map((s) => s.trim()),
      activePractitionersCount: clinicPractitionersCount,
      status: clinicStatus,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      facilities: ['Free Remedy Dispensation', 'Senior Waiting Area', 'Wheelchair Ramp'],
      seniorAccessible: true,
    };

    onAddClinic(newClinicObj);
    setShowAddClinicModal(false);
    setClinicName('');
    setClinicAddress('');
    setFeedbackNotice(`Successfully registered ${newClinicObj.name} (${newCode}) in Karnataka network.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleAddPractitionerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPracName.trim()) return;

    const newPrac: Practitioner = {
      id: `prac-${Date.now()}`,
      name: newPracName.trim(),
      title: newPracTitle.trim(),
      qualification: newPracQual.trim(),
      registrationNumber: newPracReg.trim(),
      level: newPracLevel,
      experienceYears: 5,
      clinicId: newPracClinicId,
      assignedClinicIds: [newPracClinicId],
      roomNumber: 'Room 1',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timing: '09:30 AM - 01:00 PM',
      specialization: newPracSpecialization.trim(),
      servicesOffered: ['Vibronics 108 Holistic Consultation', 'Senior Citizen Wellness'],
      status: 'Active',
      schedule: {
        practitionerId: `prac-${Date.now()}`,
        clinicId: newPracClinicId,
        consultationDurationMinutes: 20,
        servicesOffered: ['Vibronics 108 Holistic Consultation'],
        leaveDates: [],
        weeklySchedule: {
          Monday: { day: 'Monday', isWorkingDay: true, morningStart: '09:30 AM', morningEnd: '01:00 PM', maxCapacity: 12, slotDurationMinutes: 20, roomNumber: 'Room 1' },
          Tuesday: { day: 'Tuesday', isWorkingDay: false, maxCapacity: 0, slotDurationMinutes: 20 },
          Wednesday: { day: 'Wednesday', isWorkingDay: true, morningStart: '09:30 AM', morningEnd: '01:00 PM', maxCapacity: 12, slotDurationMinutes: 20, roomNumber: 'Room 1' },
          Thursday: { day: 'Thursday', isWorkingDay: false, maxCapacity: 0, slotDurationMinutes: 20 },
          Friday: { day: 'Friday', isWorkingDay: true, morningStart: '09:30 AM', morningEnd: '01:00 PM', maxCapacity: 12, slotDurationMinutes: 20, roomNumber: 'Room 1' },
          Saturday: { day: 'Saturday', isWorkingDay: false, maxCapacity: 0, slotDurationMinutes: 20 },
          Sunday: { day: 'Sunday', isWorkingDay: false, maxCapacity: 0, slotDurationMinutes: 20 },
        }
      }
    };

    if (onAddPractitioner) {
      onAddPractitioner(newPrac);
    }
    setShowAddPractitionerModal(false);
    setNewPracName('');
    setFeedbackNotice(`Registered practitioner ${newPrac.name} in state network. Assigned to clinic.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleSavePatientEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    if (onUpdatePatient) {
      onUpdatePatient(editingPatient, editReasonInput || 'State Administrator demographic update');
    }
    setEditingPatient(null);
    setEditReasonInput('');
    setFeedbackNotice(`Patient details updated for ${editingPatient.fullName}.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Coordinator Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                <ShieldCheck className="w-6 h-6 text-indigo-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Karnataka State Vibronics Seva Governance
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
                    State Coordinator Level
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Sri Sathya Sai Seva Organisations, Karnataka · Multi-Clinic Network & RBAC Console
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowAddPractitionerModal(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add Doctor</span>
              </button>
              <button
                onClick={() => setShowAddClinicModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Seva Center</span>
              </button>
            </div>
          </div>
        </div>

        {/* Coordinator Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-1">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'directory'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Hospital className="w-4 h-4" />
              <span>Network Clinics Directory ({clinics.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'patients'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>State Patient Registry ({patients.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('practitioners')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'practitioners'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Practitioner Registry & Credentials ({practitioners.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('impact')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'impact'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>State-Wide Seva Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'audit'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Security & RBAC Audit Logs ({auditLogs.length})</span>
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

        {/* TAB 1: CLINICS DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search clinics by name, locality, or pincode..."
                className="w-full text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                        {clinic.code}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          clinic.status === 'Active Pilot'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {clinic.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {clinic.name}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{clinic.address}</span>
                    </p>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Active Practitioners:</span>
                        <strong className="text-slate-900">{clinic.activePractitionersCount} Doctors</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Operating Hours:</span>
                        <span className="text-slate-500">{clinic.operatingHours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{clinic.specialties[0]}</span>
                    <button
                      onClick={() => onNavigate('find-clinic')}
                      className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      View Center Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STATE PATIENT REGISTRY (Section 9 Requirement) */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">State-Wide Patient Directory</h2>
                <p className="text-xs text-slate-500">
                  Universal Health ID (UHID) records across all network centers.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search name, UHID, or mobile..."
                  className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 w-64"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="p-4">Patient UHID & Name</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Primary Center</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{patient.fullName}</div>
                        <div className="font-mono text-xs text-indigo-600">{patient.id}</div>
                      </td>
                      <td className="p-4 font-mono text-slate-700">{patient.mobileNumber}</td>
                      <td className="p-4 text-slate-600">{patient.preferredClinicName || 'Padmanabhanagar Seva Clinic'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {patient.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setEditingPatient({ ...patient });
                            setEditReasonInput('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STATE PRACTITIONER REGISTRY & CREDENTIALS (Section 9 Requirement) */}
        {activeTab === 'practitioners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">State Practitioner Registry & Credentials</h2>
                <p className="text-xs text-slate-500">
                  Certified volunteer doctors, credentials, certification levels, and clinic assignments.
                </p>
              </div>

              <button
                onClick={() => setShowAddPractitionerModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Register Volunteer Doctor</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {practitioners.map((prac) => (
                <div key={prac.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-sm shrink-0">
                      {prac.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{prac.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
                          {prac.level || 'Level 3'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                          {prac.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{prac.qualification}</p>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                        <span>Reg No: <strong className="font-mono text-slate-700">{prac.registrationNumber || 'KA-AYU-1988-42'}</strong></span>
                        <span>·</span>
                        <span>Experience: {prac.experienceYears} Years</span>
                        <span>·</span>
                        <span>Assigned: {prac.clinicId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setFeedbackNotice(`Sent secure password reset link to ${prac.email || prac.name}. Audit logged.`);
                        setTimeout(() => setFeedbackNotice(null), 3000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Reset Access</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STATE-WIDE IMPACT ANALYTICS */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">State Seva Outreach & Cumulative Impact</h2>
              <p className="text-xs text-slate-500">Voluntary holistic healthcare service report across Karnataka</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-semibold">Free Consultations</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">12,480+</p>
                <span className="text-[11px] text-emerald-600 font-semibold">+18% this quarter</span>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-semibold">Active Seva Doctors</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">{practitioners.length}</p>
                <span className="text-[11px] text-slate-400">Certified Level 1 - 3</span>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-semibold">Network Centers</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">{clinics.length}</p>
                <span className="text-[11px] text-slate-400">Bengaluru & Districts</span>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-semibold">Remedy Phials Dispensed</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">32,500+</p>
                <span className="text-[11px] text-slate-400">100% Free of charge</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900">Top Dispensed Vibronics 108 Remedy Formulations</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span><strong>CC20.3</strong> - Arthritis & Joint Support (Musculoskeletal)</span>
                  <span className="font-bold text-indigo-700">3,420 beneficiaries</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span><strong>CC12.1</strong> - Adult Vitality Tonic (Immunity & Senior Health)</span>
                  <span className="font-bold text-indigo-700">2,890 beneficiaries</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span><strong>CC4.1</strong> - Digestion & Metabolism Balancer</span>
                  <span className="font-bold text-indigo-700">2,410 beneficiaries</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & RBAC AUDIT LOGS (Section 10 Requirement) */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Security & RBAC Audit Logs</h2>
                <p className="text-xs text-slate-500">Immutable ledger of platform actions and clinical verifications</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="All">All Actions</option>
                  <option value="Profile">Profile Modifications</option>
                  <option value="Schedule">Schedule Updates</option>
                  <option value="Prescription">Prescriptions</option>
                  <option value="Check-In">Queue Check-In</option>
                </select>

                <button
                  onClick={() => {
                    setFeedbackNotice('Audit trail exported successfully as CSV.');
                    setTimeout(() => setFeedbackNotice(null), 3000);
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Trail</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredAuditLogs.map((log) => (
                  <div key={log.id} className="p-4 sm:p-5 space-y-1 hover:bg-slate-50 transition-colors text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">{log.timestamp}</span>
                        <span className="font-bold text-slate-900">{log.action}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {log.result}
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs">{log.details}</p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>User: {log.user} ({log.userRole})</span>
                      <span>·</span>
                      <span>Clinic: {log.clinic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT PATIENT MODAL */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Patient Record ({editingPatient.id})</h3>
              <button onClick={() => setEditingPatient(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePatientEdits} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-xs font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingPatient.fullName}
                  onChange={(e) => setEditingPatient({ ...editingPatient, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={editingPatient.mobileNumber}
                    onChange={(e) => setEditingPatient({ ...editingPatient, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Status</label>
                  <select
                    value={editingPatient.status || 'Active'}
                    onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-indigo-700 block mb-1">Reason for Administrative Modification *</label>
                <input
                  type="text"
                  value={editReasonInput}
                  onChange={(e) => setEditReasonInput(e.target.value)}
                  placeholder="State admin record audit note..."
                  className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50/40 rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW SEVA CENTER MODAL */}
      {showAddClinicModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Register New Seva Center</span>
              </h3>
              <button onClick={() => setShowAddClinicModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClinicSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Center Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="e.g. Sri Sathya Sai Seva Center - Whitefield"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Locality</label>
                  <input
                    type="text"
                    value={clinicLocality}
                    onChange={(e) => setClinicLocality(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={clinicPincode}
                    onChange={(e) => setClinicPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Address</label>
                <input
                  type="text"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  placeholder="Street address / Landmark"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClinicModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Register Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRACTITIONER MODAL */}
      {showAddPractitionerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Register Volunteer Doctor to Network</span>
              </h3>
              <button onClick={() => setShowAddPractitionerModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPractitionerSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  value={newPracName}
                  onChange={(e) => setNewPracName(e.target.value)}
                  placeholder="e.g. Dr. Sudha Sharma, MBBS"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={newPracReg}
                    onChange={(e) => setNewPracReg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Certification Level</label>
                  <select
                    value={newPracLevel}
                    onChange={(e) => setNewPracLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Level 1">Level 1 (Associate)</option>
                    <option value="Level 2">Level 2 (Certified)</option>
                    <option value="Level 3">Level 3 (Senior Practitioner)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assign Primary Seva Center</label>
                <select
                  value={newPracClinicId}
                  onChange={(e) => setNewPracClinicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.locality})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPractitionerModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
