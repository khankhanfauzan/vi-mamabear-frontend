"use client";

import React from 'react';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import { AdminOrderFilters } from './AdminOrderFilters';
import { AdminOrderTable } from './AdminOrderTable';
import { AdminOrderPagination } from './AdminOrderPagination';

export function AdminOrderListing() {
  const {
    orders,
    isLoading,
    error,
    isExporting,
    searchInput,
    setSearchInput,
    currentStatus,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    updateUrlParams,
    currentPage,
    totalPages,
    updateStatus,
    handleExportCSV
  } = useAdminOrders();

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-2">
        <h1 className="text-font-5 md:text-font-6 font-bold text-[var(--mama-brown)]">
          Pesanan
        </h1>
        <p className="text-font-2 md:text-font-3 text-[var(--color-gray)]">
          Kelola dan lacak pesanan pelanggan
        </p>
      </div>

      {/* Filter Options */}
      <AdminOrderFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        currentStatus={currentStatus}
        sortBy={sortBy}
        sortOrder={sortOrder}
        startDate={startDate}
        endDate={endDate}
        updateUrlParams={updateUrlParams}
        onExport={handleExportCSV}
        isExporting={isExporting}
      />

      {/* Main Table and Pagination Content */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <AdminOrderTable
            orders={orders}
            isLoading={isLoading}
            onUpdateStatus={updateStatus}
          />

          {!isLoading && orders.length > 0 && (
            <AdminOrderPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => updateUrlParams('page', page.toString())}
            />
          )}
        </div>
      )}
    </div>
  );
}