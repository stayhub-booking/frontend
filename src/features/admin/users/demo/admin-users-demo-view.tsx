"use client";

import { useState } from "react";
import { AdminShell } from "@/features/admin/shell/components/admin-shell";
import {
  UsersPageHeading,
  UsersStatusTabs,
  UsersToolbar,
  UsersBulkActions,
} from "../components/users-toolbar";
import { UsersTable } from "../components/users-table";
import { UsersPagination } from "../components/users-pagination";
import { DEMO_ADMIN_USERS_FIXTURE } from "./users-fixture";

export function AdminUsersDemoView() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([
    "1",
    "2",
    "3",
  ]);
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const users = DEMO_ADMIN_USERS_FIXTURE;
  const isAllSelected =
    users.length > 0 && selectedUserIds.length === users.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggleMenu = (id: string) => {
    setOpenMenuUserId((prev) => (prev === id ? null : id));
  };

  const tabs = [
    { key: "all", label: "Tất cả", count: 1248 },
    { key: "active", label: "Đang hoạt động", count: 1102 },
    { key: "pending", label: "Chờ xác thực", count: 86 },
    { key: "inactive", label: "Chưa hoạt động", count: 42 },
    { key: "locked", label: "Đã khóa", count: 18 },
  ];

  return (
    <AdminShell
      activeKey="users"
      mobileMenuOpen={mobileMenuOpen}
      onOpenMobileMenu={() => setMobileMenuOpen(true)}
      onCloseMobileMenu={() => setMobileMenuOpen(false)}
      admin={{
        fullName: "Nguyễn Văn An",
        roleName: "Quản trị viên",
      }}
    >
      {/* 1. Page Title & Action */}
      <UsersPageHeading onAddUser={() => alert("Mở form thêm người dùng")} />

      {/* 2. Main Table Container Card */}
      <div className="bg-white border border-[#E3E6E9] rounded-[12px] overflow-hidden flex flex-col shadow-xs transition-shadow duration-200 hover:shadow-sm">
        {/* 2.1 Status Tabs */}
        <UsersStatusTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 2.2 Filter Toolbar */}
        <UsersToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          onSortClick={() => alert("Đổi thứ tự sắp xếp")}
          onExportCsv={() => alert("Xuất file CSV")}
        />

        {/* 2.3 Bulk Action Bar */}
        <UsersBulkActions
          selectedCount={selectedUserIds.length}
          onResendVerification={() =>
            alert(`Gửi lại email cho ${selectedUserIds.length} tài khoản`)
          }
          onLockAccounts={() =>
            alert(`Khóa ${selectedUserIds.length} tài khoản`)
          }
        />

        {/* 2.4 Data Table */}
        <UsersTable
          users={users}
          selectedUserIds={selectedUserIds}
          isAllSelected={isAllSelected}
          openMenuUserId={openMenuUserId}
          onSelectAll={handleSelectAll}
          onSelectUser={handleSelectUser}
          onToggleMenu={handleToggleMenu}
          onViewDetail={(id) => alert(`Xem chi tiết user: ${id}`)}
          onChangeRole={(id) => alert(`Đổi vai trò user: ${id}`)}
          onResendVerification={(id) =>
            alert(`Gửi lại email xác thực user: ${id}`)
          }
          onLockAccount={(id) => alert(`Khóa tài khoản user: ${id}`)}
        />

        {/* 2.5 Pagination Footer */}
        <UsersPagination
          totalElements={1248}
          currentPage={currentPage}
          totalPages={63}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </AdminShell>
  );
}
