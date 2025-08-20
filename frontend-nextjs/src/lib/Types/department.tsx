import { Meta } from "./api";

export type Department = {
  dId: number;
  code: string;
  name: string;
  timezone: string;

  // Relations
  parentDepartment?: string | null;

  manager?: string | null;

  // Audit relations (optional)
  createdByUser?: string | null;
  updatedByUser?: string | null;
  deletedByUser?: string | null;

  // Timestamps
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt?: string | null;
};

export type departmentCreateData = Omit<
  Department,
  | "dId"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "createdByUser"
  | "updatedByUser"
  | "deletedByUser"
  | "parentDepartment"
  | "manager"
> & {
  parentDepartment?: string | null;
  manager?: string | null;
};

export type departmentUpdateData = Partial<
  Omit<
    Department,
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "createdByUser"
    | "updatedByUser"
    | "deletedByUser"
    | "parentDepartment"
    | "manager"
  >
> & {
  parentDepartment?: string | null;
  manager?: string | null;
};
