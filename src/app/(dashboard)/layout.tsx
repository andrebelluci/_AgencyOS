import Link from "next/link";

import { signOut } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { linkUserToTenant } from "@/lib/auth/link-user-tenant";
import { requireSession } from "@/lib/auth/require-session";
import { getTenant } from "@/lib/tenant/get-tenant";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/conversations", label: "Conversas" },
  { href: "/knowledge", label: "Conhecimento" },
  { href: "/settings", label: "Configurações" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireSession();
  const tenant = await getTenant();
  await linkUserToTenant(user, tenant.id);

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-56 shrink-0 border-r bg-muted/30 p-4 md:block">
        <p className="mb-2 text-sm font-semibold">Agency OS</p>
        <p className="mb-6 truncate text-xs text-muted-foreground">
          {user.email}
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="mt-6">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sair
          </Button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
