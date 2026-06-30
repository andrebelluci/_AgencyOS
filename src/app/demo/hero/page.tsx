import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { DEV_PUBLIC_KEY } from "@/lib/tenant/constants";
import { cn } from "@/lib/utils";

const HERO_CHAT_SRC = `/chat?key=${encodeURIComponent(DEV_PUBLIC_KEY)}&mode=hero&inline=1`;

export default function HeroDemoPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-tight">
            Agency OS — Hero conversacional
          </span>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Início
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-10 lg:grid-cols-2 lg:items-center">
        <section className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            ISSUE-036 · V0.2
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Qual serviço você procura?
          </h1>
          <p className="max-w-lg text-muted-foreground">
            Demo do fluxo guiado na hero: serviço, cidade, prazo e contato —
            estados pré-definidos, sem LLM gerando layout. Ao final, lead
            qualificado e CTA WhatsApp.
          </p>
          <p className="text-sm text-muted-foreground">
            Tenant dev: <code className="rounded bg-muted px-1.5 py-0.5">{DEV_PUBLIC_KEY}</code>
          </p>
        </section>

        <section className="w-full">
          <iframe
            title="Hero conversacional"
            src={HERO_CHAT_SRC}
            className="h-[min(520px,70vh)] w-full rounded-xl border bg-background shadow-sm"
            allow="clipboard-write"
          />
        </section>
      </main>
    </div>
  );
}
