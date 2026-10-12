import { ApiError } from "./api-error";
import type { ApiResponse } from "./types";

export async function apiClient<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    // Nhận JSON do Next.js API trả về
    const body = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !body.success || body.data === null) {
        throw new ApiError(
            body.message || "Có lỗi xảy ra",
            response.status,
            body.code,
        );
    }

    // Chỉ trả về phần data
    return body.data;
}