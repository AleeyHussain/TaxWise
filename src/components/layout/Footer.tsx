import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-subtle bg-surface">
      <div className="container-px flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-extrabold text-primary text-lg">TaxWise</p>
          <p className="mt-2 text-sm text-secondary leading-relaxed">
            The intelligent plan recommender for independent filers and business owners. Deterministic rules with AI explanation grounding.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm font-medium">
          <Link href="/products" className="text-secondary hover:text-trust transition-colors">
            Products
          </Link>
          <Link href="/compare" className="text-secondary hover:text-trust transition-colors">
            Compare
          </Link>
          <Link href="/recommend" className="text-secondary hover:text-trust transition-colors">
            Find my plan
          </Link>
          <Link href="/assistant" className="text-secondary hover:text-trust transition-colors">
            Assistant
          </Link>
        </nav>
      </div>
      <div className="border-t border-subtle">
        <div className="container-px flex flex-col gap-1 py-4 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            Demo project with fictional tax products. Does not provide legal or financial advice.
          </p>
          <p className="shrink-0">
            Built by Ali Hussain (
            <a href="mailto:alihussainsinbox@gmail.com" className="hover:text-trust transition-colors">
              alihussainsinbox@gmail.com
            </a>
            )
          </p>
        </div>
      </div>
    </footer>
  );
}
