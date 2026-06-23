import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-px flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-bold text-slate-900 dark:text-white">TaxWise</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            A product picker for a fictional tax software company. It helps you
            find the right plan for your situation.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <Link href="/products" className="text-slate-600 hover:text-brand-700 dark:text-slate-300">
            Products
          </Link>
          <Link href="/compare" className="text-slate-600 hover:text-brand-700 dark:text-slate-300">
            Compare
          </Link>
          <Link href="/recommend" className="text-slate-600 hover:text-brand-700 dark:text-slate-300">
            Find my product
          </Link>
          <Link href="/assistant" className="text-slate-600 hover:text-brand-700 dark:text-slate-300">
            Assistant
          </Link>
          <Link href="/admin/products" className="text-slate-600 hover:text-brand-700 dark:text-slate-300">
            Admin
          </Link>
        </nav>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-px flex flex-col gap-1 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            This is a demo project with fictional products. Nothing here is tax,
            legal or financial advice.
          </p>
          <p className="shrink-0">
            Built by Ali Hussain (
            <a href="mailto:alihussainsinbox@gmail.com" className="hover:text-brand-700 dark:hover:text-brand-300">
              alihussainsinbox@gmail.com
            </a>
            )
          </p>
        </div>
      </div>
    </footer>
  );
}
