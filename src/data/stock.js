// ─────────────────────────────────────────────────────────────────────────
// A20 - Stock & Shop Management · data seam (async, demo-backed, API-ready).
//
// Inventory, sales, debts/credits and a simple P&L for actors who hold and
// resell physical stock. Per A20.5/A20.7 this module does NOT keep its own
// expense system - operating expenses are read from and written to the shared
// Expenses Management model (A21, src/data/expenses.js).
// ─────────────────────────────────────────────────────────────────────────
import { addExpense, getExpenseSummary } from "./expenses";

// Access (task): domestic stock-holding actors; smallholders optional; NOT FBR.
export const STOCK_ELIGIBLE_ROLES = ["AGR", "VAP", "MFR", "AGT", "EXP", "IMP", "BYR", "WHS"];
export const canUseStock = (role) => STOCK_ELIGIBLE_ROLES.includes(role);

export const MOVEMENT_REASONS = ["restock", "sale", "adjustment", "loss"];
export const PAYMENT_STATUSES = ["paid", "partial", "credit"];
// Store/shop types. Holding stock does NOT require a store (e.g. a warehouse);
// but shop/retail operations are profiled as stores first (see access note A20).
export const STORE_TYPES = ["Shop / Retail Outlet", "Wholesale Store", "Warehouse", "Depot", "Buying Station", "Processing Facility"];

const TODAY = "2026-06-04";
const wait = (v, ms = 200) => new Promise((r) => setTimeout(() => r(v), ms));
const clone = (x) => JSON.parse(JSON.stringify(x));

// Counters start above the seeded ID ranges to avoid collisions.
let _p = 2000, _m = 5100, _s = 8100, _r = 3100, _y = 4100, _t = 9100;
const pid = () => `PRD-${++_p}`;
const mid = () => `MOV-${++_m}`;
const sid = () => `SAL-${++_s}`;
const rid = () => `RCV-${++_r}`;
const yid = () => `PAY-${++_y}`;
const stid = () => `STR-${++_t}`;

// Stores / shops - one actor may run several in different locations, each with
// its own attendant. (Attendant login is modelled here as data; a separate
// attendant authentication flow is not yet built.)
let _stores = [
  { id: "STR-9001", actorId: "nile_traders", name: "Nile Wholesale - Kampala HQ", type: "Wholesale Store", district: "Kampala", address: "Industrial Area, Plot 12", attendantName: "Grace Apio", attendantPhone: "0772100200", attendantUsername: "grace.nile", active: true },
  { id: "STR-9002", actorId: "nile_traders", name: "Nile Depot - Gulu", type: "Depot", district: "Gulu", address: "Main Street, Gulu", attendantName: "James Okello", attendantPhone: "0772100201", attendantUsername: "james.nile", active: true },
  { id: "STR-9010", actorId: "kampala_mills", name: "Kampala Mills Factory Outlet", type: "Shop / Retail Outlet", district: "Kampala", address: "Industrial Area, Plot 44", attendantName: "Sarah Nakato", attendantPhone: "0772100300", attendantUsername: "sarah.mills", active: true },
];

// ── stores ───────────────────────────────────────────────────────────────
let _products = [
  // Nile Trading Company (AGT)
  { id: "PRD-1001", actorId: "nile_traders", name: "Maize", unit: "kg", category: "Food Crops", costPrice: 950, sellingPrice: 1100, reorderLevel: 5000, onHand: 12000 },
  { id: "PRD-1002", actorId: "nile_traders", name: "Beans (Common)", unit: "kg", category: "Food Crops", costPrice: 2800, sellingPrice: 3100, reorderLevel: 3000, onHand: 8000 },
  { id: "PRD-1003", actorId: "nile_traders", name: "Groundnuts", unit: "kg", category: "Food Crops", costPrice: 3800, sellingPrice: 4200, reorderLevel: 2000, onHand: 1500 },
  // Kampala Mills (MFR)
  { id: "PRD-1010", actorId: "kampala_mills", name: "Maize Flour", unit: "kg", category: "Manufactured", costPrice: 1700, sellingPrice: 1900, reorderLevel: 10000, onHand: 25000 },
  { id: "PRD-1011", actorId: "kampala_mills", name: "Wheat Flour", unit: "kg", category: "Manufactured", costPrice: 2200, sellingPrice: 2450, reorderLevel: 8000, onHand: 6000 },
  { id: "PRD-1012", actorId: "kampala_mills", name: "Bran (Wheat)", unit: "kg", category: "Manufactured", costPrice: 700, sellingPrice: 850, reorderLevel: 5000, onHand: 14000 },
];

