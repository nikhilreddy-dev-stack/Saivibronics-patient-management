/**
 * Saivibronics Central Data Access Service
 * 
 * ARCHITECTURE & FUTURE BACKEND PREPARATION:
 * In this client-side prototype phase, this service mediates access to demonstration
 * data models (Clinics, Practitioners, Appointments, Medical Records, Remedies).
 * 
 * For future production backend integration:
 * - Replace synchronous in-memory operations with async HTTP/REST calls to protected endpoints.
 * - Inject JWT authorization Bearer tokens from authenticated sessions.
 * - Implement role-based access control (RBAC) boundaries across:
 *     patient, practitioner, clinic-admin, org-admin.
 * - Enforce clinic-level tenant data isolation and HIPAA/consent compliance.
 * - DO NOT store real personal health information (PHI) in client-side localStorage.
 */

import { Clinic, Practitioner, Appointment, MedicalRecord, VibronicsRemedy } from '../types';
import {
  INITIAL_CLINICS,
  PRACTITIONERS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  VIBRONICS_REMEDIES,
  LOCALITIES,
  ALL_SERVICES
} from '../data/mockData';

export interface ClinicSearchParams {
  query?: string;
  locality?: string;
  service?: string;
}

export const ClinicDataService = {
  /**
   * Retrieve list of participating seva clinics
   */
  getClinics: (): Clinic[] => {
    return [...INITIAL_CLINICS];
  },

  /**
   * Find a specific clinic by unique ID
   */
  getClinicById: (id: string): Clinic | undefined => {
    return INITIAL_CLINICS.find((c) => c.id === id);
  },

  /**
   * Search and filter clinics by name, locality, PIN code, or medical seva specialty
   */
  searchClinics: (clinics: Clinic[], params: ClinicSearchParams): Clinic[] => {
    const q = (params.query || '').toLowerCase().trim();
    const loc = params.locality || 'All Localities';
    const srv = params.service || 'All Services';

    return clinics.filter((clinic) => {
      const matchesQuery =
        q === '' ||
        clinic.name.toLowerCase().includes(q) ||
        clinic.locality.toLowerCase().includes(q) ||
        clinic.pincode.includes(q) ||
        clinic.address.toLowerCase().includes(q);

      const matchesLocality =
        loc === 'All Localities' ||
        clinic.locality.toLowerCase().includes(loc.toLowerCase()) ||
        loc.toLowerCase().includes(clinic.locality.toLowerCase());

      const matchesService =
        srv === 'All Services' ||
        clinic.specialties.some((s) => s.toLowerCase().includes(srv.toLowerCase()));

      return matchesQuery && matchesLocality && matchesService;
    });
  },

  /**
   * Retrieve available practitioners, optionally filtered by clinic
   */
  getPractitioners: (clinicId?: string): Practitioner[] => {
    if (!clinicId) return [...PRACTITIONERS];
    return PRACTITIONERS.filter((p) => p.clinicId === clinicId);
  },

  /**
   * Find a specific practitioner by ID
   */
  getPractitionerById: (id: string): Practitioner | undefined => {
    return PRACTITIONERS.find((p) => p.id === id);
  },

  /**
   * Get supported locality filter values
   */
  getLocalities: (): string[] => {
    return [...LOCALITIES];
  },

  /**
   * Get supported holistic service categories
   */
  getServices: (): string[] => {
    return [...ALL_SERVICES];
  },

  /**
   * Get initial appointments for demonstration
   */
  getInitialAppointments: (): Appointment[] => {
    return [...INITIAL_APPOINTMENTS];
  },

  /**
   * Get demonstration medical records for patient view
   */
  getInitialMedicalRecords: (): MedicalRecord[] => {
    return [...INITIAL_MEDICAL_RECORDS];
  },

  /**
   * Get Vibrionics approved remedy catalog
   */
  getRemedies: (): VibronicsRemedy[] => {
    return [...VIBRONICS_REMEDIES];
  }
};
