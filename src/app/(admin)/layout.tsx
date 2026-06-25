import Link from "next/link";

import { signOut } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin";

const navItems = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/tenants", label: "Tenants" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requirePlatformAdmin();

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-56 shrink-0 border-r bg-muted/30 p-4 md:block">
        <p className="mb-1 text-sm font-semibold">Platform Admin</p>
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
