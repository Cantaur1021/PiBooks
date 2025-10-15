"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
  { href: "/invoices", label: "Invoices" },
  { href: "/journal", label: "Journal" },
  { href: "/reports", label: "Reports" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r border-white/10 p-4">
        <div className="text-xl font-bold mb-6">AccBooks</div>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={clsx(
                "block px-3 py-2 rounded-xl hover:bg-white/10",
                path === n.href && "bg-white/10"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/60">
            Self-hosted • Black & White
          </div>
          <div className="text-sm">UAE VAT 5% preset</div>
        </div>
        {children}
      </main>
    </div>
  );
}
