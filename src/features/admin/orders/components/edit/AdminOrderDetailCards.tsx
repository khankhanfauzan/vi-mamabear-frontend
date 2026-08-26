"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Check, X, AlertTriangle } from "lucide-react";
import {
  OrderDetail,
  OrderStatus,
} from "@/features/admin/orders/types/adminOrder.types";
import { ORDER_STATUS_OPTIONS } from "@/features/admin/orders/utils/orderStatus";

export function AdminOrderCustomerCard({ order }: { order: OrderDetail }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
      <h3 className="text-font-3 font-bold text-[var(--mama-brown)] mb-2">
        Pelanggan
      </h3>
      <p className="text-font-2 text-[var(--color-gray)] font-medium">
        {order.user?.name || "Customer"}
      </p>
      <p className="text-sm text-[var(--color-light-gray)]">
        {order.user?.email || "N/A"}
      </p>
      <p className="text-sm text-[var(--color-light-gray)]">
        {order.user?.phone || "N/A"}
      </p>

      {order.notes && (
        <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col gap-1">
          <span className="text-xs font-semibold text-[var(--color-light-gray)]">
            Catatan Pesanan:
          </span>
          <p className="text-sm text-[var(--color-gray)] bg-yellow-50 p-3 rounded border border-yellow-100 whitespace-pre-wrap">
            {order.notes}
          </p>
        </div>
      )}
    </div>
  );
}

export function AdminOrderAddressCard({ order }: { order: OrderDetail }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
      <h3 className="text-font-3 font-bold text-[var(--mama-brown)] mb-2">
        Alamat Pengiriman
      </h3>
      <p className="text-font-2 text-[var(--color-gray)] leading-relaxed">
        {order.shippingAddress?.completeAddress ||
          "No address details available."}
      </p>
      {order.shippingAddress?.detail && (
        <p className="text-sm text-[var(--color-light-gray)] mt-1">
          Catatan: {order.shippingAddress.detail}
        </p>
      )}
    </div>
  );
}

interface DeliveryCardProps {
  order: OrderDetail;
  isUpdatingTracking: boolean;
  onUpdateTracking: (trackingNumber: string) => Promise<void>;
}

export function AdminOrderDeliveryCard({
  order,
  isUpdatingTracking,
  onUpdateTracking,
}: DeliveryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [trackingVal, setTrackingVal] = useState(order.trackingNumber || "");

  useEffect(() => {
    setTrackingVal(order.trackingNumber || "");
  }, [order.trackingNumber]);

  const handleSave = async () => {
    await onUpdateTracking(trackingVal);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
      <h3 className="text-font-3 font-bold text-[var(--mama-brown)]">
        Pengiriman
      </h3>

      <div className="flex justify-between items-center text-sm">
        <span className="text-[var(--color-light-gray)]">Metode</span>
        <span className="text-[var(--color-gray)] font-medium">
          {order.courierName || "N/A"}{" "}
          {order.shippingMethod ? `- ${order.shippingMethod}` : ""}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-sm border-t border-gray-100 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-light-gray)]">No. Resi</span>
          {!isEditing && (
            <span className="text-[var(--color-gray)] font-bold">
              {order.trackingNumber || "Belum tersedia"}
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={trackingVal}
              onChange={(e) => setTrackingVal(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--mama-hot-pink)]"
              placeholder="Masukkan nomor resi..."
              disabled={isUpdatingTracking}
            />
            <button
              onClick={handleSave}
              disabled={isUpdatingTracking}
              className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setTrackingVal(order.trackingNumber || "");
                setIsEditing(false);
              }}
              disabled={isUpdatingTracking}
              className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          order.status !== "CANCELLED" && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-[var(--mama-hot-pink)] mt-1 flex items-center gap-1 hover:underline cursor-pointer justify-end"
            >
              <Edit2 className="w-3 h-3" />{" "}
              {order.trackingNumber ? "Ubah Nomor Resi" : "Input Nomor Resi"}
            </button>
          )
        )}
      </div>
    </div>
  );
}

interface SidebarCardsProps {
  order: OrderDetail;
  isUpdatingStatus: boolean;
  isCancelling: boolean;
  onUpdateStatus: (status: OrderStatus) => void;
  onCancelOrder: (reason?: string) => Promise<void>;
}

export function AdminOrderActionsCard({
  order,
  isUpdatingStatus,
  isCancelling,
  onUpdateStatus,
  onCancelOrder,
}: SidebarCardsProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    setSelectedStatus(order.status);
  }, [order.status]);

  const handleUpdate = () => {
    if (selectedStatus !== order.status) {
      onUpdateStatus(selectedStatus);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCancelOrder(cancelReason);
    setShowCancelForm(false);
    setCancelReason("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
      <h3 className="text-font-3 font-bold text-[var(--mama-brown)]">
        Aksi Pesanan
      </h3>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-font-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--mama-hot-pink)] cursor-pointer disabled:opacity-50"
        disabled={
          isUpdatingStatus || isCancelling || order.status === "CANCELLED"
        }
      >
        {ORDER_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={
          isUpdatingStatus ||
          isCancelling ||
          selectedStatus === order.status ||
          order.status === "CANCELLED"
        }
        className="w-full bg-[var(--mama-hot-pink)] text-white py-2.5 rounded-lg text-font-2 font-bold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
      >
        {isUpdatingStatus ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Perbarui Status"
        )}
      </button>

      {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
        <div className="border-t border-gray-100 pt-4 mt-2">
          {!showCancelForm ? (
            <button
              onClick={() => setShowCancelForm(true)}
              className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <AlertTriangle className="w-4 h-4" /> Batalkan Pesanan
            </button>
          ) : (
            <form
              onSubmit={handleCancelSubmit}
              className="flex flex-col gap-3 mt-2"
            >
              <span className="text-xs font-semibold text-red-600">
                Alasan Pembatalan:
              </span>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tulis alasan (cth: Stok habis)..."
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                required
                disabled={isCancelling}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isCancelling}
                  className="flex-1 bg-red-600 text-white text-xs font-bold py-1.5 rounded hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isCancelling ? "Memproses..." : "Ya, Batalkan"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelForm(false)}
                  disabled={isCancelling}
                  className="flex-1 border border-gray-300 text-gray-700 text-xs font-semibold py-1.5 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
