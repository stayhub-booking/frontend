"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PageResponse } from "@/lib/api/types";
import type { UserResponse } from "@/features/auth/types/auth";
import { usersHref, type UsersQuery } from "../lib/users-query";
import {
  UsersPageHeading,
  UsersStatusTabs,
  UsersToolbar,
} from "./users-toolbar";
import { UsersTable } from "./users-table";
import { UsersPagination } from "./users-pagination";
import {
  UserManagementDialog,
  type UserDialogMode,
} from "./user-management-dialog";

export function UsersPageClient({
  usersPage,
  query,
  actorId,
}: {
  usersPage: PageResponse<UserResponse>;
  query: UsersQuery;
  actorId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{
    userId: string;
    mode: UserDialogMode;
  } | null>(null);
  const [notice, setNotice] = useState("");

  function navigate(next: UsersQuery) {
    setOpenMenuUserId(null);
    startTransition(() => router.push(usersHref(next), { scroll: false }));
  }
  function openUser(userId: string, mode: UserDialogMode) {
    setNotice("");
    setOpenMenuUserId(null);
    setDialog({ userId, mode });
  }

  return (
    <>
      <UsersPageHeading showAddButton={false} />
      {notice && (
        <p
          role="status"
          className="rounded-lg border border-[#0E6B6F]/20 bg-[#E6F4F5] p-3 text-sm text-[#0E6B6F]"
        >
          {notice}
        </p>
      )}
      <section
        aria-label="Danh sách tài khoản"
        aria-busy={pending}
        className="flex min-w-0 flex-col rounded-xl border border-[#E3E6E9] bg-white shadow-xs"
      >
        <UsersStatusTabs
          activeTab="all"
          tabs={[
            { key: "all", label: "Tất cả", count: usersPage.totalElements },
            { key: "active", label: "Đang hoạt động", disabled: true },
            { key: "pending", label: "Chờ kích hoạt", disabled: true },
            { key: "inactive", label: "Chưa hoạt động", disabled: true },
            { key: "locked", label: "Đã khóa", disabled: true },
          ]}
        />
        <UsersToolbar
          searchDisabled
          roleFilterDisabled
          dateFilterDisabled
          showExportButton={false}
          sortDisabled={pending}
          sortLabel={
            query.sort === "createdAt,desc"
              ? "Sắp xếp: Mới nhất"
              : "Sắp xếp: Cũ nhất"
          }
          onSortClick={() =>
            navigate({
              ...query,
              page: 0,
              sort:
                query.sort === "createdAt,desc"
                  ? "createdAt,asc"
                  : "createdAt,desc",
            })
          }
        />
        <UsersTable
          users={usersPage.items}
          showSelection={false}
          openMenuUserId={openMenuUserId}
          onToggleMenu={(id) =>
            setOpenMenuUserId((current) => (current === id ? null : id))
          }
          onViewDetail={(id) => openUser(id, "details")}
          onChangeRole={(id) => openUser(id, "roles")}
          onChangeStatus={(id) => openUser(id, "status")}
          emptyMessage="Chưa có người dùng nào trong hệ thống."
        />
        <UsersPagination
          totalElements={usersPage.totalElements}
          totalPages={usersPage.totalPages}
          currentPage={usersPage.page + 1}
          pageSize={usersPage.size}
          startItem={
            usersPage.items.length ? usersPage.page * usersPage.size + 1 : 0
          }
          endItem={
            usersPage.items.length
              ? usersPage.page * usersPage.size + usersPage.items.length
              : 0
          }
          disabled={pending}
          onPageChange={(page) => navigate({ ...query, page: page - 1 })}
          onPageSizeChange={(size) => navigate({ ...query, page: 0, size })}
        />
      </section>
      {dialog && (
        <UserManagementDialog
          key={dialog.userId}
          userId={dialog.userId}
          actorId={actorId}
          initialMode={dialog.mode}
          onClose={() => setDialog(null)}
          onChanged={(message) => {
            setDialog(null);
            setNotice(message);
            startTransition(() => router.refresh());
          }}
        />
      )}
    </>
  );
}
