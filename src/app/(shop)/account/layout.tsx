import { AccountSidebar } from "@/components/layout/AccountSidebar";
import React from "react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto page-max-width py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Sidebar Menu */}
          <AccountSidebar />

          {/* Right Content Area */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
