"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface UserActionsMenuProps {
  userId: string;
  isOpen?: boolean;
  onToggle?: (userId: string) => void;
  onViewDetail?: (userId: string) => void;
  onChangeRole?: (userId: string) => void;
  onChangeStatus?: (userId: string) => void;
  onResendVerification?: (userId: string) => void;
  onLockAccount?: (userId: string) => void;
}

export function UserActionsMenu({
  userId,
  isOpen = false,
  onToggle,
  onViewDetail,
  onChangeRole,
  onChangeStatus,
  onResendVerification,
  onLockAccount,
}: UserActionsMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const actions = [
    { label: "Xem chi tiết", handler: onViewDetail },
    { label: "Đổi vai trò", handler: onChangeRole },
    { label: "Cập nhật trạng thái", handler: onChangeStatus },
    { label: "Gửi lại email xác thực", handler: onResendVerification },
    { label: "Khóa tài khoản", handler: onLockAccount, destructive: true },
  ].filter((action) => action.handler);

  function toggle() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const height = actions.length * 40 + 12;
      setPosition({
        top:
          rect.bottom + height > window.innerHeight
            ? Math.max(8, rect.top - height)
            : rect.bottom + 4,
        left: Math.max(8, Math.min(rect.right - 224, window.innerWidth - 232)),
      });
    }
    onToggle?.(userId);
  }

  useEffect(() => {
    if (!isOpen) return;
    menuRef.current
      ?.querySelector<HTMLButtonElement>("button")
      ?.focus({ preventScroll: true });
    const close = () => onToggle?.(userId);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      )
        close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
      }
      if (event.key === "Tab") close();
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const buttons = Array.from(
          menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
        );
        if (!buttons.length) return;
        const index = buttons.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        buttons[
          (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) %
            buttons.length
        ]?.focus();
      }
    };
    const onScroll = (event: Event) => {
      if (!menuRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", close);
    window.addEventListener("wheel", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", onScroll, {
      passive: true,
      capture: true,
    });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("wheel", onScroll, true);
      window.removeEventListener("touchmove", onScroll, true);
    };
  }, [isOpen, onToggle, userId]);

  if (!actions.length) return null;
  return (
    <div className="inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Thao tác"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !isOpen) {
            event.preventDefault();
            toggle();
          }
        }}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-[#5F6B76] transition-colors hover:bg-[#E3E6E9]/60 focus-visible:outline-2 focus-visible:outline-[#0E6B6F]"
      >
        <svg
          aria-hidden="true"
          className="h-[18px] w-[18px]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="5" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="12" cy="19" r="1.75" />
        </svg>
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label="Thao tác người dùng"
            style={position}
            className="fixed z-[80] w-56 rounded-lg border border-[#E3E6E9] bg-white py-1.5 text-left shadow-lg"
          >
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  onToggle?.(userId);
                  action.handler?.(userId);
                }}
                className={
                  "block w-full px-4 py-2.5 text-left text-sm focus-visible:outline-2 focus-visible:outline-[#0E6B6F] " +
                  (action.destructive
                    ? "text-[#B42318] hover:bg-[#FDECEA]"
                    : "text-[#17212B] hover:bg-[#F5F6F7]")
                }
              >
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
