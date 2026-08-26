import { FormSectionProps } from "../../types/adminCategory.types";

export const SettingsSection = ({
  register,
  isSubmitting,
  isActiveValue,
}: FormSectionProps & {
  isActiveValue: boolean;
  nextSortOrder: number | null;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="flex flex-col gap-2">
      <label className="text-font-2 font-bold text-[var(--mama-brown)]">
        Status Kategori
      </label>
      <label className="relative inline-flex items-center cursor-pointer w-max group">
        <input
          type="checkbox"
          className="sr-only peer"
          disabled={isSubmitting}
          {...register("isActive")}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--mama-pink)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--mama-hot-pink)] disabled:opacity-50 disabled:cursor-not-allowed group-hover:after:scale-95"></div>
        <span
          className={`ml-3 text-font-2 font-medium transition-colors ${isActiveValue ? "text-[var(--mama-hot-pink)]" : "text-gray-500"}`}
        >
          {isActiveValue
            ? "Aktif (Ditampilkan)"
            : "Tidak Aktif (Disembunyikan)"}
        </span>
      </label>
    </div>
  </div>
);