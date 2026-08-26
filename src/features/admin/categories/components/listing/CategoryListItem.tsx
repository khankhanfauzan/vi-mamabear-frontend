import { Category } from "@/features/categories/types/category.types";
import { Edit, GripVertical, Loader2, Trash2 } from "lucide-react";

interface CategoryListItemProps {
  category: Category;
  index: number;
  draggedItemIndex: number | null;
  isUpdating: boolean;
  isDeletingThis: boolean;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onEdit: (slug: string) => void;
  onDelete: (category: Category) => void;
}

export const CategoryListItem = ({
  category,
  index,
  draggedItemIndex,
  isUpdating,
  isDeletingThis,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onEdit,
  onDelete,
}: CategoryListItemProps) => {
  const isBeingDragged = draggedItemIndex === index;


  return (
    <li
      draggable={!isUpdating && !isDeletingThis}
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`group flex items-center justify-between p-4 border-b border-gray-50 last:border-none transition-colors
        ${isBeingDragged ? "opacity-50 bg-gray-50" : "hover:bg-[var(--mama-pink)] hover:bg-opacity-20 bg-white"}
        ${isDeletingThis ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          className={`p-1 ${isUpdating || isDeletingThis ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-[var(--mama-brown)] cursor-grab active:cursor-grabbing"}`}
          disabled={isUpdating || isDeletingThis}
        >
          <GripVertical size={20} />
        </button>


        {/* Category Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-font-2 font-semibold text-[var(--mama-brown)]">
              {category.name}
            </span>
            <span className="text-sm px-2 text-[var(--color-gray)] rounded-full bg-[var(--mama-pink)]">
              {category._count.products}
            </span>
          </div>
          <span className="text-font-1 text-[var(--color-gray)] mt-0.5">
            {category.description || "Tidak ada deskripsi"}
          </span>
        </div>
      </div>


      {/* Actions */}
      <div
        className={`flex items-center gap-2 transition-opacity ${isDeletingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        <button
          onClick={() => onEdit(category.slug)}
          disabled={isDeletingThis}
          className="p-2 text-[var(--color-gray)] hover:text-[var(--mama-brown)] hover:bg-white rounded-md transition-colors disabled:opacity-50"
          title="Ubah Kategori"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(category)}
          disabled={isDeletingThis}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center min-w-[34px]"
          title="Hapus Kategori"
        >
          {isDeletingThis ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>
    </li>
  );
};