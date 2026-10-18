import type { UserResponse } from "@/features/auth/types/auth";

export type UserStatus = "ACTIVE" | "PENDING" | "INACTIVE" | "BANNED";
export type AdminUserDetail = UserResponse & { updatedAt: string };
export type AdminRole = {
  key: string;
  name: string;
  description: string;
  active: boolean;
};
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; status: number };
export type UserRolesResult = {
  id: string;
  roles: string[];
  updatedAt: string;
};
export type UserStatusResult = {
  id: string;
  status: UserStatus;
  updatedAt: string;
};
