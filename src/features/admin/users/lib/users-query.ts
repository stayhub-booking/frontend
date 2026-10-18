export type UsersQuery = { page: number; size: number; sort: string };
type SearchValue = string | string[] | undefined;

function first(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseUsersQuery(
  query: Record<string, SearchValue>,
): UsersQuery {
  const rawPage = first(query.page) ?? "0";
  const page = /^\d+$/.test(rawPage) ? Number(rawPage) : 0;
  const size = Number(first(query.size) ?? 20);
  const sort = first(query.sort);
  return {
    page: Number.isSafeInteger(page) && page <= 1_000_000 ? page : 0,
    size: [20, 50, 100].includes(size) ? size : 20,
    sort: sort === "createdAt,asc" ? sort : "createdAt,desc",
  };
}

export function usersHref(query: UsersQuery): string {
  return (
    "/admin/users?" +
    new URLSearchParams({
      page: String(query.page),
      size: String(query.size),
      sort: query.sort,
    }).toString()
  );
}
