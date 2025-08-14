import { Meta } from "./api";

export type User = {
  id: string;
  name: string;
  email: string;
  // image?:  string | null
  timezone?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type UserCreateData = Omit<User, 'id' | 'email_verified_at' | 'created_at' | 'updated_at'> & {
  password: string;
};

export type UserUpdateData = Partial<Omit<User,  'email_verified_at' | 'created_at' | 'updated_at'>> & {
  password?: string;
  confirm_password?: string;
};



export type UsersResponse = {
  data: User[];
  links?:{},
  meta: Meta
};

