import {
  fetchAdminUsers,
  updateAdminUserStatus,
  updateAdminUserVerify,
} from "@/features/admin/users/services/adminService";
import {
  AdminUser,
  AdminUserQueryParams,
} from "@/features/admin/users/types/admin.types";
import { useState, useCallback, useEffect, useRef } from "react";

interface UseAdminUsersProps {
  initialData?: AdminUser[];
  initialHasNextPage?: boolean;
}

export function useAdminUsers({
  initialData,
  initialHasNextPage,
}: UseAdminUsersProps = {}) {
  const [users, setUsers] = useState<AdminUser[]>(initialData || []);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage ?? true);

  // Initialize filters with defaults matching your requirements
  const [filters, setFilters] = useState<AdminUserQueryParams>({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 20,
  });

  const isInitialMount = useRef(true);

  const loadUsers = useCallback(
    async (
      fetchPage: number,
      currentFilters: AdminUserQueryParams,
      isAppending: boolean = false,
    ) => {
      try {
        if (!isAppending) setIsLoading(true);
        else setIsFetchingMore(true);
        setError(null);

        const response = await fetchAdminUsers({
          page: fetchPage,
          ...currentFilters,
        });

        setUsers((prev) =>
          isAppending ? [...prev, ...response.data] : response.data,
        );
        setHasNextPage(response.pagination.hasNextPage);
        setPage(response.pagination.page);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memuat data.",
        );
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [],
  );

  // Fetch data when filters change (skip initial mount if we have initialData)
  useEffect(() => {
    if (isInitialMount.current && initialData) {
      isInitialMount.current = false;
      return;
    }

    // Debounce can be implemented here if needed
    const timeoutId = setTimeout(() => {
      loadUsers(1, filters, false);
    }, 300); // Small delay to prevent spamming the API on typing

    return () => clearTimeout(timeoutId);
  }, [filters, loadUsers, initialData]);

  const loadMore = () => {
    if (hasNextPage && !isFetchingMore) {
      loadUsers(page + 1, filters, true);
    }
  };

  const refresh = () => {
    loadUsers(1, filters, false);
  };

  const updateFilters = (newFilters: Partial<AdminUserQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const toggleBlockStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic update: UI changes instantly
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isBlocked: !currentStatus } : u)),
    );
    try {
      await updateAdminUserStatus(id, !currentStatus);
    } catch (err) {
      // Revert if the API call fails
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked: currentStatus } : u)),
      );
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status blokir pengguna.",
      );
    }
  };

  const toggleVerifyStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic update: UI changes instantly
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isVerified: !currentStatus } : u)),
    );
    try {
      await updateAdminUserVerify(id, !currentStatus);
    } catch (err) {
      // Revert if the API call fails
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, isVerified: currentStatus } : u,
        ),
      );
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status verifikasi pengguna.",
      );
    }
  };

  return {
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
    toggleVerifyStatus,
  };
}
