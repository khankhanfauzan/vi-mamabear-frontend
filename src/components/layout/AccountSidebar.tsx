"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User, MapPin, Package, LogOut } from "lucide-react";
import Image from "next/image";

// Helper to generate initials from name
function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  // Determine if we are on a sub-route (mobile needs to hide sidebar if so)
  const isRootAccountPage = pathname === "/account";

  const navItems = [
    {
      name: "Informasi Akun",
      href: "/account/info", // Changed from /account to /account/info to differentiate from the root menu
      icon: User,
    },
    {
      name: "Buku Alamat",
      href: "/account/addresses",
      icon: MapPin,
    },
    {
      name: "Pesanan Saya",
      href: "/account/orders",
      icon: Package,
    },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // If on mobile AND not on the root account page, hide the sidebar entirely
  // On desktop (md:block), always show it
  return (
    <aside
      className={`w-full md:w-[280px] shrink-0 ${
        !isRootAccountPage ? "hidden md:block" : "block"
      }`}
    >
      <div className="flex flex-col gap-6 sticky top-24">
        {/* User Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-stone-200">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-pink-100 flex items-center justify-center shrink-0 border border-pink-200">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[var(--mama-hot-pink)]">
                {getInitials(user?.name)}
              </span>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-[var(--mama-brown)] truncate text-font-2">
              {user?.name || "Pengguna MamaBear"}
            </span>
            <span className="text-sm text-stone-500 truncate">
              {user?.email || "Email tidak tersedia"}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-full transition-all font-semibold border ${
                  isActive
                    ? "bg-[var(--mama-hot-pink)] text-white border-[var(--mama-hot-pink)] shadow-md hidden md:flex" // Hide active item on mobile since we shouldn't be here
                    : "bg-white border-stone-200 text-stone-600 hover:border-[var(--mama-hot-pink)] hover:text-[var(--mama-hot-pink)]"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}

          <div className="h-px bg-stone-200 my-2" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-full transition-all font-bold bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut size={20} strokeWidth={2.5} />
            Keluar
          </button>
        </nav>
      </div>
    </aside>
  );
}
