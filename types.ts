
export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}

export enum RiskCategory {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONSULTED = 'CONSULTED',
  EMERGENCY = 'EMERGENCY',
  REFERRED = 'REFERRED',
  NOSHOW = 'NO_SHOW'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age?: number;
  chronicConditions?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  symptoms: string;
  chronicConditions: string[];
  severityScore: number;
  riskCategory: RiskCategory;
  preferredWindow: 'MORNING' | 'EVENING';
  requestTime: number;
  scheduledTime: string | null;
  status: AppointmentStatus;
  estimatedWaitMinutes: number;
  aiReasoning?: string;
}

export interface ClinicConfig {
  location: string;
  specialization: string;
  openingTime: string;
  closingTime: string;
  maxPatientsPerDay: number;
  consultationDuration: number;
}

export interface AIAnalysisResponse {
  severityScore: number;
  riskCategory: RiskCategory;
  reasoning: string;
}
