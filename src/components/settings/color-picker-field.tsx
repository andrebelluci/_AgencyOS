"use client";

import { Input } from "@/components/ui/input";
import { isValidHexColor, normalizeHexColor } from "@/lib/utils/color";
import { DEFAULT_PRIMARY_COLOR } from "@/modules/provisioning/defaults";

type ColorPickerFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
};

export function ColorPickerField({
  id,
  value,
  onChange,
  disabled = false,
  error,
}: ColorPickerFieldProps) {
  const normalizedValue =
    normalizeHexColor(value) ??
    normalizeHexColor(DEFAULT_PRIMARY_COLOR) ??
    "#1e40af";

  const commitHex = (next: string) => {
    if (!next.trim()) {
      onChange("");
      return;
    }

    const normalized = normalizeHexColor(next);
    if (normalized) {
      onChange(normalized);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={`${id}-picker`}
          type="color"
          value={normalizedValue}
          disabled={disabled}
          aria-label="Seletor de cor"
          className="h-10 w-14 cursor-pointer rounded-md border border-input bg-background p-1"
          onChange={(event) => onChange(event.target.value.toLowerCase())}
        />
        <Input
          id={id}
          defaultValue={normalizedValue}
          key={normalizedValue}
          disabled={disabled}
          placeholder="#1e40af"
          aria-invalid={Boolean(error)}
          className="max-w-[10rem] font-mono text-sm"
          onChange={(event) => commitHex(event.target.value)}
          onBlur={(event) => {
            const normalized = normalizeHexColor(event.target.value);
            if (normalized) {
              onChange(normalized);
              return;
            }

            if (event.target.value.trim() && !isValidHexColor(event.target.value)) {
              event.target.value = normalizedValue;
            }
          }}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Cor principal do widget (botão flutuante, cabeçalho e ações).
        </p>
      )}
    </div>
  );
}
