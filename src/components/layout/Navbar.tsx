"use client";

import { BottomNav } from "@/components/layout/navigation/BottomNavbar";
import { SidebarMenu } from "@/components/layout/navigation/SidebarMenu";
import { TopNavbar } from "@/components/layout/navigation/TopNavbar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Navbar() {
  const { isLoggedIn, user } = useAuth();

  return (
    <>
      <TopNavbar isLoggedIn={isLoggedIn} user={user} />
      <SidebarMenu />
      <BottomNav isLoggedIn={isLoggedIn} user={user} />
    </>
  );
}
