import { api } from "@/lib/Api/index";
import {
  User,
  UserCreateData,
  UserUpdateData,
  UsersResponse,
} from "@/lib/Types/user";
import { ApiError, ApiResponse } from "@/lib/Types/api";
import { handleServiceError } from "@/lib/utils/errorHandler";

const USERS_ENDPOINT = "/users";

export const getUsers = async (
  queryString: string = ""
): Promise<ApiResponse<User[]>> => {
  try {
    // console.log(queryString);
    const response = await api.get<ApiResponse<User[]>>(USERS_ENDPOINT, {
      queryString,
    });

    if (!response.data) throw new Error("No data received");
    console.log("API Response:", response); // Add this for debugging

    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load users");
  }
};

export const getUserById = async (id: number): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get<ApiResponse<User>>(
      `${USERS_ENDPOINT}/${id}`
    );
    if (response.status === "error") throw new Error("User not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch user ${id}:`);
  }
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  try {
    const response = await api.post<User>(USERS_ENDPOINT, userData);
    if (!response) throw new Error("Failed to create user");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create user.");
  }
};

export const updateUser = async (
  id: string,
  userData: UserUpdateData
): Promise<User> => {
  try {
    const response = await api.put<User>(`${USERS_ENDPOINT}/${id}`, userData);
    if (!response) throw new Error("Failed to update user");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to update user ${id}:`);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`${USERS_ENDPOINT}/${id}`);
  } catch (error) {
    const apiError = error as ApiError;
    throw handleServiceError(error, `Failed to delete user ${id}:`);
  }
};
