"use client";

import React, { useState } from "react";
import {
    Save,
    AlertCircle,
    CheckCircle2,
    Store,
    Truck,
    CreditCard,
    Percent,
} from "lucide-react";
import { Setting } from "@/features/admin/settings/types/setting.types";
import { useSettings } from "../hooks/useSetting";
import { ShippingTab } from "./ShippingTab";
import { PaymentTab } from "./PaymentTab";
import { TaxTab } from "./TaxTab";
import { StoreTab } from "./StoreTab";

interface SettingsViewProps {
    initialSettings: Setting[];
}

type TabId = "store" | "shipping" | "payment" | "tax";

export const SettingsView: React.FC<SettingsViewProps> = ({
    initialSettings,
}) => {
    const [activeTab, setActiveTab] = useState<TabId>("store");
    const { form, onSubmit, isSubmitting, submitError, submitSuccess } =
        useSettings(initialSettings);
    const { register } = form;

    const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
        {
            id: "store",
            label: "Pengaturan Toko",
            icon: <Store className="w-4 h-4" />,
        },
        {
            id: "shipping",
            label: "Pengiriman",
            icon: <Truck className="w-4 h-4" />,
        },
        {
            id: "payment",
            label: "Pembayaran",
            icon: <CreditCard className="w-4 h-4" />,
        },
        { id: "tax", label: "Pajak", icon: <Percent className="w-4 h-4" /> },
    ];

    return (
        <div className="w-full flex flex-col gap-6">
        {/* Header Section */}
            <div>
                <h1 className="text-font-5 md:text-font-6 font-bold text-[var(--mama-brown)]">
                Pengaturan
                </h1>
                <p className="text-font-1 md:text-font-2 text-[var(--color-gray)] mt-1">
                Kelola konfigurasi, layanan, dan informasi kontak toko Anda.
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar gap-2">
                {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap flex items-center gap-2 px-4 py-3 text-font-2 font-medium transition-colors ${
                    activeTab === tab.id
                        ? "border-b-2 border-[var(--mama-hot-pink)] text-[var(--mama-hot-pink)]"
                        : "text-[var(--color-gray)] hover:text-[var(--mama-brown)]"
                    }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
                ))}
            </div>

            {/* Status Messages */}
            {submitError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-md border border-red-200 text-font-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{submitError}</p>
                </div>
            )}

            {submitSuccess && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-md border border-green-200 text-font-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p>Pengaturan berhasil disimpan!</p>
                </div>
            )}

        {/* Form Container */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <form onSubmit={onSubmit} className="flex flex-col gap-8">
                    {/* Render Active Tab Sub-component */}
                    {activeTab === "store" && <StoreTab register={register} />}
                    {activeTab === "shipping" && (
                        <ShippingTab
                        register={register}
                        watch={form.watch}
                        setValue={form.setValue}
                        />
                    )}
                    {activeTab === "payment" && (
                        <PaymentTab
                        register={register}
                        watch={form.watch}
                        setValue={form.setValue}
                        />
                    )}
                    {activeTab === "tax" && <TaxTab register={register} />}

                    {/* Form Actions */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 bg-[var(--mama-hot-pink)] hover:bg-[#c44a6f] text-white px-8 py-3 rounded-md font-medium text-font-2 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                        <Save className="w-5 h-5" />
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
