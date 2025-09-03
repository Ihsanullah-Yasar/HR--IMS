import z from "zod";

export const designationSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code must not exceed 20 characters")
    .regex(
      /^[A-Z0-9-]+$/,
      "Code must contain only uppercase letters, numbers, and hyphens"
    ),
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title must not exceed 255 characters"), // Keep as string
  baseSalary: z
    .number()
    .min(0, "Base salary must be a positive number")
    .max(999999999.99, "Base salary must not exceed 999,999,999.99"),
  isActive: z.boolean(),
  department: z.string().min(1, "Department is required"),
});

export const designationUpdateSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code must not exceed 20 characters")
    .regex(
      /^[A-Z0-9-]+$/,
      "Code must contain only uppercase letters, numbers, and hyphens"
    )
    .optional(),
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title must not exceed 255 characters")
    .optional(),
  baseSalary: z
    .number()
    .min(0, "Base salary must be a positive number")
    .max(999999999.99, "Base salary must not exceed 999,999,999.99")
    .optional(),
  isActive: z.boolean().optional(),
  department: z.string().min(1, "Department is required").optional(),
});

export type DesignationFormData = z.infer<typeof designationSchema>;
export type DesignationUpdateFormData = z.infer<typeof designationUpdateSchema>;
