// ─────────────────────────────────────────────────────────────────────────
// A21 - Expenses Management · shared data seam (async, demo-backed, API-ready).
//
// The single expense ledger every eligible actor uses, keyed by Digital Trade
// ID / username. Other modules that need expense data (Stock & Shop - A20) read
// from and write to THIS model rather than keeping their own. The UI consumes
// only these functions, so a real API can replace the bodies later.
// ─────────────────────────────────────────────────────────────────────────

export const CURRENCIES = ["UGX", "USD", "EUR"];

// Configurable categories (A21.3). Adding one here needs no other code change.
export const EXPENSE_CATEGORIES = [
  { id: "production", name: "Production", subs: ["Seeds", "Fertiliser", "Labour", "Fuel", "Energy", "Pesticides", "Equipment hire"] },
  { id: "inputs", name: "Inputs / Raw Materials", subs: ["Raw materials", "Packaging", "Goods for resale"] },
  { id: "processing", name: "Processing / Manufacturing", subs: ["Milling", "Drying", "Machinery", "Energy", "Maintenance"] },
  { id: "transport", name: "Transport / Logistics", subs: ["Freight", "Fuel", "Vehicle maintenance", "Loading", "Delivery"] },
  { id: "admin", name: "Administrative", subs: ["Rent", "Utilities", "Salaries", "Office", "Communications"] },
  { id: "compliance", name: "Licenses / Permits / Compliance", subs: ["Trading licence", "Certification", "Statutory fees", "Inspection"] },
  { id: "other", name: "Other", subs: [] },
];
export const categoryName = (id) => (EXPENSE_CATEGORIES.find((c) => c.id === id) || {}).name || id;

// Access (task): all domestic actor types may use Expenses; FBR may NOT, even
// with a secondary domestic role (primary role decides). ADMIN/GOU are system
// accounts and are not actors with expense ledgers.
export const EXPENSE_ELIGIBLE_ROLES = ["AGR", "VAP", "MFR", "AGT", "EXP", "IMP", "BYR", "TRP", "CSM", "WHS"];
export const canUseExpenses = (role) => EXPENSE_ELIGIBLE_ROLES.includes(role);

const TODAY = "2026-06-04"; // fixed "today" so demo summaries/trends are stable
const wait = (v, ms = 200) => new Promise((r) => setTimeout(() => r(v), ms));
const clone = (x) => JSON.parse(JSON.stringify(x));

let _seq = 1000;
const nextId = () => `EXP-2026-${String(++_seq).padStart(4, "0")}`;

function e(actorId, date, amount, category, subCategory, description, extra = {}) {
  return {
    id: nextId(), actorId, date, amount, currency: "UGX",
    category, subCategory: subCategory || "", description,
    counterparty: extra.counterparty || "", linkedActivity: extra.linkedActivity || "",
    recurring: !!extra.recurring, createdAt: date,
  };
}

