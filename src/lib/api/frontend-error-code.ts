export const FrontendErrorCode = {
  INVALID_REQUEST: "FE_INVALID_REQUEST",
  ADMIN_ACCESS_DENIED: "FE_ADMIN_ACCESS_DENIED",
  INTERNAL_ERROR: "FE_INTERNAL_ERROR",
} as const;

export type FrontendErrorCode =
  (typeof FrontendErrorCode)[keyof typeof FrontendErrorCode];
