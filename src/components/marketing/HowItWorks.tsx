const STEPS = [
  {
    title: "Tell us about your year",
    body: "Answer five questions about your income, deductions and how much help you want.",
  },
  {
    title: "We match the rules",
    body: "A deterministic rules engine lines your answers up against each plan and picks the best fit.",
  },
  {
    title: "See your recommendation",
    body: "Get a recommended plan with the reasons behind it, plus an optional upgrade if it helps.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
      <div className="container-px">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          How it works
        </h2>
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
  );
}
