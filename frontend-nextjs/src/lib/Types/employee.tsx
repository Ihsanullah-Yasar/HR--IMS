export enum GenderType {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum MaritalStatusType {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED",
}

export interface Employee {
  id: number;

  // Core fields (aligned to EmployeeResource keys for FE usage)
  name: string;
  genderType?: GenderType | null;
  maritalStatus?: MaritalStatusType | null;
  dateOfBirth: string;
  dateOfJoining: string;
  dateOfLeaving?: string | null;
  timezone: string;
  consentGiven: boolean;
  dataRetentionUntil?: string | null;

  // Relations by id
  userId?: number | null;
  departmentId: number;
  designationId: number;

  // Expanded relations (optional)
  user?: any;
  department?: any;
  designation?: any;

  // Audit ids
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type EmployeeCreateData = {
  name: string;
  genderType?: GenderType | null;
  maritalStatus?: MaritalStatusType | null;
  dateOfBirth: string;
  dateOfJoining: string;
  dateOfLeaving?: string | null;
  timezone: string;
  consentGiven: boolean;
  user?: string | null; // select value (id as string)
  department: string; // select value (id as string)
  designation: string; // select value (id as string)
};

export type EmployeeUpdateData = Partial<EmployeeCreateData>;

export type EmployeeEditFormData = {
  editingEmployee: Employee;
  departments: Array<{ id: number; name: string; code: string }>;
  designations: Array<{ id: number; code: string; title: string }>;
  users: Array<{ id: number; name: string; email: string }>;
};
