import React, { useState, useEffect } from "react";
import {
    UseFormRegister,
    UseFormWatch,
    UseFormSetValue,
    FieldValues,
} from "react-hook-form";
import { Plus, X, Truck, Info } from "lucide-react";

// Assuming your shipping service and types are located in the shipping feature directory
import {
    getProvinces,
    getCities,
    getDistricts,
    getSubdistricts,
} from "@/features/address/services/shippingService";
import { Region, Subdistrict } from "@/features/address/types/shipping.types";

export const ShippingTab: React.FC<{
    register: UseFormRegister<FieldValues>;
    watch?: UseFormWatch<FieldValues>;
    setValue?: UseFormSetValue<FieldValues>;
}> = ({ register, watch, setValue }) => {
    const [newCourierKey, setNewCourierKey] = useState("");
    const [newCourierName, setNewCourierName] = useState("");

    // Address Waterfall State
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [cities, setCities] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>("");
    const [zipCode, setZipCode] = useState<string>("");

    const courierValue = watch ? watch("courier") : "";
    const currentProvince = watch ? watch("addr_province") : "";
    const currentAddrId = watch ? watch("addr_id") : "";

  // Parse Courier JSON safely into an object map
    let couriersObj: Record<string, string> = {};
    if (courierValue) {
        try {
            const parsed = JSON.parse(courierValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
                couriersObj = parsed[0];
            } else if (typeof parsed === "object" && parsed !== null) {
                couriersObj = parsed;
            }
        } catch {
        // Ignore invalid JSON formatting while editing
        }
    }

    // 1. Fetch Provinces on Mount
    useEffect(() => {
        const fetchProvincesData = async () => {
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (error) {
                console.error("Failed to fetch provinces", error);
            }
        };
        fetchProvincesData();
    }, []);

    // 2. Fetch Cities when Province changes
    useEffect(() => {
        if (!selectedProvince) {
            setCities([]);
            return;
        }
        const fetchCitiesData = async () => {
            try {
                const data = await getCities(Number(selectedProvince));
                setCities(data);
            } catch (error) {
                console.error("Failed to fetch cities", error);
            }
        };
        fetchCitiesData();
    }, [selectedProvince]);

    // 3. Fetch Districts when City changes
    useEffect(() => {
        if (!selectedCity) {
            setDistricts([]);
            return;
        }
        const fetchDistrictsData = async () => {
            try {
                const data = await getDistricts(Number(selectedCity));
                setDistricts(data);
            } catch (error) {
                console.error("Failed to fetch districts", error);
            }
        };
        fetchDistrictsData();
    }, [selectedCity]);

    // 4. Fetch Subdistricts when District changes
    useEffect(() => {
        if (!selectedDistrict) {
            setSubdistricts([]);
            return;
        }
        const fetchSubdistrictsData = async () => {
            try {
                const data = await getSubdistricts(Number(selectedDistrict));
                setSubdistricts(data);
            } catch (error) {
                console.error("Failed to fetch subdistricts", error);
            }
        };
        fetchSubdistrictsData();
    }, [selectedDistrict]);

    // Handlers for Select Changes
    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provId = e.target.value;
        setSelectedProvince(provId);

        // Update Form State for Province Name
        const prov = provinces.find((p) => p.id.toString() === provId);
        if (prov && setValue) {
            setValue("addr_province", prov.name, { shouldDirty: true });
        }

        // Reset Children fields and state
        setSelectedCity("");
        setSelectedDistrict("");
        setSelectedSubdistrict("");
        setZipCode("");
        if (setValue) {
            setValue("addr_id", "", { shouldDirty: true });
        }
    };

    const handleSubdistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subId = e.target.value;
        setSelectedSubdistrict(subId);

        // Find subdistrict to extract zip code and bind the Subdistrict ID to addr_id
        const sub = subdistricts.find((s) => s.id.toString() === subId);
        if (sub && setValue) {
            setZipCode(sub.zip_code);
            // Backend expects the subdistrict ID as the address identifier
            setValue("addr_id", sub.id.toString(), { shouldDirty: true });
        }
    };

    // Courier Handlers
    const handleAddCourier = () => {
        if (!newCourierKey || !newCourierName || !setValue) return;

        const updated = {
            ...couriersObj,
            [newCourierKey.toLowerCase()]: newCourierName,
        };
        setValue("courier", JSON.stringify([updated], null, 2), {
            shouldDirty: true,
        });

        setNewCourierKey("");
        setNewCourierName("");
    };

    const handleRemoveCourier = (keyToRemove: string) => {
        if (!setValue) return;

        const updated = { ...couriersObj };
        delete updated[keyToRemove];
        setValue("courier", JSON.stringify([updated], null, 2), {
            shouldDirty: true,
        });
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h2 className="text-font-3 md:text-font-4 font-bold text-[var(--mama-brown)]">
            Asal Pengiriman
        </h2>

        {/* Info Notice showing currently saved values from Backend */}
        {(currentProvince || currentAddrId) && !selectedProvince && (
            <div className="flex items-end gap-2 bg-blue-50 text-blue-700 p-3 rounded-md border border-blue-200 text-sm">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
                Alamat tersimpan saat ini: <strong>{currentProvince}</strong> (ID:{" "}
                {currentAddrId}). Gunakan dropdown di bawah untuk mengubah dan
                menetapkan lokasi baru.
            </p>
            </div>
        )}

        {/* Hidden inputs to keep react-hook-form properly synced */}
        <input type="hidden" {...register("addr_province")} />
        <input type="hidden" {...register("addr_id")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provinsi */}
            <div className="flex flex-col gap-2">
            <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                Provinsi
            </label>
            <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all bg-white"
            >
                <option value="">Pilih Provinsi</option>
                {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                    {p.name}
                </option>
                ))}
            </select>
            </div>

            {/* Kota/Kabupaten */}
            <div className="flex flex-col gap-2">
            <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                Kota / Kabupaten
            </label>
            <select
                value={selectedCity}
                onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedDistrict("");
                setSelectedSubdistrict("");
                setZipCode("");
                }}
                disabled={!selectedProvince}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                <option value="">Pilih Kota</option>
                {cities.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name}
                </option>
                ))}
            </select>
            </div>

            {/* Kecamatan */}
            <div className="flex flex-col gap-2">
            <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                Kecamatan
            </label>
            <select
                value={selectedDistrict}
                onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedSubdistrict("");
                setZipCode("");
                }}
                disabled={!selectedCity}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                <option value="">Pilih Kecamatan</option>
                {districts.map((d) => (
                <option key={d.id} value={d.id}>
                    {d.name}
                </option>
                ))}
            </select>
            </div>

            {/* Kelurahan & Kode Pos */}
            <div className="flex flex-col gap-2">
            <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                Kelurahan & Kode Pos
            </label>
            <div className="flex gap-2">
                <select
                value={selectedSubdistrict}
                onChange={handleSubdistrictChange}
                disabled={!selectedDistrict}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                <option value="">Pilih Kelurahan</option>
                {subdistricts.map((s) => (
                    <option key={s.id} value={s.id}>
                    {s.name}
                    </option>
                ))}
                </select>
                <input
                type="text"
                readOnly
                value={zipCode}
                placeholder="Kode Pos"
                className="w-24 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-font-2 text-center focus:outline-none cursor-not-allowed text-gray-500"
                />
            </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 mt-2">
            <label className="text-font-1 md:text-font-2 font-semibold text-[var(--mama-brown)]">
                Alamat Lengkap / Detail Jalan
            </label>
            <textarea
                {...register("addr")}
                rows={3}
                placeholder="Contoh: Jl. Sudirman No. 12, Patokan samping minimarket"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
            />
            </div>
        </div>

        <h2 className="text-font-3 md:text-font-4 font-bold text-[var(--mama-brown)] mt-4">
            Konfigurasi Kurir
        </h2>

        {watch && setValue ? (
            <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="text-font-1 text-[var(--color-gray)]">
                Kelola daftar kurir yang tersedia untuk pengiriman. Tambahkan atau
                hapus kurir di bawah ini.
            </label>

            <textarea {...register("courier")} className="hidden" />

            <div className="flex flex-wrap gap-2">
                {Object.entries(couriersObj).map(([key, name]) => (
                <div
                    key={key}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded-full shadow-sm text-font-2"
                >
                    <Truck className="w-3.5 h-3.5 text-[var(--mama-hot-pink)]" />
                    <span className="font-medium text-[var(--mama-brown)]">
                    {name}
                    </span>
                    <span className="text-gray-400 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                    {key}
                    </span>
                    <button
                    type="button"
                    onClick={() => handleRemoveCourier(key)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1 p-0.5 rounded-full hover:bg-red-50"
                    title="Hapus kurir"
                    >
                    <X className="w-4 h-4" />
                    </button>
                </div>
                ))}
                {Object.keys(couriersObj).length === 0 && (
                <p className="text-sm text-gray-500 italic px-2 py-1">
                    Belum ada kurir yang dikonfigurasi.
                </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-4 border-t border-gray-200">
                <input
                type="text"
                placeholder="Kode (mis. jne)"
                value={newCourierKey}
                onChange={(e) =>
                    setNewCourierKey(
                    e.target.value.toLowerCase().replace(/\s+/g, ""),
                    )
                }
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)]"
                />
                <input
                type="text"
                placeholder="Nama Tampil (mis. JNE Reguler)"
                value={newCourierName}
                onChange={(e) => setNewCourierName(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)]"
                />
                <button
                type="button"
                onClick={handleAddCourier}
                disabled={!newCourierKey || !newCourierName}
                className="flex items-center justify-center gap-1 bg-[var(--mama-brown)] hover:bg-[#6c4e4e] text-white px-4 py-2 rounded-md font-medium text-font-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <Plus className="w-4 h-4" />
                Tambah
                </button>
            </div>
            </div>
        ) : (
            <div className="flex flex-col gap-2">
            <label className="text-font-1 text-[var(--color-gray)]">
                Format JSON untuk daftar kurir yang tersedia.
            </label>
            <textarea
                {...register("courier")}
                rows={4}
                className="w-full font-mono text-sm rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all"
                placeholder='[{"jne":"JNE","sicepat":"Sicepat"}]'
            />
            </div>
        )}
        </div>
    );
};
