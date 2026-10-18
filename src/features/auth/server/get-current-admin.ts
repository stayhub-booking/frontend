import "server-only";
import { cookies } from "next/headers";

import { backendRequest } from "@/lib/api/backend";
import type { UserResponse } from "../types/auth";
import { ApiError } from "@/lib/api/api-error";

export async function getCurrentAdmin(): Promise<UserResponse | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("stayhub_access_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const user = await backendRequest<UserResponse>(
      "/api/v1/admin/auth/users/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!user.roles.includes("ADMIN")) {
      return null;
    }

    return user;
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      return null;
    }
    throw error;
  }
}