let _movements = [
  { id: "MOV-5001", actorId: "nile_traders", productId: "PRD-1001", date: "2026-05-02", qty: 20000, direction: "in", reason: "restock", note: "Season purchase from northern aggregators" },
  { id: "MOV-5002", actorId: "nile_traders", productId: "PRD-1001", date: "2026-05-20", qty: 8000, direction: "out", reason: "sale", note: "Bulk sale" },
  { id: "MOV-5003", actorId: "nile_traders", productId: "PRD-1003", date: "2026-05-22", qty: 500, direction: "out", reason: "loss", note: "Spoilage in store" },
  { id: "MOV-5010", actorId: "kampala_mills", productId: "PRD-1010", date: "2026-05-10", qty: 40000, direction: "in", reason: "restock", note: "Milling output to shop" },
  { id: "MOV-5011", actorId: "kampala_mills", productId: "PRD-1010", date: "2026-05-24", qty: 15000, direction: "out", reason: "sale", note: "Depot order" },
];

let _sales = [
  {
    id: "SAL-8001", actorId: "nile_traders", date: "2026-05-20",
    items: [{ productId: "PRD-1001", name: "Maize", qty: 8000, unitPrice: 1100, costPrice: 950, lineTotal: 8800000 }],
    buyerType: "registered", buyer: "Kampala Mills Limited", total: 8800000, paymentStatus: "paid", amountPaid: 8800000, balance: 0,
  },
  {
    id: "SAL-8002", actorId: "nile_traders", date: "2026-05-28",
    items: [{ productId: "PRD-1002", name: "Beans (Common)", qty: 4000, unitPrice: 3100, costPrice: 2800, lineTotal: 12400000 }],
    buyerType: "registered", buyer: "Mukasa General Store", total: 12400000, paymentStatus: "credit", amountPaid: 0, balance: 12400000,
  },
  {
    id: "SAL-8010", actorId: "kampala_mills", date: "2026-05-24",
    items: [{ productId: "PRD-1010", name: "Maize Flour", qty: 15000, unitPrice: 1900, costPrice: 1700, lineTotal: 28500000 }],
    buyerType: "registered", buyer: "Nile Trading Company Ltd", total: 28500000, paymentStatus: "partial", amountPaid: 18000000, balance: 10500000,
  },
];

let _receivables = [
  { id: "RCV-3001", actorId: "nile_traders", counterparty: "Mukasa General Store", saleId: "SAL-8002", amount: 12400000, amountPaid: 0, balance: 12400000, dueDate: "2026-06-28", createdAt: "2026-05-28" },
  { id: "RCV-3010", actorId: "kampala_mills", counterparty: "Nile Trading Company Ltd", saleId: "SAL-8010", amount: 28500000, amountPaid: 18000000, balance: 10500000, dueDate: "2026-06-10", createdAt: "2026-05-24" },
];

let _payables = [
  { id: "PAY-4001", actorId: "nile_traders", supplier: "Northern Farmers Cooperative", description: "Beans received on 30-day credit", amount: 9000000, amountPaid: 4000000, balance: 5000000, dueDate: "2026-06-15", createdAt: "2026-05-16" },
  { id: "PAY-4010", actorId: "kampala_mills", supplier: "Grain Suppliers Ltd", description: "Wheat grain supply", amount: 14000000, amountPaid: 14000000, balance: 0, dueDate: "2026-05-30", createdAt: "2026-05-01" },
];

