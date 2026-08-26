import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

export const StoreTab: React.FC<{ register: UseFormRegister<FieldValues> }> = ({ register }) => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h2 className="text-font-3 md:text-font-4 font-bold text-[var(--mama-brown)]">
            Informasi Umum
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                    Nama Toko
                </label>
                <input
                    {...register("site_name")}
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                Email Kontak
                </label>
                <input
                    {...register("email")}
                    type="email"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                    Deskripsi Toko
                </label>
                <textarea
                    {...register("site_description")}
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                    Nomor Telepon
                </label>
                <input
                    {...register("contact_phone")}
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                />
            </div>
        </div>

        <h2 className="text-font-3 md:text-font-4 font-bold text-[var(--mama-brown)] mt-4">
            Media Sosial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                    Instagram URL
                </label>
                <input
                    {...register("ig_link")}
                    type="text"
                    placeholder="https://instagram.com/..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                    Facebook URL
                </label>
                <input
                    {...register("fb_link")}
                    type="text"
                    placeholder="https://facebook.com/..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                />
            </div>
        </div>

        <h2 className="text-font-3 md:text-font-4 font-bold text-[var(--mama-brown)] mt-4">
            Sistem
        </h2>
        <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-md border border-gray-200 cursor-pointer">
            <input
                {...register("maint_mode")}
                type="checkbox"
                className="w-5 h-5 text-[var(--mama-hot-pink)] border-gray-300 rounded focus:ring-[var(--mama-hot-pink)]"
            />
            <span className="text-font-2 font-medium text-[var(--mama-brown)]">
                Aktifkan Mode Perbaikan (Maintenance Mode)
            </span>
        </label>
    </div>
);