import type { ReactNode } from "react";

import { AdminSidebar, type AdminUserSummary } from "./admin-sidebar";
import { AdminHeader, type BreadcrumbItem } from "./admin-header";

export interface AdminShellProps {
  children?: ReactNode;
  admin?: AdminUserSummary;
  activeKey?: string;
  breadcrumbs?: BreadcrumbItem[];
  mobileMenuOpen?: boolean;
  onOpenMobileMenu?: () => void;
  onCloseMobileMenu?: () => void;
  onNavigate?: (key: string) => void;
}

export function AdminShell({
  children,
  admin = {
    fullName: "Nguyễn Văn An",
    roleName: "Quản trị viên",
  },
  activeKey = "users",
  breadcrumbs = [
    { label: "Quản trị", href: "#" },
    { label: "Người dùng", current: true },
  ],
  mobileMenuOpen = false,
  onOpenMobileMenu,
  onCloseMobileMenu,
  onNavigate,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#17212B] antialiased">
      {/* Sidebar (Desktop 240px / Mobile drawer) */}
      <AdminSidebar
        admin={admin}
        activeKey={activeKey}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={onCloseMobileMenu}
        onNavigate={onNavigate}
      />

      {/* Main Area (offset by 240px on md screens and up) */}
      <div className="md:pl-[240px] flex flex-col min-h-screen">
        {/* Header */}
        <AdminHeader
          breadcrumbs={breadcrumbs}
          onOpenMobileMenu={onOpenMobileMenu}
        />

        {/* Content wrapper */}
        <main className="flex-1 w-full p-6 md:p-8">
          <div className="max-w-[1200px] mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
