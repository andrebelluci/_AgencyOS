import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MarketingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-tight">Agency OS</span>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col justify-center gap-6 px-4 py-16">
        <p className="text-sm font-medium text-muted-foreground">Funcionário Digital</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground">
          Transforme visitantes em oportunidades comerciais, 24 horas por dia.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Chat IA, captura de leads e encaminhamento para WhatsApp — multi-tenant desde
          o primeiro commit.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className={cn(buttonVariants())}>
            Acessar painel
          </Link>
          <Link href="/chat" className={cn(buttonVariants({ variant: "outline" }))}>
            Ver widget
          </Link>
        </div>
      </main>
    </div>
  );
}
