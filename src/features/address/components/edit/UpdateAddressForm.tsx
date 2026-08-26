"use client";

import React from "react";
import { AlertCircle, CheckCircle, Loader2, Trash } from "lucide-react";
import Link from "next/link";
import { Address } from "@/features/address/types/address.types";
import { useUpdateAddressForm } from "@/features/address/hooks/useUpdateAddressForm";

interface UpdateAddressFormProps {
  address: Address;
}

export function UpdateAddressForm({ address }: UpdateAddressFormProps) {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    isDeleting,
    options,
    loaders,
    modal,
    feedbackMessage,
  } = useUpdateAddressForm(address);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg relative">
      {/* Dynamic inline notification banners */}
      {feedbackMessage && (
        <div
          className={`mb-6 p-4 rounded-md text-font-2 flex items-start gap-2 border ${
            feedbackMessage.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {loaders.isLoadingOptions ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--mama-hot-pink)] mb-3" />
          <p className="text-font-2">Memuat detil pilihan alamat...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ROW 1: Name and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="flex flex-col">
              <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
                Nama Penerima
              </label>
              <input
                type="text"
                className="w-full border-0 border-b border-gray-300 focus:border-[var(--mama-hot-pink)] focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none transition-colors"
                {...register("name", { required: "Nama wajib diisi" })}
              />
              {errors.name && (
                <span className="text-red-500 text-font-1 mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
                Nomor Handphone
              </label>
              <div className="flex items-center border-b border-gray-300 focus-within:border-[var(--mama-hot-pink)] transition-colors">
                <span className="text-[var(--mama-brown)] font-medium text-font-2 mr-2 py-2">
                  +62
                </span>
                <input
                  type="tel"
                  className="w-full border-0 focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none"
                  {...register("phoneNumber", {
                    required: "Nomor handphone wajib diisi",
                  })}
                />
              </div>
              {errors.phoneNumber && (
                <span className="text-red-500 text-font-1 mt-1">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>

          {/* ROW 2: Province and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="flex flex-col">
              <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
                Provinsi
              </label>
              <select
                className="w-full border-0 border-b border-gray-300 focus:border-[var(--mama-hot-pink)] focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none transition-colors cursor-pointer"
                {...register("provinceId", {
                  required: "Provinsi wajib dipilih",
                })}
              >
                <option value="">Pilih Provinsi</option>
                {options.provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
              {errors.provinceId && (
                <span className="text-red-500 text-font-1 mt-1">
                  {errors.provinceId.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
                Kota
              </label>
              <select
                className="w-full border-0 border-b border-gray-300 focus:border-[var(--mama-hot-pink)] focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none transition-colors cursor-pointer"
                {...register("cityId", { required: "Kota wajib dipilih" })}
                disabled={!options.cities.length || loaders.isLoadingCities}
              >
                <option value="">
                  {loaders.isLoadingCities ? "Memuat..." : "Pilih Kota"}
                </option>
                {options.cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 3: District and Zip Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="flex flex-col">
              <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
                Kecamatan
              </label>
              <select
                className="w-full border-0 border-b border-gray-300 focus:border-[var(--mama-hot-pink)] focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none transition-colors cursor-pointer"
                {...register("districtId", {
                  required: "Kecamatan wajib dipilih",
                })}
                disabled={
                  !options.districts.length || loaders.isLoadingDistricts
                }
              >
                <option value="">
                  {loaders.isLoadingDistricts ? "Memuat..." : "Pilih Kecamatan"}
                </option>
                {options.districts.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
                Kodepos
              </label>
              <div className="flex gap-2">
                <select
                  className="w-1/2 border-0 border-b border-gray-300 focus:border-[var(--mama-hot-pink)] focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none transition-colors cursor-pointer"
                  {...register("subdistrictId", {
                    required: "Kelurahan wajib dipilih",
                  })}
                  disabled={
                    !options.subdistricts.length ||
                    loaders.isLoadingSubdistricts
                  }
                >
                  <option value="">
                    {loaders.isLoadingSubdistricts ? "Memuat..." : "Kelurahan"}
                  </option>
                  {options.subdistricts.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Kodepos"
                  readOnly
                  className="w-1/2 border-0 border-b border-gray-300 px-0 py-2 bg-transparent text-font-2 text-gray-500 outline-none cursor-not-allowed"
                  {...register("zipCode")}
                />
              </div>
              {errors.subdistrictId && (
                <span className="text-red-500 text-font-1 mt-1">
                  {errors.subdistrictId.message}
                </span>
              )}
            </div>
          </div>

          {/* ROW 4: Street */}
          <div className="flex flex-col">
            <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
              Nama Jalan, Gedung, No Rumah
            </label>
            <input
              type="text"
              className="w-full border-0 border-b border-gray-300 focus:border-[var(--mama-hot-pink)] focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none transition-colors"
              {...register("street", {
                required: "Alamat lengkap wajib diisi",
              })}
            />
            {errors.street && (
              <span className="text-red-500 text-font-1 mt-1">
                {errors.street.message}
              </span>
            )}
          </div>

          {/* ROW 5: Details */}
          <div className="flex flex-col">
            <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
              Detail Lainnya (Optional)
            </label>
            <input
              type="text"
              className="w-full border-0 border-b border-gray-300 focus:border-[var(--mama-hot-pink)] focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none transition-colors"
              {...register("details")}
            />
          </div>

          {/* ROW 6: Label */}
          <div className="flex flex-col">
            <label className="text-[var(--mama-brown)] font-bold text-font-2 mb-2">
              Simpan Sebagai (Label)
            </label>
            <input
              type="text"
              className="w-full border-0 border-b border-gray-300 focus:border-[var(--mama-hot-pink)] focus:ring-0 px-0 py-2 bg-transparent text-font-2 text-gray-800 outline-none transition-colors"
              {...register("label", { required: "Label alamat wajib diisi" })}
            />
          </div>

          {/* Actions Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
            {/* Delete trigger */}
            <button
              type="button"
              onClick={() => modal.setIsDeleteModalOpen(true)}
              className="w-full sm:w-auto text-red-500 hover:text-red-700 font-bold flex items-center justify-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 rounded-full transition-colors order-2 sm:order-1"
            >
              <Trash className="w-4 h-4" />
              Hapus Alamat
            </button>

            {/* Save and Cancel buttons */}
            <div className="flex w-full sm:w-auto items-center gap-4 order-1 sm:order-2">
              <Link
                href="/account/addresses"
                className="w-1/2 sm:w-auto text-center border border-gray-300 text-[var(--mama-brown)] font-bold py-3 px-6 rounded-full transition-colors hover:bg-gray-50"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 sm:w-auto bg-[var(--mama-hot-pink)] hover:bg-[#c24467] text-white font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal (Native React implementation) */}
      {modal.isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg transform transition-all animate-in fade-in zoom-in duration-200">
            <h3 className="text-font-3 font-bold text-[var(--mama-brown)] mb-2">
              Hapus Alamat
            </h3>
            <p className="text-font-2 text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus alamat &quot;{address.usedFor}
              &quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => modal.setIsDeleteModalOpen(false)}
                className="w-1/2 border border-gray-300 text-[var(--mama-brown)] font-bold py-2 rounded-full hover:bg-gray-50 transition-colors text-font-2"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={modal.handleDelete}
                disabled={isDeleting}
                className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-full transition-colors flex justify-center items-center gap-2 text-font-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
