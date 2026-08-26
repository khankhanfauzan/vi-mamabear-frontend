import React, { useState } from "react";
import { UploadCloud, X, ZoomIn, GripHorizontal } from "lucide-react";
import { ProductImage } from "@/features/admin/products/types/product.types";

interface ProductImagesProps {
  selectedImages: (File | ProductImage)[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  moveImage: (index: number, direction: "left" | "right" | number) => void;
  onZoom: (url: string) => void;
}

/**
 * ProductImagesSection
 * Upload block with responsive grid arrangement, deletion,
 * hold-drag drag and drop reordering (Desktop + Mobile touch support), and zoom modal activator.
 */
export default function ProductImagesSection({
  selectedImages,
  handleImageChange,
  removeImage,
  moveImage,
  onZoom,
}: ProductImagesProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number,
  ) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      moveImage(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    index: number,
  ) => {
    setTouchStartIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartIndex === null) return;

    const touch = e.touches[0];
    // Find the element currently underneath the user's touch finger
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    // Detect if we are hovering over another thumbnail container card
    const card = element.closest("[data-index]");
    if (card) {
      const index = parseInt(card.getAttribute("data-index") || "", 10);
      if (!isNaN(index) && index !== touchStartIndex) {
        setDragOverIndex(index);
      }
    }
  };

  const handleTouchEnd = () => {
    if (
      touchStartIndex !== null &&
      dragOverIndex !== null &&
      touchStartIndex !== dragOverIndex
    ) {
      moveImage(touchStartIndex, dragOverIndex);
    }
    setTouchStartIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
            Gambar Produk
          </h2>
          {selectedImages.length > 1 && (
            <p className="text-sm text-[var(--color-gray)] mt-0.5">
              Tahan & seret gambar atau pegangan ikon untuk mengatur ulang
              urutan
            </p>
          )}
        </div>
      </div>

      {}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center relative hover:bg-gray-50 transition-colors">
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <UploadCloud className="w-8 h-8 text-[var(--mama-brown)] mb-2" />
        <p className="text-font-2 text-[var(--mama-brown)]">
          Tarik & letakkan gambar ke sini atau klik untuk meramban
        </p>
        <p className="text-sm text-[var(--color-gray)] mt-1">
          Mendukung: JPG, PNG (maks 5MB per file)
        </p>
      </div>

      {}
      {selectedImages.length > 0 && (
        <div className="mt-4 flex gap-4 flex-wrap">
          {selectedImages.map((item, idx) => {
            const isFile = item instanceof File;
            const objectUrl = isFile
              ? URL.createObjectURL(item as File)
              : (item as ProductImage).imageUrl || "";

            const isDragging = idx === draggedIndex;
            const isDragOver = idx === dragOverIndex;
            const isTouchDragging = idx === touchStartIndex;

            return (
              <div
                key={idx}
                data-index={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, idx)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`group relative w-28 h-28 border rounded-md overflow-hidden bg-gray-50 select-none cursor-grab active:cursor-grabbing transition-all duration-200 ${
                  isDragging || isTouchDragging
                    ? "opacity-30 scale-95 border-[var(--mama-hot-pink)]"
                    : ""
                } ${
                  isDragOver
                    ? "border-2 border-dashed border-[var(--mama-hot-pink)] scale-105"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={objectUrl}
                  alt={`Preview ${idx + 1}`}
                  onClick={() => onZoom(objectUrl)}
                  className="w-full h-full object-cover pointer-events-none"
                />

                {/* Drag Handle Overlay Icon - visible permanently on mobile, hover-only on desktop */}
                <div className="absolute top-1 left-1 bg-white/85 rounded p-0.5 shadow-sm opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity">
                  <GripHorizontal className="w-3.5 h-3.5 text-gray-500" />
                </div>

                {/* Delete Action - visible permanently on mobile, hover-only on desktop */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  title="Hapus gambar"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Zoom/Expand Action - visible permanently on mobile, hover-only on desktop */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onZoom(objectUrl);
                  }}
                  className="absolute bottom-1 right-1 bg-white rounded p-1 shadow-md hover:bg-gray-50 text-gray-700 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  title="Perbesar gambar"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
