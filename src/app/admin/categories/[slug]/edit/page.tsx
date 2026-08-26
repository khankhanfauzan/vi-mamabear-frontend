import React from "react";
import { notFound } from "next/navigation";
import { categoryService } from "@/features/categories/services/categoryService";
import { CategoryEditForm } from "@/features/admin/categories/components/edit/CategoryEditForm";

interface EditCategoryPageProps {
  params: {
    slug: string;
  };
}

/**
 * Admin Category Edit Page (Server Component)
 * Fetches the existing category data by slug and passes it to the client form.
 */
export default async function AdminCategoryEditPage({
  params,
}: EditCategoryPageProps) {
  const category = await categoryService.getCategoryBySlug(params.slug);

  if (!category) notFound();

  return <CategoryEditForm initialData={category} />;
}
