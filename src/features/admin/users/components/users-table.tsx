import Image from "next/image";
import { ROLE_LABELS } from "../lib/user-status";
import type { UserResponse } from "@/features/auth/types/auth";
import { UserActionsMenu } from "./user-actions-menu";

export interface UsersTableProps {
  users: UserResponse[];
  showSelection?: boolean;
  selectedUserIds?: string[];
  isAllSelected?: boolean;
  openMenuUserId?: string | null;
  isLoading?: boolean;
  emptyMessage?: string;
  onSelectAll?: () => void;
  onSelectUser?: (userId: string) => void;
  onToggleMenu?: (userId: string) => void;
  onViewDetail?: (userId: string) => void;
  onChangeRole?: (userId: string) => void;
  onChangeStatus?: (userId: string) => void;
  onResendVerification?: (userId: string) => void;
  onLockAccount?: (userId: string) => void;
}

const AVATAR_PALETTES = [
  { bg: "bg-[#E2E8F0]", text: "text-[#334155]" }, // slate
  { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" }, // amber
  { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]" }, // indigo
  { bg: "bg-[#EDE9FE]", text: "text-[#5B21B6]" }, // violet
  { bg: "bg-[#FCE7F3]", text: "text-[#9D174D]" }, // pink
  { bg: "bg-[#DCFCE7]", text: "text-[#166534]" }, // green
  { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" }, // red
  { bg: "bg-[#E6F4F5]", text: "text-[#0E6B6F]" }, // teal
];

function getAvatarPalette(str?: string) {
  if (!str) return AVATAR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

function getInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date);
}

function UserRoleBadge({ roles }: { roles: string[] }) {
  if (!roles?.length) return <span className="text-[#5F6B76]">—</span>;
  return (
    <div className="flex flex-col gap-1 py-2">
      {roles.map((role) => (
        <span
          key={role}
          className="inline-flex items-center gap-1.5 text-[#17212B]"
        >
          {role !== "CUSTOMER" && (
            <span
              className={
                "h-1.5 w-1.5 shrink-0 rounded-full " +
                (role === "ADMIN" ? "bg-blue-600" : "bg-amber-500")
              }
            />
          )}
          {ROLE_LABELS[role] ?? role}
        </span>
      ))}
    </div>
  );
}

function UserStatusBadge({ status }: { status?: string }) {
  const normalizedStatus = (status || "").toUpperCase();

  switch (normalizedStatus) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#E6F4EC] text-[#1F7A4D] hover:bg-[#D9EFE3] transition-colors cursor-default whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D] shrink-0" />
          <span>Đang hoạt động</span>
        </span>
      );

    case "PENDING":
    case "PENDING_VERIFICATION":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FFF3D6] text-[#8A5A00] hover:bg-[#FEE9B5] transition-colors cursor-default whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A00] shrink-0" />
          <span>Chờ kích hoạt</span>
        </span>
      );

    case "INACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#EEF0F2] text-[#4B5560] hover:bg-[#E3E6E9] transition-colors cursor-default whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4B5560] shrink-0" />
          <span>Chưa hoạt động</span>
        </span>
      );

    case "BANNED":
    case "LOCKED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FDECEA] text-[#B42318] hover:bg-[#FCDAD6] transition-colors cursor-default whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B42318] shrink-0" />
          <span>Đã khóa</span>
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#EEF0F2] text-[#4B5560] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4B5560] shrink-0" />
          <span>{status || "Chưa xác định"}</span>
        </span>
      );
  }
}

function UserAvatar({
  fullName,
  avatarUrl,
}: {
  fullName?: string;
  avatarUrl?: string | null;
}) {
  const initials = getInitials(fullName);
  const palette = getAvatarPalette(fullName);

  if (avatarUrl) {
    return (
      <Image
        width={36}
        height={36}
        unoptimized
        src={avatarUrl}
        alt={fullName || "User"}
        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#E3E6E9]"
      />
    );
  }

  return (
    <div
      className={`w-9 h-9 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center text-[13px] font-semibold shrink-0 transition-transform duration-150 group-hover:scale-105`}
    >
      {initials}
    </div>
  );
}

