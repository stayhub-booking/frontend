import Image from "next/image";
import type { ReactNode } from "react";

export interface AdminUserSummary {
  fullName?: string;
  email?: string;
  roleName?: string;
  avatarUrl?: string | null;
}

export interface NavItemConfig {
  key: string;
  label: string;
  href?: string;
  disabled?: boolean;
  icon: ReactNode;
}

export interface AdminSidebarProps {
  admin?: AdminUserSummary;
  activeKey?: string;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  onNavigate?: (key: string) => void;
}

function getInitials(name?: string): string {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AdminSidebar({
  admin = {
    fullName: "Nguyễn Văn An",
    roleName: "Quản trị viên",
  },
  activeKey = "users",
  mobileMenuOpen = false,
  onCloseMobileMenu,
  onNavigate,
}: AdminSidebarProps) {
  const managementItems: NavItemConfig[] = [
    {
      key: "overview",
      label: "Tổng quan",
      href: "#",
      icon: (
        <svg
          className="w-[19px] h-[19px] transition-transform duration-150 group-hover:scale-105"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      key: "users",
      label: "Người dùng",
      href: "#",
      icon: (
        <svg
          className="w-[19px] h-[19px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      key: "hotels",
      disabled: true,
      label: "Khách sạn",
      href: "#",
      icon: (
        <svg
          className="w-[19px] h-[19px] transition-transform duration-150 group-hover:scale-105"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22v-4h6v4" />
          <path
            d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"
            strokeWidth="2.5"
          />
        </svg>
      ),
    },
  ];

  const categoryItems: NavItemConfig[] = [
    {
      key: "cities",
      disabled: true,
      label: "Thành phố",
      href: "#",
      icon: (
        <svg
          className="w-[19px] h-[19px] transition-transform duration-150 group-hover:scale-105"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4v18" />
          <path d="M13 11l6-2v12" />
          <path
            d="M9 9v.01M9 13v.01M9 17v.01M16 13v.01M16 17v.01"
            strokeWidth="2.2"
          />
        </svg>
      ),
    },
    {
      key: "amenities",
      disabled: true,
      label: "Tiện ích",
      href: "#",
      icon: (
        <svg
          className="w-[19px] h-[19px] transition-transform duration-150 group-hover:scale-105"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  const renderNavItem = (item: NavItemConfig) => {
    const isActive = activeKey === item.key;

    return (
      <button
        key={item.key}
        type="button"
        disabled={item.disabled}
        aria-current={isActive ? "page" : undefined}
        title={item.disabled ? "Chưa có trang quản lý" : undefined}
        onClick={() => onNavigate?.(item.key)}
        className={
          isActive
            ? "flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium bg-[#0E6B6F12] text-[#0E6B6F] relative transition-colors text-left"
            : "disabled:opacity-50 disabled:cursor-not-allowed group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#5F6B76] hover:bg-[#F5F6F7] hover:text-[#17212B] transition-all duration-150 active:scale-[0.98] text-left"
        }
      >
        {isActive && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#0E6B6F] rounded-r" />
        )}
        <span className="shrink-0">{item.icon}</span>
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  const initials = getInitials(admin.fullName);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseMobileMenu}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-[#E3E6E9] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        id="admin-sidebar"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#E3E6E9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0E6B6F] flex items-center justify-center text-white shadow-xs">
                <svg
                  className="w-[19px] h-[19px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                  <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#17212B] leading-tight">
                  StayHub
                </span>
                <span className="text-[11px] text-[#5F6B76] leading-tight font-normal">
                  Admin Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              className="md:hidden p-1 text-[#5F6B76] hover:text-[#17212B] rounded-md transition-colors"
              onClick={onCloseMobileMenu}
              aria-label="Đóng thanh điều hướng"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Navigation Body */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* Group: Quản lý */}
            <div>
              <div className="px-3 mb-2 text-[12px] font-medium text-[#5F6B76]">
                Quản lý
              </div>
              <nav className="space-y-1">
                {managementItems.map(renderNavItem)}
              </nav>
            </div>

            {/* Group: Danh mục */}
            <div>
              <div className="px-3 mb-2 text-[12px] font-medium text-[#5F6B76]">
                Danh mục
              </div>
              <nav className="space-y-1">
                {categoryItems.map(renderNavItem)}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: User Profile */}
        <div className="p-3 border-t border-[#E3E6E9]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F6F7] transition-all duration-150 cursor-pointer active:scale-[0.98]">
            {admin.avatarUrl ? (
              <Image
                width={32}
                height={32}
                unoptimized
                src={admin.avatarUrl}
                alt={admin.fullName || "Admin"}
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#E3E6E9]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0E6B6F] text-white flex items-center justify-center text-[12px] font-semibold shrink-0 shadow-xs ring-2 ring-transparent hover:ring-[#0E6B6F]/20 transition-all">
                {initials}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-[#17212B] truncate">
                {admin.fullName || "Quản trị viên"}
              </span>
              <span className="text-[12px] text-[#5F6B76] truncate">
                {admin.roleName || "Quản trị viên"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
