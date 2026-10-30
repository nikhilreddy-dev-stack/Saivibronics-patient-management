import React, { useState } from 'react';
import { Clinic, PageId } from '../types';
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
  Hospital
} from 'lucide-react';

interface OrgAdminDashboardPageProps {
  clinics: Clinic[];
  onNavigate: (page: PageId) => void;
  onAddClinic: (newClinic: Clinic) => void;
}

export const OrgAdminDashboardPage: React.FC<OrgAdminDashboardPageProps> = ({
  clinics,
  onNavigate,
  onAddClinic,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddClinicModal, setShowAddClinicModal] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  // New clinic form state
  const [clinicName, setClinicName] = useState('');
  const [clinicLocality, setClinicLocality] = useState('Whitefield');
  const [clinicPincode, setClinicPincode] = useState('560066');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicOperatingHours, setClinicOperatingHours] = useState('Mon - Sat: 9:30 AM - 1:00 PM, 5:00 PM - 7:30 PM');
  const [clinicPractitionersCount, setClinicPractitionersCount] = useState(2);
  const [clinicStatus, setClinicStatus] = useState<'Operational' | 'Upcoming' | 'Active Pilot'>('Operational');
  const [specialtiesText, setSpecialtiesText] = useState('Vibronics 108 Holistic Care, Preventive Lifestyle, Senior Wellness');

  const filteredClinics = clinics.filter((c) => {
    const q = searchFilter.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.locality.toLowerCase().includes(q) ||
      c.pincode.includes(q)
    );
  });

  const handleAddClinicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName.trim() || !clinicAddress.trim()) return;

    const newCode = `SSSO-BLR-0${clinics.length + 1}`;
    const newClinicObj: Clinic = {
      id: `clinic-${Date.now()}`,
      name: clinicName.trim(),
      code: newCode,
      locality: clinicLocality.trim(),
      pincode: clinicPincode.trim(),
      address: clinicAddress.trim(),
      phone: '+91 80 2800 1234 (Demo Only)',
      operatingHours: clinicOperatingHours,
      specialties: specialtiesText.split(',').map((s) => s.trim()).filter(Boolean),
      activePractitionersCount: Number(clinicPractitionersCount) || 2,
      status: clinicStatus,
      image: '/src/assets/images/hero_healthcare_clinic_1793209988820.jpg',
      isPilotCenter: false,
      facilities: ['Wheelchair Ramp', 'Waiting Hall', 'Free Dispensing Counter'],
      seniorAccessible: true,
    };

    onAddClinic(newClinicObj);
    setShowAddClinicModal(false);
    setAddedFeedback(`Clinic "${clinicName}" added to local prototype state! It is now visible across Find a Clinic.`);
    setTimeout(() => setAddedFeedback(null), 4000);

    // Reset form
    setClinicName('');
    setClinicAddress('');
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
          <span className="text-slate-900 font-bold">Organisation Administrator</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                State Seva Coordinator
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-semibold">Karnataka Seva Trust</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sri Sathya Sai Multi-Clinic Network
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Coordinating Bengaluru clinics with Padmanabhanagar as the foundational pilot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddClinicModal(true)}
              className="px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs min-h-[48px]"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Clinic Unit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Organisation Network Demonstration:</strong> All clinic statistics, token distributions, and registrations are fictional representations. Adding a clinic updates the current client-side prototype memory so you can immediately test discovery and booking workflows. Data is not saved to a persistent server.
        </div>
      </div>

      {addedFeedback && (
        <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-sm text-teal-950 flex items-center gap-2 font-bold shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{addedFeedback}</span>
        </div>
      )}

      {/* Summary Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Network Clinics</span>
            <Hospital className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {clinics.length}
          </div>
          <div className="text-xs text-slate-500">
            Across Bengaluru urban districts
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Pilot Location</span>
            <MapPin className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            Padmanabhanagar
          </div>
          <div className="text-xs text-teal-800 font-bold">
            PIN 560070 · Live patient management pilot
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Cumulative Volunteer Roster</span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {clinics.reduce((acc, c) => acc + c.activePractitionersCount, 0)}
          </div>
          <div className="text-xs text-slate-500">
            Certified practitioners across all units
          </div>
        </div>
      </div>

      {/* Clinic Registry Table with Search */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Registered Sri Sathya Sai Clinics Registry
            </h3>
            <p className="text-sm text-slate-500">
              Multi-clinic administrative registry and deployment status
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by clinic or locality..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 min-h-[44px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-xs border-y border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Clinic Code</th>
                <th className="py-3.5 px-4 font-bold">Clinic Name & Address</th>
                <th className="py-3.5 px-4 font-bold">Locality / PIN</th>
                <th className="py-3.5 px-4 font-bold">Active Volunteers</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-teal-800">
                    {clinic.code}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block">{clinic.name}</span>
                    <span className="text-xs text-slate-500 block truncate max-w-sm mt-0.5">{clinic.address}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    <span className="font-semibold block">{clinic.locality}</span>
                    <span className="text-xs text-slate-400 font-mono">{clinic.pincode}</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-800 font-bold">
                    {clinic.activePractitionersCount} on duty
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        clinic.isPilotCenter
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : clinic.status === 'Operational'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {clinic.isPilotCenter ? 'Active Pilot' : clinic.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onNavigate('find-clinic')}
                      className="text-teal-700 hover:text-teal-900 font-bold cursor-pointer text-sm"
                    >
                      View Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Clinic Modal */}
      {showAddClinicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <form onSubmit={handleAddClinicSubmit} className="space-y-5 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-teal-700" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Add Clinic to Demonstration Network
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddClinicModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-2 min-h-[44px] min-w-[44px]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Clinic Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Sathya Sai Seva Clinic - Whitefield"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Locality in Bengaluru <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clinicLocality}
                    onChange={(e) => setClinicLocality(e.target.value)}
                    placeholder="e.g. Whitefield"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    PIN Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={clinicPincode}
                    onChange={(e) => setClinicPincode(e.target.value)}
                    placeholder="560066"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Complete Street Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  placeholder="Near Sai Geetha Ashram, Kadugodi Main Road, Bengaluru 560066"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Active Practitioners Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={clinicPractitionersCount}
                    onChange={(e) => setClinicPractitionersCount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 min-h-[48px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Operational Status
                  </label>
                  <select
                    value={clinicStatus}
                    onChange={(e) => setClinicStatus(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 cursor-pointer min-h-[48px]"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Upcoming">Upcoming Seva Centre</option>
                    <option value="Active Pilot">Active Pilot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Services Offered (comma separated)
                </label>
                <input
                  type="text"
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 min-h-[48px]"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl text-xs text-amber-950 border border-amber-200">
                <strong>Local Prototype Update:</strong> Adding this clinic injects it into this browser session, allowing you to search for it, view its details, and schedule fictional appointments immediately.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddClinicModal(false)}
                  className="px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-2xl transition-colors cursor-pointer min-h-[48px]"
                >
                  Add Clinic to Prototype
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