// ── helpers ────────────────────────────────────────────────────────────────
function periodStart(period) {
  const [y, m] = TODAY.split("-").map(Number);
  if (period === "month") return `${y}-${String(m).padStart(2, "0")}-01`;
  if (period === "quarter") { let mm = m - 2, yy = y; if (mm < 1) { mm += 12; yy -= 1; } return `${yy}-${String(mm).padStart(2, "0")}-01`; }
  if (period === "year") return `${y}-01-01`;
  return "0000-01-01";
}
function daysOverdue(dueDate) {
  return Math.floor((new Date(TODAY) - new Date(dueDate)) / (1000 * 60 * 60 * 24));
}
export function ageingBucket(balance, dueDate) {
  if (balance <= 0) return "Settled";
  const d = daysOverdue(dueDate);
  if (d <= 0) return "Current";
  if (d <= 30) return "1–30 days";
  if (d <= 60) return "31–60 days";
  return "60+ days";
}
const productName = (id) => (_products.find((p) => p.id === id) || {}).name || id;

// ── catalogue & inventory ───────────────────────────────────────────────────
export async function getProducts(actorId, { includeInactive = false } = {}) {
  let list = _products.filter((p) => p.actorId === actorId);
  if (!includeInactive) list = list.filter((p) => p.active !== false);
  return wait(clone(list));
}

export async function updateProduct(actorId, id, changes) {
  const p = _products.find((x) => x.id === id && x.actorId === actorId);
  if (!p) return wait(null);
  ["name", "unit", "category"].forEach((k) => { if (k in changes) p[k] = changes[k]; });
  ["costPrice", "sellingPrice", "reorderLevel"].forEach((k) => { if (k in changes) p[k] = Number(changes[k]) || 0; });
  return wait(clone(p));
}

export async function setProductActive(actorId, id, active) {
  const p = _products.find((x) => x.id === id && x.actorId === actorId);
  if (!p) return wait(null);
  p.active = active;
  return wait(clone(p));
}

// ── stores / shops ───────────────────────────────────────────────────────────
export async function getStores(actorId, { activeOnly = false } = {}) {
  let list = _stores.filter((s) => s.actorId === actorId);
  if (activeOnly) list = list.filter((s) => s.active);
  return wait(clone(list));
}
export async function addStore(actorId, s) {
  const row = {
    id: stid(), actorId, name: s.name, type: s.type || STORE_TYPES[0],
    district: s.district || "", address: s.address || "",
    attendantName: s.attendantName || "", attendantPhone: s.attendantPhone || "",
    attendantUsername: s.attendantUsername || "", active: true,
  };
  _stores = [..._stores, row];
  return wait(clone(row));
}
export async function updateStore(actorId, id, changes) {
  const s = _stores.find((x) => x.id === id && x.actorId === actorId);
  if (!s) return wait(null);
  ["name", "type", "district", "address", "attendantName", "attendantPhone", "attendantUsername"].forEach((k) => { if (k in changes) s[k] = changes[k]; });
  return wait(clone(s));
}
export async function setStoreActive(actorId, id, active) {
  const s = _stores.find((x) => x.id === id && x.actorId === actorId);
  if (!s) return wait(null);
  s.active = active;
  return wait(clone(s));
}

export async function getStock(actorId) {
  const products = _products.filter((p) => p.actorId === actorId).map((p) => ({
    ...p,
    active: p.active !== false,
    valueCost: p.onHand * p.costPrice,
    valueSelling: p.onHand * p.sellingPrice,
    low: p.active !== false && p.onHand <= p.reorderLevel,
  }));
  const totals = {
    skuCount: products.length,
    unitsOnHand: products.reduce((s, p) => s + p.onHand, 0),
    valuationCost: products.reduce((s, p) => s + p.valueCost, 0),
    valuationSelling: products.reduce((s, p) => s + p.valueSelling, 0),
    lowCount: products.filter((p) => p.low).length,
  };
  return wait(clone({ products, totals }));
}

