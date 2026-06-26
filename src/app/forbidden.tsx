import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Acesso negado</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Você não tem permissão para acessar esta área.
      </p>
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Voltar ao painel
      </Link>
    </div>
  );
}
