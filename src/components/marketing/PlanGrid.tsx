"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { getProductById } from "@/features/products/catalogue";
import { Button } from "@/components/ui/Button";

const PREVIEW_IDS = ["free", "deluxe", "self-employed", "expert-full-service"];
const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function PlanGrid() {
  const previews = PREVIEW_IDS.map((id) => getProductById(id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <section className="container-px py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EXPO_OUT }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              A plan for every situation
            </h2>
            <p className="mt-2 text-secondary">
              From a free simple return to a full expert handoff.
            </p>
          </div>
          <Link
            href="/products"
            className="group hidden shrink-0 sm:inline-flex items-center gap-1.5 text-sm font-semibold text-trust hover:underline"
          >
            <span>See all 8 plans</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {previews.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.04, ease: EXPO_OUT }}
            >
              <ProductCard product={product} highlightCount={3} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Button asChild variant="secondary" className="w-full">
            <Link href="/products">
              See all 8 plans
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
