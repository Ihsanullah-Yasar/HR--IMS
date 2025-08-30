import { Meta } from "./api";
import { Department } from "./department";

export type Designation = {
  id: number;
  code: string;
  title: Record<string, string> | string; // Multi-language title object or string
  baseSalary: number;
  isActive: boolean;
  departmentId: number;

  // Relations
  department?:
    | string
    | null
    | { id: number; name: string; code: string; [key: string]: any }; // Department name or full object
  departmentCode?: string | null; // Department code

  // Audit relations (optional)
  createdByUser?: string | null;
  updatedByUser?: string | null;
  deletedByUser?: string | null;

  // Timestamps
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt?: string | null;
};

export type designationCreateData = {
  code: string;
  title: string;
  baseSalary: number;
  isActive: boolean;
  department?: string | null;
};

export type designationUpdateData = Partial<
  Omit<
    Designation,
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "createdByUser"
    | "updatedByUser"
    | "deletedByUser"
    | "department"
    | "departmentCode"
  >
> & {
  department?: string | null;
};

export type DesignationEditFormData = {
  editingDesignation: Designation;
  departments: Pick<Department, "dId" | "code" | "name">[];
};
