"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Category,
  CategoryImage,
} from "@/features/categories/types/category.types";
import {
  adminCategoryService,
  uploadCategoryImage,
} from "@/features/admin/categories/services/adminCategoryService";
import { CategoryFormValues } from "../../types/adminCategory.types";
import { BasicInfoSection } from "@/features/admin/categories/components/shared/BasicInfoSection";
import ImageUploadSection from "@/features/admin/categories/components/shared/ImageUploadSection";
import { SeoSection } from "@/features/admin/categories/components/shared/SeoSection";

interface CategoryEditFormProps {
  initialData: Category;
}

// TODO: move this as a hook file
// --- Custom Hook ---
const useCategoryEditForm = (initialData: Category) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: initialData.name,
      slug: initialData.slug,
      description: initialData.description,
      metaTitle: initialData.metaTitle || "",
      metaDescription: initialData.metaDescription || "",
      imageUrl:
        initialData.images?.[initialData.images.length - 1]?.imageUrl || "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setError(null);
    let image: CategoryImage[] = [];

    if (data.img) {
      try {
        const img = await uploadCategoryImage(data.img);
        image = [
          {
            ...img,
            sortOrder: 0,
          } as CategoryImage,
        ];
      } catch (err) {
        console.error("Gagal mengunggah gambar:", err);
        setError("Gagal mengunggah gambar kategori.");
        return;
      }
    } else {
      image = initialData.images;
    }

    try {
      const categoryPayload: Partial<Category> = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isActive: data.isActive,
        sortOrder: initialData.sortOrder,
        images: image,
      };

      // Call the update service instead of create
      await adminCategoryService.updateCategory(
        initialData.id,
        categoryPayload,
      );

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      console.error("Submit Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui kategori.",
      );
    }
  };

  const handleCancel = () => {
    router.push("/admin/categories");
  };

  const nameValue = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    } else {
      setValue("slug", "");
    }
  }, [nameValue, setValue]);

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    error,
    control,
    handleCancel,
  };
};

// --- Main Form Component ---
export const CategoryEditForm = ({ initialData }: CategoryEditFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    error,
    handleCancel,
  } = useCategoryEditForm(initialData);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
            Ubah Kategori
          </h1>
          <p className="text-font-2 text-[var(--color-gray)] mt-1">
            Perbarui informasi untuk kategori{" "}
            <strong>{initialData.name}</strong>
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Form Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
            Informasi Dasar
          </h2>
        </div>

        {/* Error State */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-font-2">
            {error}
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 flex flex-col gap-8">
          <BasicInfoSection
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            control={control}
          />
          <hr className="border-gray-100" />

          <ImageUploadSection
            errors={errors}
            control={control}
            register={register}
            isSubmitting={isSubmitting}
          />

          <hr className="border-gray-100" />

          <SeoSection
            register={register}
            isSubmitting={isSubmitting}
            control={control}
          />
        </div>

        {/* Form Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center gap-4 bg-gray-50 bg-opacity-50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[var(--mama-hot-pink)] text-white px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity text-font-2 font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-white text-[var(--color-gray)] border border-gray-200 px-6 py-2.5 rounded-md hover:bg-gray-50 transition-colors text-font-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};
