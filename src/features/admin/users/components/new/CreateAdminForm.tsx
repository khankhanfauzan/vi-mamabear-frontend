"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateAdminPayload } from "@/features/admin/users/types/admin.types";
import { useCreateAdmin } from "@/features/admin/users/hooks/useCreateAdmin";

export function CreateAdminForm() {
  const router = useRouter();
  const { submitAdmin, isLoading, error, success } = useCreateAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAdminPayload>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "ADMIN",
      password: "",
    },
  });

  const onSubmit = async (data: CreateAdminPayload) => {
    const isSuccess = await submitAdmin(data);
    if (isSuccess) {
      // Optional: Delay redirect to show success message, or redirect immediately
      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl">
      {/* Success State */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-green-800">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="font-medium text-sm">
            Admin berhasil ditambahkan! Mengalihkan...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name", { required: "Nama lengkap wajib diisi" })}
            type="text"
            placeholder="Masukkan nama lengkap"
            disabled={isLoading || success}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[--mama-hot-pink] focus:border-transparent outline-none transition-all ${
              errors.name ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format email tidak valid",
              },
            })}
            type="email"
            placeholder="admin@mamabear.id"
            disabled={isLoading || success}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[--mama-hot-pink] focus:border-transparent outline-none transition-all ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nomor Telepon
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="081234567890"
            disabled={isLoading || success}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[--mama-hot-pink] focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Peran <span className="text-red-500">*</span>
          </label>
          <select
            {...register("role", { required: "Peran wajib dipilih" })}
            disabled={isLoading || success}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[--mama-hot-pink] focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="ADMIN">Admin</option>
            <option value="SUPERADMIN">Super Admin</option>
          </select>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Kata Sandi <span className="text-red-500">*</span>
          </label>
          <input
            {...register("password", {
              required: "Kata sandi wajib diisi",
              minLength: {
                value: 6,
                message: "Kata sandi minimal 6 karakter",
              },
            })}
            type="password"
            placeholder="Minimal 6 karakter"
            disabled={isLoading || success}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[--mama-hot-pink] focus:border-transparent outline-none transition-all ${
              errors.password ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading || success}
            className="px-6 py-2.5 text-gray-600 font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading || success}
            className="flex items-center gap-2 px-6 py-2.5 bg-[--mama-hot-pink] text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:opacity-70 transition-all shadow-sm"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Menyimpan..." : "Simpan Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}
