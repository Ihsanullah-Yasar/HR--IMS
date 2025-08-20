import z from "zod";

export const departmentSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code must not exceed 20 characters")
    .regex(
      /^[A-Z0-9-]+$/,
      "Code must contain only uppercase letters, numbers, and hyphens"
    ),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),
  timezone: z.string().min(1, "Timezone is required"),
  parentDepartment: z.string().nullable().optional(),
  manager: z.string().nullable().optional(),
});

export const departmentUpdateSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code must not exceed 20 characters")
    .regex(
      /^[A-Z0-9-]+$/,
      "Code must contain only uppercase letters, numbers, and hyphens"
    )
    .optional(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters")
    .optional(),
  timezone: z.string().min(1, "Timezone is required").optional(),
  parentDepartment: z.string().nullable().optional(),
  manager: z.string().nullable().optional(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
export type DepartmentUpdateFormData = z.infer<typeof departmentUpdateSchema>;
