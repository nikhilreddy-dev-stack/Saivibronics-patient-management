export type PageId =
  | 'home'
  | 'find-clinic'
  | 'clinics'
  | 'clinic-details'
  | 'register'
  | 'signin'
  | 'patient-dashboard'
  | 'practitioner'
  | 'practitioner-signin'
  | 'practitioner-dashboard'
  | 'admin'
  | 'admin-signin'
  | 'admin-dashboard'
  | 'clinic-admin-dashboard'
  | 'org-admin-dashboard';

export type UserRole = 'patient' | 'practitioner' | 'clinic-admin' | 'org-admin';

export interface PatientProfile {
  id: string;
  patientId?: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  age?: number | string;
  gender?: string;
  preferredLanguage?: string;
  preferredClinicId: string;
  preferredClinicName?: string;
  address?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  accessibilityNeeds?: string;
  status?: 'Active' | 'Inactive';
  registeredDate: string;
}

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

export interface DailyWorkingHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isWorkingDay: boolean;
  morningStart?: string; // e.g. "09:30 AM"
  morningEnd?: string;   // e.g. "01:00 PM"
  afternoonStart?: string; // e.g. "05:00 PM"
  afternoonEnd?: string;   // e.g. "07:30 PM"
  maxCapacity: number; // Max appointments per session
  slotDurationMinutes: number; // e.g. 20
  roomNumber?: string;
}

export interface PractitionerSchedule {
  practitionerId: string;
  clinicId: string;
  weeklySchedule: Record<string, DailyWorkingHours>;
  leaveDates: string[]; // YYYY-MM-DD
  blockedSlots?: { date: string; timeSlot: string; reason: string }[];
  consultationDurationMinutes: number;
  servicesOffered: string[];
}

export interface Practitioner {
  id: string;
  name: string;
  title: string;
  qualification: string;
  registrationNumber?: string;
  level?: 'Level 1' | 'Level 2' | 'Level 3';
  phone?: string;
  email?: string;
  experienceYears: number;
  clinicId: string;
  assignedClinicIds?: string[];
  roomNumber?: string;
  availableDays: string[];
  timing: string;
  specialization: string;
  servicesOffered?: string[];
  status?: 'Active' | 'Inactive' | 'On Leave';
  schedule?: PractitionerSchedule;
}

export interface Appointment {
  id: string;
  tokenNumber: string;
  patientName: string;
  patientId: string;
  clinicId: string;
  clinicName: string;
  practitionerName: string;
  serviceName?: string;
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

export interface RemedyItem {
  code: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  precautions?: string;
}

export interface PrescriptionRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  clinicName: string;
  date: string;
  patientConcern: string;
  clinicalNotes: string;
  remedies: RemedyItem[];
  followUpDate?: string;
  followUpInstructions?: string;
  status: 'Draft' | 'Finalised';
  createdAt: string;
  finalisedAt?: string;
}

export interface ConversationThread {
  id: string; // conversationId
  patientId: string;
  patientName: string;
  patientAge?: number | string;
  practitionerId: string;
  practitionerName: string;
  clinicId: string;
  clinicName: string;
  status: 'Active' | 'Resolved';
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderRole: 'patient' | 'practitioner';
  senderName: string;
  receiverRole: 'patient' | 'practitioner';
  receiverName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface HistoricalRecord {
  id: string;
  patientId: string;
  patientName: string;
  originalVisitDate: string;
  clinicName: string;
  digitisedSummary: string;
  scannedDocRef: string;
  enteredBy: string;
  verifiedBy?: string;
  verificationStatus: 'Pending Verification' | 'Approved' | 'Returned';
  approvalNotes?: string;
  dateEntered: string;
  dateVerified?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  details: string;
  clinic: string;
  result: 'Success' | 'Denied' | 'Flagged';
}
