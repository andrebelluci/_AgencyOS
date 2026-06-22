"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import {
  tenantSettingsFormSchema,
  type TenantSettingsFormValues,
} from "@/modules/settings/schema";

import { updateTenantSettingsAction } from "./actions";

type SettingsFormProps = {
  defaultValues: TenantSettingsFormValues;
};

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TenantSettingsFormValues>({
    resolver: zodResolver(tenantSettingsFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateTenantSettingsAction(data);

      if (result.error) {
        setServerError(result.error);
        return;
      }

      setSuccess(true);
      reset(data);
    });
  });

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Empresa</CardTitle>
        <CardDescription>
          Dados exibidos no widget e usados pelos agentes de IA.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa</Label>
            <Input
              id="companyName"
              autoComplete="organization"
              disabled={isPending}
              aria-invalid={Boolean(errors.companyName)}
              {...register("companyName")}
            />
            {errors.companyName ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.companyName.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="5511999999999"
                disabled={isPending}
                {...register("whatsapp")}
              />
              <p className="text-xs text-muted-foreground">
                Apenas números, com DDI e DDD.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                autoComplete="address-level2"
                disabled={isPending}
                {...register("city")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servicesText">Serviços</Label>
            <Textarea
              id="servicesText"
              rows={5}
              placeholder={"Cimento queimado\nPorcelanato\nReformas"}
              disabled={isPending}
              {...register("servicesText")}
            />
            <p className="text-xs text-muted-foreground">
              Um serviço por linha.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">Prompt do sistema</Label>
            <Textarea
              id="systemPrompt"
              rows={6}
              placeholder="Instruções adicionais para o assistente virtual…"
              disabled={isPending}
              {...register("systemPrompt")}
            />
            <p className="text-xs text-muted-foreground">
              Complementa o comportamento padrão do agente de vendas.
            </p>
          </div>

          {serverError ? (
            <p className="text-sm text-destructive" role="alert">
              {serverError}
            </p>
          ) : null}

          {success ? (
            <p className="text-sm text-green-700 dark:text-green-400" role="status">
              Configurações salvas com sucesso.
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="justify-end border-t-0 bg-transparent">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando…" : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
