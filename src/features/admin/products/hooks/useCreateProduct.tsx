import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  createProduct,
  uploadProductImages,
} from "@/features/admin/products/services/adminProductService";
import {
  CreateProductInput,
  ProductFormValues,
  ProductImage,
} from "@/features/admin/products/types/product.types";

export function useCreateProduct() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      categoryId: "",
      price: 0,
      stock: 0,
      weightG: 0,
      isActive: "false",
      metaTitle: "",
      metaDescription: "",
      ingredients: "",
      usageInstructions: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "left" | "right" | number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      if (typeof direction === "number") {
        // Move image from initial position directly to target index dropped on
        const [movedImage] = newImages.splice(index, 1);
        newImages.splice(direction, 0, movedImage);
        return newImages;
      }
      if (direction === "left" && index > 0) {
        // Swap with the previous image
        [newImages[index - 1], newImages[index]] = [
          newImages[index],
          newImages[index - 1],
        ];
      } else if (direction === "right" && index < newImages.length - 1) {
        // Swap with the next image
        [newImages[index + 1], newImages[index]] = [
          newImages[index],
          newImages[index + 1],
        ];
      }
      return newImages;
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      let finalImages: ProductImage[] = [];

      // 1. Upload Images First (if any)
      if (selectedImages.length > 0) {
        const imageFormData = new FormData();
        selectedImages.forEach((file) => {
          imageFormData.append("images", file);
        });

        const uploadResult = await uploadProductImages(imageFormData);

        // Normalize response to array and assign sortOrder based on the final array index
        const uploadedImagesArray = Array.isArray(uploadResult)
          ? uploadResult
          : [uploadResult];
        finalImages = uploadedImagesArray.map((img, index) => ({
          ...img,
          sortOrder: index, // Set explicit sort order from the UI arrangement!
        }));
      }

      // 2. Prepare JSON Payload for Product Creation
      const productPayload: CreateProductInput = {
        name: data.name,
        description: data.description || null,
        categoryId: Number(data.categoryId),
        isActive: data.isActive === "true",
        priceIdr: data.price.toString(),
        weightG: Number(data.weightG),
        stock: Number(data.stock),
        sku: data.sku || undefined,
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
        tags: [], // Default to empty array as required by the interface
        ingredients: data.ingredients || null,
        usageInstructions: data.usageInstructions || null,
        images: finalImages,
      };

      // 3. Create Product
      await createProduct(productPayload);

      // Redirect back to product list on success
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    errorMsg,
    selectedImages,
    handleImageChange,
    removeImage,
    moveImage,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
