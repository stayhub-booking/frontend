import "server-only";

import { backendCommand } from "@/lib/api/backend";

import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/password-recovery";

export async function requestPasswordReset(
  request: ForgotPasswordRequest,
): Promise<void> {
  await backendCommand("/api/v1/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function performPasswordReset(
  request: ResetPasswordRequest,
): Promise<void> {
  await backendCommand("/api/v1/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
