import { z } from "zod";

// Leave Type Create Schema
export const leaveTypeCreateSchema = z.object({
  code: z.string().min(1, "Code is required").max(10, "Code must be at most 10 characters"),
  name: z.object({
    en: z.string().min(1, "English name is required").max(100, "English name must be at most 100 characters"),
    ar: z.string().max(100, "Arabic name must be at most 100 characters").optional(),
  }),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  days_per_year: z.number().min(0, "Days per year must be at least 0").max(365, "Days per year must be at most 365"),
  is_paid: z.boolean(),
  is_active: z.boolean(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color").optional(),
});

// Leave Type Update Schema
export const leaveTypeUpdateSchema = leaveTypeCreateSchema.partial();

// Form field types
export type LeaveTypeFormData = z.infer<typeof leaveTypeCreateSchema>;
export type LeaveTypeUpdateFormData = z.infer<typeof leaveTypeUpdateSchema>;
