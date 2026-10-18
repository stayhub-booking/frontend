"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { loginAdmin } from "../api/login-admin";
import { forgotPassword } from "../api/password-recovery";
import type { LoginRequest, UserResponse } from "../types/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const initialForm: LoginRequest = {
  email: "",
  password: "",
};

export function AdminLoginForm() {
  const router = useRouter();

  const [form, setForm] = useState<LoginRequest>(initialForm);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);

  // Modal reset password state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  // Refs for modal accessibility (focus trap and focus return)
  const forgotBtnRef = useRef<HTMLButtonElement | null>(null);
  const resetLayerRef = useRef<HTMLDivElement | null>(null);
  const resetEmailRef = useRef<HTMLInputElement | null>(null);

  // Load remember me preference after mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("stayhub_admin_remember_email");
      if (savedEmail) {
        requestAnimationFrame(() => {
          setForm((prev) => ({ ...prev, email: savedEmail }));
          setRemember(true);
        });
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  // Handle ESC key and focus trap for modal
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (!isResetOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeResetModal();
        return;
      }

      if (e.key === "Tab" && resetLayerRef.current) {
        const focusable = Array.from(
          resetLayerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetOpen]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "email" && emailError) setEmailError("");
    if (name === "password" && passwordError) setPasswordError("");
    if (generalError) setGeneralError("");
  }

  function handlePasswordKey(event: KeyboardEvent<HTMLInputElement>) {
    if (typeof event.getModifierState === "function") {
      setCapsLockOn(event.getModifierState("CapsLock"));
    }
  }

  function validateEmail(val: string): boolean {
    const trimmed = val.trim();
    if (!trimmed) {
      setEmailError("Vui lòng nhập email quản trị.");
      return false;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError("Email chưa đúng định dạng. Ví dụ: admin@stayhub.com");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword(val: string): boolean {
    if (!val) {
      setPasswordError("Vui lòng nhập mật khẩu.");
      return false;
    }
    if (val.length < 8) {
      setPasswordError("Mật khẩu cần ít nhất 8 ký tự.");
      return false;
    }
    setPasswordError("");
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailValid = validateEmail(form.email);
    const passwordValid = validatePassword(form.password);

    if (!emailValid || !passwordValid) {
      return;
    }

    try {
      setGeneralError("");
      setIsSubmitting(true);

      const result = await loginAdmin(form);

      if (remember) {
        localStorage.setItem("stayhub_admin_remember_email", form.email);
      } else {
        localStorage.removeItem("stayhub_admin_remember_email");
      }

      setUser(result.user);

      setTimeout(() => {
        router.replace("/admin");
        router.refresh();
      }, 1000);
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openResetModal() {
    setResetEmail(form.email.trim());
    setResetEmailError("");
    setResetDone(false);
    setIsResetOpen(true);
    document.body.classList.add("has-modal");
    setTimeout(() => {
      resetEmailRef.current?.focus({ preventScroll: true });
    }, 60);
  }

  function closeResetModal() {
    setIsResetOpen(false);
    document.body.classList.remove("has-modal");
    setTimeout(() => {
      forgotBtnRef.current?.focus({ preventScroll: true });
    }, 50);
  }

  async function handleResetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = resetEmail.trim().toLowerCase();
    if (!trimmed) {
      setResetEmailError("Vui lòng nhập email quản trị.");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setResetEmailError("Email chưa đúng định dạng. Ví dụ: admin@stayhub.com");
      return;
    }

    try {
      setResetEmailError("");
      setIsResetSubmitting(true);

      await forgotPassword({ email: trimmed });
      setResetDone(true);
    } catch {
      setResetEmailError("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsResetSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen min-h-dvh max-lg:grid-cols-1 max-lg:grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] bg-white text-ink">
      {/* Brand Panel (Left Column) */}
      <section
        className="relative isolate overflow-hidden flex bg-navy text-brand-ink p-[48px_56px_44px] max-xl:p-[40px_44px] max-lg:block max-lg:min-h-[176px] max-lg:p-0 max-sm:min-h-[140px] [@media(max-height:760px)_and_(min-width:1024px)]:p-[36px_44px_34px]"
        aria-label="StayHub"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 after:absolute after:inset-0 after:content-[''] after:bg-[linear-gradient(180deg,rgba(7,22,33,0.78)_0%,rgba(7,22,33,0.18)_34%,rgba(7,22,33,0.62)_68%,rgba(7,22,33,0.95)_100%),linear-gradient(90deg,rgba(7,22,33,0.36)_0%,transparent_62%)]"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/stayhub-resort.jpg"
            width={2000}
            height={1333}
            alt="StayHub Luxury Resort"
            className="block h-full w-full object-cover object-[62%_50%] max-lg:object-[62%_38%]"
          />
        </div>

        <div className="relative z-[1] flex w-full max-w-[560px] flex-col max-lg:h-[176px] max-lg:max-w-none max-lg:justify-center max-lg:p-[28px_32px] max-sm:h-[140px] max-sm:p-[22px_20px]">
          <div className="flex items-center gap-[14px]">
            <svg
              className="block h-[44px] w-[44px] shrink-0 text-white max-sm:h-[38px] max-sm:w-[38px]"
              viewBox="0 0 44 44"
              width="44"
              height="44"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                x="1"
                y="1"
                width="42"
                height="42"
                rx="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                opacity=".55"
              />
              <path
                d="M15 32V22.3a7 7 0 0 1 14 0V32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M11.5 32h21"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="26" cy="26.5" r="1.15" fill="currentColor" />
            </svg>
            <span className="font-display text-[21px] font-semibold leading-none tracking-[-0.01em] text-white max-sm:text-[19px]">
              StayHub
            </span>
            <span
              className="h-[15px] w-[1px] shrink-0 bg-white/30 max-[380px]:hidden"
              aria-hidden="true"
            />
            <span className="text-[10.5px] font-semibold leading-none tracking-[0.18em] uppercase text-white/[0.72] max-[380px]:hidden">
              Admin
            </span>
          </div>

          <div className="mt-auto max-w-[440px] pt-[64px] max-lg:hidden [@media(max-height:760px)_and_(min-width:1024px)]:pt-[40px]">
            <p className="mb-[22px] flex items-center gap-[12px] text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/80 before:h-[1px] before:w-[28px] before:shrink-0 before:bg-brass before:content-['']">
              Cổng quản trị nội bộ
            </p>
            <p className="mb-[20px] font-display text-[clamp(40px,4.2vw,58px)] font-semibold leading-[1.06] tracking-[-0.02em] text-[#fbf7ef] [text-wrap:balance] max-xl:text-[clamp(40px,4.6vw,50px)] [@media(max-height:760px)_and_(min-width:1024px)]:text-[44px]">
              Chào mừng
              <br />
              trở lại.
            </p>
            <p className="m-0 max-w-[36ch] text-[15.5px] leading-[1.65] text-white/[0.76]">
              Không gian làm việc dành cho đội ngũ vận hành StayHub.
            </p>
          </div>

          <div className="mt-[44px] flex flex-wrap justify-between gap-[16px] border-t border-white/[0.16] pt-[20px] text-[12px] tracking-[0.02em] text-white/[0.62] max-lg:hidden [@media(max-height:760px)_and_(min-width:1024px)]:mt-[24px] [@media(max-height:760px)_and_(min-width:1024px)]:pt-[16px]">
            <span>© 2026 StayHub</span>
            <span>Phiên bản nội bộ</span>
          </div>
        </div>
      </section>

      {/* Form Panel (Right Column) */}
      <section
        className="flex items-center justify-center bg-paper bg-white text-ink p-[64px_clamp(32px,6vw,88px)] max-lg:p-[56px_32px_72px] max-sm:items-start max-sm:p-[36px_20px_max(48px,env(safe-area-inset-bottom))]"
        aria-label="Đăng nhập"
      >
        <div className="grid w-full max-w-[408px] max-lg:max-w-[424px] max-sm:max-w-none">
          {user ? (
            /* Success View */
            <div className="[grid-area:1/1] self-center w-full max-w-[408px] transition-all duration-200">
              <div
                className="mb-[24px] grid h-[56px] w-[56px] place-items-center rounded-full bg-success-soft text-success"
                aria-hidden="true"
              >
                <svg
                  className="h-[26px] w-[26px] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  focusable="false"
                >
                  <path
                    d="M4 12.5l5 5L20 6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1
                className="mb-[12px] font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.015em] text-ink [text-wrap:balance] focus:outline-none"
                id="success-title"
                tabIndex={-1}
              >
                Đăng nhập thành công
              </h1>
              <p className="mb-[8px] text-[16px] leading-[1.6] text-ink-2 [overflow-wrap:anywhere]">
                Chào mừng trở lại, <strong className="font-semibold text-ink">{user.fullName || user.email}</strong>.
              </p>
              <p className="m-0 text-[13px] leading-[1.55] text-ink-3">
                Đang chuyển hướng đến bảng điều khiển quản trị...
              </p>
            </div>
          ) : (
            /* Login Form View */
            <div className="[grid-area:1/1] self-center w-full transition-all duration-200" id="login-view">
              <header className="mb-[32px] max-sm:mb-[28px]">
                <h1
                  className="mb-[12px] font-display text-[clamp(32px,3.2vw,40px)] font-semibold leading-[1.1] tracking-[-0.015em] text-ink [text-wrap:balance] focus:outline-none max-sm:text-[32px]"
                  id="login-title"
                >
                  Đăng nhập
                </h1>
                <p className="m-0 max-w-[38ch] text-[16px] leading-[1.6] text-ink-2 max-[380px]:text-[15.5px]">
                  Dùng tài khoản quản trị để tiếp tục phiên làm việc.
                </p>
              </header>

              <form className="flex flex-col gap-[20px] max-sm:gap-[18px]" id="login-form" onSubmit={handleSubmit} noValidate>
                {/* General Alert Banner */}
                {generalError && (
                  <div
                    className="flex items-start gap-[10px] rounded-control border border-danger-line bg-danger-soft p-[12px_14px] text-[13.5px] leading-[1.5] text-danger-ink"
                    role="alert"
                  >
                    <svg
                      className="mt-[2px] h-[18px] w-[18px] shrink-0 text-danger"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="12" cy="16.6" r="1.1" fill="currentColor" />
                    </svg>
                    <div>
                      <p className="m-0 font-semibold">Vui lòng kiểm tra lại thông tin.</p>
                      <ul className="m-[4px_0_0] pl-[18px]">
                        <li>{generalError}</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className={`grid gap-[8px] field ${emailError ? "has-error" : ""}`} id="email-field">
                  <label className="text-[13.5px] font-semibold tracking-[0.005em] text-ink" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="control"
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    placeholder="admin@stayhub.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => validateEmail(form.email)}
                    aria-describedby={emailError ? "email-error" : undefined}
                    aria-invalid={!!emailError}
                  />
                  {emailError && (
                    <p className="error" id="email-error">
                      <svg
                        className="mt-[2px] h-[16px] w-[16px] shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="12" cy="16.6" r="1.1" fill="currentColor" />
                      </svg>
                      <span>{emailError}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className={`grid gap-[8px] field ${passwordError ? "has-error" : ""}`} id="password-field">
                  <label className="text-[13.5px] font-semibold tracking-[0.005em] text-ink" htmlFor="password">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      className="control pr-[52px]"
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Nhập mật khẩu"
                      value={form.password}
                      onChange={handleChange}
                      onKeyDown={handlePasswordKey}
                      onKeyUp={handlePasswordKey}
                      onBlur={() => {
                        setCapsLockOn(false);
                        validatePassword(form.password);
                      }}
                      aria-describedby={passwordError ? "password-error" : capsLockOn ? "password-hint" : undefined}
                      aria-invalid={!!passwordError}
                    />
                    <button
                      className={`reveal ${showPassword ? "is-on" : ""}`}
                      type="button"
                      id="reveal"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      aria-pressed={showPassword}
                    >
                      {!showPassword ? (
                        <svg
                          className="h-[20px] w-[20px] shrink-0"
                          id="eye-open"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                        </svg>
                      ) : (
                        <svg
                          className="h-[20px] w-[20px] shrink-0"
                          id="eye-off"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M3.5 3.5l17 17"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.6 6.1A9.9 9.9 0 0 1 12 6c5.8 0 9.2 6 9.2 6a17.5 17.5 0 0 1-3.1 3.7M6.4 7.5A17 17 0 0 0 2.8 12S6.2 18 12 18c1.4 0 2.7-.3 3.9-.9"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      ref={forgotBtnRef}
                      className="relative shrink-0 whitespace-nowrap border-0 bg-transparent py-[2px] font-sans text-[13.5px] font-medium leading-[1.4] text-accent cursor-pointer hover:text-accent-strong hover:underline hover:underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 after:absolute after:inset-[-12px_-8px] after:content-['']"
                      type="button"
                      id="forgot-btn"
                      onClick={openResetModal}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  {capsLockOn && (
                    <p className="m-0 text-[12.5px] leading-[1.45] text-[#8a5a00]" id="password-hint" aria-live="polite">
                      Caps Lock đang bật.
                    </p>
                  )}
                  {passwordError && (
                    <p className="error" id="password-error">
                      <svg
                        className="mt-[2px] h-[16px] w-[16px] shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="12" cy="16.6" r="1.1" fill="currentColor" />
                      </svg>
                      <span>{passwordError}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <label className="mt-[2px] flex cursor-pointer items-center gap-[10px]">
                  <input
                    className="check shrink-0"
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="flex-1 text-[14px] leading-[1.45] text-ink-2">
                    Ghi nhớ đăng nhập trên thiết bị này
                  </span>
                </label>

                {/* Submit Button */}
                <button className="btn" type="submit" id="submit-btn" disabled={isSubmitting}>
                  <span className="whitespace-nowrap">
                    {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
                  </span>
                  {isSubmitting && <span className="spinner" id="submit-spinner" aria-hidden="true" />}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Forgot Password Modal Dialog */}
      {isResetOpen && (
        <div
          ref={resetLayerRef}
          className="fixed inset-0 z-60 grid place-items-center p-[24px] max-sm:p-[16px]"
          id="reset-layer"
        >
          <div
            className="absolute inset-0 bg-[#08141e]/55 transition-opacity duration-200"
            onClick={closeResetModal}
          />
          <div
            className="relative z-[1] w-full max-w-[440px] max-h-[calc(100dvh-48px)] overflow-auto rounded-modal bg-white p-[36px_36px_32px] shadow-[0_24px_64px_-24px_rgba(4,16,26,0.45)] max-sm:max-h-[calc(100dvh-32px)] max-sm:rounded-lg max-sm:p-[30px_22px_24px] transition-all"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
          >
            <button
              className="absolute top-[12px] right-[12px] grid h-[44px] w-[44px] place-items-center rounded-sm bg-transparent p-0 border-0 text-ink-2 cursor-pointer transition-colors duration-160 hover:bg-[#f2f5f6] hover:text-ink focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              type="button"
              onClick={closeResetModal}
              aria-label="Đóng hộp thoại"
            >
              <svg
                className="h-[20px] w-[20px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <p className="mb-[10px] text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              Khôi phục truy cập
            </p>
            <h2
              className="m-0 font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink max-sm:text-[25px]"
              id="reset-title"
            >
              Đặt lại mật khẩu
            </h2>

            {!resetDone ? (
              <form className="mt-[20px] flex flex-col gap-[18px]" id="reset-form" onSubmit={handleResetSubmit} noValidate>
                <p className="m-0 text-[14.5px] leading-[1.6] text-ink-2">
                  Nhập email quản trị của bạn, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
                </p>

                <div className={`grid gap-[8px] field ${resetEmailError ? "has-error" : ""}`} id="reset-email-field">
                  <label className="text-[13.5px] font-semibold tracking-[0.005em] text-ink" htmlFor="reset-email">
                    Email quản trị
                  </label>
                  <input
                    ref={resetEmailRef}
                    className="control"
                    id="reset-email"
                    name="reset-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck="false"
                    placeholder="admin@stayhub.com"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      if (resetEmailError) setResetEmailError("");
                    }}
                    aria-describedby={resetEmailError ? "reset-email-error" : undefined}
                    aria-invalid={!!resetEmailError}
                  />
                  {resetEmailError && (
                    <p className="error" id="reset-email-error">
                      <svg
                        className="mt-[2px] h-[16px] w-[16px] shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="12" cy="16.6" r="1.1" fill="currentColor" />
                      </svg>
                      <span>{resetEmailError}</span>
                    </p>
                  )}
                </div>

                <button className="btn" type="submit" id="reset-submit" disabled={isResetSubmitting}>
                  <span className="whitespace-nowrap">
                    {isResetSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                  </span>
                  {isResetSubmitting && <span className="spinner" id="reset-spinner" aria-hidden="true" />}
                </button>

                <p className="m-0 text-[12.5px] leading-[1.55] text-ink-3">
                  Hệ thống bảo mật xác thực nội bộ StayHub.
                </p>
              </form>
            ) : (
              <div className="mt-[22px]" id="reset-done">
                <div
                  className="mb-[18px] grid h-[48px] w-[48px] place-items-center rounded-full bg-success-soft text-success"
                  aria-hidden="true"
                >
                  <svg
                    className="h-[26px] w-[26px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    focusable="false"
                  >
                    <path
                      d="M4 12.5l5 5L20 6.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="mb-[8px] font-display text-[23px] font-semibold leading-[1.2] text-ink focus:outline-none"
                  id="reset-done-title"
                  tabIndex={-1}
                >
                  Đã gửi liên kết
                </h3>
                <p className="mb-[22px] text-[14.5px] leading-[1.6] text-ink-2 [overflow-wrap:anywhere]">
                  Đã gửi liên kết. Vui lòng kiểm tra hộp thư của bạn.
                </p>
                <button className="btn btn-ghost" type="button" onClick={closeResetModal}>
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
