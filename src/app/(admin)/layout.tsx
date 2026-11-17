import Link from "next/link";
import ThemePicker from "@/components/layout/ThemePicker";
import { Sparkles } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base text-primary">
      <header className="sticky top-0 z-40 border-b border-subtle bg-surface/80 backdrop-blur-md">
        <div className="container-px flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-trust text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span>TaxWise Admin</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/admin"
                className="rounded-lg px-3 py-1.5 text-secondary hover:bg-elevated hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="rounded-lg px-3 py-1.5 text-secondary hover:bg-elevated hover:text-primary transition-colors"
              >
                Catalogue
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemePicker />
            <Link
              href="/admin/logout"
              className="text-xs font-semibold text-danger hover:brightness-110 px-2 py-1 transition-colors"
            >
              Log out
            </Link>
            <Link
              href="/"
              className="text-xs font-medium text-secondary hover:text-primary transition-colors"
            >
              Exit to site &rarr;
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
