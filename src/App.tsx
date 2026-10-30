/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { StaffSignInPage } from './pages/StaffSignInPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { PractitionerDashboardPage } from './pages/PractitionerDashboardPage';
import { ClinicAdminDashboardPage } from './pages/ClinicAdminDashboardPage';
import { OrgAdminDashboardPage } from './pages/OrgAdminDashboardPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedClinicId, setSelectedClinicId] = useState<string>('clinic-padmanabhanagar');
  const [clinicSearchQuery, setClinicSearchQuery] = useState<string>('');
  const [clinicSearchService, setClinicSearchService] = useState<string>('All Services');

  // Prototype state management (in-memory demonstration storage)
  const [clinics, setClinics] = useState<Clinic[]>(INITIAL_CLINICS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);

  // Patient Authentication & Registration State (in-memory demonstration)
  const [authenticatedPatient, setAuthenticatedPatient] = useState<PatientProfile | null>(null);
  const [registeredPatients, setRegisteredPatients] = useState<PatientProfile[]>([DEMO_PATIENT]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSelectClinic = (clinicId: string) => {
    setSelectedClinicId(clinicId);
  };

  const handleSearchFromHome = (query: string, service?: string) => {
    setClinicSearchQuery(query);
    if (service) {
      setClinicSearchService(service);
    }
    setCurrentPage('find-clinic');
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

  // Authentication Handlers
  const handleSignInSuccess = (patient: PatientProfile) => {
    setAuthenticatedPatient(patient);
    setCurrentPage('patient-dashboard');
  };

  const handleSignOut = () => {
    setAuthenticatedPatient(null);
    setCurrentPage('home');
  };

  const handleLoginAsDemo = () => {
    setAuthenticatedPatient(DEMO_PATIENT);
    setCurrentPage('patient-dashboard');
  };

  const handleRegisterSuccess = (patient: PatientProfile) => {
    setRegisteredPatients((prev) => [patient, ...prev]);
    setAuthenticatedPatient(patient);
    setCurrentPage('patient-dashboard');
  };

  const selectedClinic = clinics.find((c) => c.id === selectedClinicId) || clinics[0];
  const clinicPractitioners = PRACTITIONERS.filter((p) => p.clinicId === selectedClinic.id);
  const activePractitioners = clinicPractitioners.length > 0 ? clinicPractitioners : PRACTITIONERS.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Prototype Academic Notice Bar with View Switcher */}
      <DemoBanner currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        authenticatedPatient={authenticatedPatient}
        onSignOut={handleSignOut}
      />

      {/* Offline Status Monitor */}
      <OfflineIndicator />

      {/* Main View Port */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            onSelectClinic={handleSelectClinic}
            onSearchClinics={handleSearchFromHome}
          />
        )}

        {currentPage === 'find-clinic' && (
          <FindClinicPage
            clinics={clinics}
            onSelectClinic={handleSelectClinic}
            onNavigate={setCurrentPage}
            initialSearchQuery={clinicSearchQuery}
            initialService={clinicSearchService}
          />
        )}

        {currentPage === 'clinic-details' && (
          <ClinicDetailsPage
            clinic={selectedClinic}
            practitioners={activePractitioners}
            onNavigate={setCurrentPage}
            onBookAppointment={handleBookAppointment}
            authenticatedPatient={authenticatedPatient}
          />
        )}

        {currentPage === 'register' && (
          <PatientRegistrationPage
            onNavigate={setCurrentPage}
            onRegisterSuccess={handleRegisterSuccess}
            clinics={clinics}
          />
        )}

        {currentPage === 'signin' && (
          <SignInPage
            onNavigate={setCurrentPage}
            onSignInSuccess={handleSignInSuccess}
            registeredPatients={registeredPatients}
          />
        )}

        {currentPage === 'staff-signin' && (
          <StaffSignInPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'patient-dashboard' && (
          <PatientDashboardPage
            appointments={appointments}
            medicalRecords={medicalRecords}
            onNavigate={setCurrentPage}
            onCancelAppointment={handleCancelAppointment}
            authenticatedPatient={authenticatedPatient}
            onSignOut={handleSignOut}
            onLoginAsDemo={handleLoginAsDemo}
          />
        )}

        {currentPage === 'practitioner-dashboard' && (
          <PractitionerDashboardPage
            appointments={appointments}
            onNavigate={setCurrentPage}
            onUpdateAppointment={handleUpdateAppointment}
          />
        )}

        {currentPage === 'clinic-admin-dashboard' && (
          <ClinicAdminDashboardPage
            appointments={appointments}
            practitioners={PRACTITIONERS}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'org-admin-dashboard' && (
          <OrgAdminDashboardPage
            clinics={clinics}
            onNavigate={setCurrentPage}
            onAddClinic={handleAddClinic}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
