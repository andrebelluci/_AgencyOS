"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { ColorPickerField } from "@/components/settings/color-picker-field";
import { QuickActionsEditor } from "@/components/settings/quick-actions-editor";
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
import { DEFAULT_PRIMARY_COLOR } from "@/modules/provisioning/defaults";
import {
  INITIAL_MESSAGE_PLACEHOLDER,
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
    control,
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
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Empresa</CardTitle>
          <CardDescription>
            Dados exibidos no widget e usados pelos agentes de IA.
          </CardDescription>
        </CardHeader>

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
            <p className="text-xs text-muted-foreground">Um serviço por linha.</p>
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
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Widget</CardTitle>
          <CardDescription>
            Mensagem inicial, identidade visual e ações rápidas do Funcionário
            Digital no site.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assistantLabel">Nome do assistente</Label>
            <Input
              id="assistantLabel"
              disabled={isPending}
              placeholder="Assistente virtual"
              aria-invalid={Boolean(errors.assistantLabel)}
              {...register("assistantLabel")}
            />
            <p className="text-xs text-muted-foreground">
              Subtítulo exibido abaixo do nome da empresa no chat. Ex.:{" "}
              <em>Concierge</em>, <em>Assistente do casal</em>. Default:{" "}
              Funcionário Digital.
            </p>
            {errors.assistantLabel ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.assistantLabel.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialMessage">Mensagem inicial</Label>
            <Textarea
              id="initialMessage"
              rows={4}
              disabled={isPending}
              aria-invalid={Boolean(errors.initialMessage)}
              {...register("initialMessage")}
            />
            <p className="text-xs text-muted-foreground">
              Use <code className="text-xs">{"{{company_name}}"}</code> e{" "}
              <code className="text-xs">{"{{assistant_label}}"}</code> como
              variáveis. Exemplo: {INITIAL_MESSAGE_PLACEHOLDER}
            </p>
            {errors.initialMessage ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.initialMessage.message}
              </p>
            ) : null}
          </div>

          <Controller
            control={control}
            name="primaryColor"
            render={({ field }) => (
              <ColorPickerField
                id="primaryColor"
                value={field.value || DEFAULT_PRIMARY_COLOR}
                onChange={field.onChange}
                disabled={isPending}
                error={errors.primaryColor?.message}
              />
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="widgetTheme">Tema do widget</Label>
            <select
              id="widgetTheme"
              disabled={isPending}
              aria-invalid={Boolean(errors.widgetTheme)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("widgetTheme")}
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="auto">Automático (sistema)</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Aplica ao chat em <code className="text-xs">/chat</code> e ao painel
              do embed. <em>Automático</em> segue{" "}
              <code className="text-xs">prefers-color-scheme</code> do visitante.
            </p>
            {errors.widgetTheme ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.widgetTheme.message}
              </p>
            ) : null}
          </div>

          <QuickActionsEditor
            control={control}
            errors={errors}
            disabled={isPending}
          />
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-3 border-t bg-transparent sm:flex-row sm:justify-end">
          {serverError ? (
            <p className="text-sm text-destructive sm:mr-auto" role="alert">
              {serverError}
            </p>
          ) : null}

          {success ? (
            <p
              className="text-sm text-green-700 dark:text-green-400 sm:mr-auto"
              role="status"
            >
              Configurações salvas com sucesso.
            </p>
          ) : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando…" : "Salvar"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
