import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthLayoutProps } from "../types/auth.types";
import Image from "next/image";

export function AuthLayout({
  children,
  title,
  backToHref,
  backToLabel,
  showImage = true,
}: AuthLayoutProps) {
  return (
    <div className="font-sans selection:bg-primary/20 py-24">
      <div className="flex justify-center items-center gap-12">
        {/* Form */}
        <div className="flex flex-col gap-4 font-sans selection:bg-primary/20 lg:p-0 w-full lg:w-1/3">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-xl font-extrabold text-[var(--mama-brown)] tracking-tight">
              {title}
            </h2>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Decorative branding elements */}
            {children}
            {backToHref && backToLabel && (
              <p className="mt-6 text-center">
                <Button
                  variant="link"
                  asChild
                  className="gap-2 text-primary hover:text-primary/80 rounded-xl"
                >
                  <Link href={backToHref}>
                    <ArrowLeft className="w-4 h-4" />
                    {backToLabel}
                  </Link>
                </Button>
              </p>
            )}
          </div>
        </div>
        {/* End Form */}

        {/* Conditional Image Rendering */}
        {showImage && (
          <div className="w-1/3 hidden lg:block">
            <Image
              src={"/images/auth/ambasador.webp"}
              alt="Mamabear Ambassador"
              width={550}
              height={550}
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
