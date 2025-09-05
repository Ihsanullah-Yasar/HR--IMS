import z from "zod";
import { GenderType, MaritalStatusType } from "@/lib/Types/employee";

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  genderType: z.nativeEnum(GenderType).optional().nullable(),
  maritalStatus: z.nativeEnum(MaritalStatusType).optional().nullable(),
  dateOfBirth: z.string().min(10, "Date of birth is required"),
  dateOfJoining: z.string().min(10, "Date of joining is required"),
  dateOfLeaving: z.string().optional().nullable(),
  timezone: z.string().min(1, "Timezone is required"),
  consentGiven: z.boolean().default(false),
  user: z.string().optional().nullable(),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
});

export const employeeUpdateSchema = employeeSchema.partial();

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type EmployeeUpdateFormData = z.infer<typeof employeeUpdateSchema>;
