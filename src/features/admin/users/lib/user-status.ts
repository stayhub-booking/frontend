import type { UserStatus } from "../types/admin-users";

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  PENDING: "Chờ kích hoạt",
  INACTIVE: "Chưa hoạt động",
  BANNED: "Đã khóa",
};
export const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Khách hàng",
  HOTEL_OWNER: "Chủ khách sạn",
  ADMIN: "Quản trị viên",
};

export function allowedUserStatuses(
  current: string,
  isSelf: boolean,
): UserStatus[] {
  const transitions: Record<string, UserStatus[]> = {
    PENDING: ["ACTIVE", "BANNED"],
    ACTIVE: ["INACTIVE", "BANNED"],
    INACTIVE: ["ACTIVE", "BANNED"],
    BANNED: ["ACTIVE"],
  };
  return (transitions[current] ?? []).filter(
    (next) => !isSelf || (next !== "INACTIVE" && next !== "BANNED"),
  );
}
