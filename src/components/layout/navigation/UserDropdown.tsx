"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, LogOut, Package, LogIn, UserPlus } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserDropdownProps {
  isLoggedIn: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Helper to generate initials from a name (e.g., "John Doe" -> "JD")
 */
function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserDropdown({
  isLoggedIn,
  user,
  children,
  className,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = async () => {
    closeDropdown();
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className="relative z-[61] cursor-pointer"
        aria-expanded={isOpen}
      >
        {children ? (
          children
        ) : isLoggedIn ? (
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-[var(--mama-hot-pink)] font-bold border-2 border-white shadow-sm hover:shadow-md transition-all ring-2 ring-transparent hover:ring-pink-200"
          >
            {getInitials(user?.name)}
          </button>
        ) : (
          <button
            type="button"
            className="text-[var(--mama-brown)] hover:bg-[color-mix(in_srgb,var(--mama-brown),transparent_90%)] p-2 rounded-md transition-all"
          >
            <User className="w-8 h-8" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-60 cursor-default bg-transparent"
          onClick={closeDropdown}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <div
          className={`absolute z-[61] w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right ${className || "right-0 mt-2"}`}
        >
          {isLoggedIn && user ? (
            <div className="px-4 py-3 mb-1">
              <p className="text-sm font-bold text-stone-800 truncate">
                {user.name || "User"}
              </p>
            </div>
          ) : (
            <div className="px-4 py-2 mb-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Akun Saya
              </span>
            </div>
          )}

          <div className="h-px bg-stone-100 mx-2 mb-1" />

          {isLoggedIn ? (
            <div className="flex flex-col">
              <Link
                href="/account/info"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-pink-50 hover:text-primary transition-colors"
                onClick={closeDropdown}
              >
                <User className="w-4 h-4" />
                Profil Saya
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-pink-50 hover:text-primary transition-colors"
                onClick={closeDropdown}
              >
                <Package className="w-4 h-4" />
                Pesanan
              </Link>
              <div className="h-px bg-stone-100 mx-2 my-1" />
              <button
                type="button"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors w-full text-left font-semibold"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[var(--mama-hot-pink)] hover:bg-pink-50 transition-colors"
                onClick={closeDropdown}
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-pink-50 transition-colors"
                onClick={closeDropdown}
              >
                <UserPlus className="w-4 h-4" />
                Daftar Akun Baru
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}