import { api } from "@/lib/Api";
import { ApiResponse } from "@/lib/Types/api";
import {
  EmployeeDocument,
  EmployeeDocumentCreateData,
  EmployeeDocumentUpdateData,
  EmployeeDocumentEditFormData,
} from "@/lib/Types/employeeDocument";
import { handleServiceError } from "@/lib/utils/errorHandler";

const EMPLOYEE_DOCUMENTS_ENDPOINT = "/employee-documents";

export const getEmployeeDocuments = async (
  queryString: string = ""
): Promise<ApiResponse<EmployeeDocument[]>> => {
  try {
    const response = await api.get<ApiResponse<EmployeeDocument[]>>(
      EMPLOYEE_DOCUMENTS_ENDPOINT,
      { queryString }
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load employee documents");
  }
};

export const getEmployeeDocumentById = async (
  id: number
): Promise<ApiResponse<EmployeeDocument>> => {
  try {
    const response = await api.get<ApiResponse<EmployeeDocument>>(
      `${EMPLOYEE_DOCUMENTS_ENDPOINT}/${id}`
    );
    if (!response.data) throw new Error("Employee document not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch employee document ${id}`);
  }
};

export const getEmployeeDocumentCreateData = async (): Promise<
  ApiResponse<{ employees: Array<{ id: number; name: string }> }>
> => {
  try {
    const response = await api.get<
      ApiResponse<{ employees: Array<{ id: number; name: string }> }>
    >(`${EMPLOYEE_DOCUMENTS_ENDPOINT}/create`);
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getEmployeeDocumentFormData = async (
  documentId: number
): Promise<ApiResponse<EmployeeDocumentEditFormData>> => {
  try {
    if (!Number.isFinite(documentId) || documentId <= 0) {
      throw new Error("Invalid document id");
    }
    const response = await api.get<ApiResponse<EmployeeDocumentEditFormData>>(
      `${EMPLOYEE_DOCUMENTS_ENDPOINT}/${documentId}/edit`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const createEmployeeDocument = async (
  documentData: EmployeeDocumentCreateData & { file?: File }
): Promise<ApiResponse<EmployeeDocument>> => {
  try {
    const formData = new FormData();
    formData.append("employee_id", documentData.employeeId.toString());
    formData.append("type", documentData.type);
    formData.append("expiry_date", documentData.expiryDate || "");

    if (documentData.metadata) {
      const metadata =
        typeof documentData.metadata === "string"
          ? documentData.metadata.trim()
            ? JSON.parse(documentData.metadata as string)
            : null
          : documentData.metadata;
      if (metadata) {
        formData.append("metadata", JSON.stringify(metadata));
      }
    }

    if (documentData.file) {
      formData.append("document", documentData.file);
    }

    const response = await api.post<ApiResponse<EmployeeDocument>>(
      EMPLOYEE_DOCUMENTS_ENDPOINT,
      formData
    );
    if (!response.data) throw new Error("Failed to create employee document");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create employee document");
  }
};

export const updateEmployeeDocument = async (
  id: number,
  documentData: EmployeeDocumentUpdateData
): Promise<ApiResponse<EmployeeDocument>> => {
  try {
    const payload: Record<string, any> = {};
    if (documentData.employeeId !== undefined)
      payload.employee_id = documentData.employeeId.toString();
    if (documentData.type !== undefined) payload.type = documentData.type;
    if (documentData.path !== undefined) payload.path = documentData.path;
    if (documentData.expiryDate !== undefined)
      payload.expiry_date = documentData.expiryDate;
    if (documentData.metadata !== undefined) {
      payload.metadata =
        typeof documentData.metadata === "string"
          ? (documentData.metadata as string).trim()
            ? JSON.parse(documentData.metadata as string)
            : null
          : documentData.metadata;
    }

    const response = await api.put<ApiResponse<EmployeeDocument>>(
      `${EMPLOYEE_DOCUMENTS_ENDPOINT}/${id}`,
      payload
    );
    if (!response.data) throw new Error("Failed to update employee document");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update employee document");
  }
};

export const deleteEmployeeDocument = async (
  id: number
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(
      `${EMPLOYEE_DOCUMENTS_ENDPOINT}/${id}`
    );
    if (!response) throw new Error("Failed to delete employee document");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete employee document");
  }
};
