import { z } from "zod";

// Salary component schema
export const salaryComponentSchema = z.object({
  name: z.string().min(1, "Component name is required").max(100, "Component name too long"),
  amount: z.number().min(0, "Amount must be positive"),
  type: z.enum(["allowance", "deduction"], {
    required_error: "Component type is required",
  }),
});

// Salary create schema
export const salaryCreateSchema = z.object({
  employeeId: z.number().min(1, "Employee is required"),
  currencyCode: z.string().min(1, "Currency is required"),
  baseAmount: z.number().min(0, "Base amount must be positive"),
  components: z.array(salaryComponentSchema).optional().default([]),
  effectiveFrom: z.string().min(1, "Effective from date is required"),
  effectiveTo: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.effectiveTo && data.effectiveFrom) {
      return new Date(data.effectiveTo) > new Date(data.effectiveFrom);
    }
    return true;
  },
  {
    message: "Effective to date must be after effective from date",
    path: ["effectiveTo"],
  }
);

// Salary update schema
export const salaryUpdateSchema = z.object({
  employeeId: z.number().min(1, "Employee is required").optional(),
  currencyCode: z.string().min(1, "Currency is required").optional(),
  baseAmount: z.number().min(0, "Base amount must be positive").optional(),
  components: z.array(salaryComponentSchema).optional(),
  effectiveFrom: z.string().min(1, "Effective from date is required").optional(),
  effectiveTo: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.effectiveTo && data.effectiveFrom) {
      return new Date(data.effectiveTo) > new Date(data.effectiveFrom);
    }
    return true;
  },
  {
    message: "Effective to date must be after effective from date",
    path: ["effectiveTo"],
  }
);

// Form data schemas (for dropdowns)
export const salaryFormDataSchema = z.object({
  employees: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
  currencies: z.array(z.object({
    code: z.string(),
    name: z.string(),
    symbol: z.string(),
  })),
});

export const salaryEditFormDataSchema = z.object({
  editingSalary: z.object({
    id: z.number(),
    employeeId: z.number(),
    currencyCode: z.string(),
    baseAmount: z.number(),
    components: z.array(salaryComponentSchema),
    effectiveFrom: z.string(),
    effectiveTo: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    employee: z.object({
      id: z.number(),
      name: z.string(),
    }).optional(),
    currency: z.object({
      code: z.string(),
      name: z.string(),
      symbol: z.string(),
    }).optional(),
  }),
  employees: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
  currencies: z.array(z.object({
    code: z.string(),
    name: z.string(),
    symbol: z.string(),
  })),
});

// Salary calculation schema
export const salaryCalculationSchema = z.object({
  baseAmount: z.number(),
  totalAllowances: z.number(),
  totalDeductions: z.number(),
  grossSalary: z.number(),
  netSalary: z.number(),
  currency: z.string(),
});

// Salary history schema
export const salaryHistorySchema = z.object({
  id: z.number(),
  employeeId: z.number(),
  effectiveFrom: z.string(),
  effectiveTo: z.string().nullable(),
  baseAmount: z.number(),
  totalAmount: z.number(),
  currency: z.string(),
  isCurrent: z.boolean(),
});

// Export types
export type SalaryComponentFormData = z.infer<typeof salaryComponentSchema>;
export type SalaryCreateFormData = z.infer<typeof salaryCreateSchema>;
export type SalaryUpdateFormData = z.infer<typeof salaryUpdateSchema>;
export type SalaryFormData = z.infer<typeof salaryFormDataSchema>;
export type SalaryEditFormData = z.infer<typeof salaryEditFormDataSchema>;
export type SalaryCalculation = z.infer<typeof salaryCalculationSchema>;
export type SalaryHistory = z.infer<typeof salaryHistorySchema>;