"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createTenantAction } from "@/app/(admin)/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateTenantForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createTenantAction({
        companyName: String(formData.get("companyName") ?? ""),
        slug: String(formData.get("slug") ?? "") || undefined,
        ownerEmail: String(formData.get("ownerEmail") ?? ""),
        ownerPassword: String(formData.get("ownerPassword") ?? ""),
        ownerName: String(formData.get("ownerName") ?? "") || undefined,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.result) {
        const status = result.result.created ? "criado" : "já existia";
        setSuccessMessage(
          `Tenant ${status}: slug "${result.result.slug}", public_key "${result.result.publicKey}", owner ${result.result.ownerEmail}.`,
        );
        router.refresh();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do tenant</CardTitle>
        <CardDescription>
          O slug é gerado automaticamente a partir do nome se deixado em branco.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa</Label>
            <Input
              id="companyName"
              name="companyName"
              required
              placeholder="Acme Acabamentos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (opcional)</Label>
            <Input id="slug" name="slug" placeholder="acme-acabamentos" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Nome do owner (opcional)</Label>
            <Input id="ownerName" name="ownerName" placeholder="Maria Silva" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmail">E-mail do owner</Label>
            <Input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              required
              placeholder="owner@acme.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerPassword">Senha do owner</Label>
            <Input
              id="ownerPassword"
              name="ownerPassword"
              type="password"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          {successMessage ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
              {successMessage}
            </p>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Criando…" : "Criar tenant"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