export async function addProduct(actorId, p) {
  const row = {
    id: pid(), actorId, name: p.name, unit: p.unit || "kg", category: p.category || "Other",
    costPrice: Number(p.costPrice) || 0, sellingPrice: Number(p.sellingPrice) || 0,
    reorderLevel: Number(p.reorderLevel) || 0, onHand: Number(p.onHand) || 0, active: true,
  };
  _products = [..._products, row];
  if (row.onHand > 0) _movements = [{ id: mid(), actorId, productId: row.id, date: TODAY, qty: row.onHand, direction: "in", reason: "restock", note: "Opening stock" }, ..._movements];
  return wait(clone(row));
}

// Stock movement. For a credit-free restock you may also log the purchase cost
// to A21 (asExpense) - demonstrating the shared expense model.
export async function recordMovement(actorId, { productId, direction, qty, reason, note = "", asExpense = false }) {
  const prod = _products.find((p) => p.id === productId && p.actorId === actorId);
  if (!prod) return wait(null);
  const n = Number(qty) || 0;
  prod.onHand = Math.max(0, prod.onHand + (direction === "in" ? n : -n));
  const mv = { id: mid(), actorId, productId, date: TODAY, qty: n, direction, reason, note };
  _movements = [mv, ..._movements];
  if (direction === "in" && reason === "restock" && asExpense) {
    await addExpense(actorId, { date: TODAY, amount: n * prod.costPrice, category: "inputs", subCategory: "Restock", description: `Restock ${n} ${prod.unit} ${prod.name}`, counterparty: note });
  }
  return wait(clone(mv));
}

export async function getMovements(actorId, filters = {}) {
  let list = _movements.filter((m) => m.actorId === actorId);
  if (filters.productId && filters.productId !== "all") list = list.filter((m) => m.productId === filters.productId);
  if (filters.reason && filters.reason !== "all") list = list.filter((m) => m.reason === filters.reason);
  if (filters.from) list = list.filter((m) => m.date >= filters.from);
  if (filters.to) list = list.filter((m) => m.date <= filters.to);
  list = list.map((m) => ({ ...m, productName: productName(m.productId) })).sort((a, b) => b.date.localeCompare(a.date));
  return wait(clone(list));
}

// ── sales ────────────────────────────────────────────────────────────────
export async function recordSale(actorId, sale) {
  const items = (sale.items || []).map((it) => {
    const prod = _products.find((p) => p.id === it.productId && p.actorId === actorId);
    const unitPrice = it.unitPrice != null ? Number(it.unitPrice) : (prod?.sellingPrice || 0);
    const qty = Number(it.qty) || 0;
    return { productId: it.productId, name: prod?.name || it.productId, qty, unitPrice, costPrice: prod?.costPrice || 0, lineTotal: qty * unitPrice };
  }).filter((it) => it.qty > 0);
  if (!items.length) return wait({ error: "Add at least one product." });

  const total = items.reduce((s, it) => s + it.lineTotal, 0);
  const status = sale.paymentStatus || "paid";
  const amountPaid = status === "paid" ? total : status === "partial" ? Math.min(Number(sale.amountPaid) || 0, total) : 0;
  const balance = total - amountPaid;
  const date = sale.date || TODAY;

  // reduce stock + log sale movements
  items.forEach((it) => {
    const prod = _products.find((p) => p.id === it.productId && p.actorId === actorId);
    if (prod) prod.onHand = Math.max(0, prod.onHand - it.qty);
    _movements = [{ id: mid(), actorId, productId: it.productId, date, qty: it.qty, direction: "out", reason: "sale", note: `Sale ${sale.buyer || ""}`.trim() }, ..._movements];
  });

  const store = _stores.find((s) => s.id === sale.storeId && s.actorId === actorId);
  const record = {
    id: sid(), actorId, date, items,
    storeId: sale.storeId || "", storeName: store?.name || "",
    buyerType: sale.buyerType || "anonymous",
    buyer: sale.buyer || (sale.buyerType === "walk-in" ? "Walk-in customer" : "Anonymous"),
    total, paymentStatus: status, amountPaid, balance,
  };
  _sales = [record, ..._sales];

  if (balance > 0) {
    const rec = { id: rid(), actorId, counterparty: record.buyer, saleId: record.id, amount: total, amountPaid, balance, dueDate: sale.dueDate || TODAY, createdAt: date };
    _receivables = [rec, ..._receivables];
    record.receivableId = rec.id;
  }
  return wait(clone(record));
}

