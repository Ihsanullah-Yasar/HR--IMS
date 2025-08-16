import { ApiError } from '../Types/api';

const DEFAULT_TIMEOUT = 30000; // 30 seconds

// const createQueryString = (queryString: string): string => {
//   const searchParams = new URLSearchParams();
  
  
// };

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: data.message || 'An error occurred',
      errors: data.errors,
    };
    throw error;
  }

  return data;
};


const createFetchApi = (config: any) => {
  const { baseUrl, defaultHeaders = {}, timeout = DEFAULT_TIMEOUT } = config;

  return async <T>(endpoint: string, options: any): Promise<T> => {
    const { queryString, body, ...restOptions } = options;
    const url = `${baseUrl}${endpoint}?${queryString ? queryString : ''}`;
    console.log(url)
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...defaultHeaders,
      ...options.headers,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      return await handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw {
            status: 408,
            message: 'Request timeout',
          } as ApiError;
        }
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };
};

export const createApiClient = (config: any) => {
  const fetchApi = createFetchApi(config);

  return {
    get: <T>(endpoint: string, options: Omit<any, 'method'> = {}) =>
      fetchApi<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, data?: any, options: Omit<any, 'method' | 'body'> = {}) =>
      fetchApi<T>(endpoint, { ...options, method: 'POST', body: data }),

    put: <T>(endpoint: string, data?: any, options: Omit<any, 'method' | 'body'> = {}) =>
      fetchApi<T>(endpoint, { ...options, method: 'PUT', body: data }),

    patch: <T>(endpoint: string, data?: any, options: Omit<any, 'method' | 'body'> = {}) =>
      fetchApi<T>(endpoint, { ...options, method: 'PATCH', body: data }),

    delete: <T>(endpoint: string, options: Omit<any, 'method'> = {}) =>
      fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
  };
}; 