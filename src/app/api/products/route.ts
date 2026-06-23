import { NextResponse } from "next/server";
import { products } from "@/data/products";

// GET /api/products -> the full catalogue.
export function GET() {
  return NextResponse.json({ products });
}
