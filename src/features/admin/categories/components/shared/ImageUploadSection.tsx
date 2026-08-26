import { ImagePlus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import Image from "next/image";
import {FormSectionProps} from "@/features/admin/categories/types/adminCategory.types";

export default function ImageUploadSection({
  control,
  errors,
}: FormSectionProps) {
  const imgValue = useWatch({
    control,
    name: "imageUrl",
  });

  const [preview, setPreview] = useState<string | null>(imgValue ?? null);

  function handlePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-font-2 font-bold text-[var(--mama-brown)]">
        Gambar Kategori
      </p>
      <div className="relative flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-[var(--mama-pink)] hover:bg-opacity-10 hover:border-[var(--mama-hot-pink)] transition-all cursor-pointer">
        <Controller
          name="img"
          control={control}
          render={({ field: { onChange, ref, name } }) => (
            <label
              className={`w-full h-40 flex flex-col items-center justify-center gap-3 group ${
                preview ? "absolute top-0 left-0 opacity-0" : "block"
              }`}
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-[var(--mama-pink)] transition-colors">
                <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-[var(--mama-hot-pink)]" />
              </div>
              <span className="text-font-2 text-[var(--color-gray)] font-medium">
                Klik untuk mengunggah gambar
              </span>
              <span className="text-font-1 text-gray-400">
                Format yang didukung: JPG, PNG, WEBP (Max 2MB)
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name={name}
                ref={ref}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  onChange(file); // simpan ke RHF
                  handlePreview(e); // preview
                }}
              />
            </label>
          )}
        />

        {preview && (
          <Image
            alt="previewimage"
            src={preview}
            width={160}
            height={160}
            className="h-40 w-auto object-contain rounded-md"
            unoptimized
          />
        )}
      </div>
      {errors?.img && (
        <p className="text-red-500">{String(errors.img.message)}*</p>
      )}
    </div>
  );
}
