"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { forgotPassword } from "../api/password-recovery";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Vui lòng nhập email");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await forgotPassword({
        email: normalizedEmail,
      });

      setIsSubmitted(true);
    } catch {
      setError("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Kiểm tra email</h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Nếu tài khoản tồn tại, StayHub sẽ gửi liên kết đặt lại mật khẩu đến
          email của bạn.
        </p>

        <Link
          href="/admin/login"
          className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-600">StayHub</p>

        <h1 className="text-3xl font-bold text-slate-900">Quên mật khẩu</h1>

        <p className="mt-2 text-sm text-slate-500">
          Nhập email để nhận liên kết đặt lại mật khẩu.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
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
          {isSubmitting ? "Đang gửi..." : "Gửi liên kết"}
        </button>

        <Link
          href="/admin/login"
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Quay lại đăng nhập
        </Link>
      </form>
    </div>
  );
}
