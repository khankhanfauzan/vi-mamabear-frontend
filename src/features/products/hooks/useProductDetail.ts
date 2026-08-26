import { useState, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ProductDetail, ProductImage } from '../types/product.types';

export const useProductDetail = (product: ProductDetail) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const variantQuery = searchParams.get('variant');

  // Initialize variant from URL or fallback to the first available variant
  const initialVariant = useMemo(() => {
    if (variantQuery && product.variants) {
      const found = product.variants.find((v) => v.id.toString() === variantQuery);
      if (found) return found;
    }
    return product.variants?.length > 0 ? product.variants[0] : null;
  }, [variantQuery, product.variants]);

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    initialVariant ? initialVariant.id : null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage'>('description');

  const currentVariant = useMemo(() => {
    return product.variants?.find((v) => v.id === selectedVariantId) || null;
  }, [selectedVariantId, product.variants]);

  // Combine all product images and each variant's first image, ensuring uniqueness
  const activeImages = useMemo(() => {
    const list: ProductImage[] = [...(product.images || [])];
    
    product.variants?.forEach((v) => {
      if (v.images && v.images.length > 0) {
        const firstVarImg = v.images[0];
        // Avoid adding duplicate images
        const exists = list.some(
          (img) => img.imageUrl === firstVarImg.imageUrl || img.id === firstVarImg.id
        );
        if (!exists) {
          list.push(firstVarImg);
        }
      }
    });
    
    return list;
  }, [product.images, product.variants]);

  // Set initial main image based on selected variant (or fall back to the first product image)
  const [mainImage, setMainImage] = useState<ProductImage | null>(() => {
    if (initialVariant?.images && initialVariant.images.length > 0) {
      return initialVariant.images[0];
    }
    return product.images?.length > 0 ? product.images[0] : null;
  });

  // Synchronize variant selection with URL search params and update the main image
  const handleVariantSelect = (id: number) => {
    setSelectedVariantId(id);
    setQuantity(1); // Reset quantity when variant changes
    
    const variant = product.variants?.find((v) => v.id === id);
    if (variant?.images && variant.images.length > 0) {
      setMainImage(variant.images[0]);
    }
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('variant', id.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    setQuantity((prev) => {
      if (type === 'increase') {
        const maxStock = currentVariant?.stock || 1;
        return prev < maxStock ? prev + 1 : prev;
      } else {
        return prev > 1 ? prev - 1 : 1;
      }
    });
  };

  return {
    selectedVariantId,
    currentVariant,
    quantity,
    activeTab,
    activeImages, // Return combined image list
    mainImage,
    setActiveTab,
    setMainImage,
    handleVariantSelect,
    handleQuantityChange,
  };
};