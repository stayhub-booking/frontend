import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/features/auth/server/get-current-admin";
import { getAdminUsers } from "@/features/admin/users/server/get-admin-users";
import { UsersPageClient } from "@/features/admin/users/components/users-page-client";
import {
  parseUsersQuery,
  usersHref,
} from "@/features/admin/users/lib/users-query";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [admin, rawQuery] = await Promise.all([
    getCurrentAdmin(),
    searchParams,
  ]);
  if (!admin || admin.status !== "ACTIVE") redirect("/admin/login");
  const query = parseUsersQuery(rawQuery);
  const usersPage = await getAdminUsers(query);
  if (query.page > 0 && query.page >= usersPage.totalPages) {
    redirect(
      usersHref({ ...query, page: Math.max(0, usersPage.totalPages - 1) }),
    );
  }
  return (
    <UsersPageClient
      key={[usersPage.page, usersPage.size, query.sort].join(":")}
      actorId={admin.id}
      usersPage={usersPage}
      query={query}
    />
  );
}
