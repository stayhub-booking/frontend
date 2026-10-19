"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "./admin-shell";
import type { AdminUserSummary } from "./admin-sidebar";

export function AdminLayoutClient({
  children,
  admin,
}: {
  children: ReactNode;
  admin: AdminUserSummary;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isUsers = pathname.startsWith("/admin/users");

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    const sidebar = document.getElementById("admin-sidebar");
    sidebar?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
      if (event.key !== "Tab") return;
      const items = sidebar?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href]",
      );
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [mobileMenuOpen]);

  return (
    <AdminShell
      admin={admin}
      activeKey={isUsers ? "users" : "overview"}
      breadcrumbs={[
        { label: "Quản trị", href: "/admin" },
        { label: isUsers ? "Người dùng" : "Tổng quan", current: true },
      ]}
      mobileMenuOpen={mobileMenuOpen}
      onOpenMobileMenu={() => setMobileMenuOpen(true)}
      onCloseMobileMenu={() => setMobileMenuOpen(false)}
      onNavigate={(key) => {
        const href =
          key === "users"
            ? "/admin/users"
            : key === "overview"
              ? "/admin"
              : null;
        if (href) {
          setMobileMenuOpen(false);
          router.push(href);
        }
      }}
    >
      {children}
    </AdminShell>
  );
}
