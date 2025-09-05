import { api } from "@/lib/Api";
import { ApiResponse } from "@/lib/Types/api";
import {
  Employee,
  EmployeeCreateData,
  EmployeeUpdateData,
  EmployeeEditFormData,
} from "@/lib/Types/employee";
import { handleServiceError } from "@/lib/utils/errorHandler";

const EMPLOYEES_ENDPOINT = "/employees";

export const getEmployees = async (
  queryString: string = ""
): Promise<ApiResponse<Employee[]>> => {
  try {
    const response = await api.get<ApiResponse<Employee[]>>(
      EMPLOYEES_ENDPOINT,
      { queryString }
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load employees");
  }
};

export const getEmployeeById = async (
  id: number
): Promise<ApiResponse<Employee>> => {
  try {
    const response = await api.get<ApiResponse<Employee>>(
      `${EMPLOYEES_ENDPOINT}/${id}`
    );
    if (!response.data) throw new Error("Employee not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch employee ${id}`);
  }
};

export const getEmployeeFormData = async (
  employeeId: number
): Promise<ApiResponse<EmployeeEditFormData>> => {
  try {
    if (!Number.isFinite(employeeId) || employeeId <= 0) {
      throw new Error("Invalid employee id");
    }
    const response = await api.get<ApiResponse<EmployeeEditFormData>>(
      `${EMPLOYEES_ENDPOINT}/${employeeId}/edit`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const createEmployee = async (
  employeeData: EmployeeCreateData
): Promise<ApiResponse<Employee>> => {
  try {
    const payload: Record<string, any> = {
      name: employeeData.name,
      gender_type: employeeData.genderType?.toLowerCase?.() ?? null,
      marital_status: employeeData.maritalStatus?.toLowerCase?.() ?? null,
      date_of_birth: employeeData.dateOfBirth,
      date_of_joining: employeeData.dateOfJoining,
      date_of_leaving: employeeData.dateOfLeaving ?? null,
      timezone: employeeData.timezone,
      consent_given: employeeData.consentGiven,
      // Remove user_id from create - will be set by authenticated user
      department_id: parseInt(employeeData.department),
      designation_id: parseInt(employeeData.designation),
    };

    const response = await api.post<ApiResponse<Employee>>(
      EMPLOYEES_ENDPOINT,
      payload
    );
    if (!response.data) throw new Error("Failed to create employee");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create employee");
  }
};

export const updateEmployee = async (
  id: number,
  employeeData: EmployeeUpdateData
): Promise<ApiResponse<Employee>> => {
  try {
    const payload: Record<string, any> = {};
    if (employeeData.name !== undefined) payload.name = employeeData.name;
    if (employeeData.genderType !== undefined)
      payload.gender_type = employeeData.genderType?.toLowerCase?.() ?? null;
    if (employeeData.maritalStatus !== undefined)
      payload.marital_status =
        employeeData.maritalStatus?.toLowerCase?.() ?? null;
    if (employeeData.dateOfBirth !== undefined)
      payload.date_of_birth = employeeData.dateOfBirth;
    if (employeeData.dateOfJoining !== undefined)
      payload.date_of_joining = employeeData.dateOfJoining;
    if (employeeData.dateOfLeaving !== undefined)
      payload.date_of_leaving = employeeData.dateOfLeaving;
    if (employeeData.timezone !== undefined)
      payload.timezone = employeeData.timezone;
    if (employeeData.consentGiven !== undefined)
      payload.consent_given = employeeData.consentGiven;
    if (employeeData.user !== undefined)
      payload.user_id = employeeData.user ? parseInt(employeeData.user) : null;
    if (employeeData.department !== undefined)
      payload.department_id = parseInt(employeeData.department);
    if (employeeData.designation !== undefined)
      payload.designation_id = parseInt(employeeData.designation);

    const response = await api.put<ApiResponse<Employee>>(
      `${EMPLOYEES_ENDPOINT}/${id}`,
      payload
    );
    if (!response.data) throw new Error("Failed to update employee");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update employee");
  }
};

export const deleteEmployee = async (
  id: number
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(
      `${EMPLOYEES_ENDPOINT}/${id}`
    );
    if (!response) throw new Error("Failed to delete employee");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete employee");
  }
};
