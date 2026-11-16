import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-px flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-extrabold text-slate-900 dark:text-white text-lg">TaxWise</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The intelligent plan recommender for independent filers and business owners. Deterministic rules with AI explanation grounding.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm font-medium">
          <Link href="/products" className="text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 transition">
            Products
          </Link>
          <Link href="/compare" className="text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 transition">
            Compare
          </Link>
          <Link href="/recommend" className="text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 transition">
            Find my plan
          </Link>
          <Link href="/assistant" className="text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 transition">
            Assistant
          </Link>
        </nav>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-px flex flex-col gap-1 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Demo project with fictional tax products. Does not provide legal or financial advice.
          </p>
          <p className="shrink-0">
            Built by Ali Hussain (
            <a href="mailto:alihussainsinbox@gmail.com" className="hover:text-blue-700 dark:hover:text-blue-300 transition">
              alihussainsinbox@gmail.com
            </a>
            )
          </p>
        </div>
      </div>
    </footer>
  );
}
