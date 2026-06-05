import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Boxes, ShoppingCart, Scale, TrendingUp, FileText, Plus, X, Loader2,
  AlertCircle, Download, Ban, Package, ArrowRight, Trash2, Receipt,
  Store, Edit2, MapPin, Power,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { formatUGX } from "../data/demo";
import { EXPENSE_CATEGORIES, getExpenses } from "../data/expenses";
import { exportReport } from "../utils/exportReport";
import {
  canUseStock, getStock, addProduct, updateProduct, setProductActive, recordMovement, recordSale, getSales,
  getProducts, getReceivables, getPayables, addPayable, recordReceivablePayment,
  recordPayablePayment, getShopSummary, addShopExpense, MOVEMENT_REASONS,
  stockReport, salesReport, debtorsCreditorsReport,
  getStores, addStore, updateStore, setStoreActive, STORE_TYPES,
} from "../data/stock";

const labelCls = "block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5";
const inputCls = "w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted";
const PERIODS = [["month", "This month"], ["quarter", "Last 3 months"], ["year", "This year"], ["all", "All time"]];

const SECTIONS = [
  { id: "inventory", label: "Inventory", path: "/stock", icon: Boxes },
  { id: "stores", label: "Stores & Shops", path: "/stock/stores", icon: Store },
  { id: "sell", label: "Record Sale", path: "/stock/sell", icon: ShoppingCart },
  { id: "debts", label: "Debts & Credits", path: "/stock/debts", icon: Scale },
  { id: "finance", label: "Revenue & Profit", path: "/stock/finance", icon: TrendingUp },
  { id: "reports", label: "Reports", path: "/stock/reports", icon: FileText },
];

function Modal({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
        <div className="flex items-start justify-between gap-3 p-5 border-b border-warm-border">
          <div><h2 className="text-lg font-bold text-ink">{title}</h2>{subtitle && <p className="text-xs text-warm-muted mt-0.5">{subtitle}</p>}</div>
          <button onClick={onClose} className="text-warm-muted hover:text-ink p-1"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, tone }) {
  return (
    <div className="bg-white border border-warm-border rounded-xl p-4">
      <div className={`text-xl font-bold ${tone || "text-ink"}`}>{value}</div>
      <div className="text-xs text-warm-text mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-warm-muted mt-0.5">{sub}</div>}
    </div>
  );
}

