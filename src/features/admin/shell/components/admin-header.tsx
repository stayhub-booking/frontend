import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  onOpenMobileMenu?: () => void;
  hasNotification?: boolean;
}

export function AdminHeader({
  breadcrumbs = [
    { label: "Quản trị", href: "#" },
    { label: "Người dùng", current: true },
  ],
  onOpenMobileMenu,
  hasNotification = false,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 right-0 left-0 h-16 bg-white/95 backdrop-blur-xs border-b border-[#E3E6E9] z-30 transition-all">
      <div className="w-full h-full px-6 md:px-8 flex items-center justify-between">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 text-[#5F6B76] hover:text-[#17212B] hover:bg-[#F5F6F7] rounded-lg transition-colors active:scale-95"
            aria-label="Mở menu điều hướng"
          >
            <svg
              className="w-[22px] h-[22px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[13px] text-[#5F6B76]"
          >
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isCurrent = item.current || isLast;

              return (
                <div key={item.label} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <svg
                      className="w-3.5 h-3.5 text-[#5F6B76]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}

                  {isCurrent ? (
                    <span className="text-[#17212B] font-medium">
                      {item.label}
                    </span>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      className="hover:text-[#17212B] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right: Notification & Help Icons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="relative p-2 text-[#5F6B76] hover:text-[#17212B] hover:bg-[#F5F6F7] rounded-lg transition-all active:scale-95 group"
            disabled
            title="Thông báo chưa khả dụng"
            aria-label="Thông báo"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:rotate-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {hasNotification && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0E6B6F] ring-2 ring-white" />
            )}
          </button>

          <button
            type="button"
            className="p-2 text-[#5F6B76] hover:text-[#17212B] hover:bg-[#F5F6F7] rounded-lg transition-all active:scale-95"
            disabled
            title="Trợ giúp chưa khả dụng"
            aria-label="Trợ giúp"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
