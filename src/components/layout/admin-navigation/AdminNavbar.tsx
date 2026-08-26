"use client";

import React, { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import AdminSidebar from "./AdminSidebar";

export default function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch session data
  const { data: session, status } = useSession();

  // Extract user details from the session, with fallbacks
  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "admin@store.com";

  return (
    <>
      {/* Sidebar Component Controlled by Navbar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--mama-pink)] bg-white px-4 shadow-sm lg:justify-end lg:px-6">
        {/* Left side: Hamburger (Mobile Only) */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md p-2 text-[var(--mama-brown)] transition-colors hover:bg-[var(--mama-pink)] hover:bg-opacity-50 hover:text-[var(--mama-hot-pink)]"
            aria-label="Buka Menu"
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>

        {/* Right side: Notifications & Avatar */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <button
            className="relative rounded-full p-2 text-[var(--mama-brown)] transition-colors hover:bg-[var(--mama-pink)] hover:bg-opacity-50 hover:text-[var(--mama-hot-pink)]"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            {/* Notification Dot */}
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--mama-hot-pink)]"></span>
          </button>

          {/* User Profile */}
          <div
            className="ml-2 flex items-center cursor-pointer group"
            aria-label="Profil Pengguna"
          >
            {/* User Avatar */}
            {status === "loading" ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mama-hot-pink)] text-font-3 font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* User Details (Desktop Only) */}
            <div className="hidden flex-col ml-3 md:flex justify-center">
              {status === "loading" ? (
                <>
                  <div className="mb-1 h-4 w-24 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-3 w-32 animate-pulse rounded-md bg-gray-200" />
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-[var(--mama-brown)] leading-tight transition-colors group-hover:text-[var(--mama-hot-pink)]">
                    {userName}
                  </span>
                  <span className="text-xs text-[var(--color-gray)] leading-tight mt-0.5">
                    {userEmail}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
