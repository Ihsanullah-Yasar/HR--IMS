import { api } from "@/lib/Api";
import { ApiResponse } from "@/lib/Types/api";
import {
  Salary,
  salaryCreateData,
  salaryUpdateData,
  SalaryEditFormData,
  SalaryFormData,
} from "@/lib/Types/salary";
import { handleServiceError } from "@/lib/utils/errorHandler";

const SALARIES_ENDPOINT = "/salaries";

export const getSalaries = async (
  queryString: string = ""
): Promise<ApiResponse<Salary[]>> => {
  try {
    const response = await api.get<ApiResponse<Salary[]>>(SALARIES_ENDPOINT, {
      queryString,
    });
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load salaries");
  }
};

export const getSalaryFormData = async (): Promise<
  ApiResponse<SalaryFormData>
> => {
  try {
    const response = await api.get<ApiResponse<SalaryFormData>>(
      `${SALARIES_ENDPOINT}/create/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getSalaryEditFormData = async (
  salaryId: number
): Promise<ApiResponse<SalaryEditFormData>> => {
  try {
    if (!Number.isFinite(salaryId) || salaryId <= 0) {
      throw new Error("Invalid salary id");
    }
    const response = await api.get<ApiResponse<SalaryEditFormData>>(
      `${SALARIES_ENDPOINT}/${salaryId}/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getSalaryById = async (
  id: number
): Promise<ApiResponse<Salary>> => {
  try {
    const response = await api.get<ApiResponse<Salary>>(
      `${SALARIES_ENDPOINT}/${id}`
    );
    if (response.status === "error") throw new Error("Salary not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch salary ${id}`);
  }
};

export const createSalary = async (
  salaryData: salaryCreateData
): Promise<ApiResponse<Salary>> => {
  try {
    // Transform frontend field names to backend field names
    const transformedData: Record<string, any> = {
      employee_id: salaryData.employeeId,
      currency_code: salaryData.currencyCode,
      base_amount: salaryData.baseAmount,
      components: salaryData.components || [],
      effective_from: salaryData.effectiveFrom,
      effective_to: salaryData.effectiveTo || null,
    };

    const response = await api.post<ApiResponse<Salary>>(
      SALARIES_ENDPOINT,
      transformedData
    );
    if (!response.data) throw new Error("Failed to create salary");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create salary");
  }
};

export const updateSalary = async (
  id: number,
  salaryData: salaryUpdateData
): Promise<ApiResponse<Salary>> => {
  try {
    // Transform frontend field names to backend field names
    const transformedData: any = {};

    if (salaryData.employeeId !== undefined)
      transformedData.employee_id = salaryData.employeeId;
    if (salaryData.currencyCode !== undefined)
      transformedData.currency_code = salaryData.currencyCode;
    if (salaryData.baseAmount !== undefined)
      transformedData.base_amount = salaryData.baseAmount;
    if (salaryData.components !== undefined)
      transformedData.components = salaryData.components;
    if (salaryData.effectiveFrom !== undefined)
      transformedData.effective_from = salaryData.effectiveFrom;
    if (salaryData.effectiveTo !== undefined)
      transformedData.effective_to = salaryData.effectiveTo;

    console.log("Transformed salary data:", transformedData);

    const response = await api.put<ApiResponse<Salary>>(
      `${SALARIES_ENDPOINT}/${id}`,
      transformedData
    );
    if (!response.data) throw new Error("Failed to update salary");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update salary");
  }
};

export const deleteSalary = async (id: number): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(
      `${SALARIES_ENDPOINT}/${id}`
    );
    if (!response) throw new Error("Failed to delete salary");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete salary");
  }
};

// Additional utility functions for salary management

export const getEmployeeSalaries = async (
  employeeId: number
): Promise<ApiResponse<Salary[]>> => {
  try {
    const response = await api.get<ApiResponse<Salary[]>>(SALARIES_ENDPOINT, {
      queryString: `filter[employee_id]=${employeeId}`,
    });
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load employee salaries");
  }
};

export const getCurrentSalary = async (
  employeeId: number
): Promise<ApiResponse<Salary | null>> => {
  try {
    const response = await api.get<ApiResponse<Salary[]>>(SALARIES_ENDPOINT, {
      queryString: `filter[employee_id]=${employeeId}&filter[effective_to]=null`,
    });

    if (!response.data || response.data.length === 0) {
      return { ...response, data: null };
    }

    // Return the most recent salary
    const currentSalary = response.data.sort(
      (a, b) =>
        new Date(b.effectiveFrom).getTime() -
        new Date(a.effectiveFrom).getTime()
    )[0];

    return { ...response, data: currentSalary };
  } catch (error) {
    throw handleServiceError(error, "Unable to load current salary");
  }
};

export const calculateSalary = (
  salary: Salary
): {
  totalAllowances: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
} => {
  const totalAllowances = salary.components
    .filter((component) => component.type === "allowance")
    .reduce((sum, component) => sum + component.amount, 0);

  const totalDeductions = salary.components
    .filter((component) => component.type === "deduction")
    .reduce((sum, component) => sum + component.amount, 0);

  const grossSalary = salary.baseAmount + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  return {
    totalAllowances,
    totalDeductions,
    grossSalary,
    netSalary,
  };
};
