import { Meta } from "./api";
import { Employee } from "./employee";

export enum AttendanceSource {
  BIOMETRIC = "biometric",
  MANUAL = "manual",
  MOBILE_APP = "mobile_app",
  WEB_PORTAL = "web_portal",
}

export type AttendanceRecord = {
  id: number;
  employeeId: number;
  checkIn: string; // ISO date string
  checkOut?: string | null; // ISO date string
  source: AttendanceSource;
  hoursWorked?: number | null;
  logDate: string; // Date string (YYYY-MM-DD)

  // Relations
  employee?: Employee;

  // Timestamps
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type AttendanceCreateData = Omit<
  AttendanceRecord,
  "id" | "createdAt" | "updatedAt" | "employee" | "hoursWorked"
> & {
  hoursWorked?: number | null;
};

export type AttendanceUpdateData = Partial<
  Omit<AttendanceRecord, "id" | "createdAt" | "updatedAt" | "employee">
>;

export type AttendanceCreateFormData = {
  employees: Pick<Employee, "id" | "name" | "departmentId">[];
};

export type AttendanceStats = {
  totalRecords: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageHoursWorked: number;
  totalHoursThisMonth: number;
};

export type AttendanceFilters = {
  employeeId?: number;
  employeeName?: string;
  departmentName?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  source?: AttendanceSource;
};

export type AttendanceSummary = {
  employee: Employee;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  totalHours: number;
  averageHoursPerDay: number;
  lastCheckIn?: string;
  lastCheckOut?: string;
};