export async function getSales(actorId, filters = {}) {
  let list = _sales.filter((s) => s.actorId === actorId);
  if (filters.from) list = list.filter((s) => s.date >= filters.from);
  if (filters.to) list = list.filter((s) => s.date <= filters.to);
  if (filters.productId && filters.productId !== "all") list = list.filter((s) => s.items.some((it) => it.productId === filters.productId));
  if (filters.buyer) list = list.filter((s) => (s.buyer || "").toLowerCase().includes(filters.buyer.toLowerCase()));
  list = [...list].sort((a, b) => b.date.localeCompare(a.date));
  return wait(clone(list));
}

// ── receivables & payables ──────────────────────────────────────────────────
function decorate(list) {
  return list.map((x) => ({ ...x, ageing: ageingBucket(x.balance, x.dueDate), overdue: x.balance > 0 && daysOverdue(x.dueDate) > 0 }));
}
export async function getReceivables(actorId) {
  return wait(clone(decorate(_receivables.filter((r) => r.actorId === actorId))));
}
export async function getPayables(actorId) {
  return wait(clone(decorate(_payables.filter((p) => p.actorId === actorId))));
}
export async function addPayable(actorId, p) {
  const amount = Number(p.amount) || 0;
  const paid = Number(p.amountPaid) || 0;
  const row = { id: yid(), actorId, supplier: p.supplier, description: p.description || "", amount, amountPaid: paid, balance: amount - paid, dueDate: p.dueDate || TODAY, createdAt: TODAY };
  _payables = [row, ..._payables];
  return wait(clone(row));
}
export async function recordReceivablePayment(actorId, id, amount) {
  const r = _receivables.find((x) => x.id === id && x.actorId === actorId);
  if (!r) return wait(null);
  r.amountPaid = Math.min(r.amount, r.amountPaid + (Number(amount) || 0));
  r.balance = r.amount - r.amountPaid;
  return wait(clone(r));
}
export async function recordPayablePayment(actorId, id, amount) {
  const p = _payables.find((x) => x.id === id && x.actorId === actorId);
  if (!p) return wait(null);
  p.amountPaid = Math.min(p.amount, p.amountPaid + (Number(amount) || 0));
  p.balance = p.amount - p.amountPaid;
  return wait(clone(p));
}

// ── revenue / expenses / profit (A20.5, expenses from A21) ───────────────────
export async function getShopSummary(actorId, period = "quarter") {
  const start = periodStart(period);
  const sales = _sales.filter((s) => s.actorId === actorId && s.date >= start && s.date <= TODAY);
  const revenue = sales.reduce((s, x) => s + x.total, 0);
  const cogs = sales.reduce((s, x) => s + x.items.reduce((a, it) => a + it.qty * it.costPrice, 0), 0);
  const grossProfit = revenue - cogs;
  const expSummary = await getExpenseSummary(actorId, period);
  const expenses = expSummary.total || 0;
  const netProfit = grossProfit - expenses;

  const stock = _products.filter((p) => p.actorId === actorId);
  const stockValuation = stock.reduce((s, p) => s + p.onHand * p.costPrice, 0);
  const receivables = _receivables.filter((r) => r.actorId === actorId).reduce((s, r) => s + r.balance, 0);
  const payables = _payables.filter((p) => p.actorId === actorId).reduce((s, p) => s + p.balance, 0);

  return clone({
    period, revenue, cogs, grossProfit, expenses, netProfit,
    expenseByCategory: expSummary.byCategory || [],
    salesCount: sales.length, stockValuation, receivables, payables,
  });
}

