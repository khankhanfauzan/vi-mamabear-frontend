import React, { useState } from "react";
import {
  Plus,
  X,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  Edit,
  Trash2,
} from "lucide-react";
import { adminProductService } from "@/features/admin/products/services/adminProductService";
import {
  CreateVariantInput,
  ProductImage,
  ProductVariant,
} from "@/features/admin/products/types/product.types";

interface ProductVariantsSectionProps {
  productId?: number;
  initialVariants?: ProductVariant[];
}

/**
 * ProductVariantsSection
 * Handles displaying and creating product variations. Integrates with variant endpoints,
 * supporting image uploads and dynamic client state synchronization.
 */
export default function ProductVariantsSection({
  productId,
  initialVariants = [],
}: ProductVariantsSectionProps) {
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states for adding/editing a variant
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [variantName, setVariantName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [sku, setSku] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [variantImageFile, setVariantImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVariantImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditingVariantId(null);
    setVariantName("");
    setPrice("");
    setStock("");
    setWeight("");
    setSku("");
    setSortOrder(0);
    setVariantImageFile(null);
    setImagePreviewUrl(null);
    setErrorMsg(null);
  };

  const openEditModal = (variant: ProductVariant) => {
    setEditingVariantId(variant.id);
    setVariantName(variant.name);
    setPrice(Number(variant.priceIdr));
    setStock(variant.stock);
    setWeight(variant.weightG);
    setSku(variant.sku);
    setSortOrder(variant.sortOrder);

    // Preview first image if available
    if (variant.images && variant.images.length > 0) {
      setImagePreviewUrl(variant.images[0].imageUrl || null);
    } else {
      setImagePreviewUrl(null);
    }

    setVariantImageFile(null);
    setIsModalOpen(true);
    setErrorMsg(null);
  };

  const handleDeleteVariant = async (variantId: number) => {
    setDeletingId(variantId);
    setErrorMsg(null);
    try {
      await adminProductService.deleteProductVariant(variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghapus varian",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleVariantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    if (!variantName || !price || !weight || !stock) {
      setErrorMsg("Mohon lengkapi semua field wajib");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      let finalImages: ProductImage[] = [];

      // 1. Resolve images (Use existing if editing and no new file, otherwise upload new)
      if (variantImageFile) {
        const formData = new FormData();
        formData.append("images", variantImageFile);
        const uploadResult =
          await adminProductService.uploadProductImages(formData);

        const normalized = Array.isArray(uploadResult)
          ? uploadResult
          : [uploadResult];
        finalImages = normalized.map((img, idx) => ({
          ...img,
          sortOrder: idx,
        }));
      } else if (editingVariantId) {
        // Carry over existing images if editing without changing picture
        const existingVariant = variants.find((v) => v.id === editingVariantId);
        finalImages = existingVariant?.images || [];
      }

      // 2. Format variant payload conforming to API requirements
      const variantPayload: Partial<CreateVariantInput> = {
        productId,
        name: variantName,
        images: finalImages,
        priceIdr: Number(price),
        weightG: Number(weight),
        sku: sku || "", // Guaranteed to be a string
        stock: Number(stock),
        sortOrder: Number(sortOrder),
      };

      if (editingVariantId) {
        // Dispatch PUT request
        const updatedVariant = await adminProductService.updateProductVariant(
          editingVariantId,
          variantPayload,
        );
        setVariants((prev) =>
          prev.map((v) => (v.id === editingVariantId ? updatedVariant : v)),
        );
      } else {
        // Dispatch POST request
        const newVariant = await adminProductService.createProductVariant(
          productId,
          variantPayload as CreateVariantInput,
        );
        setVariants((prev) => [...prev, newVariant]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan varian",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If no productId is provided (meaning we are still creating the primary product draft)
  if (!productId) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-2">
          Varian Produk
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Varian produk dapat ditambahkan dan dikelola secara mandiri setelah
          produk utama berhasil dibuat.
        </p>
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6 text-center text-gray-400 text-sm">
          Fitur varian dinonaktifkan sementara saat draf produk baru dibuat.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
            Varian Produk
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola pilihan variasi ukuran, rasa, atau kemasan produk ini
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setErrorMsg(null);
          }}
          className="flex items-center gap-2 bg-[var(--mama-hot-pink)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Varian
        </button>
      </div>

      {/* List of active variants */}
      {variants.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-8 text-center text-gray-500 text-sm">
          Belum ada varian produk. Klik tombol di atas untuk menambah varian
          pertama.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                <th className="py-3 px-4">Info</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4 text-center">Stok</th>
                <th className="py-3 px-4 text-center">Berat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {variants.map((v) => (
                <tr
                  key={v.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {v.images && v.images.length > 0 ? (
                        <img
                          src={v.images[0].imageUrl}
                          alt={v.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{v.name}</p>
                      <p className="text-xs text-gray-400">
                        Order: {v.sortOrder}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">
                    {v.sku || "-"}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    Rp {Number(v.priceIdr).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-gray-900">
                    {v.stock}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {v.weightG}g
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(v)}
                        className="p-1.5 text-gray-400 hover:text-[var(--mama-hot-pink)] hover:bg-pink-50 rounded transition-colors"
                        title="Edit Varian"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(v.id)}
                        disabled={deletingId === v.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Hapus Varian"
                      >
                        {deletingId === v.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Variant Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h3 className="text-lg font-bold text-[var(--mama-brown)]">
                  {editingVariantId ? "Edit Varian" : "Tambah Varian Baru"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingVariantId
                    ? "Perbarui detail varian produk ini"
                    : "Isi detail varian produk yang ingin ditambahkan"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content (Changed from <form> to prevent parent form submission) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Nama Varian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rasa Cokelat - 900g"
                  value={variantName}
                  onChange={(e) => setVariantName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-[var(--mama-hot-pink)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="185000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value) || "")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-[var(--mama-hot-pink)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Stok <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value) || "")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-[var(--mama-hot-pink)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Berat (Gram) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="900"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value) || "")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-[var(--mama-hot-pink)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Urutan Sortir
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-[var(--mama-hot-pink)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="S26-PROCAL-3-900"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-[var(--mama-hot-pink)]"
                />
              </div>

              {/* Variant Image Uploader */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Gambar Varian
                </label>
                <div className="flex items-center gap-4 mt-1">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative overflow-hidden flex-shrink-0">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/jpeg, image/png"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <p className="font-medium text-gray-700">
                      Klik kotak untuk mengunggah gambar
                    </p>
                    <p className="mt-0.5">
                      Hanya mendukung file format JPG & PNG (maks 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) =>
                    handleVariantSubmit(e as unknown as React.FormEvent)
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--mama-hot-pink)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Proses...
                    </>
                  ) : editingVariantId ? (
                    "Simpan Perubahan"
                  ) : (
                    "Simpan Varian"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
