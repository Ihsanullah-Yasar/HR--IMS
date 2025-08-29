import { api } from "@/lib/Api";
import { ApiResponse } from "@/lib/Types/api";
import {
  Department,
  departmentCreateData,
  departmentUpdateData,
  DepartmentEditFormData,
} from "@/lib/Types/department";
import { User } from "@/lib/Types/user";
import { handleServiceError } from "@/lib/utils/errorHandler";

const DEPARTMENTS_ENDPOINT = "/departments";

export const getDepartments = async (
  queryString: string = ""
): Promise<ApiResponse<Department[]>> => {
  try {
    const response = await api.get<ApiResponse<Department[]>>(
      DEPARTMENTS_ENDPOINT,
      {
        queryString,
      }
    );
    if (!response.data) throw new Error("No data recieved");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load departments");
  }
};

export const getDepartmentFormData = async (
  departmentId?: number
): Promise<ApiResponse<DepartmentEditFormData>> => {
  try {
    if (!Number.isFinite(departmentId) || (departmentId as number) <= 0) {
      throw new Error("Invalid department id");
    }
    const response = await api.get<ApiResponse<DepartmentEditFormData>>(
      `${DEPARTMENTS_ENDPOINT}/${departmentId}/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getDepartmentById = async (
  id: number
): Promise<ApiResponse<Department>> => {
  try {
    const response = await api.get<ApiResponse<Department>>(
      `${DEPARTMENTS_ENDPOINT}/${id}`
    );
    if (response.status === "error") throw new Error("Department not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch department ${id}`);
  }
};

export const createDepartment = async (
  departmentData: departmentCreateData
): Promise<ApiResponse<Department>> => {
  try {
    // Transform frontend field names to backend field names
    const parentDeptValue = parseInt(departmentData.parentDepartment ?? "");
    const managerValue = parseInt(departmentData.manager ?? "");

    const transformedData: Record<string, any> = {
      code: departmentData.code,
      name: departmentData.name,
      timezone: departmentData.timezone,
      parent_department_id: !isNaN(parentDeptValue) ? parentDeptValue : null,
      manager_employee_id: !isNaN(managerValue) ? managerValue : null,
    };

    const response = await api.post<ApiResponse<Department>>(
      DEPARTMENTS_ENDPOINT,
      transformedData
    );
    if (!response.data) throw new Error("Failed to create department");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create department");
  }
};

export const updateDepartment = async (
  id: number,
  departmentData: departmentUpdateData
): Promise<ApiResponse<Department>> => {
  try {
    // Transform frontend field names to backend field names
    const transformedData: any = {};

    if (departmentData.code !== undefined)
      transformedData.code = departmentData.code;
    if (departmentData.name !== undefined)
      transformedData.name = departmentData.name;
    if (departmentData.timezone !== undefined)
      transformedData.timezone = departmentData.timezone;
    // ✅ Add only if it's a valid number
    const deptValue = parseInt(departmentData.parentDepartment ?? "");
    if (!isNaN(deptValue)) {
      transformedData.parent_department_id = deptValue;
    }

    const managerValue = parseInt(departmentData.manager ?? "");
    if (!isNaN(managerValue)) {
      transformedData.manager_employee_id = managerValue;
    }
    console.log("Transformed data : ", transformedData);
    const response = await api.put<ApiResponse<Department>>(
      `${DEPARTMENTS_ENDPOINT}/${id}`,
      transformedData
    );
    if (!response.data) throw new Error("Failed to update department");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update department");
  }
};

export const deleteDepartemnt = async (
  id: number
): Promise<ApiResponse<null>> => {
  try {
    const response = api.delete<ApiResponse<null>>(
      `${DEPARTMENTS_ENDPOINT}/${id}`
    );
    if (!response) throw new Error("Failded to delete department");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete department");
  }
};
