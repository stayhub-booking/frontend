import "server-only";

import { cookies } from "next/headers";
import { getCurrentAdmin } from "@/features/auth/server/get-current-admin";
import { ApiError } from "@/lib/api/api-error";
import { backendRequest } from "@/lib/api/backend";

export async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // Server Actions are public endpoints: recheck the current DB-backed identity per call.
  const admin = await getCurrentAdmin();
  if (!admin || admin.status !== "ACTIVE") {
    throw new ApiError(
      "Phiên quản trị đã hết hạn hoặc không còn quyền truy cập.",
      401,
    );
  }
  const token = (await cookies()).get("stayhub_access_token")?.value;
  if (!token) {
    throw new ApiError("Vui lòng đăng nhập lại.", 401);
  }
  return backendRequest<T>(path, {
    ...options,
    headers: { ...options.headers, Authorization: "Bearer " + token },
  });
}
