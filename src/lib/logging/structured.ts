import "server-only";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type StructuredLogFields = {
  level?: LogLevel;
  message: string;
  request_id?: string;
  tenant_id?: string | null;
  route?: string;
  duration_ms?: number;
  status?: number;
  [key: string]: unknown;
};

function writeLog(fields: StructuredLogFields): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level: fields.level ?? "info",
    ...fields,
  };

  const line = JSON.stringify(payload);

  if (payload.level === "error") {
    console.error(line);
    return;
  }

  if (payload.level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export function logStructured(fields: StructuredLogFields): void {
  writeLog(fields);
}

export function logError(
  message: string,
  error: unknown,
  context?: Omit<StructuredLogFields, "message" | "level">,
): void {
  const errorFields: Record<string, unknown> = {
    ...context,
    level: "error" as const,
    message,
  };

  if (error instanceof Error) {
    errorFields.error_name = error.name;
    errorFields.error_message = error.message;
    errorFields.error_stack = error.stack;
  } else {
    errorFields.error_message = String(error);
  }

  writeLog(errorFields as StructuredLogFields);
}
