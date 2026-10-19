import "server-only";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import type { PageResponse } from "@/lib/api/types";
import type { UserResponse } from "@/features/auth/types/auth";
import { adminRequest } from "./admin-request";
import { parseUsersQuery } from "../lib/users-query";

type GetAdminUsersParams = { page?: number; size?: number; sort?: string };

export async function getAdminUsers({
  page = 0,
  size = 20,
  sort = "createdAt,desc",
}: GetAdminUsersParams = {}): Promise<PageResponse<UserResponse>> {
  const query = parseUsersQuery({
    page: String(page),
    size: String(size),
    sort,
  });
  const params = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
    sort: query.sort,
  });
  try {
    return await adminRequest<PageResponse<UserResponse>>(
      "/api/v1/admin/users?" + params,
    );
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect("/admin/login");
    }
    throw error;
  }
}
