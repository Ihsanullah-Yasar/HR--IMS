import z from "zod";
import { DocumentType } from "@/lib/Types/employeeDocument";

export const employeeDocumentSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  type: z.nativeEnum(DocumentType, {
    errorMap: () => ({ message: "Please select a valid document type" }),
  }),
  path: z.string().min(1, "File path is required"),
  expiryDate: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
});

export const employeeDocumentUpdateSchema = employeeDocumentSchema.partial();

export type EmployeeDocumentFormData = z.infer<typeof employeeDocumentSchema>;
export type EmployeeDocumentUpdateFormData = z.infer<
  typeof employeeDocumentUpdateSchema
>;
