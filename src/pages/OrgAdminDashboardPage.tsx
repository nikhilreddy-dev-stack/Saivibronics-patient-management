import React, { useState } from 'react';
import { Clinic, PageId, AuditLogEntry } from '../types';
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
  Activity
} from 'lucide-react';

interface OrgAdminDashboardPageProps {
  clinics: Clinic[];
  auditLogs?: AuditLogEntry[];
  onNavigate: (page: PageId) => void;
  onAddClinic: (newClinic: Clinic) => void;
}

export const OrgAdminDashboardPage: React.FC<OrgAdminDashboardPageProps> = ({
  clinics,
  auditLogs = [],
  onNavigate,
  onAddClinic,
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'impact' | 'practitioners' | 'audit'>('directory');
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddClinicModal, setShowAddClinicModal] = useState(false);
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
                  Sri Sathya Sai Seva Organisations, Karnataka · Multi-Clinic Network Console
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowAddClinicModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Seva Center</span>
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
              onClick={() => setActiveTab('practitioners')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'practitioners'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>State Practitioner Registry</span>
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
            {/* Search filter */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search clinics by name, locality (e.g. Padmanabhanagar), or pincode..."
                className="w-full text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Clinics grid */}
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
                        <strong className="text-slate-900">{clinic.activePractitionersCount} Seva Doctors</strong>
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

        {/* TAB 2: STATE-WIDE IMPACT ANALYTICS */}
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
                <p className="text-3xl font-bold text-slate-900 mt-2">48</p>
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
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span><strong>CC15.1</strong> - Mental & Emotional Balance (Stress Relief)</span>
                  <span className="font-bold text-indigo-700">1,940 beneficiaries</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRACTITIONER REGISTRY */}
        {activeTab === 'practitioners' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">State Practitioner Registry & Accreditation</h2>
              <p className="text-xs text-slate-500">Certified Sai Vibronics volunteer doctors in Karnataka</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
                    KR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dr. K. S. Ramesh, BAMS, MD (Ayu)</h4>
                    <p className="text-xs text-slate-500">Reg: KA-AYU-1988-42 · Padmanabhanagar Pilot Center</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  Level 3 Certified
                </span>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold">
                    RM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Smt. Radha V. Murthy, M.Sc</h4>
                    <p className="text-xs text-slate-500">Accredited 2018 · Padmanabhanagar Pilot Center</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  Level 3 Certified
                </span>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">
                    VP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Sri Venkatesh Prasad, B.Pharm</h4>
                    <p className="text-xs text-slate-500">Accredited 2017 · Basavanagudi Center</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  Level 3 Certified
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & RBAC AUDIT LOGS */}
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
                  <option value="Check-In">Queue Check-In</option>
                  <option value="Prescription">Prescriptions</option>
                  <option value="Historical">Historical Records</option>
                  <option value="Roster">Roster Updates</option>
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

      {/* ADD NEW SEVA CENTER MODAL */}
      {showAddClinicModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Register New Seva Center</span>
              </h3>
              <button
                onClick={() => setShowAddClinicModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Practitioners Count</label>
                  <input
                    type="number"
                    value={clinicPractitionersCount}
                    onChange={(e) => setClinicPractitionersCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={clinicStatus}
                    onChange={(e) => setClinicStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option>Operational</option>
                    <option>Upcoming</option>
                    <option>Active Pilot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Specialties</label>
                <input
                  type="text"
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
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
    </div>
  );
};
