"use client";

import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WhatsAppCtaProps = {
  url: string;
  onClick: () => void;
  primaryColor?: string;
};

export function WhatsAppCta({ url, onClick, primaryColor }: WhatsAppCtaProps) {
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
          "h-10 w-full gap-2 text-white hover:opacity-90 focus-visible:ring-2",
          !primaryColor && "bg-[#25D366] hover:bg-[#20bd5a] focus-visible:ring-[#25D366]/40",
        )}
        style={
          primaryColor
            ? {
                backgroundColor: primaryColor,
                borderColor: primaryColor,
              }
            : undefined
        }
      >
        <MessageCircle aria-hidden />
        Continuar no WhatsApp
      </a>
    </div>
  );
}
