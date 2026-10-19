export const PasswordRecoveryErrorCode = {
  INVALID_TOKEN: "AUTH_400_001",
  CONFIRMATION_MISMATCH: "AUTH_400_002",
  SAME_AS_CURRENT: "USER_400_002",
} as const;

type PasswordRecoveryErrorCode =
  (typeof PasswordRecoveryErrorCode)[keyof typeof PasswordRecoveryErrorCode];

const resetPasswordErrorMessages: Record<PasswordRecoveryErrorCode, string> = {
  [PasswordRecoveryErrorCode.INVALID_TOKEN]:
    "Liên kết không hợp lệ, đã hết hạn hoặc đã được sử dụng.",
  [PasswordRecoveryErrorCode.CONFIRMATION_MISMATCH]:
    "Mật khẩu xác nhận không khớp.",
  [PasswordRecoveryErrorCode.SAME_AS_CURRENT]:
    "Mật khẩu mới phải khác mật khẩu hiện tại.",
};

const defaultResetPasswordError =
  "Không thể đặt lại mật khẩu. Vui lòng thử lại.";

export function getResetPasswordErrorMessage(code?: string): string {
  if (!code || !(code in resetPasswordErrorMessages)) {
    return defaultResetPasswordError;
  }

  return resetPasswordErrorMessages[code as PasswordRecoveryErrorCode];
}
