import "server-only";

import { ApiError } from "./api-error";
import type { ApiResponse } from "./types";

type BackendResult<T> = {
  body: ApiResponse<T>;
  status: number;
};

async function executeBackendRequest<T>(
  path: string,
  options: RequestInit,
): Promise<BackendResult<T>> {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error("BACKEND_URL chưa được cấu hình");
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new ApiError(
      body.message || "Không thể gọi backend",
      response.status,
      body.code,
    );
  }

  return {
    body,
    status: response.status,
  };
}

export async function backendRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { body, status } = await executeBackendRequest<T>(path, options);

  if (body.data === null) {
    throw new ApiError(
      body.message || "Không thể gọi backend",
      status,
      body.code,
    );
  }

  return body.data;
}

export async function backendCommand(
  path: string,
  options: RequestInit = {},
): Promise<void> {
  await executeBackendRequest<null>(path, options);
}