// Write an operating expense through the shared A21 model (A20 does not keep its own).
export async function addShopExpense(actorId, expense) {
  return addExpense(actorId, expense);
}

// ── reports (shaped for src/utils/exportReport.js) ───────────────────────────
const ugx = (n) => `UGX ${Math.round(n).toLocaleString()}`;

export async function stockReport(actorId) {
  const { products, totals } = await getStock(actorId);
  return {
    id: "stock", title: "Stock report",
    description: "Stock on hand, valuation at cost and reorder status per product.",
    stats: [
      { label: "Products", value: totals.skuCount },
      { label: "Units on hand", value: totals.unitsOnHand.toLocaleString() },
      { label: "Valuation (cost)", value: ugx(totals.valuationCost) },
      { label: "Low-stock items", value: totals.lowCount },
    ],
    detail: {
      columns: ["Product", "Category", "On hand", "Reorder", "Cost", "Selling", "Value (cost)", "Status"],
      rows: products.map((p) => [p.name, p.category, `${p.onHand.toLocaleString()} ${p.unit}`, p.reorderLevel.toLocaleString(), ugx(p.costPrice), ugx(p.sellingPrice), ugx(p.valueCost), p.low ? "LOW - reorder" : "OK"]),
    },
  };
}

export async function salesReport(actorId, filters = {}) {
  const sales = await getSales(actorId, filters);
  const revenue = sales.reduce((s, x) => s + x.total, 0);
  return {
    id: "sales", title: "Sales report",
    description: "Recorded sales by product, period and buyer.",
    stats: [
      { label: "Sales", value: sales.length },
      { label: "Revenue", value: ugx(revenue) },
      { label: "On credit", value: sales.filter((s) => s.balance > 0).length },
    ],
    detail: {
      columns: ["Sale ID", "Date", "Buyer", "Items", "Total", "Status", "Balance"],
      rows: sales.map((s) => [s.id, s.date, s.buyer, s.items.map((it) => `${it.name} ×${it.qty}`).join("; "), ugx(s.total), s.paymentStatus, ugx(s.balance)]),
    },
  };
}

export async function debtorsCreditorsReport(actorId) {
  const recv = await getReceivables(actorId);
  const pay = await getPayables(actorId);
  const totalRecv = recv.reduce((s, r) => s + r.balance, 0);
  const totalPay = pay.reduce((s, p) => s + p.balance, 0);
  return {
    id: "debts", title: "Debtors & creditors report",
    description: "Outstanding receivables owed to you and payables you owe, with ageing.",
    stats: [
      { label: "Receivables", value: ugx(totalRecv) },
      { label: "Payables", value: ugx(totalPay) },
      { label: "Net position", value: ugx(totalRecv - totalPay) },
    ],
    detail: {
      columns: ["Type", "Counterparty", "Amount", "Paid", "Balance", "Due", "Ageing"],
      rows: [
        ...recv.map((r) => ["Receivable", r.counterparty, ugx(r.amount), ugx(r.amountPaid), ugx(r.balance), r.dueDate, r.ageing]),
        ...pay.map((p) => ["Payable", p.supplier, ugx(p.amount), ugx(p.amountPaid), ugx(p.balance), p.dueDate, p.ageing]),
      ],
    },
  };
}
