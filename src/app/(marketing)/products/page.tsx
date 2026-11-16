import type { Metadata } from "next";
import ProductsClientView from "./_components/ProductsClientView";

export const metadata: Metadata = {
  title: "Tax Plans Catalog — TaxWise",
  description:
    "Explore all 8 TaxWise software plans and supported tax schedules from simple personal returns to corporate filings.",
};

export default function ProductsPage() {
  return <ProductsClientView />;
}
