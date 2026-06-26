"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, type Control, type FieldErrors } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TenantSettingsFormValues } from "@/modules/settings/schema";

type QuickActionsEditorProps = {
  control: Control<TenantSettingsFormValues>;
  errors: FieldErrors<TenantSettingsFormValues>;
  disabled?: boolean;
};

export function QuickActionsEditor({
  control,
  errors,
  disabled = false,
}: QuickActionsEditorProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "quickActions",
  });

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Ações rápidas</Label>
        <p className="text-xs text-muted-foreground">
          Botões exibidos no widget. Tipo WhatsApp usa o número configurado acima
          quando a URL estiver vazia.
        </p>
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma ação configurada.
        </p>
      ) : null}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const fieldError = errors.quickActions?.[index];

          return (
            <div
              key={field.id}
              className="rounded-lg border border-border p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={field.enabled}
                    disabled={disabled}
                    onChange={(event) =>
                      update(index, { ...field, enabled: event.target.checked })
                    }
                  />
                  Habilitada
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  aria-label="Remover ação"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`quick-action-label-${index}`}>Rótulo</Label>
                  <Input
                    id={`quick-action-label-${index}`}
                    value={field.label}
                    disabled={disabled}
                    onChange={(event) =>
                      update(index, { ...field, label: event.target.value })
                    }
                  />
                  {fieldError?.label ? (
                    <p className="text-sm text-destructive">
                      {fieldError.label.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`quick-action-type-${index}`}>Tipo</Label>
                  <select
                    id={`quick-action-type-${index}`}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={field.type}
                    disabled={disabled}
                    onChange={(event) =>
                      update(index, {
                        ...field,
                        type: event.target.value as "whatsapp" | "link",
                      })
                    }
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="link">Link</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`quick-action-url-${index}`}>
                  URL {field.type === "whatsapp" ? "(opcional)" : ""}
                </Label>
                <Input
                  id={`quick-action-url-${index}`}
                  value={field.url ?? ""}
                  disabled={disabled}
                  placeholder={
                    field.type === "whatsapp"
                      ? "https://wa.me/5511999999999"
                      : "https://exemplo.com.br"
                  }
                  onChange={(event) =>
                    update(index, { ...field, url: event.target.value })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || fields.length >= 6}
        onClick={() =>
          append({
            label: "WhatsApp",
            type: "whatsapp",
            url: "",
            enabled: true,
          })
        }
      >
        <Plus className="size-4" />
        Adicionar ação
      </Button>
    </div>
  );
}
