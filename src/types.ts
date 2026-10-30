export type PageId =
  | 'home'
  | 'find-clinic'
  | 'clinic-details'
  | 'register'
  | 'signin'
  | 'patient-dashboard'
  | 'practitioner-dashboard'
  | 'clinic-admin-dashboard'
  | 'org-admin-dashboard';

export type UserRole = 'patient' | 'practitioner' | 'clinic-admin' | 'org-admin';

export interface Clinic {
  id: string;
  name: string;
  code: string;
  locality: string;
  pincode: string;
  address: string;
  phone: string;
  operatingHours: string;
  specialties: string[];
  activePractitionersCount: number;
  status: 'Active Pilot' | 'Operational' | 'Upcoming';
  image: string;
  isPilotCenter?: boolean;
  facilities: string[];
  seniorAccessible: boolean;
}

export interface Practitioner {
  id: string;
  name: string;
  title: string;
  qualification: string;
  experienceYears: number;
  clinicId: string;
  availableDays: string[];
  timing: string;
  specialization: string;
}

export interface Appointment {
  id: string;
  tokenNumber: string;
  patientName: string;
  patientId: string;
  clinicId: string;
  clinicName: string;
  practitionerName: string;
  date: string;
  timeSlot: string;
  status: 'Scheduled' | 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled';
  reasonForVisit: string;
  notes?: string;
  remedySummary?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  clinicName: string;
  practitionerName: string;
  diagnosisSummary: string;
  prescribedRemedies: string[];
  followUpAdvice: string;
  lifestyleNotes: string;
  vitals: {
    bp: string;
    pulse: string;
    weight: string;
  };
}

export interface VibronicsRemedy {
  code: string;
  name: string;
  category: string;
  commonUses: string;
}
