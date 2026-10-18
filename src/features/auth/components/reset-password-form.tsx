"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

import { ApiError } from "@/lib/api/api-error";

import { resetPassword } from "../api/password-recovery";
import { getResetPasswordErrorMessage } from "../lib/password-recovery-error";

export function ResetPasswordForm() {
  const tokenCaptured = useRef(false);

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isCheckingLink, setIsCheckingLink] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (tokenCaptured.current) {
      return;
    }

    tokenCaptured.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const resetToken = searchParams.get("token")?.trim() ?? "";

    setToken(resetToken);
    setIsCheckingLink(false);

    // Không giữ reset token trên thanh địa chỉ.
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.hash}`,
    );
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 8 || newPassword.length > 72) {
      setError("Mật khẩu phải có từ 8 đến 72 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      setIsCompleted(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (caughtError) {
      if (!(caughtError instanceof ApiError)) {
        setError("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
        return;
      }

      setError(getResetPasswordErrorMessage(caughtError.code));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingLink) {
    return <p className="text-sm text-slate-600">Đang kiểm tra liên kết...</p>;
  }

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">
          Liên kết không hợp lệ
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Liên kết đặt lại mật khẩu bị thiếu hoặc không đúng.
        </p>

        <Link
          href="/forgot-password"
          className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Yêu cầu liên kết mới
        </Link>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">
          Đặt lại mật khẩu thành công
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Bạn có thể đăng nhập bằng mật khẩu mới.
        </p>

        <Link
          href="/admin/login"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Đi đến đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-600">StayHub</p>

        <h1 className="text-3xl font-bold text-slate-900">Đặt lại mật khẩu</h1>

        <p className="mt-2 text-sm text-slate-500">
          Nhập mật khẩu mới cho tài khoản.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Mật khẩu mới
          </label>

          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Xác nhận mật khẩu
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  );
}
