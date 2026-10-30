import React, { useState, useMemo } from 'react';
import { Clinic, PageId } from '../types';
import { LOCALITIES, ALL_SERVICES } from '../data/mockData';
import {
  Search,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  Filter,
  ShieldAlert,
  ArrowRight,
  Accessibility,
  Building,
  RotateCcw,
  Phone,
  Users
} from 'lucide-react';

interface FindClinicPageProps {
  clinics: Clinic[];
  onSelectClinic: (clinicId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const FindClinicPage: React.FC<FindClinicPageProps> = ({
  clinics,
  onSelectClinic,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [selectedService, setSelectedService] = useState('All Services');
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  // Filtered clinics
  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        clinic.name.toLowerCase().includes(query) ||
        clinic.locality.toLowerCase().includes(query) ||
        clinic.pincode.includes(query) ||
        clinic.address.toLowerCase().includes(query);

      const matchesLocality =
        selectedLocality === 'All Localities' ||
        clinic.locality.toLowerCase().includes(selectedLocality.toLowerCase()) ||
        selectedLocality.toLowerCase().includes(clinic.locality.toLowerCase());

      const matchesService =
        selectedService === 'All Services' ||
        clinic.specialties.some((s) => s.toLowerCase().includes(selectedService.toLowerCase()));

      return matchesSearch && matchesLocality && matchesService;
    });
  }, [clinics, searchQuery, selectedLocality, selectedService]);

  const handleRequestLocation = () => {
    setShowLocationDialog(true);
  };

  const confirmLocationAccess = () => {
    setShowLocationDialog(false);
    if ('geolocation' in navigator) {
      setLocationNotice('Requesting location from browser...');
      navigator.geolocation.getCurrentPosition(
        () => {
          setSelectedLocality('Padmanabhanagar');
          setLocationNotice('Nearest center detected: Padmanabhanagar, Bengaluru (560070). Showing closest pilot clinics.');
        },
        (error) => {
          setLocationNotice(
            error.code === 1
              ? 'Location permission was denied. You can select your locality manually using the buttons below.'
              : 'Location service unavailable. You can search manually by PIN code or locality.'
          );
        },
        { timeout: 8000 }
      );
    } else {
      setLocationNotice('Geolocation is not supported by your browser. Please choose your locality manually.');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocality('All Localities');
    setSelectedService('All Services');
    setLocationNotice(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title & Context */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-teal-700 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Find a Clinic</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Sri Sathya Sai Vibronics Clinics
            </h1>
            <p className="mt-1 text-base text-slate-600">
              Discover participating seva clinics in Padmanabhanagar and across Bengaluru.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-950 font-bold self-start md:self-auto">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Demonstration Pilot Data</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Panel with Accessible Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <label htmlFor="clinic-search" className="block text-sm font-bold text-slate-800 mb-2">
              Search by Clinic Name, Locality or PIN Code
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="clinic-search"
                type="text"
                placeholder="e.g. Padmanabhanagar, 560070, Basavanagudi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 min-h-[48px]"
              />
            </div>
          </div>

          {/* Locality Dropdown */}
          <div className="md:col-span-3">
            <label htmlFor="locality-filter" className="block text-sm font-bold text-slate-800 mb-2">
              Filter by Locality
            </label>
            <select
              id="locality-filter"
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer min-h-[48px]"
            >
              {LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Service Dropdown */}
          <div className="md:col-span-3">
            <label htmlFor="service-filter" className="block text-sm font-bold text-slate-800 mb-2">
              Available Seva Service
            </label>
            <select
              id="service-filter"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 cursor-pointer min-h-[48px]"
            >
              {ALL_SERVICES.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location & Quick Manual Selection Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-500">Quick Localities:</span>
            {['Padmanabhanagar', 'Banashankari', 'Basavanagudi', 'Jayanagar'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocality(loc)}
                className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[38px] ${
                  selectedLocality.includes(loc)
                    ? 'bg-teal-700 border-teal-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={handleRequestLocation}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-900 rounded-xl text-sm font-bold border border-teal-200 transition-colors cursor-pointer min-h-[44px]"
            >
              <Navigation className="w-4 h-4 text-teal-700" />
              <span>Use My Location</span>
            </button>

            {(searchQuery || selectedLocality !== 'All Localities' || selectedService !== 'All Services') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Status Message if any */}
        {locationNotice && (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-sm text-teal-950 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <p>{locationNotice}</p>
            </div>
            <button
              onClick={() => setLocationNotice(null)}
              className="text-teal-700 hover:text-teal-950 font-bold ml-2 cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
        <div>
          Showing <span className="font-extrabold text-slate-900">{filteredClinics.length}</span>{' '}
          {filteredClinics.length === 1 ? 'clinic' : 'clinics'} in Bengaluru
        </div>
        <div>
          Pilot Headquarters: <span className="font-bold text-teal-800">Padmanabhanagar (560070)</span>
        </div>
      </div>

      {/* Clinic Cards Grid */}
      {filteredClinics.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl text-slate-400 flex items-center justify-center mx-auto">
            <Building className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No clinics matched your criteria</h3>
          <p className="text-base text-slate-600 max-w-md mx-auto">
            Try adjusting your search terms, removing filters, or resetting to view the Padmanabhanagar pilot center.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-3 bg-teal-700 text-white rounded-2xl text-sm font-bold hover:bg-teal-800 transition-colors cursor-pointer min-h-[48px]"
          >
            Show All Bengaluru Clinics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className={`bg-white rounded-3xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                clinic.isPilotCenter
                  ? 'border-teal-400 ring-2 ring-teal-100'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header with image */}
                <div className="p-6 sm:p-7 pb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 uppercase tracking-wider font-mono">
                      {clinic.code}
                    </span>
                    {clinic.isPilotCenter && (
                      <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 uppercase tracking-wider">
                        Pilot Center
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {clinic.name}
                  </h3>

                  <div className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                    <MapPin className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </div>
                </div>

                {/* Body: Hours & Services */}
                <div className="px-6 sm:px-7 py-3 space-y-4 text-sm">
                  <div className="flex items-start gap-2.5 text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Operating Hours: </span>
                      {clinic.operatingHours}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block mb-2">
                      Available Holistic Services:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {clinic.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {clinic.seniorAccessible && (
                    <div className="flex items-center gap-2 text-teal-900 font-bold text-xs sm:text-sm">
                      <Accessibility className="w-4 h-4 text-teal-700" />
                      <span>Wheelchair accessible entrance & priority queue available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 sm:p-7 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-slate-500 text-xs sm:text-sm self-start sm:self-center">
                  <span className="font-bold text-slate-800">{clinic.activePractitionersCount}</span> certified volunteers on duty
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectClinic(clinic.id);
                    onNavigate('clinic-details');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <span>View Details & Book Token</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Explicit Location Permission Modal */}
      {showLocationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Location Access Permission
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Saivibronics would like to use your browser location to display the nearest Sri Sathya Sai clinic in Bengaluru (such as the Padmanabhanagar pilot center).
            </p>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
              <strong>Privacy Guarantee:</strong> Location coordinates are processed exclusively in your browser session for distance sorting and are never saved or sent to external servers.
            </div>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLocationDialog(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLocationAccess}
                className="px-5 py-2.5 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                Allow Location Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