function Table({ columns, rows, empty = "No records." }) {
  if (!rows.length) return <p className="text-sm text-warm-muted text-center py-8">{empty}</p>;
  return (
    <div className="overflow-x-auto border border-warm-border rounded-lg">
      <table className="w-full text-xs">
        <thead><tr className="bg-warm-bg text-left">{columns.map((c) => <th key={c} className="font-semibold text-warm-text px-3 py-2 whitespace-nowrap">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-warm-border">{r.map((c, j) => <td key={j} className="px-3 py-2 whitespace-nowrap text-ink">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

// ── Inventory ────────────────────────────────────────────────────────────────
function Inventory({ actorId }) {
  const [data, setData] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [moveFor, setMoveFor] = useState(null);
  const [editFor, setEditFor] = useState(null);
  const load = useCallback(async () => setData(await getStock(actorId)), [actorId]);
  useEffect(() => { load(); }, [load]);
  if (!data) return <Loader />;
  const { products, totals } = data;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Products" value={totals.skuCount} />
        <StatTile label="Units on hand" value={totals.unitsOnHand.toLocaleString()} />
        <StatTile label="Stock value (cost)" value={formatUGX(totals.valuationCost)} sub={`Retail ${formatUGX(totals.valuationSelling)}`} />
        <StatTile label="Low-stock items" value={totals.lowCount} tone={totals.lowCount ? "text-red-600" : "text-ink"} />
      </div>

      {totals.lowCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={15} /> {totals.lowCount} product{totals.lowCount !== 1 ? "s are" : " is"} at or below reorder level.
        </div>
      )}

      <div className="bg-white border border-warm-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ink text-sm">Inventory</h3>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 bg-gold hover:bg-gold-mid text-ink text-xs font-bold px-3 py-1.5 rounded-lg"><Plus size={13} /> Add product</button>
        </div>
        <div className="overflow-x-auto border border-warm-border rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="bg-warm-bg text-left">{["Product", "Category", "On hand", "Reorder", "Cost", "Selling", "Value", "Actions"].map((c, i) => <th key={i} className="font-semibold text-warm-text px-3 py-2 whitespace-nowrap">{c}</th>)}</tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={`border-t border-warm-border ${!p.active ? "opacity-50" : ""}`}>
                  <td className="px-3 py-2 font-medium text-ink whitespace-nowrap">
                    {p.name}{!p.active && <span className="ml-1.5 text-[9px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-1 rounded">INACTIVE</span>}
                  </td>
                  <td className="px-3 py-2 text-warm-text">{p.category}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={p.low ? "text-red-600 font-semibold" : "text-ink"}>{p.onHand.toLocaleString()} {p.unit}</span>
                    {p.low && <span className="ml-1.5 text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1 rounded">LOW</span>}
                  </td>
                  <td className="px-3 py-2 text-warm-muted">{p.reorderLevel.toLocaleString()}</td>
                  <td className="px-3 py-2 text-warm-text">{formatUGX(p.costPrice)}</td>
                  <td className="px-3 py-2 text-warm-text">{formatUGX(p.sellingPrice)}</td>
                  <td className="px-3 py-2 font-semibold text-ink">{formatUGX(p.valueCost)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      {p.active && <button onClick={() => setMoveFor({ ...p, direction: "in", reason: "restock" })} className="text-[11px] font-semibold text-gold-dark hover:underline">Restock</button>}
                      {p.active && <button onClick={() => setMoveFor({ ...p, direction: "out", reason: "adjustment" })} className="text-[11px] font-semibold text-warm-muted hover:text-ink hover:underline">Adjust</button>}
                      <button onClick={() => setEditFor(p)} className="text-[11px] font-semibold text-warm-muted hover:text-ink hover:underline flex items-center gap-0.5"><Edit2 size={11} /> Edit</button>
                      <button onClick={async () => { await setProductActive(actorId, p.id, !p.active); load(); }} className="text-[11px] font-semibold text-warm-muted hover:text-ink hover:underline">{p.active ? "Deactivate" : "Reactivate"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <ProductModal actorId={actorId} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
      {editFor && <ProductModal actorId={actorId} product={editFor} onClose={() => setEditFor(null)} onSaved={() => { setEditFor(null); load(); }} />}
      {moveFor && <MovementModal actorId={actorId} product={moveFor} onClose={() => setMoveFor(null)} onSaved={() => { setMoveFor(null); load(); }} />}
    </div>
  );
}

function ProductModal({ actorId, product, onClose, onSaved }) {
  const [f, setF] = useState(product
    ? { name: product.name, unit: product.unit, category: product.category, costPrice: String(product.costPrice), sellingPrice: String(product.sellingPrice), reorderLevel: String(product.reorderLevel), onHand: String(product.onHand) }
    : { name: "", unit: "kg", category: "Food Crops", costPrice: "", sellingPrice: "", reorderLevel: "", onHand: "" });
  const [err, setErr] = useState("");
  const set = (x) => setF((p) => ({ ...p, ...x }));
  async function submit() {
    if (!f.name.trim()) return setErr("Enter a product name.");
    if (!f.sellingPrice) return setErr("Enter a selling price.");
    if (product) await updateProduct(actorId, product.id, f);
    else await addProduct(actorId, f);
    onSaved();
  }
  return (
    <Modal title={product ? "Edit product" : "Add product"} subtitle={product ? "Update this catalogue item." : "Add an item to your stock catalogue."} onClose={onClose}>
      <div className="space-y-3">
        <div><label className={labelCls}>Name *</label><input value={f.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="e.g. Maize" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Unit</label><select value={f.unit} onChange={(e) => set({ unit: e.target.value })} className={inputCls}>{["kg", "tonne", "bag", "litre", "piece"].map((u) => <option key={u}>{u}</option>)}</select></div>
          <div><label className={labelCls}>Category</label><input value={f.category} onChange={(e) => set({ category: e.target.value })} className={inputCls} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Cost price</label><input type="number" value={f.costPrice} onChange={(e) => set({ costPrice: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>Selling price *</label><input type="number" value={f.sellingPrice} onChange={(e) => set({ sellingPrice: e.target.value })} className={inputCls} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Reorder level</label><input type="number" value={f.reorderLevel} onChange={(e) => set({ reorderLevel: e.target.value })} className={inputCls} /></div>
          {!product && <div><label className={labelCls}>Opening stock</label><input type="number" value={f.onHand} onChange={(e) => set({ onHand: e.target.value })} className={inputCls} /></div>}
        </div>
        {product && <p className="text-[11px] text-warm-muted">Stock on hand is changed via Restock / Adjust, not edited here.</p>}
        {err && <p className="text-xs text-red-500">{err}</p>}
        <button onClick={submit} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-sm">{product ? "Save changes" : "Add product"}</button>
      </div>
    </Modal>
  );
}

function MovementModal({ actorId, product, onClose, onSaved }) {
  const [f, setF] = useState({ direction: product.direction, reason: product.reason, qty: "", note: "", asExpense: false });
  const set = (x) => setF((p) => ({ ...p, ...x }));
  async function submit() {
    if (!f.qty || Number(f.qty) <= 0) return;
    await recordMovement(actorId, { productId: product.id, ...f }); onSaved();
  }
  return (
    <Modal title={`Stock movement - ${product.name}`} subtitle={`On hand: ${product.onHand.toLocaleString()} ${product.unit}`} onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Direction</label><select value={f.direction} onChange={(e) => set({ direction: e.target.value })} className={inputCls}><option value="in">Stock in</option><option value="out">Stock out</option></select></div>
          <div><label className={labelCls}>Reason</label><select value={f.reason} onChange={(e) => set({ reason: e.target.value })} className={inputCls}>{MOVEMENT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
        </div>
        <div><label className={labelCls}>Quantity ({product.unit})</label><input type="number" value={f.qty} onChange={(e) => set({ qty: e.target.value })} className={inputCls} /></div>
        <div><label className={labelCls}>Note</label><input value={f.note} onChange={(e) => set({ note: e.target.value })} className={inputCls} placeholder="Supplier / reason" /></div>
        {f.direction === "in" && f.reason === "restock" && (
          <label className="flex items-center gap-2 text-xs text-warm-text"><input type="checkbox" checked={f.asExpense} onChange={(e) => set({ asExpense: e.target.checked })} /> Also record purchase cost as an expense (A21)</label>
        )}
        <button onClick={submit} className="w-full bg-ink hover:bg-ink-mid text-white font-bold py-2.5 rounded-lg text-sm">Record movement</button>
      </div>
    </Modal>
  );
}

// ── Stores & Shops ───────────────────────────────────────────────────────────
function Stores({ actorId }) {
  const [stores, setStores] = useState(null);
  const [editing, setEditing] = useState(null);
  const load = useCallback(async () => setStores(await getStores(actorId)), [actorId]);
  useEffect(() => { load(); }, [load]);
  if (!stores) return <Loader />;
  return (
    <div className="space-y-5">
      <div className="bg-white border border-warm-border rounded-xl p-5">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h3 className="font-bold text-ink text-sm">Stores &amp; shops</h3>
            <p className="text-xs text-warm-muted mt-0.5 max-w-lg">Profile each location you operate. One business can run several stores/shops in different locations, each with its own attendant. Holding stock alone does not require a store - but recording shop sales does.</p>
          </div>
          <button onClick={() => setEditing({})} className="flex items-center gap-1.5 bg-gold hover:bg-gold-mid text-ink text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"><Plus size={13} /> Add store / shop</button>
        </div>
        {stores.length === 0 ? (
          <div className="text-center py-10 text-warm-muted"><Store size={28} className="mx-auto mb-2" /><p className="text-sm">No stores yet. Add a store or shop to record sales per location.</p></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {stores.map((s) => (
              <div key={s.id} className={`border rounded-xl p-4 ${s.active ? "border-warm-border" : "border-warm-border bg-warm-bg/60"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-ink text-sm flex items-center gap-2">{s.name} {!s.active && <span className="text-[9px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-1.5 rounded">Inactive</span>}</div>
                    <div className="text-xs text-warm-muted">{s.type}</div>
                  </div>
                </div>
                <div className="text-xs text-warm-text mt-2 flex items-center gap-1"><MapPin size={11} className="text-warm-muted" /> {[s.address, s.district].filter(Boolean).join(", ") || "-"}</div>
                <div className="text-xs text-warm-text mt-1">Attendant: <span className="font-medium text-ink">{s.attendantName || "-"}</span>{s.attendantPhone ? ` · ${s.attendantPhone}` : ""}</div>
                {s.attendantUsername && <div className="text-[11px] text-warm-muted font-mono mt-0.5">login: {s.attendantUsername}</div>}
                <div className="flex gap-2 mt-3 pt-3 border-t border-warm-border">
                  <button onClick={() => setEditing(s)} className="flex items-center gap-1 border border-warm-border hover:border-ink text-ink text-xs font-semibold px-3 py-1.5 rounded-lg"><Edit2 size={12} /> Edit</button>
                  <button onClick={async () => { await setStoreActive(actorId, s.id, !s.active); load(); }} className="flex items-center gap-1 border border-warm-border hover:border-ink text-warm-text text-xs font-semibold px-3 py-1.5 rounded-lg"><Power size={12} /> {s.active ? "Deactivate" : "Reactivate"}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {editing && <StoreModal actorId={actorId} store={editing.id ? editing : null} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function StoreModal({ actorId, store, onClose, onSaved }) {
  const [f, setF] = useState(store ? { ...store } : { name: "", type: STORE_TYPES[0], district: "", address: "", attendantName: "", attendantPhone: "", attendantUsername: "" });
  const [err, setErr] = useState("");
  const set = (x) => setF((p) => ({ ...p, ...x }));
  async function submit() {
    if (!f.name.trim()) return setErr("Enter a store name.");
    if (store) await updateStore(actorId, store.id, f); else await addStore(actorId, f);
    onSaved();
  }
  return (
    <Modal title={store ? "Edit store / shop" : "Add store / shop"} subtitle="A location you operate, with its attendant." onClose={onClose}>
      <div className="space-y-3">
        <div><label className={labelCls}>Store / shop name *</label><input value={f.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="e.g. Kampala Main Shop" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Type</label><select value={f.type} onChange={(e) => set({ type: e.target.value })} className={inputCls}>{STORE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><label className={labelCls}>District</label><input value={f.district} onChange={(e) => set({ district: e.target.value })} className={inputCls} placeholder="e.g. Kampala" /></div>
        </div>
        <div><label className={labelCls}>Address / location</label><input value={f.address} onChange={(e) => set({ address: e.target.value })} className={inputCls} placeholder="Street, plot, landmark" /></div>
        <div className="border-t border-warm-border pt-3">
          <div className="text-xs font-bold text-warm-text uppercase tracking-wider mb-2">Attendant</div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Name</label><input value={f.attendantName} onChange={(e) => set({ attendantName: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Phone</label><input value={f.attendantPhone} onChange={(e) => set({ attendantPhone: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="mt-3"><label className={labelCls}>Attendant login username <span className="text-warm-muted normal-case font-normal">(optional)</span></label><input value={f.attendantUsername} onChange={(e) => set({ attendantUsername: e.target.value })} className={inputCls} placeholder="for the attendant to sign in and record sales" /></div>
        </div>
        {err && <p className="text-xs text-red-500">{err}</p>}
        <button onClick={submit} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-sm">{store ? "Save store" : "Add store"}</button>
      </div>
    </Modal>
  );
}

// ── Record Sale ──────────────────────────────────────────────────────────────
function Sell({ actorId }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [stores, setStores] = useState(null);
  const [storeId, setStoreId] = useState("");
  const [lines, setLines] = useState([{ productId: "", qty: "" }]);
  const [buyerType, setBuyerType] = useState("walk-in");
  const [buyer, setBuyer] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [amountPaid, setAmountPaid] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setProducts(await getProducts(actorId));
    setSales(await getSales(actorId, {}));
    const st = await getStores(actorId, { activeOnly: true });
    setStores(st);
    setStoreId((cur) => cur || st[0]?.id || "");
  }, [actorId]);
  useEffect(() => { load(); }, [load]);

  const prod = (id) => products.find((p) => p.id === id);
  const total = lines.reduce((s, l) => { const p = prod(l.productId); return s + (p ? p.sellingPrice * (Number(l.qty) || 0) : 0); }, 0);
  const setLine = (i, x) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...x } : l)));

  async function submit() {
    setErr("");
    if (!storeId) return setErr("Select the store / shop for this sale.");
    const items = lines.filter((l) => l.productId && Number(l.qty) > 0);
    if (!items.length) return setErr("Add at least one product with a quantity.");
    for (const l of items) { const p = prod(l.productId); if (p && Number(l.qty) > p.onHand) return setErr(`Only ${p.onHand} ${p.unit} of ${p.name} in stock.`); }
    const res = await recordSale(actorId, {
      items, storeId, buyerType, buyer: buyerType === "registered" ? buyer : undefined,
      paymentStatus, amountPaid: Number(amountPaid) || 0, dueDate,
    });
    if (res?.error) return setErr(res.error);
    setMsg(`Sale ${res.id} recorded - ${formatUGX(res.total)}${res.balance > 0 ? ` · receivable ${formatUGX(res.balance)} created` : ""}.`);
    setLines([{ productId: "", qty: "" }]); setBuyer(""); setAmountPaid(""); setDueDate(""); setPaymentStatus("paid");
    load();
  }

  if (stores === null) return <Loader />;
  if (stores.length === 0) {
    return (
      <div className="bg-white border border-warm-border rounded-xl p-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 bg-gold-light border border-gold-border rounded-xl flex items-center justify-center mx-auto mb-3"><Store size={22} className="text-gold-dark" /></div>
        <h3 className="font-bold text-ink mb-1">Set up your shop first</h3>
        <p className="text-sm text-warm-text mb-4">Recording sales is done per store/shop. Profile at least one active store before you can record sales here. (Holding stock alone doesn't require a store.)</p>
        <button onClick={() => navigate("/stock/stores")} className="inline-flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold px-5 py-2.5 rounded-lg text-sm"><Plus size={15} /> Add a store / shop</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white border border-warm-border rounded-xl p-5">
        <h3 className="font-bold text-ink text-sm mb-4">Record a sale</h3>
        {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2.5 text-sm mb-3">{msg}</div>}
        <div className="mb-3">
          <label className={labelCls}>Store / shop <span className="text-red-400">*</span></label>
          <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className={inputCls}>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}{s.district ? ` - ${s.district}` : ""}</option>)}
          </select>
        </div>
        <div className="space-y-2 mb-3">
          {lines.map((l, i) => {
            const p = prod(l.productId);
            return (
              <div key={i} className="flex items-center gap-2">
                <select value={l.productId} onChange={(e) => setLine(i, { productId: e.target.value })} className={inputCls + " flex-1"}>
                  <option value="">Select product</option>
                  {products.map((pp) => <option key={pp.id} value={pp.id}>{pp.name} ({pp.onHand} {pp.unit} @ {formatUGX(pp.sellingPrice)})</option>)}
                </select>
                <input type="number" value={l.qty} onChange={(e) => setLine(i, { qty: e.target.value })} className={inputCls + " w-28"} placeholder="Qty" />
                <div className="w-28 text-right text-xs font-semibold text-ink">{p ? formatUGX(p.sellingPrice * (Number(l.qty) || 0)) : "-"}</div>
                {lines.length > 1 && <button onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} className="text-warm-muted hover:text-red-500"><Trash2 size={14} /></button>}
              </div>
            );
          })}
          <button onClick={() => setLines((ls) => [...ls, { productId: "", qty: "" }])} className="text-xs text-gold font-semibold flex items-center gap-1"><Plus size={12} /> Add item</button>
        </div>

        <div className="grid md:grid-cols-3 gap-3 border-t border-warm-border pt-3">
          <div>
            <label className={labelCls}>Buyer</label>
            <select value={buyerType} onChange={(e) => setBuyerType(e.target.value)} className={inputCls}>
              <option value="walk-in">Walk-in customer</option><option value="registered">Registered actor</option><option value="anonymous">Anonymous</option>
            </select>
            {buyerType === "registered" && <input value={buyer} onChange={(e) => setBuyer(e.target.value)} className={inputCls + " mt-2"} placeholder="Buyer name / Trade ID" />}
          </div>
          <div>
            <label className={labelCls}>Payment status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={inputCls}>
              <option value="paid">Paid in full</option><option value="partial">Partial</option><option value="credit">On credit</option>
            </select>
            {paymentStatus === "partial" && <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className={inputCls + " mt-2"} placeholder="Amount paid" />}
          </div>
          <div>
            <label className={labelCls}>{paymentStatus === "paid" ? "Total" : "Due date"}</label>
            {paymentStatus === "paid"
              ? <div className={inputCls + " bg-warm-bg font-bold"}>{formatUGX(total)}</div>
              : <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />}
          </div>
        </div>

        {err && <p className="text-xs text-red-500 mt-3">{err}</p>}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-warm-text">Total: <span className="font-bold text-ink text-lg">{formatUGX(total)}</span></div>
          <button onClick={submit} className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold px-5 py-2.5 rounded-lg text-sm"><ShoppingCart size={15} /> Record sale</button>
        </div>
      </div>

      <div className="bg-white border border-warm-border rounded-xl p-5">
        <h3 className="font-bold text-ink text-sm mb-3">Recent sales</h3>
        <Table
          columns={["Date", "Buyer", "Items", "Total", "Status", "Balance"]}
          rows={sales.slice(0, 10).map((s) => [s.date, s.buyer, s.items.map((it) => `${it.name} ×${it.qty}`).join("; "), formatUGX(s.total), s.paymentStatus, formatUGX(s.balance)])}
          empty="No sales recorded yet."
        />
      </div>
    </div>
  );
}

// ── Debts & Credits ──────────────────────────────────────────────────────────
function Debts({ actorId }) {
  const [recv, setRecv] = useState([]);
  const [pay, setPay] = useState([]);
  const [addPay, setAddPay] = useState(false);
  const [payFor, setPayFor] = useState(null); // {kind, row}
  const load = useCallback(async () => { setRecv(await getReceivables(actorId)); setPay(await getPayables(actorId)); }, [actorId]);
  useEffect(() => { load(); }, [load]);

  const totalRecv = recv.reduce((s, r) => s + r.balance, 0);
  const totalPay = pay.reduce((s, p) => s + p.balance, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatTile label="Receivables (owed to you)" value={formatUGX(totalRecv)} tone="text-green-600" />
        <StatTile label="Payables (you owe)" value={formatUGX(totalPay)} tone="text-red-600" />
        <StatTile label="Net position" value={formatUGX(totalRecv - totalPay)} />
      </div>

      <div className="bg-white border border-warm-border rounded-xl p-5">
        <h3 className="font-bold text-ink text-sm mb-3">Receivables - debts owed to you</h3>
        <div className="overflow-x-auto border border-warm-border rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="bg-warm-bg text-left">{["Counterparty", "Amount", "Paid", "Balance", "Due", "Ageing", ""].map((c, i) => <th key={i} className="font-semibold text-warm-text px-3 py-2 whitespace-nowrap">{c}</th>)}</tr></thead>
            <tbody>
              {recv.length === 0 ? <tr><td colSpan={7} className="text-center text-warm-muted py-6">No receivables.</td></tr> : recv.map((r) => (
                <tr key={r.id} className="border-t border-warm-border">
                  <td className="px-3 py-2 font-medium text-ink">{r.counterparty}</td>
                  <td className="px-3 py-2">{formatUGX(r.amount)}</td>
                  <td className="px-3 py-2 text-warm-text">{formatUGX(r.amountPaid)}</td>
                  <td className="px-3 py-2 font-semibold text-ink">{formatUGX(r.balance)}</td>
                  <td className="px-3 py-2 text-warm-muted">{r.dueDate}</td>
                  <td className="px-3 py-2"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.overdue ? "bg-red-50 text-red-600" : "bg-warm-bg text-warm-text"}`}>{r.ageing}</span></td>
                  <td className="px-3 py-2">{r.balance > 0 && <button onClick={() => setPayFor({ kind: "recv", row: r })} className="text-[11px] font-semibold text-gold-dark hover:underline">Record payment</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-warm-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-ink text-sm">Payables - credits you owe</h3>
          <button onClick={() => setAddPay(true)} className="flex items-center gap-1.5 border border-warm-border hover:border-ink text-ink text-xs font-bold px-3 py-1.5 rounded-lg"><Plus size={13} /> Add payable</button>
        </div>
        <div className="overflow-x-auto border border-warm-border rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="bg-warm-bg text-left">{["Supplier", "Description", "Amount", "Paid", "Balance", "Due", "Ageing", ""].map((c, i) => <th key={i} className="font-semibold text-warm-text px-3 py-2 whitespace-nowrap">{c}</th>)}</tr></thead>
            <tbody>
              {pay.length === 0 ? <tr><td colSpan={8} className="text-center text-warm-muted py-6">No payables.</td></tr> : pay.map((p) => (
                <tr key={p.id} className="border-t border-warm-border">
                  <td className="px-3 py-2 font-medium text-ink">{p.supplier}</td>
                  <td className="px-3 py-2 text-warm-text">{p.description}</td>
                  <td className="px-3 py-2">{formatUGX(p.amount)}</td>
                  <td className="px-3 py-2 text-warm-text">{formatUGX(p.amountPaid)}</td>
                  <td className="px-3 py-2 font-semibold text-ink">{formatUGX(p.balance)}</td>
                  <td className="px-3 py-2 text-warm-muted">{p.dueDate}</td>
                  <td className="px-3 py-2"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.overdue ? "bg-red-50 text-red-600" : "bg-warm-bg text-warm-text"}`}>{p.ageing}</span></td>
                  <td className="px-3 py-2">{p.balance > 0 && <button onClick={() => setPayFor({ kind: "pay", row: p })} className="text-[11px] font-semibold text-gold-dark hover:underline">Record payment</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addPay && <AddPayableModal actorId={actorId} onClose={() => setAddPay(false)} onSaved={() => { setAddPay(false); load(); }} />}
      {payFor && <PaymentModal actorId={actorId} payFor={payFor} onClose={() => setPayFor(null)} onSaved={() => { setPayFor(null); load(); }} />}
    </div>
  );
}

function AddPayableModal({ actorId, onClose, onSaved }) {
  const [f, setF] = useState({ supplier: "", description: "", amount: "", amountPaid: "", dueDate: "" });
  const set = (x) => setF((p) => ({ ...p, ...x }));
  return (
    <Modal title="Add payable" subtitle="A credit you owe a supplier." onClose={onClose}>
      <div className="space-y-3">
        <div><label className={labelCls}>Supplier *</label><input value={f.supplier} onChange={(e) => set({ supplier: e.target.value })} className={inputCls} /></div>
        <div><label className={labelCls}>Description</label><input value={f.description} onChange={(e) => set({ description: e.target.value })} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Amount</label><input type="number" value={f.amount} onChange={(e) => set({ amount: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>Already paid</label><input type="number" value={f.amountPaid} onChange={(e) => set({ amountPaid: e.target.value })} className={inputCls} /></div>
        </div>
        <div><label className={labelCls}>Due date</label><input type="date" value={f.dueDate} onChange={(e) => set({ dueDate: e.target.value })} className={inputCls} /></div>
        <button onClick={async () => { if (!f.supplier.trim()) return; await addPayable(actorId, f); onSaved(); }} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-sm">Add payable</button>
      </div>
    </Modal>
  );
}

function PaymentModal({ actorId, payFor, onClose, onSaved }) {
  const { kind, row } = payFor;
  const [amount, setAmount] = useState(String(row.balance));
  async function submit() {
    const a = Number(amount) || 0;
    if (kind === "recv") await recordReceivablePayment(actorId, row.id, a);
    else await recordPayablePayment(actorId, row.id, a);
    onSaved();
  }
  return (
    <Modal title="Record payment" subtitle={`${kind === "recv" ? row.counterparty : row.supplier} · balance ${formatUGX(row.balance)}`} onClose={onClose}>
      <div className="space-y-3">
        <div><label className={labelCls}>Amount received / paid</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} /></div>
        <button onClick={submit} className="w-full bg-ink hover:bg-ink-mid text-white font-bold py-2.5 rounded-lg text-sm">Record payment</button>
      </div>
    </Modal>
  );
}

// ── Revenue / Expenses / Profit ──────────────────────────────────────────────
function Finance({ actorId }) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("quarter");
  const [sum, setSum] = useState(null);
  const [recent, setRecent] = useState([]);
  const [showExp, setShowExp] = useState(false);
  const load = useCallback(async () => { setSum(await getShopSummary(actorId, period)); setRecent(await getExpenses(actorId, {})); }, [actorId, period]);
  useEffect(() => { load(); }, [load]);
  if (!sum) return <Loader />;
  const max = Math.max(...sum.expenseByCategory.map((c) => c.total), 1);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-warm-muted">Period:</span>
        {PERIODS.map(([v, l]) => <button key={v} onClick={() => setPeriod(v)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${period === v ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border hover:border-ink"}`}>{l}</button>)}
      </div>

      <div className="bg-white border border-warm-border rounded-xl p-5">
        <h3 className="font-bold text-ink text-sm mb-4">Profit &amp; loss</h3>
        <div className="space-y-2 max-w-md">
          {[
            ["Revenue (sales)", sum.revenue, "text-ink"],
            ["Cost of goods sold", -sum.cogs, "text-warm-text"],
            ["Gross profit", sum.grossProfit, "text-ink font-bold"],
            ["Operating expenses (A21)", -sum.expenses, "text-warm-text"],
            ["Net profit", sum.netProfit, sum.netProfit >= 0 ? "text-green-700 font-bold" : "text-red-600 font-bold"],
          ].map(([l, v, cls]) => (
            <div key={l} className={`flex items-center justify-between py-1.5 ${l === "Net profit" || l === "Gross profit" ? "border-t border-warm-border pt-2" : ""}`}>
              <span className="text-sm text-warm-text">{l}</span>
              <span className={`text-sm ${cls}`}>{v < 0 ? `(${formatUGX(-v)})` : formatUGX(v)}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-warm-muted mt-3 flex items-center gap-1.5"><Receipt size={12} /> Operating expenses are pulled from the shared Expenses module (A21).</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border border-warm-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink text-sm">Operating expenses by category</h3>
            <button onClick={() => setShowExp(true)} className="flex items-center gap-1.5 bg-gold hover:bg-gold-mid text-ink text-xs font-bold px-3 py-1.5 rounded-lg"><Plus size={13} /> Add expense</button>
          </div>
          {sum.expenseByCategory.length === 0 ? <p className="text-sm text-warm-muted py-4 text-center">No expenses in this period.</p> : (
            <div className="space-y-2.5">
              {sum.expenseByCategory.map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <div className="w-36 text-xs text-ink truncate">{c.name}</div>
                  <div className="flex-1 h-5 bg-warm-bg rounded-md overflow-hidden"><div className="h-full bg-gold rounded-md" style={{ width: `${Math.max((c.total / max) * 100, 2)}%` }} /></div>
                  <div className="w-28 text-right text-xs font-semibold text-ink">{formatUGX(c.total)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white border border-warm-border rounded-xl p-5">
          <h3 className="font-bold text-ink text-sm mb-3">Shop position</h3>
          <div className="space-y-2 text-sm">
            <Row k="Sales recorded" v={sum.salesCount} />
            <Row k="Stock value (cost)" v={formatUGX(sum.stockValuation)} />
            <Row k="Receivables" v={formatUGX(sum.receivables)} />
            <Row k="Payables" v={formatUGX(sum.payables)} />
          </div>
          <button onClick={() => navigate("/expenses")} className="w-full mt-4 text-xs font-semibold text-gold flex items-center justify-center gap-1">Full expense ledger <ArrowRight size={12} /></button>
        </div>
      </div>

      {showExp && <AddExpenseModal actorId={actorId} onClose={() => setShowExp(false)} onSaved={() => { setShowExp(false); load(); }} />}
    </div>
  );
}

function Row({ k, v }) {
  return <div className="flex items-center justify-between"><span className="text-warm-text">{k}</span><span className="font-semibold text-ink">{v}</span></div>;
}

function AddExpenseModal({ actorId, onClose, onSaved }) {
  const [f, setF] = useState({ date: "2026-06-04", amount: "", category: "admin", description: "" });
  const set = (x) => setF((p) => ({ ...p, ...x }));
  return (
    <Modal title="Add operating expense" subtitle="Recorded in the shared Expenses model (A21)." onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Date</label><input type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>Amount</label><input type="number" value={f.amount} onChange={(e) => set({ amount: e.target.value })} className={inputCls} /></div>
        </div>
        <div><label className={labelCls}>Category</label><select value={f.category} onChange={(e) => set({ category: e.target.value })} className={inputCls}>{EXPENSE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className={labelCls}>Description</label><input value={f.description} onChange={(e) => set({ description: e.target.value })} className={inputCls} /></div>
        <button onClick={async () => { if (!f.amount || !f.description.trim()) return; await addShopExpense(actorId, f); onSaved(); }} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-sm">Save expense</button>
      </div>
    </Modal>
  );
}

// ── Reports ──────────────────────────────────────────────────────────────────
function Reports({ actorId, actorName }) {
  const [reports, setReports] = useState(null);
  const [salesFilters, setSalesFilters] = useState({ from: "", to: "", buyer: "" });
  const load = useCallback(async () => {
    setReports({
      stock: await stockReport(actorId),
      sales: await salesReport(actorId, salesFilters),
      debts: await debtorsCreditorsReport(actorId),
    });
  }, [actorId, salesFilters]);
  useEffect(() => { load(); }, [load]);
  if (!reports) return <Loader />;
  const meta = { institution: actorName || "shop", asOf: "FY2025/26" };

  return (
    <div className="space-y-4">
      <ReportPanel report={reports.stock} meta={meta} />
      <ReportPanel report={reports.sales} meta={meta}
        filters={
          <div className="flex items-center gap-2 flex-wrap">
            <input type="date" value={salesFilters.from} onChange={(e) => setSalesFilters((s) => ({ ...s, from: e.target.value }))} className="px-2 py-1 border border-warm-border rounded text-xs" title="From" />
            <input type="date" value={salesFilters.to} onChange={(e) => setSalesFilters((s) => ({ ...s, to: e.target.value }))} className="px-2 py-1 border border-warm-border rounded text-xs" title="To" />
            <input value={salesFilters.buyer} onChange={(e) => setSalesFilters((s) => ({ ...s, buyer: e.target.value }))} className="px-2 py-1 border border-warm-border rounded text-xs" placeholder="Buyer" />
          </div>
        } />
      <ReportPanel report={reports.debts} meta={meta} />
    </div>
  );
}

function ReportPanel({ report, meta, filters }) {
  const preview = report.detail.rows.slice(0, 8);
  return (
    <div className="bg-white border border-warm-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div>
          <h3 className="font-bold text-ink text-sm">{report.title}</h3>
          <p className="text-xs text-warm-muted mt-0.5">{report.description}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-warm-muted mr-0.5">Export:</span>
          {["csv", "xlsx", "pdf"].map((fmt) => (
            <button key={fmt} onClick={() => exportReport(report, fmt, meta)} className="flex items-center gap-1 text-[10px] font-bold text-ink border border-warm-border hover:border-gold hover:bg-gold-light px-2 py-1 rounded-md">
              <Download size={11} /> {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {filters && <div className="mb-3">{filters}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3">
        {report.stats.map((s, i) => <div key={i} className="bg-warm-bg border border-warm-border rounded-lg p-2.5"><div className="text-base font-bold text-ink">{s.value}</div><div className="text-[10px] text-warm-text">{s.label}</div></div>)}
      </div>
      <Table columns={report.detail.columns} rows={preview} />
      {report.detail.rows.length > preview.length && <p className="text-[10px] text-warm-muted mt-1.5">Showing {preview.length} of {report.detail.rows.length} rows · export for the full set.</p>}
    </div>
  );
}

function Loader() {
  return <div className="flex flex-col items-center justify-center py-24 text-warm-muted"><Loader2 size={28} className="animate-spin mb-3" /><p className="text-sm">Loading…</p></div>;
}

// ── Page shell ───────────────────────────────────────────────────────────────
export default function Stock({ section = "inventory" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;

  if (!canUseStock(role)) {
    const isFBR = role === "FBR";
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto text-center py-20">
          <div className="w-14 h-14 bg-warm-bg border border-warm-border rounded-2xl flex items-center justify-center mx-auto mb-4"><Ban size={26} className="text-warm-muted" /></div>
          <h1 className="text-xl font-bold text-ink mb-2">Stock Management isn't available</h1>
          <p className="text-sm text-warm-text leading-relaxed">
            {isFBR
              ? "Stock & Shop Management is for domestic actors who hold and resell physical stock in Uganda. As a Foreign Buyer / International Trader (FBR), your account does not keep a Ugandan stock ledger."
              : "Your account type does not include a stock ledger."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const actorId = user.username;
  return (
    <DashboardLayout>
      <div className="flex items-center gap-2 mb-1">
        <Boxes size={20} className="text-gold-dark" />
        <h1 className="text-xl font-bold text-ink">Stock Management</h1>
      </div>
      <p className="text-sm text-warm-text mb-5">Manage stock, record sales, track debts and see your shop's profit. Visible only to you.</p>

      {/* Section tabs */}
      <div className="border-b border-warm-border mb-6 flex gap-1 overflow-x-auto">
        {SECTIONS.map((t) => (
          <button key={t.id} onClick={() => navigate(t.path)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-all ${section === t.id ? "border-gold text-ink" : "border-transparent text-warm-muted hover:text-ink"}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {section === "inventory" && <Inventory actorId={actorId} />}
      {section === "stores" && <Stores actorId={actorId} />}
      {section === "sell" && <Sell actorId={actorId} />}
      {section === "debts" && <Debts actorId={actorId} />}
      {section === "finance" && <Finance actorId={actorId} />}
      {section === "reports" && <Reports actorId={actorId} actorName={user.name} />}
    </DashboardLayout>
  );
}
