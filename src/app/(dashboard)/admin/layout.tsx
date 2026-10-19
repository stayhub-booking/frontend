import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentAdmin } from "@/features/auth/server/get-current-admin";
import { AdminLayoutClient } from "@/features/admin/shell/components/admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.status !== "ACTIVE") redirect("/admin/login");
  return (
    <AdminLayoutClient
      admin={{
        fullName: admin.fullName,
        email: admin.email,
        avatarUrl: admin.avatarUrl,
        roleName: "Quản trị viên",
      }}
    >
      {children}
    </AdminLayoutClient>
  );
}
