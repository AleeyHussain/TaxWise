// Display the price the way the brief writes it: "Free" or "CAD $30".
export function formatPrice(price: number): string {
  return price === 0 ? "Free" : `CAD $${price}`;
}
