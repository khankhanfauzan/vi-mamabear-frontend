import { FormSectionProps } from "../../types/adminCategory.types";

export const BasicInfoSection = ({
  register,
  errors,
  isSubmitting,
}: FormSectionProps) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-font-2 font-bold text-[var(--mama-brown)]"
        >
          Nama Kategori
        </label>
        <input
          id="name"
          type="text"
          placeholder="mis., Almond Mix"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all text-font-2 text-gray-800 disabled:bg-gray-50"
          {...register("name", { required: "Nama kategori wajib diisi" })}
        />
        {errors?.name && (
          <span className="text-red-500 text-font-1">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="slug"
          className="text-font-2 font-bold text-[var(--mama-brown)]"
        >
          Slug
        </label>
        <input
          id="slug"
          type="text"
          placeholder="mis., almond-mix"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all text-font-2 text-gray-800 disabled:bg-gray-50"
          {...register("slug", { required: "Slug wajib diisi" })}
        />
        {errors?.slug && (
          <span className="text-red-500 text-font-1">
            {errors.slug.message}
          </span>
        )}
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <label
        htmlFor="description"
        className="text-font-2 font-bold text-[var(--mama-brown)]"
      >
        Deskripsi
      </label>
      <textarea
        id="description"
        rows={4}
        placeholder="Deskripsi singkat tentang kategori"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all text-font-2 text-gray-800 resize-y disabled:bg-gray-50"
        {...register("description")}
      />
    </div>
  </>
);
