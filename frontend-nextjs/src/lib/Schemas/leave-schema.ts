import { z } from "zod";

// Leave Create Schema
export const leaveCreateSchema = z.object({
  employee_id: z.number().min(1, "Employee is required"),
  leave_type_id: z.number().min(1, "Leave type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  total_days: z.number().min(0.5, "Total days must be at least 0.5").optional(),
  reason: z.string().min(1, "Reason is required").max(1000, "Reason must be at most 1000 characters"),
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']),
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return endDate >= startDate;
}, {
  message: "End date must be after or equal to start date",
  path: ["end_date"],
});

// Leave Update Schema
export const leaveUpdateSchema = leaveCreateSchema.partial();

// Form field types
export type LeaveFormData = z.infer<typeof leaveCreateSchema>;
export type LeaveUpdateFormData = z.infer<typeof leaveUpdateSchema>;
