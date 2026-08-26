import React, { useState } from "react";
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldValues } from "react-hook-form";
import { Plus, X, CreditCard } from "lucide-react";

interface PaymentTabProps {
    register: UseFormRegister<FieldValues>;
    watch?: UseFormWatch<FieldValues>;
    setValue?: UseFormSetValue<FieldValues>;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({ register, watch, setValue }) => {
    const [newMethodKey, setNewMethodKey] = useState("");
    const [newMethodName, setNewMethodName] = useState("");

    // Watch the current value of payment_type to dynamically render the active list
    const paymentTypeValue = watch ? watch("payment_type") : "";

    // Parse the current payment type configurations into a safe object map
    let paymentsObj: Record<string, string> = {};
    if (paymentTypeValue) {
        try {
            const parsed = JSON.parse(paymentTypeValue);
            if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
                paymentsObj = parsed;
            }
        } catch {
        // Ignore invalid JSON formatting during live changes
        }
    }

    const handleAddPaymentMethod = () => {
        if (!newMethodKey || !newMethodName || !setValue) return;

        // Convert keys to lowercase and clear spaces to prevent API/routing issues
        const safeKey = newMethodKey.toLowerCase().replace(/\s+/g, "");
        const updated = { ...paymentsObj, [safeKey]: newMethodName };

        setValue("payment_type", JSON.stringify(updated), { shouldDirty: true });
        setNewMethodKey("");
        setNewMethodName("");
    };

    const handleRemovePaymentMethod = (keyToRemove: string) => {
        if (!setValue) return;

        const updated = { ...paymentsObj };
        delete updated[keyToRemove];

        setValue("payment_type", JSON.stringify(updated), { shouldDirty: true });
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-font-3 md:text-font-4 font-bold text-[var(--mama-brown)]">
                Metode Pembayaran
            </h2>

            {watch && setValue ? (
                <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                    <label className="text-font-1 text-[var(--color-gray)]">
                        Kelola daftar metode pembayaran yang didukung oleh toko Anda. Tambahkan atau hapus pilihan metode pembayaran di bawah.
                    </label>

                    {/* Hidden textarea to register the form field so react-hook-form can handle the submission */}
                    <textarea {...register("payment_type")} className="hidden" />

                    {/* Render Active Payment Method Badges */}
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(paymentsObj).map(([key, name]) => (
                            <div
                                key={key}
                                className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded-full shadow-sm text-font-2"
                            >
                                <CreditCard className="w-3.5 h-3.5 text-[var(--mama-hot-pink)]" />
                                <span className="font-medium text-[var(--mama-brown)]">{name}</span>
                                <span className="text-gray-400 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                    {key}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemovePaymentMethod(key)}
                                    className="text-gray-400 hover:text-red-500 transition-colors ml-1 p-0.5 rounded-full hover:bg-red-50"
                                    title="Hapus metode"
                                >
                                <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {Object.keys(paymentsObj).length === 0 && (
                        <p className="text-sm text-gray-500 italic px-2 py-1">
                            Belum ada metode pembayaran yang dikonfigurasi.
                        </p>
                        )}
                    </div>

                    {/* Add New Payment Method Input Fields */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-4 border-t border-gray-200">
                        <input
                            type="text"
                            placeholder="Kode Metode (mis. qris)"
                            value={newMethodKey}
                            onChange={(e) => setNewMethodKey(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)]"
                        />
                        <input
                            type="text"
                            placeholder="Nama Tampil (mis. QRIS Mandiri)"
                            value={newMethodName}
                            onChange={(e) => setNewMethodName(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)]"
                        />
                        <button
                            type="button"
                            onClick={handleAddPaymentMethod}
                            disabled={!newMethodKey || !newMethodName}
                            className="flex items-center justify-center gap-1 bg-[var(--mama-brown)] hover:bg-[#6c4e4e] text-white px-4 py-2 rounded-md font-medium text-font-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        <Plus className="w-4 h-4" />
                            Tambah
                        </button>
                    </div>
                </div>
            ) : (
                // Fallback standard text input if watch or setValue props are missing
                    <div className="flex flex-col gap-2">
                    <label className="text-font-1 text-[var(--color-gray)]">
                        Format JSON untuk konfigurasi tipe pembayaran.
                    </label>
                    <textarea
                        {...register("payment_type")}
                        rows={4}
                        className="w-full font-mono text-sm rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                        placeholder='{"qris":"QRIS","debit":"Debit"}'
                    />
                </div>
            )}
        </div>
    );
};