import "server-only";

import { backendRequest } from "@/lib/api/backend";
import { ApiError } from "@/lib/api/api-error";
import { FrontendErrorCode } from "@/lib/api/frontend-error-code";
import { saveAuthCookies } from "@/lib/auth/cookies";

import type {
    AuthenticationResponse,
    LoginRequest,
    LoginResult,
} from "../types/auth";

export async function loginAdmin(
    request: LoginRequest,
): Promise<LoginResult> {
    const authentication = await backendRequest<AuthenticationResponse>(
        "/api/v1/auth/login",
        {
            method: "POST",
            body: JSON.stringify(request),
        },
    );

    if (!authentication.user.roles.includes("ADMIN")) {
        throw new ApiError(
            "Tài khoản không có quyền quản trị",
            403,
            FrontendErrorCode.ADMIN_ACCESS_DENIED,
        );
    }

    await saveAuthCookies(authentication);

    return {
        user: authentication.user,
    };
}
