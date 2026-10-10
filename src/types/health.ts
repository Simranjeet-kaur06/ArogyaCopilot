export type LanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'te'
  | 'ta'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
];

export type AgeGroup = 'toddler' | 'teenager' | 'adult' | 'senior';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  abhaAddress: string;
  abhaNumber: string;
  gender: string;
  yearOfBirth: string;
  bloodGroup: string;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "1-0-1" or "Twice daily"
  route?: string; // "Oral", "Inhalation", etc.
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Anytime';
  duration?: string;
  purpose?: string;
  isHighRisk?: boolean;
  takenToday?: {
    morning?: boolean;
    afternoon?: boolean;
    night?: boolean;
  };
  reminderTimes?: string[]; // e.g. ["08:00", "20:00"]
  remainingPills?: number;
}

export interface LabTestItem {
  id: string;
  testName: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical';
  explanation: string;
  category?: 'Diabetes' | 'Lipid' | 'Liver' | 'Kidney' | 'CBC' | 'Thyroid' | 'General';
}

export interface MedicalRecord {
  id: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Diagnostic Imaging';
  title: string;
  facilityName: string;
  doctorName: string;
  date: string;
  confidence: number;
  diagnoses: string[];
  medicines: MedicineItem[];
  labTests: LabTestItem[];
  plainLanguageSummary: string;
  abnormalValuesExplained: string;
  foodDrugInteractions: string[];
  lifestyleAdvice: string[];
  questionsForDoctor: string[];
  fhirResource?: Record<string, any>;
  imageUri?: string;
  isCritical?: boolean;
  ayurvedicAdvice?: AyurvedicAdvice;
}

export interface AyurvedicHerb {
  id: string;
  name: string;
  sanskritName: string;
  doshaImpact: string;
  keyBenefits: string[];
  recommendedForm: string;
  therapeuticUse: string;
  contraindications: string;
  allopathicInteractionNote: string;
}

export interface AyurvedicAdvice {
  prakritiDoshaNote: string;
  recommendedHerbs: AyurvedicHerb[];
  dinacharyaTips: string[];
  incompatibleFoodsViruddha: string[];
  dietaryPathyaApathya: {
    favorablePathya: string[];
    avoidApathya: string[];
  };
}

export interface WaterLog {
  id: string;
  amountMl: number;
  timestamp: string;
}

export interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  email?: string;
}

export interface HospitalVisitReminder {
  id: string;
  doctorName: string;
  hospitalName: string;
  department: string;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // e.g. "10:30 AM"
  purpose: string;
  isFastingRequired: boolean;
  notes?: string;
  checklist: Array<{ id: string; label: string; checked: boolean }>;
  reminderAlerts: string[];
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  googleMapsUrl?: string;
  hospitalPhone?: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Multispecialty' | 'Government' | 'Trauma & Emergency' | 'Cardiology' | 'Pediatric';
  distanceKm: number;
  emergencyPhone: string;
  generalPhone: string;
  address: string;
  has24x7Emergency: boolean;
  icuBedsAvailable: number;
  rating: number;
  latitude: number;
  longitude: number;
  openGoogleMapsUrl: string;
}

export interface AgeTask {
  id: string;
  title: string;
  description: string;
  category: 'Physical' | 'Mental' | 'Nutritional' | 'Habit';
  completed: boolean;
  points: number;
  targetGroup: AgeGroup;
}

export interface AgeTip {
  id: string;
  title: string;
  tip: string;
  category: string;
  iconName: string;
  targetGroup: AgeGroup;
}

export interface AbhaProfile {
  abhaNumber: string; // e.g., "91-4521-8720-3341"
  abhaAddress: string; // e.g., "rahul.verma@abdm"
  name: string;
  gender: string;
  yearOfBirth: string;
  bloodGroup: string;
  linkedFacilities: string[];
  isVerified: boolean;
  qrPayload: string;
}
