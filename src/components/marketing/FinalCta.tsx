import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function FinalCta() {
  return (
    <section className="container-px pb-20">
      <div className="card flex flex-col items-center gap-4 bg-brand-600 p-10 text-center text-white dark:bg-brand-700">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready to find your plan?</h2>
        <p className="max-w-xl text-brand-50">
          It takes about two minutes. You can restart any time and nothing is saved
          to a server.
        </p>
        <Link
          href="/recommend"
          className="btn bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 btn-lg shadow-md mt-2"
        >
          Start the questionnaire
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
