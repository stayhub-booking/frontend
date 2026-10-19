import { apiClient } from "@/lib/api/client";

import type {
  ForgotPasswordRequest,
  ForgotPasswordResult,
  ResetPasswordRequest,
  ResetPasswordResult,
} from "../types/password-recovery";

export function forgotPassword(request: ForgotPasswordRequest) {
  return apiClient<ForgotPasswordResult>("/api/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function resetPassword(request: ResetPasswordRequest) {
  return apiClient<ResetPasswordResult>("/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
