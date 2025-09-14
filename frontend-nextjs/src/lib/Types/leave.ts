import { z } from "zod";

// Base Leave interface
export interface Leave {
  id: number;
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: number;
  approved_at?: string;
  created_by?: {
    id: number;
    name: string;
  };
  updated_by?: {
    id: number;
    name: string;
  };
  deleted_by?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  employee?: {
    id: number;
    name: string;
  };
  leaveType?: {
    id: number;
    code: string;
    name: {
      en: string;
      ar?: string;
    };
    color?: string;
  };
  approvedBy?: {
    id: number;
    name: string;
  };
}

// Form data interfaces
export interface LeaveCreateFormData {
  employees: Array<{
    id: number;
    name: string;
  }>;
  leaveTypes: Array<{
    ltId: number;
    name: {
      en: string;
      ar?: string;
    };
    code: string;
  }>;
}

export interface LeaveEditFormData {
  editingLeave: Leave;
  employees: Array<{
    id: number;
    name: string;
  }>;
  leaveTypes: Array<{
    ltId: number;
    name: {
      en: string;
      ar?: string;
    };
    code: string;
  }>;
}

// Create and Update data interfaces
export interface LeaveCreateData {
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  total_days?: number;
  reason: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

export interface LeaveUpdateData {
  employee_id?: number;
  leave_type_id?: number;
  start_date?: string;
  end_date?: string;
  total_days?: number;
  reason?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: number;
  approved_at?: string;
}

// Zod schemas for validation
export const leaveCreateSchema = z.object({
  employee_id: z.number().min(1, "Employee is required"),
  leave_type_id: z.number().min(1, "Leave type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  total_days: z.number().min(0.5, "Total days must be at least 0.5").optional(),
  reason: z.string().min(1, "Reason is required").max(1000, "Reason must be at most 1000 characters"),
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).default('pending'),
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return endDate >= startDate;
}, {
  message: "End date must be after or equal to start date",
  path: ["end_date"],
});

export const leaveUpdateSchema = leaveCreateSchema.partial();

// Form field types
export type LeaveFormData = z.infer<typeof leaveCreateSchema>;
export type LeaveUpdateFormData = z.infer<typeof leaveUpdateSchema>;
