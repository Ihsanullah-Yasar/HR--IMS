import { createApiClient } from './fetchApi';

const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  defaultHeaders: {
    'Accept': 'application/json',
  },
  timeout: 30000,
};

export const api = createApiClient(apiConfig);

// Example usage:
/*
// GET request
const getUsers = async () => {
  try {
    const response = await api.get<User[]>('/users', {
      params: { page: 1, per_page: 10 }
    });
    return response.data;
  } catch (error) {
    // Handle error
    throw error;
  }
};

// POST request
const createUser = async (userData: UserCreateData) => {
  try {
    const response = await api.post<User>('/users', userData);
    return response.data;
  } catch (error) {
    // Handle error
    throw error;
  }
};

// PUT request
const updateUser = async (id: number, userData: UserUpdateData) => {
  try {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    // Handle error
    throw error;
  }
};

// DELETE request
const deleteUser = async (id: number) => {
  try {
    const response = await api.delete<void>(`/users/${id}`);
    return response;
  } catch (error) {
    // Handle error
    throw error;
  }
};
*/ 