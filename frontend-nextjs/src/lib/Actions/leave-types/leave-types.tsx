import { api } from "@/lib/Api";
import { ApiResponse } from "@/lib/Types/api";
import {
  LeaveType,
  LeaveTypeCreateData,
  LeaveTypeUpdateData,
  LeaveTypeEditFormData,
  LeaveTypeCreateFormData,
} from "@/lib/Types/leave-type";
import { handleServiceError } from "@/lib/utils/errorHandler";

const LEAVE_TYPES_ENDPOINT = "/leave-types";

export const getLeaveTypes = async (
  queryString: string = ""
): Promise<ApiResponse<LeaveType[]>> => {
  try {
    const response = await api.get<ApiResponse<LeaveType[]>>(
      LEAVE_TYPES_ENDPOINT,
      {
        queryString,
      }
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load leave types");
  }
};

export const getLeaveTypeFormData = async (
  leaveTypeId?: number
): Promise<ApiResponse<LeaveTypeEditFormData>> => {
  try {
    if (!Number.isFinite(leaveTypeId) || (leaveTypeId as number) <= 0) {
      throw new Error("Invalid leave type id");
    }
    const response = await api.get<ApiResponse<LeaveTypeEditFormData>>(
      `${LEAVE_TYPES_ENDPOINT}/${leaveTypeId}/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getLeaveTypeCreateFormData = async (): Promise<
  ApiResponse<LeaveTypeCreateFormData>
> => {
  try {
    const response = await api.get<ApiResponse<LeaveTypeCreateFormData>>(
      `${LEAVE_TYPES_ENDPOINT}/create/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getLeaveTypeById = async (
  id: number
): Promise<ApiResponse<LeaveType>> => {
  try {
    const response = await api.get<ApiResponse<LeaveType>>(
      `${LEAVE_TYPES_ENDPOINT}/${id}`
    );
    if (response.status === "error") throw new Error("Leave type not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch leave type ${id}`);
  }
};

export const createLeaveType = async (
  leaveTypeData: LeaveTypeCreateData
): Promise<ApiResponse<LeaveType>> => {
  try {
    const response = await api.post<ApiResponse<LeaveType>>(
      LEAVE_TYPES_ENDPOINT,
      leaveTypeData
    );
    if (!response.data) throw new Error("Failed to create leave type");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create leave type");
  }
};

export const updateLeaveType = async (
  id: number,
  leaveTypeData: LeaveTypeUpdateData
): Promise<ApiResponse<LeaveType>> => {
  try {
    const response = await api.put<ApiResponse<LeaveType>>(
      `${LEAVE_TYPES_ENDPOINT}/${id}`,
      leaveTypeData
    );
    if (!response.data) throw new Error("Failed to update leave type");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update leave type");
  }
};

export const deleteLeaveType = async (
  id: number
): Promise<ApiResponse<null>> => {
  try {
    const response = api.delete<ApiResponse<null>>(
      `${LEAVE_TYPES_ENDPOINT}/${id}`
    );
    if (!response) throw new Error("Failed to delete leave type");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete leave type");
  }
};
