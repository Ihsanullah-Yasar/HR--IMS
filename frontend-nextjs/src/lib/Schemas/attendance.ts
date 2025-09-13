import { z } from "zod";

export const attendanceCreateSchema = z.object({
  employeeId: z.number().min(1, "Employee is required"),
  checkIn: z.string().min(1, "Check-in time is required"),
  checkOut: z.string().optional().nullable(),
  source: z.enum(['biometric', 'manual', 'mobile_app', 'web_portal']),
  hoursWorked: z.number().min(0).max(24).optional().nullable(),
  logDate: z.string().optional(),
});

export const attendanceUpdateSchema = z.object({
  employeeId: z.number().min(1).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional().nullable(),
  source: z.enum(['biometric', 'manual', 'mobile_app', 'web_portal']).optional(),
  hoursWorked: z.number().min(0).max(24).optional().nullable(),
  logDate: z.string().optional(),
});

export const attendanceBulkCreateSchema = z.object({
  records: z.array(attendanceCreateSchema).min(1, "At least one record is required"),
});

export const attendanceFilterSchema = z.object({
  employeeId: z.number().optional(),
  employeeName: z.string().optional(),
  departmentName: z.string().optional(),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
  source: z.enum(['biometric', 'manual', 'mobile_app', 'web_portal']).optional(),
});

export type AttendanceCreateFormData = z.infer<typeof attendanceCreateSchema>;
export type AttendanceUpdateFormData = z.infer<typeof attendanceUpdateSchema>;
export type AttendanceBulkCreateFormData = z.infer<typeof attendanceBulkCreateSchema>;
export type AttendanceFilterFormData = z.infer<typeof attendanceFilterSchema>;
