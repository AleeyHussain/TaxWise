import Link from "next/link";
import { ArrowRightIcon, SparkleIcon, CheckIcon } from "@/components/icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-100/60 to-transparent dark:from-slate-900/40" />
      <div className="container-px py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge badge-brand mx-auto mb-5 py-1 px-3">
            <SparkleIcon className="h-3.5 w-3.5" />
            AI-guided · Rules-backed · 4.9★ from 12,000 filers
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            The tax plan that actually fits your life.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Answer five questions. Get a plan matched to your income, deductions,
            and how much help you want — with the reasoning spelled out.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/recommend"
              className="btn bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 btn-lg shadow-sm"
            >
              Find my plan
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/compare" className="btn btn-secondary btn-lg">
              Compare all plans
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            or{" "}
            <Link href="/assistant" className="link">
              ask the assistant
            </Link>{" "}
            a question.
          </p>

          <div className="mt-12 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-8 text-center dark:divide-slate-800 dark:border-slate-800">
            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                <span>2 min</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">To match your plan</p>
            </div>
            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                <span>No sign-up</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Anonymous & instant</p>
            </div>
            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                <span>GDPR-friendly</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Zero data retention</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
