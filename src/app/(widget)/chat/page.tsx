import { getTenant } from "@/lib/tenant/get-tenant";

export default async function ChatWidgetPage() {
  await getTenant();

  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md space-y-2 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Chat</h1>
        <p className="text-sm text-muted-foreground">
          Widget conversacional — ISSUE-016
        </p>
      </div>
    </div>
  );
}
