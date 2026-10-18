"use server";

import { ApiError } from "@/lib/api/api-error";
import { adminRequest } from "./admin-request";
import type {
  ActionResult,
  AdminRole,
  AdminUserDetail,
  UserRolesResult,
  UserStatusResult,
} from "../types/admin-users";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function requireUserId(userId: unknown): asserts userId is string {
  if (typeof userId !== "string" || !UUID_PATTERN.test(userId)) {
    throw new ApiError("Mã người dùng không hợp lệ.", 400);
  }
}

function actionError(error: unknown): ActionResult<never> {
  if (error instanceof ApiError) {
    return { success: false, message: error.message, status: error.status };
  }
  return {
    success: false,
    message: "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
    status: 500,
  };
}

export async function loadUserManagement(
  userId: string,
): Promise<ActionResult<{ user: AdminUserDetail; roles: AdminRole[] }>> {
  try {
    requireUserId(userId);
    const user = await adminRequest<AdminUserDetail>(
      "/api/v1/admin/users/" + userId,
    );
    const roles = await adminRequest<AdminRole[]>(
      "/api/v1/admin/roles?activeOnly=true",
    );
    return { success: true, data: { user, roles } };
  } catch (error) {
    return actionError(error);
  }
}

export async function replaceUserRoles(
  userId: string,
  roleKeys: string[],
): Promise<ActionResult<UserRolesResult>> {
  try {
    requireUserId(userId);
    if (
      !Array.isArray(roleKeys) ||
      roleKeys.length < 1 ||
      roleKeys.length > 20 ||
      roleKeys.some(
        (key) => typeof key !== "string" || !/^[A-Z][A-Z0-9_]{0,49}$/.test(key),
      ) ||
      new Set(roleKeys).size !== roleKeys.length
    ) {
      throw new ApiError(
        "Chọn ít nhất một vai trò hợp lệ, không trùng lặp.",
        400,
      );
    }
    const data = await adminRequest<UserRolesResult>(
      "/api/v1/admin/users/" + userId + "/roles",
      { method: "PUT", body: JSON.stringify({ roleKeys }) },
    );
    return { success: true, data };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateUserStatus(
  userId: string,
  status: string,
  reason: string,
): Promise<ActionResult<UserStatusResult>> {
  try {
    requireUserId(userId);
    if (
      !["ACTIVE", "PENDING", "INACTIVE", "BANNED"].includes(status) ||
      typeof reason !== "string" ||
      reason.trim().length < 5 ||
      reason.trim().length > 255
    ) {
      throw new ApiError(
        "Trạng thái không hợp lệ hoặc lý do phải dài từ 5–255 ký tự.",
        400,
      );
    }
    const data = await adminRequest<UserStatusResult>(
      "/api/v1/admin/users/" + userId + "/status",
      {
        method: "PATCH",
        body: JSON.stringify({ status, reason: reason.trim() }),
      },
    );
    return { success: true, data };
  } catch (error) {
    return actionError(error);
  }
}
