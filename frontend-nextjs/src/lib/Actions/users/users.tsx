import { api } from "@/lib/Api/index";
import {
  User,
  UserCreateData,
  UserUpdateData,
  UsersResponse,
} from "@/lib/Types/user";
import { ApiError, ApiResponse } from "@/lib/Types/api";

const USERS_ENDPOINT = "/users";

export const getUsers = async (
  queryString: string = ""
): Promise<ApiResponse<User[]>> => {
  try {
    console.log(queryString);
    const response = await api.get<ApiResponse<User[]>>(USERS_ENDPOINT, {
      queryString,
    });

    if (!response.data) throw new Error("No data received");
    console.log("API Response:", response); // Add this for debugging

    return response;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("Failed to fetch users:", apiError.message);
    throw apiError;
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
    const apiError = error as ApiError;
    console.error(`Failed to fetch user ${id}:`, apiError.message);
    throw apiError;
  }
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  try {
    const response = await api.post<User>(USERS_ENDPOINT, userData);
    if (!response) throw new Error("Failed to create user");
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    console.error("Failed to create user:", apiError.message);
    throw apiError;
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
    const apiError = error as ApiError;
    console.log(`Failed to update user ${id}:`, apiError.message);
    throw apiError;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`${USERS_ENDPOINT}/${id}`);
  } catch (error) {
    const apiError = error as ApiError;
    console.error(`Failed to delete user ${id}:`, apiError.message);
    throw apiError;
  }
};

// Example usage with TanStack Query:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useUsers = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['users', page, perPage],
    queryFn: () => getUsers(page, perPage)
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id)
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateData }) => 
      updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};
*/
