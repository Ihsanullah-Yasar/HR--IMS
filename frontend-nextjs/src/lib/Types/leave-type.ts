import { z } from "zod";

// Base LeaveType interface
export interface LeaveType {
  id: number;
  code: string;
  name: {
    en: string;
    ar?: string;
  };
  description?: string;
  days_per_year: number;
  is_paid: boolean;
  is_active: boolean;
  color?: string;
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
}

// Form data interfaces
export interface LeaveTypeCreateFormData {
  leaveTypes: Array<{
    ltId: number;
    name: {
      en: string;
      ar?: string;
  };
    code: string;
  }>;
}

export interface LeaveTypeEditFormData {
  editingLeaveType: LeaveType;
}

// Create and Update data interfaces
export interface LeaveTypeCreateData {
  code: string;
  name: {
    en: string;
    ar?: string;
  };
  description?: string;
  days_per_year: number;
  is_paid: boolean;
  is_active: boolean;
  color?: string;
}

export interface LeaveTypeUpdateData {
  code?: string;
  name?: {
    en: string;
    ar?: string;
  };
  description?: string;
  days_per_year?: number;
  is_paid?: boolean;
  is_active?: boolean;
  color?: string;
}

// Zod schemas for validation
export const leaveTypeCreateSchema = z.object({
  code: z.string().min(1, "Code is required").max(10, "Code must be at most 10 characters"),
  name: z.object({
    en: z.string().min(1, "English name is required").max(100, "English name must be at most 100 characters"),
    ar: z.string().max(100, "Arabic name must be at most 100 characters").optional(),
  }),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  days_per_year: z.number().min(0, "Days per year must be at least 0").max(365, "Days per year must be at most 365"),
  is_paid: z.boolean().default(true),
  is_active: z.boolean().default(true),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color").optional(),
});

export const leaveTypeUpdateSchema = leaveTypeCreateSchema.partial();

// Form field types
export type LeaveTypeFormData = z.infer<typeof leaveTypeCreateSchema>;
export type LeaveTypeUpdateFormData = z.infer<typeof leaveTypeUpdateSchema>;
