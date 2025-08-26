enum Gender {
  Male,
  Female,
  Other,
}

enum MartialStatus {
  Single = "SINGLE",
  Married = "MARRIED",
  Divorced = "DIVORCED",
  Widowed = "WIDOWED",
  Separated = "SEPARATED",
}

export interface Employee {
  id: number;

  // Core fields
  name: string; // multi-language first name
  gender_type?: Gender | null;
  marital_status?: MartialStatus | null;
  date_of_birth: string; // ISO date string (YYYY-MM-DD)
  date_of_joining: string; // ISO date string
  date_of_leaving?: string | null; // nullable ISO date string
  timezone: string; // default 'UTC'
  consent_given: boolean; // default false
  data_retention_until?: string | null; // nullable timestamp (ISO)

  // Audit
  created_by?: number | null; // FK -> users.id
  updated_by?: number | null; // FK -> users.id
  deleted_by?: number | null; // FK -> users.id
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at?: string | null; // for soft deletes

  // Foreign relations
  user_id?: number | null; // unique FK -> users.id
  department_id: number; // FK -> departments.id (required)
  designation_id: number; // FK -> designations.id (required)
}
