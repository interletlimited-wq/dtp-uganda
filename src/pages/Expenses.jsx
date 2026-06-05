import { useState, useEffect, useCallback } from "react";
import {
  Receipt, Plus, X, Loader2, AlertCircle, TrendingUp, Tag, Calendar,
  Repeat, BarChart3, Ban,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { formatUGX } from "../data/demo";
import {
  getExpenses, getExpenseSummary, addExpense, categoryName,
  EXPENSE_CATEGORIES, CURRENCIES, canUseExpenses,
} from "../data/expenses";

const labelCls = "block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5";
const inputCls = "w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted";
const PERIODS = [["month", "This month"], ["quarter", "Last 3 months"], ["year", "This year"], ["all", "All time"]];
const monthLabel = (ym) => {
  const [, m] = ym.split("-");
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(m) - 1] || ym;
};

// Money formatter that respects currency (UGX via formatUGX, others plain).
function money(amount, currency = "UGX") {
  if (currency === "UGX") return formatUGX(amount);
  return `${currency} ${Number(amount).toLocaleString()}`;
}

// ── Add expense modal ────────────────────────────────────────────────────────
function AddExpenseModal({ onClose, onSaved, actorId }) {
  const [f, setF] = useState({
    date: "2026-06-04", amount: "", currency: "UGX", category: "production",
    subCategory: "", description: "", counterparty: "", linkedActivity: "", recurring: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (x) => setF((p) => ({ ...p, ...x }));
  const cat = EXPENSE_CATEGORIES.find((c) => c.id === f.category);

  async function submit() {
    if (!f.date) return setError("Select a date.");
    if (!f.amount || Number(f.amount) <= 0) return setError("Enter an amount greater than zero.");
    if (!f.description.trim()) return setError("Add a short description.");
    setSaving(true);
    await addExpense(actorId, { ...f, amount: Number(f.amount) });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl">
        <div className="flex items-start justify-between gap-3 p-5 border-b border-warm-border">
          <div>
            <h2 className="text-lg font-bold text-ink">Record an expense</h2>
            <p className="text-xs text-warm-muted mt-0.5">Logged against your Trade ID; only you can see it.</p>
          </div>
          <button onClick={onClose} className="text-warm-muted hover:text-ink p-1"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Date <span className="text-red-400">*</span></label>
              <input type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Amount <span className="text-red-400">*</span></label>
              <input type="number" value={f.amount} onChange={(e) => set({ amount: e.target.value })} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select value={f.currency} onChange={(e) => set({ currency: e.target.value })} className={inputCls}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category <span className="text-red-400">*</span></label>
              <select value={f.category} onChange={(e) => set({ category: e.target.value, subCategory: "" })} className={inputCls}>
                {EXPENSE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Sub-category <span className="text-warm-muted normal-case font-normal">(optional)</span></label>
              <input value={f.subCategory} onChange={(e) => set({ subCategory: e.target.value })} className={inputCls} placeholder="e.g. Fertiliser" list="subcat-list" />
              <datalist id="subcat-list">{(cat?.subs || []).map((s) => <option key={s} value={s} />)}</datalist>
            </div>
          </div>

          <div>
            <label className={labelCls}>Description <span className="text-red-400">*</span></label>
            <input value={f.description} onChange={(e) => set({ description: e.target.value })} className={inputCls} placeholder="What was this expense for?" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Counterparty / payee <span className="text-warm-muted normal-case font-normal">(optional)</span></label>
              <input value={f.counterparty} onChange={(e) => set({ counterparty: e.target.value })} className={inputCls} placeholder="Who was paid" />
            </div>
            <div>
              <label className={labelCls}>Linked activity / batch <span className="text-warm-muted normal-case font-normal">(optional)</span></label>
              <input value={f.linkedActivity} onChange={(e) => set({ linkedActivity: e.target.value })} className={inputCls} placeholder="e.g. BATCH-VAP-2026-089" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-warm-text">
            <input type="checkbox" checked={f.recurring} onChange={(e) => set({ recurring: e.target.checked })} />
            <Repeat size={13} className="text-warm-muted" /> Recurring expense (e.g. monthly rent, licence)
          </label>

          {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="px-5 py-2.5 border border-warm-border rounded-lg text-sm font-medium text-warm-text hover:text-ink hover:border-ink transition-all">Cancel</button>
            <button onClick={submit} disabled={saving} className="flex-1 bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Save expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CSS bar list ─────────────────────────────────────────────────────────────
function Bars({ items }) {
  if (!items.length) return <p className="text-sm text-warm-muted py-4 text-center">No data for this period.</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3">
          <div className="w-28 md:w-40 text-xs text-ink truncate flex-shrink-0" title={it.label}>{it.label}</div>
          <div className="flex-1 h-5 bg-warm-bg rounded-md overflow-hidden">
            <div className="h-full bg-gold rounded-md" style={{ width: `${Math.max((it.value / max) * 100, 2)}%` }} />
          </div>
          <div className="w-28 text-right text-xs font-semibold text-ink flex-shrink-0">{it.display}</div>
        </div>
      ))}
    </div>
  );
}

// ── Access block (FBR / ineligible) ──────────────────────────────────────────
function ExpensesBlocked({ role }) {
  const isFBR = role === "FBR";
  return (
    <div className="max-w-xl mx-auto text-center py-20">
      <div className="w-14 h-14 bg-warm-bg border border-warm-border rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Ban size={26} className="text-warm-muted" />
      </div>
      <h1 className="text-xl font-bold text-ink mb-2">Expenses Management isn't available</h1>
      <p className="text-sm text-warm-text leading-relaxed">
        {isFBR
          ? "Expenses Management is for domestic trade actors who produce, process, transport or trade within Uganda. As a Foreign Buyer / International Trader (FBR), your account does not keep a Ugandan expense ledger."
          : "Your account type does not include an expense ledger."}
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Expenses() {
  const { user } = useAuth();
  const role = user?.role;
  const eligible = canUseExpenses(role);

  const [period, setPeriod] = useState("quarter");
  const [filters, setFilters] = useState({ category: "all", from: "", to: "" });
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    if (!user || !eligible) { setLoading(false); return; }
    setLoading(true);
    const [list, sum] = await Promise.all([
      getExpenses(user.username, filters),
      getExpenseSummary(user.username, period),
    ]);
    setRows(list); setSummary(sum); setLoading(false);
  }, [user, eligible, filters, period]);
  useEffect(() => { load(); }, [load]);

  if (!eligible) return <DashboardLayout><ExpensesBlocked role={role} /></DashboardLayout>;

  const setF = (x) => setFilters((p) => ({ ...p, ...x }));

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2"><Receipt size={20} className="text-gold-dark" /> Expenses</h1>
          <p className="text-sm text-warm-text mt-0.5">Record and analyse your operating costs. Visible only to you.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap">
          <Plus size={16} /> Record an expense
        </button>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs text-warm-muted">Summary period:</span>
        {PERIODS.map(([v, l]) => (
          <button key={v} onClick={() => setPeriod(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${period === v ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border hover:border-ink"}`}>
            {l}
          </button>
        ))}
      </div>

      {loading || !summary ? (
        <div className="flex flex-col items-center justify-center py-24 text-warm-muted"><Loader2 size={28} className="animate-spin mb-3" /><p className="text-sm">Loading expenses…</p></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-warm-border rounded-xl p-4">
              <div className="text-2xl font-bold text-ink">{formatUGX(summary.total)}</div>
              <div className="text-xs text-warm-text mt-0.5">Total expenses</div>
              <div className="text-[10px] text-warm-muted">{PERIODS.find((p) => p[0] === period)?.[1]}</div>
            </div>
            <div className="bg-white border border-warm-border rounded-xl p-4">
              <div className="text-2xl font-bold text-ink">{summary.count}</div>
              <div className="text-xs text-warm-text mt-0.5">Entries recorded</div>
            </div>
            <div className="bg-white border border-warm-border rounded-xl p-4">
              <div className="text-2xl font-bold text-ink">{summary.byCategory[0]?.name || "-"}</div>
              <div className="text-xs text-warm-text mt-0.5">Largest category</div>
              <div className="text-[10px] text-warm-muted">{summary.byCategory[0] ? `${summary.byCategory[0].pct.toFixed(0)}% of spend` : ""}</div>
            </div>
            <div className="bg-white border border-warm-border rounded-xl p-4">
              <div className="text-2xl font-bold text-ink">{EXPENSE_CATEGORIES.length}</div>
              <div className="text-xs text-warm-text mt-0.5">Categories tracked</div>
            </div>
          </div>

          {/* Breakdown + trend */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-warm-border rounded-xl p-5">
              <h3 className="font-bold text-ink text-sm mb-4 flex items-center gap-2"><Tag size={14} className="text-gold-dark" /> Breakdown by category</h3>
              <Bars items={summary.byCategory.map((c) => ({ label: c.name, value: c.total, display: `${formatUGX(c.total)} · ${c.pct.toFixed(0)}%` }))} />
            </div>
            <div className="bg-white border border-warm-border rounded-xl p-5">
              <h3 className="font-bold text-ink text-sm mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-gold-dark" /> Trend over time</h3>
              <Bars items={summary.trend.map((t) => ({ label: monthLabel(t.month), value: t.total, display: formatUGX(t.total) }))} />
            </div>
          </div>

          {/* Filters + list */}
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <h3 className="font-bold text-ink text-sm flex items-center gap-2"><BarChart3 size={14} className="text-gold-dark" /> Expense entries</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <select value={filters.category} onChange={(e) => setF({ category: e.target.value })} className="px-3 py-1.5 border border-warm-border rounded-lg text-xs text-ink bg-white">
                  <option value="all">All categories</option>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="date" value={filters.from} onChange={(e) => setF({ from: e.target.value })} className="px-3 py-1.5 border border-warm-border rounded-lg text-xs text-ink bg-white" title="From date" />
                <input type="date" value={filters.to} onChange={(e) => setF({ to: e.target.value })} className="px-3 py-1.5 border border-warm-border rounded-lg text-xs text-ink bg-white" title="To date" />
                {(filters.category !== "all" || filters.from || filters.to) && (
                  <button onClick={() => setFilters({ category: "all", from: "", to: "" })} className="text-xs text-gold font-semibold">Clear</button>
                )}
              </div>
            </div>

            {rows.length === 0 ? (
              <div className="text-center py-12 text-warm-muted">
                <Receipt size={28} className="mx-auto mb-2" />
                <p className="text-sm">No expenses match your filters. Record your first expense to start tracking costs.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-warm-border rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-warm-bg text-left">
                      {["Date", "Category", "Description", "Counterparty", "Linked to", "Amount"].map((h) => (
                        <th key={h} className="font-semibold text-warm-text px-3 py-2 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((x) => (
                      <tr key={x.id} className="border-t border-warm-border">
                        <td className="px-3 py-2 whitespace-nowrap text-ink flex items-center gap-1"><Calendar size={11} className="text-warm-muted" /> {x.date}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="text-ink">{categoryName(x.category)}</span>
                          {x.subCategory && <span className="text-warm-muted"> · {x.subCategory}</span>}
                        </td>
                        <td className="px-3 py-2 text-ink">
                          {x.description}
                          {x.recurring && <span className="ml-1.5 text-[9px] font-bold text-gold-dark bg-gold-light border border-gold-border px-1 rounded">RECURRING</span>}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-warm-text">{x.counterparty || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-warm-muted font-mono">{x.linkedActivity || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-right font-semibold text-ink">{money(x.amount, x.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {showAdd && <AddExpenseModal actorId={user.username} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
    </DashboardLayout>
  );
}
