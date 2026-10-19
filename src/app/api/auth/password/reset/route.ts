import { performPasswordReset } from "@/features/auth/server/password-recovery";
import type { ResetPasswordRequest } from "@/features/auth/types/password-recovery";
import { FrontendErrorCode } from "@/lib/api/frontend-error-code";
import {
  errorResponse,
  handleRouteError,
  successResponse,
} from "@/lib/api/route-response";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ResetPasswordRequest>;

    if (!body.token?.trim() || !body.newPassword || !body.confirmPassword) {
      return errorResponse(
        "Vui lòng nhập đầy đủ thông tin",
        400,
        FrontendErrorCode.INVALID_REQUEST,
      );
    }

    await performPasswordReset({
      token: body.token.trim(),
      newPassword: body.newPassword,
      confirmPassword: body.confirmPassword,
    });

    return successResponse(
      { completed: true as const },
      "Đặt lại mật khẩu thành công",
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
