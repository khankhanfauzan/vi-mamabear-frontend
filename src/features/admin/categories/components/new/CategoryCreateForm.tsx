"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  adminCategoryService,
  uploadCategoryImage,
} from "@/features/admin/categories/services/adminCategoryService";
import { Category } from "@/features/categories/types/category.types";
import { CategoryFormValues } from "../../types/adminCategory.types";
import { SettingsSection } from "./SetingsSection";
import { BasicInfoSection } from "../shared/BasicInfoSection";
import ImageUploadSection from "../shared/ImageUploadSection";
import { SeoSection } from "../shared/SeoSection";

/**
 * Custom hook to manage category creation form state and side-effects
 */
const useCreateCategoryForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [nextSortOrder, setNextSortOrder] = useState<number | null>(null);

  const formMethods = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
      metaTitle: "",
      metaDescription: "",
      img: undefined,
    },
  });

  const { watch, setValue } = formMethods;
  const nameValue = watch("name");
  const isActiveValue = watch("isActive");

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

  // Fetch the next sort order
  useEffect(() => {
    const getNextOrder = async () => {
      try {
        const categories = await adminCategoryService.fetchCategories();
        setNextSortOrder(categories.length + 1);
      } catch (err) {
        console.error("Gagal mengambil kategori untuk menentukan urutan", err);
      }
    };
    getNextOrder();
  }, []);

  const onSubmit = async (data: CategoryFormValues) => {
    setError(null);
    try {
      let image;
      if (data.img) {
        const img = await uploadCategoryImage(data.img);
        image = [
          {
            ...img,
            sortOrder: 0,
          },
        ];
      }

      const categoryPayload: Partial<Category> = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isActive: data.isActive,
        sortOrder: nextSortOrder !== null ? nextSortOrder : 0,
        images: image,
      };

      await adminCategoryService.createCategory(
        categoryPayload as Partial<Category>,
      );

      router.push("/admin/categories");
      router.refresh();
    } catch (err: unknown) {
      console.error("Submit Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuat kategori.",
      );
    }
  };

  return {
    formMethods,
    error,
    nextSortOrder,
    isActiveValue,
    onSubmit,
    router,
  };
};

const FormFooter = ({
  isSubmitting,
  onCancel,
}: {
  isSubmitting: boolean;
  onCancel: () => void;
}) => (
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
        "Buat Kategori"
      )}
    </button>
    <button
      type="button"
      onClick={onCancel}
      disabled={isSubmitting}
      className="bg-white text-[var(--color-gray)] border border-gray-200 px-6 py-2.5 rounded-md hover:bg-gray-50 transition-colors text-font-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
    >
      Batal
    </button>
  </div>
);

export const CategoryCreateForm = () => {
  const { formMethods, error, nextSortOrder, isActiveValue, onSubmit, router } =
    useCreateCategoryForm();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = formMethods;

  const handleCancel = () => router.push("/admin/categories");

  return (
    <div className="w-full flex flex-col gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
            Tambah Kategori Baru
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-font-2">
            {error}
          </div>
        )}

        <div className="p-6 flex flex-col gap-6">
          <BasicInfoSection
            control={control}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
          />

          <SettingsSection
            control={control}
            register={register}
            isSubmitting={isSubmitting}
            isActiveValue={isActiveValue}
            nextSortOrder={nextSortOrder}
          />

          <ImageUploadSection
            control={control}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
          />

          <SeoSection
            control={control}
            register={register}
            isSubmitting={isSubmitting}
          />
        </div>

        <FormFooter isSubmitting={isSubmitting} onCancel={handleCancel} />
      </form>
    </div>
  );
};