export function UsersTable({
  users,
  showSelection = true,
  selectedUserIds = [],
  isAllSelected = false,
  openMenuUserId = null,
  isLoading = false,
  emptyMessage = "Không có người dùng nào.",
  onSelectAll,
  onSelectUser,
  onToggleMenu,
  onViewDetail,
  onChangeRole,
  onChangeStatus,
  onResendVerification,
  onLockAccount,
}: UsersTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] text-left border-collapse">
        <thead>
          <tr className="bg-[#FAFBFB] border-b border-[#E3E6E9] text-[13px] font-medium text-[#5F6B76]">
            {showSelection && (
              <th className="w-[44px] px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="w-[17px] h-[17px] rounded border-[#CBD5E1] text-[#0E6B6F] focus:ring-[#0E6B6F]/20 accent-[#0E6B6F] cursor-pointer align-middle"
                />
              </th>
            )}
            <th className="py-3.5 px-3 font-medium">Người dùng</th>
            <th className="w-[140px] py-3.5 px-3 font-medium">Số điện thoại</th>
            <th className="w-[140px] py-3.5 px-3 font-medium">Vai trò</th>
            <th className="w-[160px] py-3.5 px-3 font-medium">Trạng thái</th>
            <th className="w-[120px] py-3.5 px-3 font-medium">Ngày tham gia</th>
            <th className="w-[56px] py-3.5 px-3 text-right font-medium">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E3E6E9] text-[13px]">
          {isLoading ? (
            <tr>
              <td
                colSpan={showSelection ? 7 : 6}
                className="px-4 py-12 text-center text-[#5F6B76]"
              >
                <div className="inline-flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin text-[#0E6B6F]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Đang tải danh sách người dùng...</span>
                </div>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={showSelection ? 7 : 6}
                className="px-4 py-12 text-center text-[#5F6B76]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isSelected = selectedUserIds.includes(user.id);
              const isMenuOpen = openMenuUserId === user.id;

              return (
                <tr
                  key={user.id}
                  className={`group h-[64px] transition-all duration-150 ${
                    isSelected
                      ? "bg-[#0E6B6F]/[0.04] shadow-[inset_3px_0_0_0_#0E6B6F]"
                      : "hover:bg-[#F8FAFA]"
                  }`}
                >
                  {/* Checkbox */}
                  {showSelection && (
                    <td className="w-[44px] px-4 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Chọn người dùng ${user.fullName || user.email}`}
                        checked={isSelected}
                        onChange={() => onSelectUser?.(user.id)}
                        className="w-[17px] h-[17px] rounded border-[#CBD5E1] text-[#0E6B6F] focus:ring-[#0E6B6F]/20 accent-[#0E6B6F] cursor-pointer align-middle"
                      />
                    </td>
                  )}

                  {/* User (Avatar + Name + Email) */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        fullName={user.fullName}
                        avatarUrl={user.avatarUrl}
                      />
                      <div className="flex flex-col min-w-0 max-w-[200px] sm:max-w-[260px]">
                        <button
                          type="button"
                          onClick={() => onViewDetail?.(user.id)}
                          title={user.fullName || "Chưa đặt tên"}
                          className="text-left text-[14px] font-medium text-[#17212B] truncate hover:text-[#0E6B6F] transition-colors cursor-pointer"
                        >
                          {user.fullName || "Chưa đặt tên"}
                        </button>
                        <span
                          title={user.email || "—"}
                          className="text-[13px] text-[#5F6B76] truncate"
                        >
                          {user.email || "—"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Phone number */}
                  <td className="px-3 text-[#17212B] tabular-nums whitespace-nowrap">
                    {user.phone || "—"}
                  </td>

                  {/* Role */}
                  <td className="px-3 whitespace-nowrap">
                    <UserRoleBadge roles={user.roles} />
                  </td>

                  {/* Status */}
                  <td className="px-3 whitespace-nowrap">
                    <UserStatusBadge status={user.status} />
                  </td>

                  {/* Created Date */}
                  <td className="px-3 text-[#5F6B76] tabular-nums whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Action Menu */}
                  <td className="px-3 text-right relative">
                    <UserActionsMenu
                      userId={user.id}
                      isOpen={isMenuOpen}
                      onToggle={onToggleMenu}
                      onViewDetail={onViewDetail}
                      onChangeRole={onChangeRole}
                      onChangeStatus={onChangeStatus}
                      onResendVerification={onResendVerification}
                      onLockAccount={onLockAccount}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
