/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  PageId,
  Clinic,
  Appointment,
  MedicalRecord,
  PatientProfile,
  PrescriptionRecord,
  ChatMessage,
  HistoricalRecord,
  AuditLogEntry,
  ConversationThread,
  Practitioner,
  PractitionerSchedule
} from './types';
import {
  INITIAL_CLINICS,
  PRACTITIONERS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  DEMO_PATIENT,
  INITIAL_PATIENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MESSAGES,
  INITIAL_CONVERSATIONS,
  INITIAL_HISTORICAL_RECORDS,
  INITIAL_AUDIT_LOGS,
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

  // Shared platform state
  const [clinics, setClinics] = useState<Clinic[]>(INITIAL_CLINICS);
  const [practitioners, setPractitioners] = useState<Practitioner[]>(PRACTITIONERS);
  const [patients, setPatients] = useState<PatientProfile[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(INITIAL_PRESCRIPTIONS);
  const [conversations, setConversations] = useState<ConversationThread[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [historicalRecords, setHistoricalRecords] = useState<HistoricalRecord[]>(INITIAL_HISTORICAL_RECORDS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Authentication states
  const [authenticatedPatient, setAuthenticatedPatient] = useState<PatientProfile | null>(DEMO_PATIENT);
  const [isPractitionerAuthenticated, setIsPractitionerAuthenticated] = useState<boolean>(true);
  const [adminRole, setAdminRole] = useState<'clinic-admin' | 'org-admin'>('clinic-admin');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true);

  // Navigation handler with browser History API support
  const navigateTo = useCallback((destination: string) => {
    let targetPath = destination;

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
    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: newAppointment.patientName,
      userRole: 'Patient / Reception',
      action: 'Token Scheduled',
      details: `Token #${newAppointment.tokenNumber} scheduled for ${newAppointment.practitionerName} on ${newAppointment.date} (${newAppointment.timeSlot})`,
      clinic: newAppointment.clinicName,
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'Cancelled' } : a))
    );
    if (apt) {
      const newAudit: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: authenticatedPatient?.fullName || 'Patient',
        userRole: 'Patient',
        action: 'Token Cancelled',
        details: `Cancelled token #${apt.tokenNumber} for ${apt.date}`,
        clinic: apt.clinicName,
        result: 'Success',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt))
    );
  };

  const handleAddClinic = (newClinic: Clinic) => {
    setClinics((prev) => [newClinic, ...prev]);
    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'state.coordinator@saivibronics.org',
      userRole: 'Organisation Administrator',
      action: 'Register Clinic',
      details: `Added new center ${newClinic.name} (${newClinic.code})`,
      clinic: newClinic.name,
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Administrator Patient Modification (Section 9 Requirement)
  const handleUpdatePatient = (updatedPatient: PatientProfile, reason?: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    if (authenticatedPatient && authenticatedPatient.id === updatedPatient.id) {
      setAuthenticatedPatient(updatedPatient);
    }
    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: adminRole === 'clinic-admin' ? 'admin.padmanabhanagar@saivibronics.org' : 'state.coordinator@saivibronics.org',
      userRole: adminRole === 'clinic-admin' ? 'Clinic Administrator' : 'Organisation Administrator',
      action: 'Patient Profile Edit',
      details: `Modified patient ${updatedPatient.fullName} (${updatedPatient.id}). Reason: ${reason || 'Demographic update'}`,
      clinic: 'Padmanabhanagar Pilot',
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Administrator Practitioner Management & Schedule (Section 6 & 9 Requirements)
  const handleUpdatePractitioner = (updatedPractitioner: Practitioner, reason?: string) => {
    setPractitioners((prev) =>
      prev.map((p) => (p.id === updatedPractitioner.id ? updatedPractitioner : p))
    );
    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: adminRole === 'clinic-admin' ? 'admin.padmanabhanagar@saivibronics.org' : 'state.coordinator@saivibronics.org',
      userRole: adminRole === 'clinic-admin' ? 'Clinic Administrator' : 'Organisation Administrator',
      action: 'Practitioner Profile & Schedule Update',
      details: `Updated ${updatedPractitioner.name}. ${reason || 'Schedule and room configuration update'}`,
      clinic: updatedPractitioner.clinicId,
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleAddPractitioner = (newPractitioner: Practitioner) => {
    setPractitioners((prev) => [...prev, newPractitioner]);
    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'state.coordinator@saivibronics.org',
      userRole: 'Organisation Administrator',
      action: 'Add Practitioner',
      details: `Accredited ${newPractitioner.name} (${newPractitioner.registrationNumber})`,
      clinic: newPractitioner.clinicId,
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleUpdatePractitionerSchedule = (updatedSchedule: PractitionerSchedule) => {
    setPractitioners((prev) =>
      prev.map((p) => {
        if (p.id === updatedSchedule.practitionerId) {
          const daysList = Object.entries(updatedSchedule.weeklySchedule)
            .filter(([, v]) => v.isWorkingDay)
            .map(([k]) => k);
          return {
            ...p,
            schedule: updatedSchedule,
            availableDays: daysList,
          };
        }
        return p;
      })
    );
    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'dr.ramesh@saivibronics-seva.org',
      userRole: 'Senior Practitioner',
      action: 'Practitioner Schedule Self-Update',
      details: `Updated weekly working hours and leave dates for ${updatedSchedule.practitionerId}`,
      clinic: updatedSchedule.clinicId,
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Practitioner Prescribing action
  const handleCreatePrescription = (newRx: PrescriptionRecord) => {
    setPrescriptions((prev) => [newRx, ...prev]);

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === newRx.appointmentId
          ? {
              ...apt,
              status: 'Completed',
              notes: newRx.clinicalNotes,
              remedySummary: newRx.remedies.map((r) => `${r.code} (${r.name})`).join(' + '),
            }
          : apt
      )
    );

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now().toString().slice(-6)}`,
      date: newRx.date,
      clinicName: newRx.clinicName,
      practitionerName: newRx.practitionerName,
      diagnosisSummary: newRx.patientConcern,
      prescribedRemedies: newRx.remedies.map(
        (r) => `${r.code} ${r.name} - ${r.dosage} (${r.frequency})`
      ),
      followUpAdvice: newRx.followUpInstructions || 'Take remedies as directed before meals.',
      lifestyleNotes: 'Maintain gentle hydration and avoid exposing sugar globules to strong aromas or radiation.',
      vitals: {
        bp: '124/82 mmHg',
        pulse: '74 bpm',
        weight: '63.5 kg',
      },
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'dr.ramesh@saivibronics-seva.org',
      userRole: 'Senior Practitioner',
      action: 'Finalise Prescription',
      details: `Digital prescription ${newRx.id} issued for ${newRx.patientName} (${newRx.patientId})`,
      clinic: newRx.clinicName,
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Two-Panel Multi-Conversation Messaging Action (Section 7 Requirement)
  const handleSendMessage = (conversationId: string, text: string, senderRole: 'patient' | 'practitioner') => {
    const isPatient = senderRole === 'patient';
    const targetConversation = conversations.find((c) => c.id === conversationId) || conversations[0];

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: targetConversation.id,
      senderRole,
      senderName: isPatient ? (authenticatedPatient?.fullName || 'Smt. Ananya Rao') : 'Dr. K. S. Ramesh, BAMS',
      receiverRole: isPatient ? 'practitioner' : 'patient',
      receiverName: isPatient ? 'Dr. K. S. Ramesh, BAMS' : targetConversation.patientName,
      text,
      timestamp: 'Just now',
      read: !isPatient,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Update conversation thread snippet and move to top
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== targetConversation.id);
      const updatedThread: ConversationThread = {
        ...targetConversation,
        lastMessageText: text,
        lastMessageTime: 'Just now',
        unreadCount: isPatient ? targetConversation.unreadCount + 1 : 0,
      };
      return [updatedThread, ...remaining];
    });
  };

  // Historical record digitisation
  const handleDigitiseRecord = (
    recordData: Omit<HistoricalRecord, 'id' | 'dateEntered' | 'verificationStatus'>
  ) => {
    const newRecord: HistoricalRecord = {
      ...recordData,
      id: `hist-${Date.now().toString().slice(-6)}`,
      dateEntered: new Date().toISOString().slice(0, 10),
      verificationStatus: 'Pending Verification',
    };
    setHistoricalRecords((prev) => [newRecord, ...prev]);

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'admin.padmanabhanagar@saivibronics.org',
      userRole: 'Clinic Administrator',
      action: 'Historical Record Digitisation',
      details: `Submitted paper record for ${newRecord.patientName} (${newRecord.patientId})`,
      clinic: 'Padmanabhanagar Pilot',
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Historical record dual sign-off
  const handleVerifyHistoricalRecord = (
    recordId: string,
    status: 'Approved' | 'Returned',
    notes?: string
  ) => {
    setHistoricalRecords((prev) =>
      prev.map((rec) =>
        rec.id === recordId
          ? {
              ...rec,
              verificationStatus: status,
              verifiedBy: 'Dr. K. S. Ramesh, BAMS, MD (Ayu)',
              approvalNotes: notes,
              dateVerified: new Date().toISOString().slice(0, 10),
            }
          : rec
      )
    );

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'dr.ramesh@saivibronics-seva.org',
      userRole: 'Senior Practitioner',
      action: `Dual Sign-Off: ${status}`,
      details: `Sign-off completed for paper record ${recordId}`,
      clinic: 'Padmanabhanagar Pilot',
      result: 'Success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
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
    setPatients((prev) => [patient, ...prev]);
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
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
        <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Saivibronics Clinical Portal
              </div>
              <div className="text-[11px] text-teal-700 font-semibold tracking-wide flex items-center gap-1.5">
                <span>Dr. K. S. Ramesh, BAMS, MD (Ayu)</span>
                <span className="text-slate-300">·</span>
                <span>Padmanabhanagar Center (Room 1)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateTo('/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="View Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Website</span>
            </button>
            <button
              onClick={handlePractitionerSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1">
          <PractitionerDashboardPage
            practitioner={practitioners[0]}
            appointments={appointments}
            prescriptions={prescriptions}
            conversations={conversations}
            messages={messages}
            historicalRecords={historicalRecords}
            onNavigate={(page) => navigateTo(page)}
            onUpdateAppointment={handleUpdateAppointment}
            onCreatePrescription={handleCreatePrescription}
            onSendMessage={(convId, text) => handleSendMessage(convId, text, 'practitioner')}
            onUpdatePractitionerSchedule={handleUpdatePractitionerSchedule}
            onVerifyHistoricalRecord={handleVerifyHistoricalRecord}
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
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
        <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Saivibronics Administration Console
              </div>
              <div className="text-[11px] text-indigo-700 font-semibold tracking-wide flex items-center gap-1.5">
                <span>
                  {adminRole === 'clinic-admin'
                    ? 'Padmanabhanagar Pilot Reception'
                    : 'Karnataka State Coordinator'}
                </span>
                <span className="text-slate-300">·</span>
                <span className="capitalize">{adminRole.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setAdminRole((prev) => (prev === 'clinic-admin' ? 'org-admin' : 'clinic-admin'))}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Toggle between Clinic Reception and State Network Coordinator views"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Switch to {adminRole === 'clinic-admin' ? 'Org Admin' : 'Clinic Desk'}</span>
            </button>

            <button
              onClick={() => navigateTo('/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="View Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Website</span>
            </button>

            <button
              onClick={handleAdminSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
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
              practitioners={practitioners}
              patients={patients}
              historicalRecords={historicalRecords}
              onNavigate={(page) => navigateTo(page)}
              onBookAppointment={handleBookAppointment}
              onDigitiseRecord={handleDigitiseRecord}
              onUpdatePatient={handleUpdatePatient}
              onUpdatePractitioner={handleUpdatePractitioner}
            />
          ) : (
            <OrgAdminDashboardPage
              clinics={clinics}
              practitioners={practitioners}
              patients={patients}
              auditLogs={auditLogs}
              onNavigate={(page) => navigateTo(page)}
              onAddClinic={handleAddClinic}
              onAddPractitioner={handleAddPractitioner}
              onUpdatePatient={handleUpdatePatient}
              onUpdatePractitioner={handleUpdatePractitioner}
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
      <DemoBanner currentPage={legacyPageId} onNavigate={navigateTo} />

      <Header
        currentPage={legacyPageId}
        onNavigate={navigateTo}
        authenticatedPatient={authenticatedPatient}
        onSignOut={handlePatientSignOut}
      />

      <OfflineIndicator />

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
            practitioners={practitioners}
            appointments={appointments}
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
            registeredPatients={patients}
          />
        )}

        {(currentPath === '/dashboard/patient' || currentPath === '/patient-dashboard') && (
          <PatientDashboardPage
            appointments={appointments}
            medicalRecords={medicalRecords}
            prescriptions={prescriptions}
            messages={messages}
            onSendMessage={(text) => handleSendMessage('conv-0842-prac1', text, 'patient')}
            onNavigate={navigateTo}
            onCancelAppointment={handleCancelAppointment}
            authenticatedPatient={authenticatedPatient}
            onSignOut={handlePatientSignOut}
            onLoginAsDemo={handlePatientLoginAsDemo}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
