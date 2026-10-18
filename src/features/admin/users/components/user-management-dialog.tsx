"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  loadUserManagement,
  replaceUserRoles,
  updateUserStatus,
} from "../server/user-actions";
import {
  allowedUserStatuses,
  ROLE_LABELS,
  STATUS_LABELS,
} from "../lib/user-status";
import type {
  ActionResult,
  AdminRole,
  AdminUserDetail,
} from "../types/admin-users";

export type UserDialogMode = "details" | "roles" | "status";

const fieldClass =
  "w-full rounded-lg border border-[#E3E6E9] bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-[#0E6B6F]";
const buttonClass =
  "rounded-lg bg-[#0E6B6F] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A5356] disabled:opacity-50";

export function UserManagementDialog({
  userId,
  actorId,
  initialMode,
  onClose,
  onChanged,
}: {
  userId: string;
  actorId: string;
  initialMode: UserDialogMode;
  onClose: () => void;
  onChanged: (message: string) => void;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<UserDialogMode>(initialMode);
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [roleKeys, setRoleKeys] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadUserManagement(userId)
      .then((result) => {
        if (cancelled) return;
        if (!result.success) {
          if (result.status === 401) router.replace("/admin/login");
          setError(result.message);
          return;
        }
        setUser(result.data.user);
        setRoles(result.data.roles);
        setRoleKeys(result.data.user.roles);
        setStatus(
          allowedUserStatuses(result.data.user.status, userId === actorId)[0] ??
            "",
        );
      })
      .catch(() => {
        if (!cancelled)
          setError("Không tải được thông tin tài khoản. Vui lòng thử lại.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, actorId, router, retryKey]);

  function handleResult<T>(result: ActionResult<T>, message: string) {
    if (!result.success) {
      if (result.status === 401) router.replace("/admin/login");
      setError(result.message);
    } else {
      onChanged(message);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setError("");
    setSaving(true);
    try {
      if (mode === "roles") {
        handleResult(
          await replaceUserRoles(userId, roleKeys),
          "Đã cập nhật vai trò tài khoản.",
        );
      } else if (mode === "status") {
        handleResult(
          await updateUserStatus(userId, status, reason),
          "Đã cập nhật trạng thái tài khoản.",
        );
      }
    } catch {
      setError("Không thể gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  const statuses = user
    ? allowedUserStatuses(user.status, userId === actorId)
    : [];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="user-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!saving) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border border-[#E3E6E9] bg-white p-0 text-[#17212B] shadow-xl backdrop:bg-black/30"
    >
      <div className="flex items-center justify-between border-b border-[#E3E6E9] p-5">
        <h2 id="user-dialog-title" className="font-semibold">
          Thông tin người dùng
        </h2>
        <button
          type="button"
          disabled={saving}
          onClick={onClose}
          aria-label="Đóng thông tin người dùng"
          className="rounded-lg px-3 py-2 text-lg hover:bg-slate-100 disabled:opacity-50"
        >
          ×
        </button>
      </div>

      <div className="space-y-5 p-5">
        {loading && <p role="status">Đang tải thông tin tài khoản…</p>}
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-[#FDECEA] p-3 text-sm text-[#B42318]"
          >
            {error}
          </p>
        )}
        {!loading && !user && (
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              setError("");
              setLoading(true);
              setRetryKey((key) => key + 1);
            }}
          >
            Thử lại
          </button>
        )}

        {user && !loading && (
          <>
            <div>
              <p className="text-lg font-semibold">{user.fullName}</p>
              <p className="break-all text-sm text-[#5F6B76]">{user.email}</p>
            </div>
            <div
              className="flex gap-2 border-b border-[#E3E6E9] text-sm"
              aria-label="Nội dung thông tin người dùng"
            >
              {(["details", "roles", "status"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setMode(tab);
                    setError("");
                  }}
                  aria-pressed={mode === tab}
                  className={
                    "border-b-2 px-3 py-2 " +
                    (mode === tab
                      ? "border-[#0E6B6F] text-[#0E6B6F]"
                      : "border-transparent text-[#5F6B76]")
                  }
                >
                  {
                    {
                      details: "Chi tiết",
                      roles: "Vai trò",
                      status: "Trạng thái",
                    }[tab]
                  }
                </button>
              ))}
            </div>

            {mode === "details" ? (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                <dt className="text-[#5F6B76]">Số điện thoại</dt>
                <dd>{user.phone || "—"}</dd>
                <dt className="text-[#5F6B76]">Vai trò</dt>
                <dd>
                  {user.roles
                    .map((role) => ROLE_LABELS[role] ?? role)
                    .join(", ") || "—"}
                </dd>
                <dt className="text-[#5F6B76]">Trạng thái</dt>
                <dd>{STATUS_LABELS[user.status] ?? user.status}</dd>
                <dt className="text-[#5F6B76]">Ngày tham gia</dt>
                <dd>
                  {new Date(user.createdAt).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </dd>
                <dt className="text-[#5F6B76]">Cập nhật</dt>
                <dd>
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                    : "—"}
                </dd>
              </dl>
            ) : (
              <form onSubmit={save} className="space-y-4">
                {mode === "roles" ? (
                  <fieldset disabled={saving} className="space-y-3">
                    <legend className="mb-3 text-sm text-[#5F6B76]">
                      Tài khoản phải có ít nhất một vai trò.
                    </legend>
                    {roles.map((role) => (
                      <label
                        key={role.key}
                        className="flex items-center gap-3 rounded-lg border border-[#E3E6E9] p-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={roleKeys.includes(role.key)}
                          onChange={(event) => {
                            setRoleKeys((keys) =>
                              event.target.checked
                                ? [...keys, role.key]
                                : keys.filter((key) => key !== role.key),
                            );
                          }}
                          className="accent-[#0E6B6F]"
                        />
                        <span>{ROLE_LABELS[role.key] ?? role.name}</span>
                      </label>
                    ))}
                    {user.roles
                      .filter((key) => !roles.some((role) => role.key === key))
                      .map((key) => (
                        <label
                          key={key}
                          className="flex items-center gap-3 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={roleKeys.includes(key)}
                            onChange={(event) => {
                              setRoleKeys((keys) =>
                                event.target.checked
                                  ? [...keys, key]
                                  : keys.filter((item) => item !== key),
                              );
                            }}
                          />
                          {ROLE_LABELS[key] ?? key} (vai trò không còn khả dụng)
                        </label>
                      ))}
                  </fieldset>
                ) : (
                  <>
                    <p className="text-sm">
                      Hiện tại:{" "}
                      <strong>
                        {STATUS_LABELS[user.status] ?? user.status}
                      </strong>
                    </p>
                    {statuses.length === 0 ? (
                      <p className="text-sm text-[#5F6B76]">
                        Bạn không thể vô hiệu hóa hoặc khóa tài khoản của chính
                        mình.
                      </p>
                    ) : (
                      <>
                        <label className="block space-y-2 text-sm">
                          <span>Trạng thái mới</span>
                          <select
                            aria-label="Trạng thái mới"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            disabled={saving}
                            className={fieldClass}
                          >
                            {statuses.map((next) => (
                              <option key={next} value={next}>
                                {STATUS_LABELS[next]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block space-y-2 text-sm">
                          <span>Lý do thay đổi</span>
                          <textarea
                            aria-label="Lý do thay đổi"
                            required
                            minLength={5}
                            maxLength={255}
                            rows={3}
                            value={reason}
                            disabled={saving}
                            onChange={(event) => setReason(event.target.value)}
                            className={fieldClass}
                          />
                          <span className="text-xs text-[#5F6B76]">
                            Từ 5–255 ký tự. Thay đổi sẽ được ghi nhận để kiểm
                            tra.
                          </span>
                        </label>
                      </>
                    )}
                  </>
                )}
                <button
                  type="submit"
                  disabled={
                    saving ||
                    (mode === "roles"
                      ? roleKeys.length === 0
                      : !status || reason.trim().length < 5)
                  }
                  className={buttonClass}
                >
                  {saving ? "Đang lưu…" : "Lưu thay đổi"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
