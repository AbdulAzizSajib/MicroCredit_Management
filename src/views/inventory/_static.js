// Static dummy data for inventory module dropdowns.
// Replace with API-driven options later (plants & products will become dynamic).

export const PLANTS = [
  { code: "P001", name: "Plant 1 — Dhaka" },
  { code: "P002", name: "Plant 2 — Chittagong" },
  { code: "P003", name: "Plant 3 — Sylhet" },
  { code: "P004", name: "Plant 4 — Khulna" },
];

export const PRODUCTS = [
  { code: "PRD001", name: "Shampling Pack-S CB2E" },
  { code: "PRD002", name: "Sav. Twinkle Pant BD M5" },
  { code: "PRD003", name: "Sav. Twinkle Pant BD M40" },
  { code: "PRD004", name: "Product A — 500g" },
  { code: "PRD005", name: "Product B — 1kg" },
  { code: "PRD006", name: "Product C — 250ml" },
];

export const SALES_TYPES = ["LOCAL", "EXPORT"];
export const INVOICE_TYPES = ["Invoice", "Challan"];
export const YN = [
  { value: "Y", label: "Yes" },
  { value: "N", label: "No" },
];

export const plantName = (code) => PLANTS.find((p) => p.code === code)?.name || code || "-";
export const productName = (code) => PRODUCTS.find((p) => p.code === code)?.name || code || "-";
