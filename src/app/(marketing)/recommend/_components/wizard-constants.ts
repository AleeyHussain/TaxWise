export const STEP_LABEL: Record<string, string> = {
  filing: "Filing",
  income: "Income",
  deductions: "Deductions",
  help: "Help",
  revenue: "Revenue",
  result: "Result",
};

export const STEP_VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 24 : -24,
    opacity: 0,
  }),
};
