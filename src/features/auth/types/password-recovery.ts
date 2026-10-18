export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResult = {
  accepted: true;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordResult = {
  completed: true;
};
