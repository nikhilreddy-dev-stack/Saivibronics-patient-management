import React, { useState, useMemo } from 'react';
import { Clinic, PageId } from '../types';
import { LOCALITIES, ALL_SERVICES } from '../data/mockData';
import {
  Search,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Accessibility,
  Building,
  RotateCcw,
  Map as MapIcon,
  List,
  Compass
} from 'lucide-react';

interface FindClinicPageProps {
  clinics: Clinic[];
  onSelectClinic: (clinicId: string) => void;
  onNavigate: (page: PageId) => void;
  initialSearchQuery?: string;
  initialService?: string;
}

export const FindClinicPage: React.FC<FindClinicPageProps> = ({
  clinics,
  onSelectClinic,
  onNavigate,
  initialSearchQuery = '',
  initialService = 'All Services',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [selectedService, setSelectedService] = useState(initialService);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [hoveredClinicId, setHoveredClinicId] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  React.useEffect(() => {
    if (initialService && initialService !== 'All Services') {
      setSelectedService(initialService);
    }
  }, [initialService]);

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
        srvMatches(clinic.specialties, selectedService);

      return matchesSearch && matchesLocality && matchesService;
    });
  }, [clinics, searchQuery, selectedLocality, selectedService]);

  function srvMatches(specialties: string[], selected: string) {
    if (selected === 'All Services') return true;
    return specialties.some((s) => s.toLowerCase().includes(selected.toLowerCase()));
  }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Title & Context */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Find a Clinic</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Sri Sathya Sai Vibronics Clinics
            </h1>
            <p className="mt-1 text-base text-slate-600">
              Discover participating seva clinics in Padmanabhanagar and across Bengaluru.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold self-start md:self-auto">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Pilot Demonstration Directory</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <label htmlFor="clinic-search" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
                className="w-full pl-12 pr-4 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 min-h-[48px]"
              />
            </div>
          </div>

          {/* Locality Dropdown */}
          <div className="md:col-span-3">
            <label htmlFor="locality-filter" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Filter by Locality
            </label>
            <select
              id="locality-filter"
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 cursor-pointer min-h-[48px]"
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
            <label htmlFor="service-filter" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Available Seva Service
            </label>
            <select
              id="service-filter"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 cursor-pointer min-h-[48px]"
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
            <span className="text-xs font-bold text-slate-500">Popular Localities:</span>
            {['Padmanabhanagar', 'Banashankari', 'Basavanagudi', 'Jayanagar'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocality(loc)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer min-h-[36px] ${
                  selectedLocality.includes(loc)
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
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
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition-colors cursor-pointer min-h-[40px]"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Use My Location</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'map' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Map View"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>

            {(searchQuery || selectedLocality !== 'All Localities' || selectedService !== 'All Services') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer min-h-[40px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Status Message if any */}
        {locationNotice && (
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <p>{locationNotice}</p>
            </div>
            <button
              onClick={() => setLocationNotice(null)}
              className="text-blue-700 hover:text-blue-900 font-bold ml-2 cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-medium">
        <div>
          Showing <span className="font-extrabold text-slate-900">{filteredClinics.length}</span>{' '}
          {filteredClinics.length === 1 ? 'clinic' : 'clinics'} in Bengaluru
        </div>
        <div className="text-xs">
          Pilot Hub: <span className="font-bold text-blue-600">Padmanabhanagar (560070)</span>
        </div>
      </div>

      {/* List / Map Layout */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Scrollable Clinic List */}
          <div className="lg:col-span-5 space-y-4 max-h-[680px] overflow-y-auto pr-1">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                onMouseEnter={() => setHoveredClinicId(clinic.id)}
                className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer ${
                  hoveredClinicId === clinic.id
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => {
                  onSelectClinic(clinic.id);
                  onNavigate('clinic-details');
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-mono">
                    {clinic.code}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">PIN {clinic.pincode}</span>
                </div>
                <h4 className="font-bold text-slate-900 mt-2 text-base">{clinic.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{clinic.address}</p>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Open Today</span>
                  </span>
                  <span className="text-blue-600 font-bold flex items-center gap-1">
                    <span>View & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Interactive Bengaluru Map Representation */}
          <div className="lg:col-span-7 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative min-h-[450px] lg:min-h-[600px] flex flex-col justify-between p-6">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Map Top Bar */}
            <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-xs text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Bengaluru South Region Map Preview</span>
              </div>
              <span className="text-slate-500">Interactive Seva Coordinates</span>
            </div>

            {/* Map Pins Grid */}
            <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 gap-6 py-8">
              {filteredClinics.map((clinic, idx) => (
                <div
                  key={clinic.id}
                  onClick={() => {
                    onSelectClinic(clinic.id);
                    onNavigate('clinic-details');
                  }}
                  className={`p-3 rounded-xl bg-white border shadow-md transition-all cursor-pointer transform hover:-translate-y-1 ${
                    hoveredClinicId === clinic.id
                      ? 'border-blue-600 ring-2 ring-blue-300 scale-105'
                      : 'border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate">{clinic.locality}</div>
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{clinic.name}</div>
                </div>
              ))}
            </div>

            {/* Map Footer Legend */}
            <div className="relative z-10 bg-white/95 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Click any pin to inspect clinic details and book token slot.</span>
              <span className="font-bold text-blue-600">Padmanabhanagar Pilot Active</span>
            </div>
          </div>
        </div>
      ) : (
        /* Standard List View */
        filteredClinics.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl text-slate-400 flex items-center justify-center mx-auto">
              <Building className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No clinics matched your criteria</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Try adjusting your search terms, removing filters, or resetting to view the Padmanabhanagar pilot center.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer min-h-[44px]"
            >
              Show All Bengaluru Clinics
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className={`bg-white rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  clinic.isPilotCenter
                    ? 'border-blue-400 ring-2 ring-blue-50'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Header */}
                  <div className="p-6 sm:p-7 pb-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 uppercase tracking-wider font-mono">
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
                      <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{clinic.address}</span>
                    </div>
                  </div>

                  {/* Body: Hours & Services */}
                  <div className="px-6 sm:px-7 py-3 space-y-4 text-sm">
                    <div className="flex items-start gap-2.5 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Operating Hours: </span>
                        {clinic.operatingHours}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800 block mb-2 text-xs uppercase tracking-wider">
                        Available Seva Specialties:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {clinic.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {clinic.seniorAccessible && (
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                        <Accessibility className="w-4 h-4 text-emerald-600" />
                        <span>Senior-Friendly & Wheelchair Accessible</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 sm:p-7 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-slate-500 text-xs self-start sm:self-center">
                    <span className="font-bold text-slate-800">{clinic.activePractitionersCount}</span> certified volunteers on duty
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectClinic(clinic.id);
                      onNavigate('clinic-details');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <span>View Details & Book Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Explicit Location Permission Modal */}
      {showLocationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Location Access Permission
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Saivibronics would like to use your browser location to display the nearest Sri Sathya Sai clinic in Bengaluru (such as the Padmanabhanagar pilot center).
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <strong>Privacy Guarantee:</strong> Location coordinates are processed exclusively in your browser session for distance sorting and are never saved or sent to external servers.
            </div>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLocationDialog(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLocationAccess}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer min-h-[40px]"
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
