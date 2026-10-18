import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/features/auth/server/get-current-admin";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <section className="space-y-3">
      <h1>Trang quản trị</h1>
      <p>Xin chào {admin.fullName}</p>
      <p>{admin.email}</p>
      <Link
        href="/admin/users"
        className="inline-block rounded-lg bg-[#0E6B6F] px-4 py-2 text-sm text-white"
      >
        Quản lý người dùng
      </Link>
    </section>
  );
}
