import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

export const TaxTab: React.FC<{ register: UseFormRegister<FieldValues> }> = ({ register }) => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h2 className="text-font-3 md:text-font-4 font-bold text-[var(--mama-brown)]">
            Pengaturan Pajak
        </h2>
        <div className="flex flex-col gap-2 max-w-md">
            <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                Persentase Pajak (Desimal)
            </label>
            <input
                {...register("tax_rate")}
                type="number"
                step="0.01"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                placeholder="Contoh: 0.12 untuk 12%"
            />
        </div>
    </div>
);