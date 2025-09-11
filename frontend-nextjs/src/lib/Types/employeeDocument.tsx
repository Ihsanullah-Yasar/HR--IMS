export enum DocumentType {
  CONTRACT = "contract",
  ID_PROOF = "id_proof",
  PASSPORT = "passport",
  DRIVING_LICENSE = "driving_license",
  DEGREE_CERTIFICATE = "degree_certificate",
  EXPERIENCE_CERTIFICATE = "experience_certificate",
  OTHER = "other",
}

export interface EmployeeDocument {
  id: number;
  employeeId: number;
  type: DocumentType;
  path: string;
  expiryDate?: string | null;
  metadata?: Record<string, any> | null;

  // Relations
  employee?: {
    id: number;
    name: string;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export type EmployeeDocumentCreateData = {
  employeeId: string; // select value (id as string)
  type: DocumentType;
  path: string;
  expiryDate?: string | null;
  metadata?: string | null;
};

export type EmployeeDocumentUpdateData = Partial<EmployeeDocumentCreateData>;

export type EmployeeDocumentEditFormData = {
  editingDocument: EmployeeDocument;
  employees: Array<{ id: number; name: string }>;
};
