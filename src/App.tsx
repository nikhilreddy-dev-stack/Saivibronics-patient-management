/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PageId, Clinic, Appointment, MedicalRecord, PatientProfile } from './types';
import {
  INITIAL_CLINICS,
  PRACTITIONERS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  DEMO_PATIENT,
} from './data/mockData';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { OfflineIndicator } from './components/OfflineIndicator';

import { HomePage } from './pages/HomePage';
import { FindClinicPage } from './pages/FindClinicPage';
import { ClinicDetailsPage } from './pages/ClinicDetailsPage';
import { PatientRegistrationPage } from './pages/PatientRegistrationPage';
import { SignInPage } from './pages/SignInPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { PractitionerSignInPage } from './pages/PractitionerSignInPage';
import { PractitionerDashboardPage } from './pages/PractitionerDashboardPage';
import { AdminSignInPage } from './pages/AdminSignInPage';
import { ClinicAdminDashboardPage } from './pages/ClinicAdminDashboardPage';
import { OrgAdminDashboardPage } from './pages/OrgAdminDashboardPage';

import { Stethoscope, Building2, LogOut, ExternalLink, Layers } from 'lucide-react';

export default function App() {
  // Current URL path representation
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      return p && p !== '' ? p : '/';
    }
    return '/';
  });

  const [selectedClinicId, setSelectedClinicId] = useState<string>('clinic-padmanabhanagar');
  const [clinicSearchQuery, setClinicSearchQuery] = useState<string>('');
  const [clinicSearchService, setClinicSearchService] = useState<string>('All Services');

  // Shared in-memory data state
  const [clinics, setClinics] = useState<Clinic[]>(INITIAL_CLINICS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);

  // Authentication states
  const [authenticatedPatient, setAuthenticatedPatient] = useState<PatientProfile | null>(null);
  const [registeredPatients, setRegisteredPatients] = useState<PatientProfile[]>([DEMO_PATIENT]);
  const [isPractitionerAuthenticated, setIsPractitionerAuthenticated] = useState<boolean>(true);
  const [adminRole, setAdminRole] = useState<'clinic-admin' | 'org-admin'>('clinic-admin');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true);

  // Navigation handler with browser History API support
  const navigateTo = useCallback((destination: string) => {
    let targetPath = destination;

    // Map legacy PageId strings to standard URL paths if needed
    if (destination === 'home') targetPath = '/';
    else if (destination === 'find-clinic' || destination === 'clinics') targetPath = '/clinics';
    else if (destination === 'clinic-details') targetPath = `/clinics/${selectedClinicId}`;
    else if (destination === 'register') targetPath = '/register';
    else if (destination === 'signin') targetPath = '/signin';
    else if (destination === 'patient-dashboard') targetPath = '/dashboard/patient';
    else if (destination === 'practitioner' || destination === 'practitioner-dashboard') targetPath = '/practitioner/dashboard';
    else if (destination === 'practitioner-signin') targetPath = '/practitioner/signin';
    else if (destination === 'admin' || destination === 'admin-dashboard' || destination === 'clinic-admin-dashboard' || destination === 'org-admin-dashboard') targetPath = '/admin/dashboard';
    else if (destination === 'admin-signin') targetPath = '/admin/signin';

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setCurrentPath(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedClinicId]);

  // Support Browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectClinic = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    navigateTo(`/clinics/${clinicId}`);
  };

  const handleSearchFromHome = (query: string, service?: string) => {
    setClinicSearchQuery(query);
    if (service) {
      setClinicSearchService(service);
    }
    navigateTo('/clinics');
  };

  const handleBookAppointment = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: 'Cancelled' } : apt))
    );
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt))
    );
  };

  const handleAddClinic = (newClinic: Clinic) => {
    setClinics((prev) => [newClinic, ...prev]);
  };

  // Patient Authentication Handlers
  const handlePatientSignInSuccess = (patient: PatientProfile) => {
    setAuthenticatedPatient(patient);
    navigateTo('/dashboard/patient');
  };

  const handlePatientSignOut = () => {
    setAuthenticatedPatient(null);
    navigateTo('/');
  };

  const handlePatientLoginAsDemo = () => {
    setAuthenticatedPatient(DEMO_PATIENT);
    navigateTo('/dashboard/patient');
  };

  const handlePatientRegisterSuccess = (patient: PatientProfile) => {
    setRegisteredPatients((prev) => [patient, ...prev]);
    setAuthenticatedPatient(patient);
    navigateTo('/dashboard/patient');
  };

  // Practitioner Portal Authentication Handlers
  const handlePractitionerSignInSuccess = () => {
    setIsPractitionerAuthenticated(true);
    navigateTo('/practitioner/dashboard');
  };

  const handlePractitionerSignOut = () => {
    setIsPractitionerAuthenticated(false);
    navigateTo('/practitioner/signin');
  };

  // Admin Portal Authentication Handlers
  const handleAdminSignInSuccess = (role: 'clinic-admin' | 'org-admin') => {
    setAdminRole(role);
    setIsAdminAuthenticated(true);
    navigateTo('/admin/dashboard');
  };

  const handleAdminSignOut = () => {
    setIsAdminAuthenticated(false);
    navigateTo('/admin/signin');
  };

  const selectedClinic = clinics.find((c) => c.id === selectedClinicId) || clinics[0];
  const clinicPractitioners = PRACTITIONERS.filter((p) => p.clinicId === selectedClinic.id);
  const activePractitioners = clinicPractitioners.length > 0 ? clinicPractitioners : PRACTITIONERS.slice(0, 2);

  // Derive legacy PageId for components expecting onNavigate(PageId)
  const legacyPageId: PageId = (() => {
    if (currentPath === '/' || currentPath === '/home') return 'home';
    if (currentPath === '/clinics' || currentPath === '/find-clinic') return 'find-clinic';
    if (currentPath.startsWith('/clinics/')) return 'clinic-details';
    if (currentPath === '/register') return 'register';
    if (currentPath === '/signin') return 'signin';
    if (currentPath === '/dashboard/patient' || currentPath === '/patient-dashboard') return 'patient-dashboard';
    if (currentPath === '/practitioner/signin') return 'practitioner-signin';
    if (currentPath.startsWith('/practitioner')) return 'practitioner-dashboard';
    if (currentPath === '/admin/signin') return 'admin-signin';
    if (currentPath.startsWith('/admin')) {
      return adminRole === 'org-admin' ? 'org-admin-dashboard' : 'clinic-admin-dashboard';
    }
    return 'home';
  })();

  // -------------------------------------------------------------
  // 1. PRACTITIONER PORTAL SHELL & ROUTES (/practitioner/*)
  // -------------------------------------------------------------
  if (currentPath.startsWith('/practitioner')) {
    const isSignInRoute = currentPath === '/practitioner/signin';

    if (isSignInRoute || !isPractitionerAuthenticated) {
      return (
        <PractitionerSignInPage
          onSignInSuccess={handlePractitionerSignInSuccess}
          onNavigatePublicHome={() => navigateTo('/')}
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
        {/* Dedicated Practitioner Top Bar */}
        <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Saivibronics Clinical Portal
              </div>
              <div className="text-[11px] text-teal-400 font-semibold tracking-wide flex items-center gap-1.5">
                <span>Dr. K. S. Ramesh, BAMS, MD (Ayu)</span>
                <span className="text-slate-600">·</span>
                <span>Padmanabhanagar Center</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateTo('/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="View Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
            <button
              onClick={handlePractitionerSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1">
          <PractitionerDashboardPage
            appointments={appointments}
            onNavigate={(page) => navigateTo(page)}
            onUpdateAppointment={handleUpdateAppointment}
          />
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ADMINISTRATION PORTAL SHELL & ROUTES (/admin/*)
  // -------------------------------------------------------------
  if (currentPath.startsWith('/admin')) {
    const isSignInRoute = currentPath === '/admin/signin';

    if (isSignInRoute || !isAdminAuthenticated) {
      return (
        <AdminSignInPage
          onSignInSuccess={handleAdminSignInSuccess}
          onNavigatePublicHome={() => navigateTo('/')}
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
        {/* Dedicated Administration Top Bar */}
        <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Saivibronics Administration Console
              </div>
              <div className="text-[11px] text-indigo-300 font-semibold tracking-wide flex items-center gap-1.5">
                <span>
                  {adminRole === 'clinic-admin'
                    ? 'Padmanabhanagar Pilot Reception'
                    : 'Karnataka State Coordinator'}
                </span>
                <span className="text-slate-600">·</span>
                <span className="capitalize">{adminRole.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Prototype Role Switcher for Admin Level Testing */}
            <button
              onClick={() => setAdminRole((prev) => (prev === 'clinic-admin' ? 'org-admin' : 'clinic-admin'))}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-700 text-indigo-200 text-xs font-semibold hover:bg-indigo-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Toggle between Clinic Reception and State Network Coordinator views"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Switch to {adminRole === 'clinic-admin' ? 'Org Admin' : 'Clinic Desk'}</span>
            </button>

            <button
              onClick={() => navigateTo('/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="View Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <button
              onClick={handleAdminSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1">
          {adminRole === 'clinic-admin' ? (
            <ClinicAdminDashboardPage
              appointments={appointments}
              practitioners={PRACTITIONERS}
              onNavigate={(page) => navigateTo(page)}
            />
          ) : (
            <OrgAdminDashboardPage
              clinics={clinics}
              onNavigate={(page) => navigateTo(page)}
              onAddClinic={handleAddClinic}
            />
          )}
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. PUBLIC WEBSITE & PATIENT PORTAL
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Demonstration mode banner is ONLY rendered if ?demo=true is present in URL */}
      <DemoBanner currentPage={legacyPageId} onNavigate={navigateTo} />

      {/* Public Top Navigation Bar (Contains patient-facing options only) */}
      <Header
        currentPage={legacyPageId}
        onNavigate={navigateTo}
        authenticatedPatient={authenticatedPatient}
        onSignOut={handlePatientSignOut}
      />

      {/* Offline Status Monitor */}
      <OfflineIndicator />

      {/* Main View Port */}
      <main className="flex-1">
        {(currentPath === '/' || currentPath === '/home') && (
          <HomePage
            onNavigate={navigateTo}
            onSelectClinic={handleSelectClinic}
            onSearchClinics={handleSearchFromHome}
          />
        )}

        {(currentPath === '/clinics' || currentPath === '/find-clinic') && (
          <FindClinicPage
            clinics={clinics}
            onSelectClinic={handleSelectClinic}
            onNavigate={navigateTo}
            initialSearchQuery={clinicSearchQuery}
            initialService={clinicSearchService}
          />
        )}

        {currentPath.startsWith('/clinics/') && (
          <ClinicDetailsPage
            clinic={selectedClinic}
            practitioners={activePractitioners}
            onNavigate={navigateTo}
            onBookAppointment={handleBookAppointment}
            authenticatedPatient={authenticatedPatient}
          />
        )}

        {currentPath === '/register' && (
          <PatientRegistrationPage
            onNavigate={navigateTo}
            onRegisterSuccess={handlePatientRegisterSuccess}
            clinics={clinics}
          />
        )}

        {currentPath === '/signin' && (
          <SignInPage
            onNavigate={navigateTo}
            onSignInSuccess={handlePatientSignInSuccess}
            registeredPatients={registeredPatients}
          />
        )}

        {(currentPath === '/dashboard/patient' || currentPath === '/patient-dashboard') && (
          <PatientDashboardPage
            appointments={appointments}
            medicalRecords={medicalRecords}
            onNavigate={navigateTo}
            onCancelAppointment={handleCancelAppointment}
            authenticatedPatient={authenticatedPatient}
            onSignOut={handlePatientSignOut}
            onLoginAsDemo={handlePatientLoginAsDemo}
          />
        )}
      </main>

      {/* Public Website Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
