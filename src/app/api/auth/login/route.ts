import { loginAdmin } from "@/features/auth/server/login-admin";
import type { LoginRequest } from "@/features/auth/types/auth";
import { FrontendErrorCode } from "@/lib/api/frontend-error-code";
import {
    errorResponse,
    handleRouteError,
    successResponse,
} from "@/lib/api/route-response";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Partial<LoginRequest>;

        if (!body.email?.trim() || !body.password) {
            return errorResponse(
                "Vui lòng nhập email và mật khẩu",
                400,
                FrontendErrorCode.INVALID_REQUEST,
            );
        }

        const result = await loginAdmin({
            email: body.email.trim(),
            password: body.password,
        });

        return successResponse(result, "Đăng nhập thành công");
    } catch (error) {
        return handleRouteError(error);
    }
}