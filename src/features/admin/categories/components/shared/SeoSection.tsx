import { FormSectionProps } from "../../types/adminCategory.types";

export const SeoSection = ({ register, isSubmitting }: FormSectionProps) => (
  <div className="pt-6 border-t border-gray-100 flex flex-col gap-6">
    <h3 className="text-font-3 font-bold text-[var(--mama-brown)]">
      SEO (Opsional)
    </h3>
    <div className="flex flex-col gap-2">
      <label
        htmlFor="metaTitle"
        className="text-font-2 font-bold text-[var(--mama-brown)]"
      >
        Meta Title (SEO)
      </label>
      <input
        id="metaTitle"
        type="text"
        placeholder="Judul untuk mesin pencari"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all text-font-2 text-gray-800 disabled:bg-gray-50"
        {...register("metaTitle")}
      />
    </div>
    <div className="flex flex-col gap-2">
      <label
        htmlFor="metaDescription"
        className="text-font-2 font-bold text-[var(--mama-brown)]"
      >
        Meta Description (SEO)
      </label>
      <textarea
        id="metaDescription"
        rows={3}
        placeholder="Deskripsi singkat untuk hasil pencarian Google"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all text-font-2 text-gray-800 resize-y disabled:bg-gray-50"
        {...register("metaDescription")}
      />
    </div>
  </div>
);