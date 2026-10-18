export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
  timestamp: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  status: string;
  roles: string[];
  createdAt: string;
};

export type AuthenticationResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
  refreshToken: string;
};

export type LoginResult = {
  user: UserResponse;
};
