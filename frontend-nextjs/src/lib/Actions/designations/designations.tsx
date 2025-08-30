import { api } from "@/lib/Api";
import { ApiResponse } from "@/lib/Types/api";
import {
  Designation,
  designationCreateData,
  designationUpdateData,
  DesignationEditFormData,
} from "@/lib/Types/designation";
import { handleServiceError } from "@/lib/utils/errorHandler";

const DESIGNATIONS_ENDPOINT = "/designations";

export const getDesignations = async (
  queryString: string = ""
): Promise<ApiResponse<Designation[]>> => {
  try {
    const response = await api.get<ApiResponse<Designation[]>>(
      DESIGNATIONS_ENDPOINT,
      {
        queryString,
      }
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load designations");
  }
};

export const getDesignationFormData = async (
  designationId?: number
): Promise<ApiResponse<DesignationEditFormData>> => {
  try {
    if (!Number.isFinite(designationId) || (designationId as number) <= 0) {
      throw new Error("Invalid designation id");
    }
    const response = await api.get<ApiResponse<DesignationEditFormData>>(
      `${DESIGNATIONS_ENDPOINT}/${designationId}/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getDesignationById = async (
  id: number
): Promise<ApiResponse<Designation>> => {
  try {
    const response = await api.get<ApiResponse<Designation>>(
      `${DESIGNATIONS_ENDPOINT}/${id}`
    );
    if (response.status === "error") throw new Error("Designation not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch designation ${id}`);
  }
};

export const createDesignation = async (
  designationData: designationCreateData
): Promise<ApiResponse<Designation>> => {
  try {
    // Transform frontend field names to backend field names
    const departmentValue = parseInt(designationData.department ?? "");

    const transformedData: Record<string, any> = {
      code: designationData.code,
      title: designationData.title,
      base_salary: designationData.baseSalary,
      is_active: designationData.isActive,
      department_id: !isNaN(departmentValue) ? departmentValue : null,
    };

    const response = await api.post<ApiResponse<Designation>>(
      DESIGNATIONS_ENDPOINT,
      transformedData
    );
    if (!response.data) throw new Error("Failed to create designation");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create designation");
  }
};

export const updateDesignation = async (
  id: number,
  designationData: designationUpdateData
): Promise<ApiResponse<Designation>> => {
  try {
    // Transform frontend field names to backend field names
    const transformedData: any = {};

    if (designationData.code !== undefined)
      transformedData.code = designationData.code;
    if (designationData.title !== undefined)
      transformedData.title = designationData.title;
    if (designationData.baseSalary !== undefined)
      transformedData.base_salary = designationData.baseSalary;
    if (designationData.isActive !== undefined)
      transformedData.is_active = designationData.isActive;

    // Add only if it's a valid number
    const deptValue = parseInt(designationData.department ?? "");
    if (!isNaN(deptValue)) {
      transformedData.department_id = deptValue;
    }

    const response = await api.put<ApiResponse<Designation>>(
      `${DESIGNATIONS_ENDPOINT}/${id}`,
      transformedData
    );
    if (!response.data) throw new Error("Failed to update designation");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update designation");
  }
};

export const deleteDesignation = async (
  id: number
): Promise<ApiResponse<null>> => {
  try {
    const response = api.delete<ApiResponse<null>>(
      `${DESIGNATIONS_ENDPOINT}/${id}`
    );
    if (!response) throw new Error("Failed to delete designation");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete designation");
  }
};
