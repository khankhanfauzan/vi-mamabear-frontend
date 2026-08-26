"use client";

import React from "react";
import { useAdminUsers } from "../../hooks/useAdmin";
import { AdminUserCard, AdminUserSkeleton } from "./AdminUserCard";
import { AdminUser, UserRole, AdminUserQueryParams } from "../../types/admin.types";
import { AlertCircle, Users, Loader2, Search } from "lucide-react";

interface AdminUserListProps {
  initialData?: AdminUser[];
  initialHasNextPage?: boolean;
}

export function AdminUserList({ initialData, initialHasNextPage }: AdminUserListProps) {
  const { 
    users, 
    isLoading, 
    isFetchingMore, 
    error, 
    hasNextPage,
    filters, 
    loadMore, 
    refresh,
    updateFilters,
    toggleBlockStatus,
    toggleVerifyStatus
  } = useAdminUsers({ initialData, initialHasNextPage });

  const handleEdit = (user: AdminUser) => {
    console.log("Edit requested for:", user.id);
  };

  const handleToggleBlock = async (user: AdminUser) => {
    await toggleBlockStatus(user.id, user.isBlocked);
  };

  const handleToggleVerify = async (user: AdminUser) => {
    await toggleVerifyStatus(user.id, user.isVerified);
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-[--mama-hot-pink] focus:border-[--mama-hot-pink] sm:text-sm transition-colors"
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-[--mama-hot-pink] focus:border-[--mama-hot-pink] outline-none"
              value={filters.role || ""}
              onChange={(e) => updateFilters({ role: e.target.value as UserRole | "" })}
            >
              <option value="">Semua Peran</option>
              <option value="SUPERADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-[--mama-hot-pink] focus:border-[--mama-hot-pink] outline-none"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              updateFilters({ 
                sortBy: sortBy as AdminUserQueryParams["sortBy"], 
                sortOrder: sortOrder as AdminUserQueryParams["sortOrder"] 
              });
            }}
          >
            <option value="createdAt-desc">Terbaru</option>
            <option value="createdAt-asc">Terlama</option>
            <option value="name-asc">Nama (A-Z)</option>
            <option value="name-desc">Nama (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && !users.length && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-2xl border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-font-h4 font-bold text-red-800 mb-2">Gagal Memuat Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && !users.length ? (
          Array.from({ length: 6 }).map((_, i) => <AdminUserSkeleton key={i} />)
        ) : (
          users.map((user) => (
            <AdminUserCard 
              key={user.id} 
              user={user} 
              onEdit={handleEdit} 
              onToggleBlock={handleToggleBlock}
              onToggleVerify={handleToggleVerify}
            />
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && users.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <Users className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-font-h4 font-bold text-gray-700 mb-1">Pencarian Tidak Ditemukan</h3>
          <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter Anda.</p>
        </div>
      )}

      {/* Pagination Load More */}
      {hasNextPage && users.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={isFetchingMore}
            className="flex items-center gap-2 px-6 py-3 bg-[--mama-brown] text-white font-semibold rounded-full hover:bg-opacity-90 disabled:opacity-70 transition-all shadow-sm"
          >
            {isFetchingMore && <Loader2 className="w-4 h-4 animate-spin" />}
            {isFetchingMore ? "Memuat..." : "Muat Lebih Banyak"}
          </button>
        </div>
      )}
    </div>
  );
}