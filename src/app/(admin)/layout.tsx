import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { SparkleIcon } from "@/components/icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="container-px flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white dark:bg-slate-700">
                <SparkleIcon className="h-5 w-5" />
              </span>
              <span>TaxWise Admin</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/admin"
                className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Catalogue
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
