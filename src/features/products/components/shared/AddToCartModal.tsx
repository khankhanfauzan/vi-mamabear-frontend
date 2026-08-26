import React, { useState, useRef } from "react";
import Image from "next/image";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import {
  ProductDetail,
  ProductVariant,
} from "@/features/products/types/product.types";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { FlyToCartGhost } from "@/features/cart/components/FlyToCartGhost";
import {Coordinates, useUIStore} from "@/store/use-ui-store";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetail;
  variants: ProductVariant[];
  currentVariant: ProductVariant | null;
  selectedVariantId: number | null;
  quantity: number;
  onVariantSelect: (id: number) => void;
  onQuantityChange: (type: "increase" | "decrease") => void;
}

const formatIDR = (amount: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

export const AddToCartModal = ({
  isOpen,
  onClose,
  product,
  variants,
  currentVariant,
  selectedVariantId,
  quantity,
  onVariantSelect,
  onQuantityChange,
}: AddToCartModalProps) => {
  // Zustand Connections
  const addItem = useCartStore((state) => state.addItem);
  const cartIconRect = useUIStore((state) => state.cartIconRect);
  const triggerCartBounce = useUIStore((state) => state.triggerCartBounce);

  const [isLoading, setIsLoading] = useState(false);
  const [flyAnimation, setFlyAnimation] = useState<{
    imageUrl: string;
    startRect: Coordinates;
  } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  if (!isOpen) return null;

  // Check if variant has specific images, otherwise fallback to product images
  const activeImage = currentVariant?.images?.[0] || product.images?.[0];

  const hasDiscount = Number(product.discountPercent) > 0;
  let activeCurrentPrice = product.currentPrice;
  if (currentVariant && hasDiscount) {
    const vPrice = Number(currentVariant.priceIdr);
    const discount = Number(product.discountPercent);
    activeCurrentPrice = (vPrice - (vPrice * discount) / 100).toString();
  }

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await addItem({
        product,
        variant: currentVariant,
        quantity,
      });

      // Trigger the fly animation if coordinates and image exist
      if (imageRef.current && cartIconRect && activeImage) {
        const rect = imageRef.current.getBoundingClientRect();
        setFlyAnimation({
          imageUrl: activeImage.imageUrl,
          startRect: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          },
        });

        // Delay closing the modal so the ghost component doesn't unmount before arriving
        setTimeout(() => {
          onClose();
          setFlyAnimation(null);
        }, 850);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
      // TODO: Add a toast notification here in the future
      // toast.error("Maaf, gagal menambahkan produk ke keranjang");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlyComplete = () => {
    setFlyAnimation(null);
    triggerCartBounce();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 relative animate-in slide-in-from-bottom-1/2 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[var(--mama-hot-pink)] transition-colors rounded-full hover:bg-gray-100"
        >
          <X size={24} />
        </button>

        {}
        <div className="flex gap-4 border-b border-gray-100 pb-5 mb-5 mt-2">
          <div className="w-24 h-24 relative rounded-xl border border-[var(--mama-pink)] bg-[var(--mama-cream)] overflow-hidden flex-shrink-0 shadow-sm">
            {activeImage && (
              <Image
                ref={imageRef}
                src={activeImage.imageUrl}
                alt={product.name}
                fill
                className="object-contain"
                sizes="96px"
              />
            )}
          </div>
          <div className="flex flex-col justify-end">
            <span className="text-font-4 font-bold text-[var(--mama-hot-pink)]">
              {formatIDR(activeCurrentPrice)}
            </span>
            <span className="text-font-2 text-[var(--color-gray)] mt-1">
              Stok:{" "}
              <span className="font-medium text-[var(--mama-brown)]">
                {currentVariant?.stock || 0}
              </span>
            </span>
          </div>
        </div>

        {}
        {variants && variants.length > 0 && (
          <div className="mb-6">
            <h4 className="text-font-2 font-semibold text-[var(--mama-brown)] mb-3">
              Pilih Varian
            </h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-hide">
              {variants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => onVariantSelect(variant.id)}
                    className={`px-4 py-2 rounded-full text-font-1 font-medium transition-all ${
                      isSelected
                        ? "bg-[var(--mama-hot-pink)] text-white border border-[var(--mama-hot-pink)] shadow-md"
                        : "bg-white text-[var(--color-gray)] border border-gray-200 hover:border-[var(--mama-hot-pink)] hover:text-[var(--mama-hot-pink)]"
                    }`}
                  >
                    {variant.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {}
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-font-2 font-semibold text-[var(--mama-brown)]">
            Jumlah
          </h4>
          <div className="flex items-center border border-[var(--color-light-gray)] rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => onQuantityChange("decrease")}
              className="p-2 hover:bg-gray-100 text-[var(--color-gray)] transition-colors"
              disabled={quantity <= 1}
            >
              <Minus size={18} />
            </button>
            <span className="px-4 text-font-2 font-medium text-[var(--mama-brown)] w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange("increase")}
              className="p-2 hover:bg-gray-100 text-[var(--color-gray)] transition-colors"
              disabled={!currentVariant || quantity >= currentVariant.stock}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={isLoading || (variants.length > 0 && !currentVariant)}
          className="w-full flex justify-center items-center gap-2 bg-[var(--mama-hot-pink)] text-white py-3.5 rounded-full font-bold text-font-3 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Konfirmasi"
          )}
        </button>
      </div>

      {flyAnimation && cartIconRect && (
        <FlyToCartGhost
          imageUrl={flyAnimation.imageUrl}
          startRect={flyAnimation.startRect}
          endRect={cartIconRect}
          onComplete={handleFlyComplete}
        />
      )}
    </div>
  );
};