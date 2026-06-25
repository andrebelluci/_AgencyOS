"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EmbedCodeCardProps = {
  snippet: string;
  publicKey: string;
};

export function EmbedCodeCard({ snippet, publicKey }: EmbedCodeCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Instalar no site</CardTitle>
        <CardDescription>
          Cole este código antes do fechamento da tag{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;/body&gt;</code>{" "}
          no HTML do seu site.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <pre
            className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs leading-relaxed"
            data-testid="embed-snippet"
            data-public-key={publicKey}
          >
            <code>{snippet}</code>
          </pre>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Chave pública:{" "}
            <code className="rounded bg-muted px-1 py-0.5">{publicKey}</code>
          </p>

          <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="size-4" aria-hidden />
                Copiado
              </>
            ) : (
              <>
                <Copy className="size-4" aria-hidden />
                Copiar código
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
