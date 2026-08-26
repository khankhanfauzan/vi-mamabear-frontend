"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLogins } from "@/features/auth/components/SocialLogins";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { LoginPayload } from "@/features/auth/types/auth.types";
import {
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, serverError, handleLogin } = useLogin();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  return (
    <div className="space-y-4">
      {/* Error */}
      {serverError && (
        <div className="flex items-center gap-2 p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
          <AlertCircle className="w-4 h-4" />
          {serverError}
        </div>
      )}

      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleLogin)}
        noValidate
      >
        {/* EMAIL */}
        <div className="space-y-2">
          <Label className="font-bold text-[var(--mama-brown)] ml-1">
            Email
          </Label>

          <div className="relative group">
            <Mail
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                errors.email
                  ? "text-destructive"
                  : "text-stone-400 group-focus-within:text-primary"
              }`}
            />

            <Input
              type="email"
              placeholder="mama@contoh.com"
              {...register("email", {
                required: "Email wajib diisi",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Format email tidak valid",
                },
              })}
              className={`pl-10 bg-white border-0 border-b border-gray-300 
              [&::placeholder]:text-[0.6rem] [&::placeholder]:text-stone-400 
              [&::placeholder]:font-semibold rounded-none ${
                errors.email
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "border-stone-200 focus-visible:ring-primary/20"
              }`}
            />
          </div>

          {errors.email && (
            <p className="text-destructive ml-1">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <Label className="font-bold text-[var(--mama-brown)]">
              Password
            </Label>

            <Button
              variant="link"
              asChild
              className="text-[11px] font-bold text-primary p-0 h-auto"
            >
              <Link href="/forgot-password">Lupa sandi?</Link>
            </Button>
          </div>

          <div className="relative group">
            <Lock
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                errors.password
                  ? "text-destructive"
                  : "text-stone-400 group-focus-within:text-primary"
              }`}
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
              {...register("password", {
                required: "Kata sandi wajib diisi",
              })}
              className={`pl-10 pr-10 bg-white border-0 border-b border-gray-300 
              [&::placeholder]:text-[0.6rem] [&::placeholder]:text-stone-400 
              [&::placeholder]:font-semibold rounded-none ${
                errors.password
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "border-stone-200 focus-visible:ring-primary/20"
              }`}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-400 h-8 w-8"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>

          {errors.password && (
            <p className="text-destructive ml-1">{errors.password.message}</p>
          )}
        </div>

        {/* REMEMBER ME */}
        <div className="flex items-center space-x-2 px-1 py-1">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="remember"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-stone-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary text-white"
              />
            )}
          />
          <Label
            htmlFor="remember"
            className="text-xs font-semibold text-stone-500 cursor-pointer select-none"
          >
            Ingat saya
          </Label>
        </div>

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white h-12 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all rounded-full"
        >
          {loading ? "Memproses..." : "Masuk Sekarang"}
          {!loading && <ChevronRight className="w-4 h-4" />}
        </Button>
      </form>

      <SocialLogins />

      <p className="text-center text-stone-500 pt-2">
        Belum punya akun?{" "}
        <Button
          variant="link"
          asChild
          className="font-bold text-primary p-0 h-auto"
        >
          <Link href="/register">Daftar di sini</Link>
        </Button>
      </p>
    </div>
  );
}
