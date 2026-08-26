"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  BarChart,
  Settings,
  ExternalLink,
  LogOut,
  X,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

// 1. Define Types for Navigation
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[]; // Array of allowed roles. If undefined, visible to all.
}

// 2. Navigation Data (Indonesian UI Text)
const MAIN_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Produk", href: "/admin/products", icon: Package },
  { title: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
  { title: "Kategori", href: "/admin/categories", icon: FolderTree },
  { title: "Pelanggan", href: "/admin/customers", icon: Users },
  { title: "Manajemen Admin", href: "/admin/users", icon: Shield, roles: ["SUPERADMIN"] },
  { title: "Laporan", href: "/admin/reports", icon: BarChart },
  { title: "Pengaturan", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  
  // Fetch session to determine user role
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role;

  // Close sidebar automatically ONLY when the route actually changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      onClose();
      prevPathname.current = pathname;
    }
  }, [pathname, onClose]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Sub-component for the sidebar inner content to avoid repeating logic
  const SidebarContent = () => (
    <div className="flex h-full w-[var(--sidebar-width)] flex-col border-r border-[var(--mama-pink)] bg-[#fcfafa] font-quicksand">
      {/* Header / Logo Section */}
      <div className="flex items-center justify-between border-b border-[var(--mama-pink)] px-6 h-16">
        <div className="flex items-center gap-4">
          {/* Logo*/}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white shadow-sm">
            <Link href="/admin/dashboard" className="shrink-0">
              <Image
                src="/images/layout/logo.png"
                alt="Mamabear Logo"
                width={50}
                height={50}
                className="lg:w-[60px] lg:h-[60px]"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* Title */}
          <div className="flex flex-col leading-tight">
            <span className="text-font-3 font-bold text-[var(--mama-hot-pink)]">
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden text-[var(--mama-brown)] hover:text-[var(--mama-hot-pink)] transition-colors"
          aria-label="Tutup Menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
        {MAIN_NAV_ITEMS
          .filter((item) => !item.roles || (userRole && item.roles.includes(userRole)))
          .map((item) => {
            // Check if current route matches to apply active styling
            const isActive =
              pathname?.startsWith(item.href) ||
              // Fallback for visual testing if pathname is empty
              (pathname === "/" && item.href === "/admin/products");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--mama-hot-pink)] text-white shadow-sm"
                    : "text-[var(--mama-brown)] hover:bg-[var(--mama-pink)] hover:bg-opacity-50"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${isActive ? "text-white" : "text-[var(--mama-brown)] group-hover:text-[var(--mama-hot-pink)]"}`}
                  strokeWidth={2}
                />
                <span className="text-font-3 font-semibold">{item.title}</span>
              </Link>
            );
          })}
      </nav>

      {/* Bottom Action Links */}
      <div className="border-t border-[var(--mama-pink)] px-4 py-4 space-y-1.5">
        <Link
          href="/"
          target="_blank"
          className="group flex items-center gap-4 rounded-xl px-4 py-3 text-[var(--mama-brown)] transition-colors hover:bg-[var(--mama-pink)] hover:bg-opacity-50"
        >
          <ExternalLink
            className="h-5 w-5 group-hover:text-[var(--mama-hot-pink)]"
            strokeWidth={2}
          />
          <span className="text-font-3 font-semibold">Lihat Situs Web</span>
        </Link>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-[var(--mama-hot-pink)] transition-colors hover:bg-[var(--mama-pink)] hover:bg-opacity-50"
        >
          <LogOut className="h-5 w-5" strokeWidth={2} />
          <span className="text-font-3 font-semibold">Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay (Darkens background when menu is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Wrapper */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}