import { Button } from "@/components/ui/button";

export function SocialLogins() {
  return (
    <div className="space-y-4 pt-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium italic">
            Atau lanjutkan dengan
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="rounded-xl gap-2 font-semibold">
          {/* <Chrome className="w-4 h-4 text-red-500" /> */}
          Google
        </Button>
        <Button variant="outline" className="rounded-xl gap-2 font-semibold">
          {/* <Facebook className="w-4 h-4 text-blue-600" /> */}
          Facebook
        </Button>
      </div>
    </div>
  );
}
