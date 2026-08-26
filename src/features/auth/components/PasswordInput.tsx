import React, { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { FieldError } from "react-hook-form";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

/**
 * Reusable Password Input component.
 * Uses React.forwardRef to allow React Hook Form registration.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-2">
        <Label
          htmlFor={props.id}
          className="font-bold text-[var(--mama-brown)] ml-1"
        >
          {label}
        </Label>
        <div className="relative group">
          <Lock
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
              error
                ? "text-destructive"
                : "text-stone-400 group-focus-within:text-primary"
            }`}
          />
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            {...props}
            className={`pl-10 pr-10 border-0 border-b border-gray-300 
              [&::placeholder]:text-[0.6rem] [&::placeholder]:text-stone-400 
              [&::placeholder]:font-semibold rounded-none ${
              error
                ? "border-destructive focus-visible:ring-destructive/20"
                : "border-stone-200 focus-visible:ring-primary/20"
            } ${className || ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {error && (
          <p className="text-xs text-destructive ml-1">{error.message}</p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
