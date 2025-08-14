export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

export type Links={
  url: string,
  label: string,
  active: boolean
} [];

export type Meta={
  current_page: number,
  from: number,
  last_page: number,
  links: Links,
  path: string,
  per_page: number,
  to: number,
  total: number
}

export interface ApiResponse<T> {
  status?: 'success' | 'error';
  data: T; 
  message?: string;
  links?: {},
  meta?: Meta;
};

