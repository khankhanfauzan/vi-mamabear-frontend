import {AdminUserHeader} from "@/features/admin/users/components/listing/AdminUserHeader";
import {AdminUserList} from "@/features/admin/users/components/listing/AdminUserList";
import {fetchAdminUsers} from "@/features/admin/users/services/adminService";
import React from "react";

// Revalidate 0 ensures we always fetch fresh data on page load for admin features
export const revalidate = 0;

export default async function AdminUsersPage() {
  let initialData;
  let initialHasNextPage = false;

  // Try to fetch initial SSR data to pass to the Client Component
  try {
    const response = await fetchAdminUsers({ page: 1, limit: 10 });
    initialData = response.data;
    initialHasNextPage = response.pagination.hasNextPage;
  } catch (error) {
    // If SSR fetch fails (e.g. auth issue or network error), 
    // the client component will handle fetching and error displaying gracefully
    console.error("[AdminUsersPage] SSR Fetch failed:", error);
  }

  return (
    <main className="page-max-width py-8 px-4 md:px-6 min-h-screen">
      <AdminUserHeader />

      {/* Render the Client-Side list orchestrator */}
      <AdminUserList
        initialData={initialData} 
        initialHasNextPage={initialHasNextPage} 
      />
    </main>
  );
}