const FAQ = [
  {
    q: "How does the recommendation work?",
    a: "Your answers run through a deterministic rules engine. Corporate filings come first, then expert-help options, then self-employment, investments, common deductions, and finally a simple free return. The highest-priority rule that matches wins.",
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

export default function FaqSection() {
  return (
    <section className="container-px py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl text-center">
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-slate-200 dark:divide-slate-800">
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
      </div>
    </section>
  );
}
