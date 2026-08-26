import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  imageUrl?: string;
  img : File
}

export interface FormSectionProps {
  register: UseFormRegister<CategoryFormValues>;
  isSubmitting: boolean;
  errors?: FieldErrors<CategoryFormValues>;
  control : Control<CategoryFormValues>
}