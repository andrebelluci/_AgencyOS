"use client";

import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WhatsAppCtaProps = {
  url: string;
  onClick: () => void;
};

export function WhatsAppCta({ url, onClick }: WhatsAppCtaProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 pb-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        data-testid="whatsapp-cta"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-10 w-full gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] focus-visible:ring-[#25D366]/40",
        )}
      >
        <MessageCircle aria-hidden />
        Continuar no WhatsApp
      </a>
    </div>
  );
}
