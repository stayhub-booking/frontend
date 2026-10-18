export interface UsersPaginationProps {
  // Range & Counts
  totalElements?: number;
  currentPage?: number; // 1-indexed
  pageSize?: number;
  startItem?: number;
  endItem?: number;

  // Controls visibility
  showInfo?: boolean;
  showPageSizeSelector?: boolean;
  showPageButtons?: boolean;

  // Page size selector
  pageSizeOptions?: number[];
  pageSizeDisabled?: boolean;
  onPageSizeChange?: (size: number) => void;

  // Pages buttons
  totalPages?: number;
  pages?: Array<number | "...">;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
}

function generateDefaultPages(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage, "...", totalPages];
}

export function UsersPagination({
  totalElements = 0,
  currentPage = 1,
  pageSize = 20,
  startItem,
  endItem,

  showInfo = true,
  showPageSizeSelector = true,
  showPageButtons = true,

  pageSizeOptions = [20, 50, 100],
  pageSizeDisabled = false,
  onPageSizeChange,

  totalPages = 0,
  pages,
  disabled = false,
  onPageChange,
}: UsersPaginationProps) {
  const computedStart =
    startItem !== undefined
      ? startItem
      : totalElements === 0
        ? 0
        : (currentPage - 1) * pageSize + 1;

  const computedEnd =
    endItem !== undefined
      ? endItem
      : Math.min(currentPage * pageSize, totalElements);

  const renderedPages =
    pages || generateDefaultPages(currentPage, Math.max(1, totalPages));

  const canPrevious = currentPage > 1 && !disabled;
  const canNext = currentPage < totalPages && !disabled;

  return (
    <div className="p-4 border-t border-[#E3E6E9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[13px] text-[#5F6B76] bg-white">
      {/* Left Info & Page size selector */}
      <div className="flex flex-wrap items-center gap-3">
        {showInfo && (
          <span>
            Hiển thị{" "}
            <span className="text-[#17212B] font-medium tabular-nums">
              {computedStart.toLocaleString("vi-VN")}–
              {computedEnd.toLocaleString("vi-VN")}
            </span>{" "}
            trong{" "}
            <span className="text-[#17212B] font-medium tabular-nums">
              {totalElements.toLocaleString("vi-VN")}
            </span>{" "}
            tài khoản
          </span>
        )}

        {showPageSizeSelector && (
          <div className="relative">
            <select
              value={pageSize}
              disabled={pageSizeDisabled || disabled}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="appearance-none pl-2.5 pr-7 py-1 text-[12px] bg-white border border-[#E3E6E9] rounded-lg text-[#17212B] focus:outline-none focus:border-[#0E6B6F] focus:ring-1 focus:ring-[#0E6B6F] hover:border-[#CBD5E1] cursor-pointer transition-colors disabled:bg-[#F5F6F7] disabled:text-[#5F6B76] disabled:cursor-not-allowed"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / trang
                </option>
              ))}
            </select>
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#5F6B76] pointer-events-none">
              <svg
                className="w-3.5 h-3.5"
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

      {/* Right Pagination Buttons */}
      {showPageButtons && (
        <div className="flex items-center gap-1 self-center sm:self-auto">
          {/* Previous Button */}
          <button
            type="button"
            aria-label="Trang trước"
            disabled={!canPrevious}
            onClick={() => canPrevious && onPageChange?.(currentPage - 1)}
            className={`w-8 h-8 rounded-lg border border-[#E3E6E9] flex items-center justify-center transition-all ${
              canPrevious
                ? "text-[#17212B] hover:bg-[#F5F6F7] hover:border-[#CBD5E1] active:scale-95 cursor-pointer"
                : "text-[#5F6B76] opacity-40 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Page Numbers & Ellipsis */}
          {renderedPages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-6 text-center text-[#5F6B76] tabular-nums select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                disabled={disabled}
                aria-current={isActive ? "page" : undefined}
                onClick={() => !disabled && onPageChange?.(page)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] tabular-nums transition-all ${
                  isActive
                    ? "bg-[#0E6B6F1A] text-[#0E6B6F] font-semibold shadow-2xs cursor-default"
                    : disabled
                      ? "text-[#5F6B76] opacity-40 cursor-not-allowed"
                      : "text-[#17212B] font-medium hover:bg-[#F5F6F7] active:scale-95 cursor-pointer"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            type="button"
            aria-label="Trang sau"
            disabled={!canNext}
            onClick={() => canNext && onPageChange?.(currentPage + 1)}
            className={`w-8 h-8 rounded-lg border border-[#E3E6E9] flex items-center justify-center transition-all ${
              canNext
                ? "text-[#17212B] hover:bg-[#F5F6F7] hover:border-[#CBD5E1] active:scale-95 cursor-pointer"
                : "text-[#5F6B76] opacity-40 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
