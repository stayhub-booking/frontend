// ==========================================
// 1. UsersPageHeading
// ==========================================
export interface UsersPageHeadingProps {
  title?: string;
  description?: string;
  showAddButton?: boolean;
  addButtonLabel?: string;
  addButtonDisabled?: boolean;
  onAddUser?: () => void;
}

export function UsersPageHeading({
  title = "Quản lý người dùng",
  description = "Theo dõi tài khoản, vai trò và trạng thái người dùng trên hệ thống StayHub.",
  showAddButton = true,
  addButtonLabel = "Thêm người dùng",
  addButtonDisabled = false,
  onAddUser,
}: UsersPageHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-[24px] font-semibold text-[#17212B] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[13px] text-[#5F6B76] mt-1">{description}</p>
        )}
      </div>

      {showAddButton && (
        <button
          type="button"
          onClick={onAddUser}
          disabled={addButtonDisabled}
          className="group inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0E6B6F] hover:bg-[#0A5356] text-white text-[13px] font-medium rounded-lg transition-all duration-150 shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] self-start sm:self-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#0E6B6F]/40"
        >
          <svg
            className="w-[18px] h-[18px] transition-transform duration-150 group-hover:rotate-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>{addButtonLabel}</span>
        </button>
      )}
    </div>
  );
}

// ==========================================
// 2. UsersStatusTabs
// ==========================================
export interface TabItem {
  key: string;
  label: string;
  count?: number | string;
  disabled?: boolean;
}

export interface UsersStatusTabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
}

