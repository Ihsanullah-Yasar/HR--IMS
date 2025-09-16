import { Meta } from "./api";
import { Employee } from "./employee";
import { Currency } from "./currency";

export type SalaryComponent = {
  name: string;
  amount: number;
  type: 'allowance' | 'deduction';
};

export type Salary = {
  id: number;
  employeeId: number;
  currencyCode: string;
  baseAmount: number;
  components: SalaryComponent[];
  effectiveFrom: string; // ISO date string
  effectiveTo?: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // Relations
  employee?: Employee;
  currency?: Currency;
};

export type salaryCreateData = Omit<
  Salary,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "employee"
  | "currency"
> & {
  employee?: string | null;
  currency?: string | null;
};

export type salaryUpdateData = Partial<
  Omit<
    Salary,
    | "createdAt"
    | "updatedAt"
    | "employee"
    | "currency"
  >
> & {
  employee?: string | null;
  currency?: string | null;
};

export type SalaryEditFormData = {
  editingSalary: Salary;
  employees: Pick<Employee, "id" | "name">[];
  currencies: Pick<Currency, "code" | "name" | "symbol">[];
};

export type SalaryFormData = {
  employees: Pick<Employee, "id" | "name">[];
  currencies: Pick<Currency, "code" | "name" | "symbol">[];
};

// Salary calculation types
export type SalaryCalculation = {
  baseAmount: number;
  totalAllowances: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  currency: string;
};

// Salary history types
export type SalaryHistory = {
  id: number;
  employeeId: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  baseAmount: number;
  totalAmount: number;
  currency: string;
  isCurrent: boolean;
};
