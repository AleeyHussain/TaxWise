import { NextResponse } from "next/server";
import { products } from "@/features/products/catalogue";

export const revalidate = 3600;

export function GET() {
  return NextResponse.json(
    { products },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