export function UsersStatusTabs({
  tabs,
  activeTab,
  onTabChange,
}: UsersStatusTabsProps) {
  return (
    <div className="relative px-5 border-b border-[#E3E6E9] overflow-x-auto">
      <div className="flex items-center gap-6 relative min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              disabled={tab.disabled}
              onClick={() => onTabChange?.(tab.key)}
              className={`py-3.5 text-[13px] border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors duration-150 ${
                tab.disabled
                  ? "opacity-50 cursor-not-allowed text-[#5F6B76] border-transparent"
                  : isActive
                    ? "text-[#0E6B6F] border-[#0E6B6F] font-semibold cursor-pointer"
                    : "text-[#5F6B76] border-transparent hover:text-[#17212B] font-medium cursor-pointer"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count !== null && (
                <span
                  className={`px-1.5 py-0.5 text-[11px] rounded-full tabular-nums transition-colors ${
                    isActive
                      ? "bg-[#0E6B6F12] text-[#0E6B6F] font-medium"
                      : "bg-[#F5F6F7] text-[#5F6B76] font-normal"
                  }`}
                >
                  {typeof tab.count === "number"
                    ? tab.count.toLocaleString("vi-VN")
                    : tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 3. UsersToolbar
// ==========================================
export interface FilterOption {
  value: string;
  label: string;
}

export interface UsersToolbarProps {
  // Search
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  searchDisabled?: boolean;
  onSearchChange?: (value: string) => void;

  // Role filter
  showRoleFilter?: boolean;
  selectedRole?: string;
  roleOptions?: FilterOption[];
  roleFilterDisabled?: boolean;
  onRoleChange?: (role: string) => void;

  // Date filter
  showDateFilter?: boolean;
  selectedDateRange?: string;
  dateOptions?: FilterOption[];
  dateFilterDisabled?: boolean;
  onDateRangeChange?: (range: string) => void;

  // Sort action
  showSortButton?: boolean;
  sortLabel?: string;
  sortDisabled?: boolean;
  onSortClick?: () => void;

  // Export CSV action
  showExportButton?: boolean;
  exportLabel?: string;
  exportDisabled?: boolean;
  onExportCsv?: () => void;
}

export function UsersToolbar({
  showSearch = true,
  searchValue = "",
  searchPlaceholder = "Tìm theo tên, email hoặc số điện thoại",
  searchDisabled = false,
  onSearchChange,

  showRoleFilter = true,
  selectedRole = "",
  roleOptions = [
    { value: "", label: "Tất cả vai trò" },
    { value: "CUSTOMER", label: "Khách hàng" },
    { value: "HOTEL_OWNER", label: "Chủ khách sạn" },
    { value: "ADMIN", label: "Quản trị viên" },
  ],
  roleFilterDisabled = false,
  onRoleChange,

  showDateFilter = true,
  selectedDateRange = "",
  dateOptions = [
    { value: "", label: "Tất cả thời gian" },
    { value: "7d", label: "7 ngày gần đây" },
    { value: "30d", label: "30 ngày gần đây" },
    { value: "this_year", label: "Năm nay" },
  ],
  dateFilterDisabled = false,
  onDateRangeChange,

  showSortButton = true,
  sortLabel = "Sắp xếp: Mới nhất",
  sortDisabled = false,
  onSortClick,

  showExportButton = true,
  exportLabel = "Xuất CSV",
  exportDisabled = false,
  onExportCsv,
}: UsersToolbarProps) {
  return (
    <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E6E9] bg-white">
      {/* Left filter group */}
      <div className="flex min-w-0 w-full sm:w-auto flex-wrap items-center gap-2.5 flex-1">
        {/* Search box (~320px) */}
        {showSearch && (
          <div className="relative w-full sm:w-[320px] group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B76] group-focus-within:text-[#0E6B6F] transition-colors pointer-events-none">
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchValue}
              disabled={searchDisabled}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13px] bg-white border border-[#E3E6E9] rounded-lg text-[#17212B] placeholder-[#5F6B76] focus:outline-none focus:border-[#0E6B6F] focus:ring-2 focus:ring-[#0E6B6F]/20 transition-all duration-150 hover:border-[#CBD5E1] disabled:bg-[#F5F6F7] disabled:text-[#5F6B76] disabled:cursor-not-allowed"
            />
          </div>
        )}

        {/* Filter: Role */}
        {showRoleFilter && (
          <div className="relative">
            <select
              value={selectedRole}
              disabled={roleFilterDisabled}
              onChange={(e) => onRoleChange?.(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-[13px] bg-white border border-[#E3E6E9] rounded-lg text-[#17212B] focus:outline-none focus:border-[#0E6B6F] focus:ring-2 focus:ring-[#0E6B6F]/20 hover:border-[#CBD5E1] cursor-pointer transition-all duration-150 disabled:bg-[#F5F6F7] disabled:text-[#5F6B76] disabled:cursor-not-allowed"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6B76] pointer-events-none">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        )}

        {/* Filter: Date */}
        {showDateFilter && (
          <div className="relative">
            <select
              value={selectedDateRange}
              disabled={dateFilterDisabled}
              onChange={(e) => onDateRangeChange?.(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-[13px] bg-white border border-[#E3E6E9] rounded-lg text-[#17212B] focus:outline-none focus:border-[#0E6B6F] focus:ring-2 focus:ring-[#0E6B6F]/20 hover:border-[#CBD5E1] cursor-pointer transition-all duration-150 disabled:bg-[#F5F6F7] disabled:text-[#5F6B76] disabled:cursor-not-allowed"
            >
              {dateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6B76] pointer-events-none">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        )}
      </div>

      {/* Right action group */}
      <div className="flex items-center gap-2">
        {showSortButton && (
          <button
            type="button"
            onClick={onSortClick}
            disabled={sortDisabled}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#17212B] bg-white border border-[#E3E6E9] rounded-lg hover:bg-[#F5F6F7] hover:border-[#CBD5E1] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 text-[#5F6B76]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 16 4 4 4-4" />
              <path d="M7 20V4" />
              <path d="m21 8-4-4-4 4" />
              <path d="M17 4v16" />
            </svg>
            <span>{sortLabel}</span>
          </button>
        )}

        {showExportButton && (
          <button
            type="button"
            onClick={onExportCsv}
            disabled={exportDisabled}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#17212B] bg-white border border-[#E3E6E9] rounded-lg hover:bg-[#F5F6F7] hover:border-[#CBD5E1] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 text-[#5F6B76]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{exportLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. UsersBulkActions
// ==========================================
export interface UsersBulkActionsProps {
  selectedCount: number;
  isVisible?: boolean;
  resendDisabled?: boolean;
  lockDisabled?: boolean;
  onResendVerification?: () => void;
  onLockAccounts?: () => void;
}

export function UsersBulkActions({
  selectedCount,
  isVisible = true,
  resendDisabled = false,
  lockDisabled = false,
  onResendVerification,
  onLockAccounts,
}: UsersBulkActionsProps) {
  if (!isVisible || selectedCount <= 0) {
    return null;
  }

  return (
    <div className="overflow-hidden transition-all duration-200">
      <div className="px-5 py-2.5 bg-[#E6F4F5] border-b border-[#0E6B6F20] flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <div className="flex items-center gap-2 text-[#0E6B6F] font-medium">
          <svg
            className="w-[18px] h-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>
            Đã chọn{" "}
            <strong className="font-semibold tabular-nums">
              {selectedCount}
            </strong>{" "}
            tài khoản
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={resendDisabled}
            onClick={onResendVerification}
            className="px-3 py-1.5 text-[12px] font-medium bg-white text-[#17212B] border border-[#E3E6E9] rounded-lg hover:bg-[#F5F6F7] hover:border-[#CBD5E1] active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gửi lại email xác thực
          </button>

          <button
            type="button"
            disabled={lockDisabled}
            onClick={onLockAccounts}
            className="px-3 py-1.5 text-[12px] font-medium bg-[#FDECEA] text-[#B42318] border border-[#B4231830] rounded-lg hover:bg-[#FCDAD6] active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Khóa tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}
