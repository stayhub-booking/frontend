export function UsersTableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Đang tải danh sách người dùng"
      className="space-y-5 bg-white p-6 motion-safe:animate-pulse"
    >
      <span className="sr-only">Đang tải danh sách người dùng…</span>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-36 rounded bg-slate-200" />
            <div className="h-3 w-48 max-w-full rounded bg-slate-100" />
          </div>
          <div className="h-5 w-24 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export function UsersErrorState({
  onRetry,
  pending = false,
}: {
  onRetry: () => void;
  pending?: boolean;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-[#E3E6E9] bg-white p-10 text-center"
    >
      <h2 className="font-semibold text-[#17212B]">
        Không tải được danh sách người dùng
      </h2>
      <p className="mt-2 text-sm text-[#5F6B76]">
        Vui lòng kiểm tra kết nối và thử lại.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={onRetry}
        className="mt-5 rounded-lg bg-[#0E6B6F] px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? "Đang tải…" : "Tải lại dữ liệu"}
      </button>
    </div>
  );
}
