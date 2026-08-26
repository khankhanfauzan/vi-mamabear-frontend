import React, { useState, useEffect, useRef } from "react";
import { Edit, MoreVertical, ImageIcon, Copy, Trash2 } from "lucide-react";
import type { Product } from "@/features/products/types/products.types";
import { formatIDR } from "@/features/admin/products/utils/formatUtils";
import Link from "next/link";

export interface ProductTableRowProps {
  product: Product;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * ProductTableRow
 * Represents a single product entity row.
 */
export function ProductTableRow({
  product,
  isSelected,
  onToggle,
  onDuplicate,
  onDelete,
}: ProductTableRowProps) {
  const stock = product.variants?.[0]?.stock ?? 0;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown context menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <tr
      className={`border-b border-[var(--color-light-gray)]/20 hover:bg-[var(--mama-cream)]/30 transition-colors ${isSelected ? "bg-[var(--mama-cream)]/20" : ""}`}
    >
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(product.id)}
          className="w-4 h-4 rounded border-gray-300 text-[var(--mama-hot-pink)] focus:ring-[var(--mama-hot-pink)] cursor-pointer"
        />
      </td>
      <td className="p-4 flex items-center gap-4 min-w-[250px]">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
          {product.images?.[0] ? (
            <img
              src={product.images[0].imageUrl}
              alt={product.images[0].altText || product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="text-gray-400 w-6 h-6" />
          )}
        </div>
        <span className="font-semibold text-[var(--mama-brown)] text-font-2">
          {product.name}
        </span>
      </td>
      <td className="p-4 text-[var(--color-gray)] text-font-2">
        {product.category?.name || "-"}
      </td>
      <td className="p-4 text-[var(--color-gray)] text-font-2">
        {formatIDR(product.currentPrice)}
      </td>
      <td className="p-4 text-[var(--color-gray)] text-font-2">{stock}</td>
      <td className="p-4">
        {product.isActive ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#1e8e3e] border border-[#ceead6]">
            Diterbitkan
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            Draf
          </span>
        )}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="p-2 text-[var(--color-gray)] hover:bg-[var(--mama-cream)] rounded-md transition-colors"
            title="Edit Produk"
          >
            <Edit className="w-4 h-4" />
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 text-[var(--color-gray)] hover:bg-[var(--mama-cream)] rounded-md transition-colors"
              title="Opsi Lainnya"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    onDuplicate(product.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-gray)] hover:bg-[var(--mama-cream)]/50 hover:text-[var(--mama-brown)] flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4" /> Duplikat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(product.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

/**
 * ProductTableSkeleton
 * Shimmer-loaded placeholder row structure.
 */
export function ProductTableSkeleton() {
  return (
    <tr className="border-b border-[var(--color-light-gray)]/20">
      <td className="p-4">
        <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
      </td>
      <td className="p-4 flex items-center gap-4 min-w-[250px]">
        <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gray-200 animate-pulse" />
          <div className="w-8 h-8 rounded-md bg-gray-200 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

export interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  isAllSelected: boolean;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedProductIds: number[];
  onToggleProduct: (id: number) => void;
  onDuplicateProduct: (id: number) => void;
  onDeleteProduct: (id: number) => void;
}

/**
 * ProductTable
 * Renders head labels, handles skeletal processing, maps actual rows, and wraps layouts.
 */
export default function ProductTable({
  products,
  isLoading,
  isAllSelected,
  onSelectAll,
  selectedProductIds,
  onToggleProduct,
  onDuplicateProduct,
  onDeleteProduct,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="bg-[var(--mama-pink)] text-[var(--mama-brown)]">
          <tr>
            <th className="p-4 rounded-tl-lg w-12">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-[var(--mama-hot-pink)] focus:ring-[var(--mama-hot-pink)] cursor-pointer"
              />
            </th>
            <th className="p-4 text-font-1 font-bold tracking-wide uppercase">
              Produk
            </th>
            <th className="p-4 text-font-1 font-bold tracking-wide uppercase">
              Kategori
            </th>
            <th className="p-4 text-font-1 font-bold tracking-wide uppercase">
              Harga
            </th>
            <th className="p-4 text-font-1 font-bold tracking-wide uppercase">
              Stok
            </th>
            <th className="p-4 text-font-1 font-bold tracking-wide uppercase">
              Status
            </th>
            <th className="p-4 text-font-1 font-bold tracking-wide uppercase rounded-tr-lg">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && products.length === 0 ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <ProductTableSkeleton key={idx} />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                isSelected={selectedProductIds.includes(product.id)}
                onToggle={onToggleProduct}
                onDuplicate={onDuplicateProduct}
                onDelete={onDeleteProduct}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-[var(--color-gray)]"
              >
                Tidak ada produk yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
