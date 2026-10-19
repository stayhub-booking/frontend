"use client";

import { useTransition } from "react";
import { UsersErrorState } from "@/features/admin/users/components/users-data-state";

export default function ErrorPage({ retry }: { retry: () => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <UsersErrorState
      pending={pending}
      onRetry={() => startTransition(() => retry())}
    />
  );
}
