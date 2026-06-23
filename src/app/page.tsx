import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRightIcon, SparkleIcon } from "@/components/icons";
import { getProductById, products } from "@/data/products";

const STEPS = [
  {
    title: "Tell us about your year",
    body: "Answer a short questionnaire about your income, deductions and how much help you want.",
  },
  {
    title: "We match the rules",
    body: "A simple rules engine lines your answers up against each plan and picks the best fit.",
  },
  {
    title: "See your recommendation",
    body: "Get a recommended plan with the reasons behind it, plus an optional upgrade if it helps.",
  },
];

const FAQ = [
  {
    q: "How does the recommendation work?",
    a: "Your answers run through a small rules engine. Corporate filings come first, then expert-help options, then self-employment, investments, common deductions, and finally a simple free return. The highest-priority rule that matches wins.",
  },
  {
    q: "Is this real tax advice?",
    a: "No. TaxWise only points you to a software plan based on the product rules. It is not tax, legal or financial advice. For your specific situation, talk to a qualified tax professional.",
  },
  {
    q: "Do I need an account to try it?",
    a: "No account needed. You can run the questionnaire, compare plans and ask the assistant without signing up.",
  },
  {
    q: "What can the assistant help with?",
    a: "Ask it product questions in plain language, like which plan fits salary and donations, or the difference between two plans. It answers from the same product data the rest of the site uses.",
  },
];

// A small curated set for the landing preview.
const PREVIEW_IDS = ["free", "deluxe", "self-employed", "expert-full-service"];

export default function LandingPage() {
  const previews = PREVIEW_IDS.map((id) => getProductById(id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-950/40" />
        <div className="container-px py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge badge-brand mx-auto mb-5">
              <SparkleIcon className="h-3.5 w-3.5" />
              {products.length} plans, one good match
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Find the tax plan that actually fits you
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Answer a few quick questions about your year and we will point you to
              the right plan, with the reasons spelled out. No jargon, no guesswork.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/recommend" className="btn btn-primary btn-lg">
                Find my product
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/compare" className="btn btn-secondary btn-lg">
                Compare products
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Or just{" "}
              <Link href="/assistant" className="link">
                ask the assistant
              </Link>{" "}
              a question.
            </p>
          </div>
        </div>
      </section>

      {/* Product previews */}
      <section className="container-px py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              A plan for every situation
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              From a free simple return to a full expert handoff.
            </p>
          </div>
          <Link href="/products" className="hidden shrink-0 sm:inline-flex btn btn-ghost btn-sm">
            See all plans
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {previews.map((product) => (
            <ProductCard key={product.id} product={product} highlightCount={3} />
          ))}
        </div>
        <div className="mt-8 sm:hidden">
          <Link href="/products" className="btn btn-secondary w-full">
            See all plans
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="container-px">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="card p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-px py-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Frequently asked questions
        </h2>
        <div className="mt-8 mx-auto max-w-3xl divide-y divide-slate-200 dark:divide-slate-800">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900 dark:text-white">
                {item.q}
                <span className="text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-px pb-20">
        <div className="card flex flex-col items-center gap-4 bg-brand-600 p-10 text-center text-white dark:bg-brand-700">
          <h2 className="text-2xl font-bold">Ready to find your plan?</h2>
          <p className="max-w-xl text-brand-50">
            It takes about a minute. You can restart any time and nothing is saved
            to a server.
          </p>
          <Link href="/recommend" className="btn bg-white text-brand-700 hover:bg-brand-50 btn-lg">
            Start the questionnaire
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
