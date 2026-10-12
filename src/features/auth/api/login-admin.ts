import { apiClient } from "@/lib/api/client";

import type {
    LoginRequest,
    LoginResult,
} from "../types/auth";

export function loginAdmin(request: LoginRequest) {
    return apiClient<LoginResult>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(request),
    });
}