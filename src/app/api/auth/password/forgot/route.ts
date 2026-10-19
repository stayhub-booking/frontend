import { requestPasswordReset } from "@/features/auth/server/password-recovery";
import type { ForgotPasswordRequest } from "@/features/auth/types/password-recovery";
import { FrontendErrorCode } from "@/lib/api/frontend-error-code";
import {
  errorResponse,
  handleRouteError,
  successResponse,
} from "@/lib/api/route-response";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ForgotPasswordRequest>;
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return errorResponse(
        "Vui lòng nhập email",
        400,
        FrontendErrorCode.INVALID_REQUEST,
      );
    }

    await requestPasswordReset({ email });

    return successResponse(
      { accepted: true as const },
      "Nếu tài khoản tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi",
      202,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
