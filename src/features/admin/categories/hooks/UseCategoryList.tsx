import { adminCategoryService } from "@/features/admin/categories/services/adminCategoryService";
import { Category } from "@/features/categories/types/category.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useCategoryList = (initialCategories: Category[]) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(
    [...initialCategories].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Drag and Drop Logic ---
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
    setError(null);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedItemIndex];

    newCategories.splice(draggedItemIndex, 1);
    newCategories.splice(index, 0, draggedItem);

    setDraggedItemIndex(index);
    setCategories(newCategories);
  };

  const handleDragEnd = async () => {
    setDraggedItemIndex(null);
    setIsUpdating(true);
    setError(null);

    try {
      const promises: Promise<Category | null>[] = [];
      
      const updatedCategories = categories.map((cat, index) => {
        if (cat.sortOrder !== index) {
          promises.push(
            adminCategoryService.updateCategory(cat.id, { sortOrder: index })
          );
          return { ...cat, sortOrder: index };
        }
        return cat;
      });

      setCategories(updatedCategories);

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    } catch (err: unknown) {
      console.error("Failed to update category order:", err);
      setError(err instanceof Error ? err.message : "Gagal mengubah urutan kategori.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Action Logic ---
  const handleEdit = (slug: string) => {
    router.push(`/admin/categories/${slug}/edit`);
  };

  const initiateDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const cancelDelete = () => {
    if (!isDeleting) setCategoryToDelete(null);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(categoryToDelete.id);
    setError(null);

    try {
      await adminCategoryService.deleteCategory(categoryToDelete.id);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id)
      );
      setCategoryToDelete(null);
      router.refresh();
    } catch (err: unknown) {
      console.error("Failed to delete category:", err);
      setError(err instanceof Error ? err.message : "Gagal menghapus kategori.");
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(null);
    }
  };

  return {
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
  };
};