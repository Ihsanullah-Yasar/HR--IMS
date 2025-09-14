import { api } from "@/lib/Api";
import { ApiResponse } from "@/lib/Types/api";
import {
  Leave,
  LeaveCreateData,
  LeaveUpdateData,
  LeaveEditFormData,
  LeaveCreateFormData,
} from "@/lib/Types/leave";
import { handleServiceError } from "@/lib/utils/errorHandler";

const LEAVES_ENDPOINT = "/leaves";

export const getLeaves = async (
  queryString: string = ""
): Promise<ApiResponse<Leave[]>> => {
  try {
    const response = await api.get<ApiResponse<Leave[]>>(LEAVES_ENDPOINT, {
      queryString,
    });
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load leave requests");
  }
};

export const getLeaveFormData = async (
  leaveId?: number
): Promise<ApiResponse<LeaveEditFormData>> => {
  try {
    if (!Number.isFinite(leaveId) || (leaveId as number) <= 0) {
      throw new Error("Invalid leave id");
    }
    const response = await api.get<ApiResponse<LeaveEditFormData>>(
      `${LEAVES_ENDPOINT}/${leaveId}/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getLeaveCreateFormData = async (): Promise<
  ApiResponse<LeaveCreateFormData>
> => {
  try {
    const response = await api.get<ApiResponse<LeaveCreateFormData>>(
      `${LEAVES_ENDPOINT}/create/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getLeaveById = async (id: number): Promise<ApiResponse<Leave>> => {
  try {
    const response = await api.get<ApiResponse<Leave>>(
      `${LEAVES_ENDPOINT}/${id}`
    );
    if (response.status === "error") throw new Error("Leave request not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch leave request ${id}`);
  }
};

export const createLeave = async (
  leaveData: LeaveCreateData
): Promise<ApiResponse<Leave>> => {
  try {
    const response = await api.post<ApiResponse<Leave>>(
      LEAVES_ENDPOINT,
      leaveData
    );
    if (!response.data) throw new Error("Failed to create leave request");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create leave request");
  }
};

export const updateLeave = async (
  id: number,
  leaveData: LeaveUpdateData
): Promise<ApiResponse<Leave>> => {
  try {
    const response = await api.put<ApiResponse<Leave>>(
      `${LEAVES_ENDPOINT}/${id}`,
      leaveData
    );
    if (!response.data) throw new Error("Failed to update leave request");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update leave request");
  }
};

export const deleteLeave = async (id: number): Promise<ApiResponse<null>> => {
  try {
    const response = api.delete<ApiResponse<null>>(`${LEAVES_ENDPOINT}/${id}`);
    if (!response) throw new Error("Failed to delete leave request");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete leave request");
  }
};

// Additional actions for leave management
export const approveLeave = async (
  id: number,
  approvedBy: number
): Promise<ApiResponse<Leave>> => {
  try {
    const response = await api.put<ApiResponse<Leave>>(
      `${LEAVES_ENDPOINT}/${id}`,
      {
        status: "approved",
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      }
    );
    if (!response.data) throw new Error("Failed to approve leave request");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to approve leave request");
  }
};

export const rejectLeave = async (
  id: number,
  approvedBy: number
): Promise<ApiResponse<Leave>> => {
  try {
    const response = await api.put<ApiResponse<Leave>>(
      `${LEAVES_ENDPOINT}/${id}`,
      {
        status: "rejected",
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      }
    );
    if (!response.data) throw new Error("Failed to reject leave request");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to reject leave request");
  }
};