let _expenses = [
  // Nalwanga Sarah (AGR) - coffee production
  e("nalwanga_sarah", "2026-01-15", 850000, "production", "Seeds", "Arabica seedlings for new plot"),
  e("nalwanga_sarah", "2026-02-10", 1200000, "production", "Fertiliser", "NPK and organic compost", { counterparty: "Mbale Agro-inputs" }),
  e("nalwanga_sarah", "2026-03-05", 600000, "production", "Labour", "Weeding and pruning", { recurring: true }),
  e("nalwanga_sarah", "2026-04-20", 450000, "production", "Fuel", "Pump fuel for irrigation"),
  e("nalwanga_sarah", "2026-05-12", 300000, "transport", "Freight", "Cherry to hulling station", { counterparty: "Ssekandi Transport Services", linkedActivity: "Harvest 2026" }),
  e("nalwanga_sarah", "2026-05-28", 120000, "compliance", "Trading licence", "Cooperative membership & licence", { recurring: true }),

  // Mbale Coffee Hullers (VAP) - processing
  e("mbale_hullers", "2026-02-03", 4200000, "inputs", "Raw materials", "Cherry purchase from outgrowers"),
  e("mbale_hullers", "2026-03-18", 2800000, "processing", "Energy", "Hulling station power & diesel", { recurring: true }),
  e("mbale_hullers", "2026-04-09", 1500000, "processing", "Maintenance", "Huller servicing & spares"),
  e("mbale_hullers", "2026-05-02", 3100000, "admin", "Salaries", "Station staff wages", { recurring: true }),
  e("mbale_hullers", "2026-05-22", 900000, "transport", "Freight", "Parchment to Kampala", { counterparty: "Ssekandi Transport Services" }),
  e("mbale_hullers", "2026-05-30", 600000, "compliance", "Certification", "EUDR origin documentation"),

  // Kampala Mills (MFR) - manufacturing
  e("kampala_mills", "2026-01-25", 9000000, "inputs", "Raw materials", "Maize grain for milling"),
  e("kampala_mills", "2026-03-02", 5200000, "processing", "Machinery", "Mill line maintenance contract", { recurring: true }),
  e("kampala_mills", "2026-04-15", 3800000, "admin", "Utilities", "Factory electricity & water", { recurring: true }),
  e("kampala_mills", "2026-05-10", 1400000, "compliance", "Statutory fees", "UNBS certification renewal", { recurring: true }),
  e("kampala_mills", "2026-05-26", 2200000, "transport", "Delivery", "Flour distribution to depots"),

  // Ssekandi Transport (TRP) - logistics
  e("ssekandi_transport", "2026-02-14", 1800000, "transport", "Fuel", "Diesel - fleet refuelling", { recurring: true }),
  e("ssekandi_transport", "2026-03-22", 950000, "transport", "Vehicle maintenance", "Tyres and servicing"),
  e("ssekandi_transport", "2026-04-30", 400000, "compliance", "Statutory fees", "Vehicle road licences", { recurring: true }),
  e("ssekandi_transport", "2026-05-18", 700000, "admin", "Salaries", "Driver wages", { recurring: true }),
];

// ── reads ────────────────────────────────────────────────────────────────
export async function getExpenses(actorId, filters = {}) {
  let list = _expenses.filter((x) => x.actorId === actorId);
  if (filters.category && filters.category !== "all") list = list.filter((x) => x.category === filters.category);
  if (filters.from) list = list.filter((x) => x.date >= filters.from);
  if (filters.to) list = list.filter((x) => x.date <= filters.to);
  list = [...list].sort((a, b) => b.date.localeCompare(a.date));
  return wait(clone(list));
}

function periodStart(period) {
  const [y, m] = TODAY.split("-").map(Number);
  if (period === "month") return `${y}-${String(m).padStart(2, "0")}-01`;
  if (period === "quarter") {
    let mm = m - 2, yy = y;
    if (mm < 1) { mm += 12; yy -= 1; }
    return `${yy}-${String(mm).padStart(2, "0")}-01`;
  }
  if (period === "year") return `${y}-01-01`;
  return "0000-01-01"; // all time
}

export async function getExpenseSummary(actorId, period = "quarter") {
  const start = periodStart(period);
  const list = _expenses.filter((x) => x.actorId === actorId && x.date >= start && x.date <= TODAY);
  const total = list.reduce((s, x) => s + (x.amount || 0), 0);

  const byCatMap = {};
  list.forEach((x) => { byCatMap[x.category] = (byCatMap[x.category] || 0) + x.amount; });
  const byCategory = Object.entries(byCatMap)
    .map(([id, amt]) => ({ category: id, name: categoryName(id), total: amt, pct: total ? (amt / total) * 100 : 0 }))
    .sort((a, b) => b.total - a.total);

  const monthMap = {};
  list.forEach((x) => { const mk = x.date.slice(0, 7); monthMap[mk] = (monthMap[mk] || 0) + x.amount; });
  const trend = Object.entries(monthMap).map(([month, amt]) => ({ month, total: amt })).sort((a, b) => a.month.localeCompare(b.month));

  return wait({ total, count: list.length, byCategory, trend, period });
}

// ── mutation ───────────────────────────────────────────────────────────────
export async function addExpense(actorId, expense) {
  const row = {
    id: nextId(), actorId, currency: "UGX", subCategory: "", counterparty: "",
    linkedActivity: "", recurring: false, createdAt: TODAY,
    ...expense, amount: Number(expense.amount) || 0,
  };
  _expenses = [row, ..._expenses];
  return wait(clone(row));
}
