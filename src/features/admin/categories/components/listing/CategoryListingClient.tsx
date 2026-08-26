"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { Category } from "@/features/categories/types/category.types";
import { DeleteConfirmModal } from "@/features/admin/categories/components/listing/DeleteConfirmModal";
import { CategoryListItem } from "@/features/admin/categories/components/listing/CategoryListItem";
import { useCategoryList } from "@/features/admin/categories/hooks/UseCategoryList";

interface CategoryListProps {
  initialCategories: Category[];
}

export const CategoryListingClient = ({
  initialCategories,
}: CategoryListProps) => {
  // Extract all complex state and logic into the custom hook defined above
  const {
    categories,
    draggedItemIndex,
    isUpdating,
    isDeleting,
    categoryToDelete,
    error,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleEdit,
    initiateDelete,
    cancelDelete,
    confirmDelete,
  } = useCategoryList(initialCategories);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={categoryToDelete !== null}
        categoryName={categoryToDelete?.name || ""}
        isDeleting={isDeleting !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 text-sm">
          {error}
        </div>
      )}

      {/* List Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* List Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
            Hierarki Kategori
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-font-1 text-[var(--color-light-gray)]">
              Tarik dan lepas untuk mengubah urutan kategori
            </p>
            {isUpdating && (
              <Loader2
                size={14}
                className="animate-spin text-[var(--mama-hot-pink)]"
              />
            )}
          </div>
        </div>

        {/* Draggable List */}
        <ul className="flex flex-col">
          {categories.length === 0 ? (
            <li className="p-8 text-center text-[var(--color-gray)] text-font-2">
              Belum ada kategori yang ditambahkan.
            </li>
          ) : (
            categories.map((category, index) => (
              <CategoryListItem
                key={category.id}
                category={category}
                index={index}
                draggedItemIndex={draggedItemIndex}
                isUpdating={isUpdating}
                isDeletingThis={isDeleting === category.id}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                onEdit={handleEdit}
                onDelete={initiateDelete}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
