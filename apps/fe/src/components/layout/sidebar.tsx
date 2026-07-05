"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, SIDEBAR_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth.store";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  Warehouse,
  Bell,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = () => {
    auth.logout();
    clearAuth();
    // Full navigation, not router.push: see the login page for why a soft
    // navigation can silently no-op here (stale client router cache entry).
    window.location.href = "/auth/login";
  };

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r bg-background">
      {/* Logo */}
      <Link href="/" className="flex h-16 items-center gap-2.5 border-b px-5">
        <Image src="/logo.png" alt={`${APP_NAME} logo`} width={30} height={30} />
        <span className="font-bold text-primary">
          {APP_NAME}
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {SIDEBAR_LINKS.map(({ href, labelFr, icon }) => {
          const Icon = ICONS[icon];
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {labelFr}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
