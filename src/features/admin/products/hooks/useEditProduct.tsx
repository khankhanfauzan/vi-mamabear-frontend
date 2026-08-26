import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  updateProduct,
  uploadProductImages,
} from "@/features/admin/products/services/adminProductService";
import {
  Product,
  ProductImage,
} from "@/features/admin/products/types/product.types";

export interface EditProductFormValues {
  name: string;
  description: string;
  categoryId: string;
  isActive: string;
  metaTitle: string;
  metaDescription: string;
  ingredients: string;
  usageInstructions: string;
}

export function useEditProduct(initialData: Product) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Accept both File (new uploads) and ProductImage (existing)
  const [images, setImages] = useState<(File | ProductImage)[]>([]);

  const form = useForm<EditProductFormValues>({
    // Use 'values' instead of 'defaultValues' to ensure the form reactively seeds 
    // the data when initialData is provided/hydrated by the server.
    values: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId?.toString() || "",
      isActive: initialData?.isActive ? "true" : "false",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      ingredients: initialData?.ingredients || "",
      usageInstructions: initialData?.usageInstructions || "",
    },
  });

  useEffect(() => {
    // Sort initial images by sortOrder to preserve exact arrangement
    if (initialData.images && initialData.images.length > 0) {
      const sortedImages = [...initialData.images].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
      );
      setImages(sortedImages);
    }
  }, [initialData.images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "left" | "right" | number) => {
    setImages((prev) => {
      const newImages = [...prev];
      if (typeof direction === "number") {
        const [movedImage] = newImages.splice(index, 1);
        newImages.splice(direction, 0, movedImage);
        return newImages;
      }
      if (direction === "left" && index > 0) {
        [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      } else if (direction === "right" && index < newImages.length - 1) {
        [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
      }
      return newImages;
    });
  };

  const onSubmit = async (data: EditProductFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Separate new files from existing database images
      const newFiles = images.filter((img) => img instanceof File) as File[];
      let uploadedImages: ProductImage[] = [];

      // Upload new files
      if (newFiles.length > 0) {
        const imageFormData = new FormData();
        newFiles.forEach((file) => imageFormData.append("images", file));
        
        const uploadResult = await uploadProductImages(imageFormData);
        uploadedImages = Array.isArray(uploadResult) ? uploadResult : [uploadResult];
      }

      // Reconstruct the exact final array order combining existing DB images and newly generated Cloudinary images
      const finalImages: ProductImage[] = [];
      const uploadedCopy = [...uploadedImages];

      images.forEach((item, index) => {
        if (item instanceof File) {
          const uploadedObj = uploadedCopy.shift();
          if (uploadedObj) finalImages.push({ ...uploadedObj, sortOrder: index });
        } else {
          finalImages.push({ ...(item as ProductImage), sortOrder: index });
        }
      });

      // Prepare Update Payload
      const updatePayload: Partial<Product> = {
        name: data.name,
        description: data.description || null,
        categoryId: Number(data.categoryId),
        isActive: data.isActive === "true",
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        ingredients: data.ingredients || null,
        usageInstructions: data.usageInstructions || null,
        images: finalImages,
      };

      await updateProduct(initialData.id, updatePayload);
      
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Gagal memperbarui produk");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    errorMsg,
    images,
    handleImageChange,
    removeImage,
    moveImage,
    onSubmit: form.handleSubmit(onSubmit),
  };
}