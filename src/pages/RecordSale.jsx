import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ArrowLeft, Check, X, Search, Shield, AlertCircle,
  Lock, Info, Edit2, EyeOff
} from "lucide-react";
import { getActorProducts, getActorStores, MARKET_PRICES, formatUGX } from "../data/demo";
import { SAMPLE_ACCOUNTS } from "../data/constants";

const PAYMENT_METHODS = [
  "MTN MoMo", "Airtel Money", "Stanbic Bank", "Centenary Bank",
  "Equity Bank", "DFCU Bank", "Cash", "Cheque", "Bank Transfer"
];
const DELIVERY_OPTIONS = [
  "Buyer collects from store",
  "Seller delivers to buyer",
  "Third-party transporter",
  "Already delivered"
];

function BuyerLookup({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  function handleSearch(val) {
    setQuery(val);
    if (val.length < 3) { setResults([]); return; }
    const matches = SAMPLE_ACCOUNTS.filter(a =>
      (a.tradeId?.toLowerCase().includes(val.toLowerCase()) ||
       a.name?.toLowerCase().includes(val.toLowerCase()) ||
       a.username?.toLowerCase().includes(val.toLowerCase())) &&
      a.role !== "ADMIN" && a.role !== "GOU"
    );
    setResults(matches.slice(0, 5));
  }

  function handleSelect(acc) {
    setSelected(acc);
    setResults([]);
    setQuery(acc.tradeId || acc.username);
    onSelect(acc);
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted" />
        <input value={query}
          onChange={e => { setSelected(null); onSelect(null); handleSearch(e.target.value); }}
          className="w-full pl-9 pr-4 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted"
          placeholder="Search by Trade ID, name or username..." />
      </div>
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-warm-border rounded-xl shadow-lg z-20 mt-1 overflow-hidden">
          {results.map(a => (
            <button key={a.username} onClick={() => handleSelect(a)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-warm-bg transition-colors text-left border-b border-warm-border last:border-0">
              <div className="flex-1">
                <div className="text-sm font-medium text-ink">{a.name}</div>
                <div className="text-xs text-warm-muted font-mono">{a.tradeId}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] font-bold bg-warm-bg border border-warm-border px-2 py-0.5 rounded">{a.role}</span>
                {a.verified && (
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <Shield size={9} /> {a.verified}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      {selected && (
        <div className="mt-2 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <Check size={16} className="text-green-500 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-green-700">{selected.name}</div>
            <div className="text-xs text-green-600 font-mono">{selected.tradeId} · {selected.role} · {selected.verified} Verified</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecordSale() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const products = getActorProducts(user?.username, user?.role);
  const stores = getActorStores(user?.username, user?.role);

  const [buyer, setBuyer] = useState(null);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    productId: "", quantity: "", unit: "kg", pricePerUnit: "",
    paymentMethod: "", deliveryOption: "",
    saleDate: new Date().toISOString().split("T")[0],
    note: "", reference: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedRef, setSubmittedRef] = useState("");
  const [editCount, setEditCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editReason, setEditReason] = useState("");
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivated, setDeactivated] = useState(false);

  function addEntry() {
    if (!form.productId || !form.quantity || !form.pricePerUnit) {
      setErrors({ productId: !form.productId ? "Required" : "", quantity: !form.quantity ? "Required" : "", pricePerUnit: !form.pricePerUnit ? "Required" : "" });
      return;
    }
    const product = products.find(p => p.id === form.productId);
    setEntries([...entries, {
      ...form,
      id: Date.now(),
      productName: product?.name || "",
      total: parseInt(form.quantity) * parseInt(form.pricePerUnit)
    }]);
    setForm({ ...form, productId: "", quantity: "", pricePerUnit: "", note: "", reference: "" });
    setErrors({});
  }

  function removeEntry(id) {
    setEntries(entries.filter(e => e.id !== id));
  }

  const grandTotal = entries.reduce((s, e) => s + e.total, 0);

  const selectedProduct = products.find(p => p.id === form.productId);
  const marketPrice = selectedProduct ? MARKET_PRICES.find(p => p.commodity === selectedProduct.name) : null;
  const total = form.quantity && form.pricePerUnit ? parseInt(form.quantity) * parseInt(form.pricePerUnit) : 0;
  const priceDiff = marketPrice && form.pricePerUnit
    ? ((parseInt(form.pricePerUnit) - marketPrice.sell) / marketPrice.sell * 100).toFixed(1)
    : null;
  const canEdit = editCount < 1;

  function validate() {
    const e = {};
    if (!buyer) e.buyer = "Please select a buyer";
    if (!form.productId) e.productId = "Please select a product";
    if (!form.quantity || parseInt(form.quantity) <= 0) e.quantity = "Enter a valid quantity";
    if (selectedProduct && parseInt(form.quantity) > selectedProduct.stockRemaining)
      e.quantity = `Only ${selectedProduct.stockRemaining} ${selectedProduct.unit} in stock`;
    if (!form.pricePerUnit || parseInt(form.pricePerUnit) <= 0) e.pricePerUnit = "Enter a valid price";
    if (!form.paymentMethod) e.paymentMethod = "Select a payment method";
    if (!form.deliveryOption) e.deliveryOption = "Select a delivery option";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const ref = `TXN-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 8999))}`;
    setSubmittedRef(ref);
    setSubmitting(false);
    setSubmitted(true);
  }

  async function handleEditSubmit() {
    if (editReason.length < 20) { setErrors({editReason: "Reason must be at least 20 characters"}); return; }
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setIsEditing(false);
    setEditCount(c => c + 1);
    setEditReason("");
  }

  function handleDeactivate() {
    if (deactivateReason.length < 20) { setErrors({deactivateReason: "Reason must be at least 20 characters"}); return; }
    setDeactivated(true);
    setShowDeactivate(false);
  }

  const formSection = (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Buyer Trade ID or name <span className="text-red-400">*</span></label>
        <BuyerLookup onSelect={setBuyer} />
        {errors.buyer && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={10}/> {errors.buyer}</p>}
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Product <span className="text-red-400">*</span></label>
        <select value={form.productId}
          onChange={e => {
            const p = products.find(x => x.id === e.target.value);
            setForm({...form, productId: e.target.value, unit: p?.unit || "kg", pricePerUnit: p?.price?.toString() || ""});
            setErrors({...errors, productId: ""});
          }}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white ${errors.productId ? "border-red-300" : "border-warm-border"}`}>
          <option value="">Select product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}  -  {p.stockRemaining.toLocaleString()} {p.unit} in stock</option>)}
        </select>
        {errors.productId && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={10}/> {errors.productId}</p>}
      </div>
      {selectedProduct && (
        <div className="md:col-span-2 grid grid-cols-3 gap-3 p-3 bg-warm-bg border border-warm-border rounded-xl text-xs">
          <div><span className="text-warm-muted">In stock:</span> <span className="font-semibold text-ink ml-1">{selectedProduct.stockRemaining.toLocaleString()} {selectedProduct.unit}</span></div>
          {marketPrice && <div><span className="text-warm-muted">Market price:</span> <span className="font-semibold text-ink ml-1">UGX {marketPrice.sell.toLocaleString()}/{selectedProduct.unit}</span></div>}
          <div><span className="text-warm-muted">Store:</span> <span className="font-semibold text-ink ml-1">{stores.find(s => s.id === selectedProduct.storeId)?.name || " - "}</span></div>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Quantity sold <span className="text-red-400">*</span></label>
        <div className="flex gap-2">
          <input type="number" value={form.quantity}
            onChange={e => { setForm({...form, quantity: e.target.value}); setErrors({...errors, quantity: ""}); }}
            className={`flex-1 px-3 py-2.5 border rounded-lg text-sm text-ink bg-white ${errors.quantity ? "border-red-300" : "border-warm-border"}`}
            placeholder="e.g. 500" />
          <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
            className="w-24 px-2 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            {["kg","tonne","litre","bunch","crate","piece"].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        {errors.quantity && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={10}/> {errors.quantity}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Price per unit (UGX) <span className="text-red-400">*</span></label>
        <input type="number" value={form.pricePerUnit}
          onChange={e => { setForm({...form, pricePerUnit: e.target.value}); setErrors({...errors, pricePerUnit: ""}); }}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white ${errors.pricePerUnit ? "border-red-300" : "border-warm-border"}`}
          placeholder="e.g. 9000" />
        {marketPrice && form.pricePerUnit && (
          <p className={`text-xs mt-1 ${parseFloat(priceDiff) >= 0 ? "text-green-600" : "text-amber-600"}`}>
            {parseFloat(priceDiff) >= 0 ? "▲" : "▼"} {Math.abs(priceDiff)}% {parseFloat(priceDiff) >= 0 ? "above" : "below"} market price
          </p>
        )}
        {errors.pricePerUnit && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={10}/> {errors.pricePerUnit}</p>}
      </div>
      {total > 0 && (
        <div className="md:col-span-2 p-4 bg-ink rounded-xl flex items-center justify-between">
          <div className="text-white/50 text-sm">Total transaction value</div>
          <div className="text-gold font-bold text-2xl font-mono">{formatUGX(total)}</div>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Payment method <span className="text-red-400">*</span></label>
        <select value={form.paymentMethod}
          onChange={e => { setForm({...form, paymentMethod: e.target.value}); setErrors({...errors, paymentMethod: ""}); }}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white ${errors.paymentMethod ? "border-red-300" : "border-warm-border"}`}>
          <option value="">Select method</option>
          {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
        </select>
        {errors.paymentMethod && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={10}/> {errors.paymentMethod}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Delivery option <span className="text-red-400">*</span></label>
        <select value={form.deliveryOption}
          onChange={e => { setForm({...form, deliveryOption: e.target.value}); setErrors({...errors, deliveryOption: ""}); }}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white ${errors.deliveryOption ? "border-red-300" : "border-warm-border"}`}>
          <option value="">Select option</option>
          {DELIVERY_OPTIONS.map(d => <option key={d}>{d}</option>)}
        </select>
        {errors.deliveryOption && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={10}/> {errors.deliveryOption}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Sale date</label>
        <input type="date" value={form.saleDate} onChange={e => setForm({...form, saleDate: e.target.value})}
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Payment reference</label>
        <input value={form.reference} onChange={e => setForm({...form, reference: e.target.value})}
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted"
          placeholder="MoMo ref, cheque no..." />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Note (optional)</label>
        <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})}
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white resize-none h-16 placeholder:text-warm-muted"
          placeholder="Any additional notes about this sale..." />
      </div>
    </div>
  );

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
            <ArrowLeft size={15}/> Dashboard
          </button>
          <h1 className="text-xl font-bold text-ink">Sale record</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {deactivated ? (
              <div className="bg-white border border-warm-border rounded-xl p-6 mb-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-warm-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <EyeOff size={18} className="text-warm-muted"/>
                  </div>
                  <div>
                    <div className="font-semibold text-ink">Record deactivated</div>
                    <div className="text-xs text-warm-muted">Admin has been notified. Record remains in audit trail.</div>
                  </div>
                </div>
                <div className="p-3 bg-warm-bg rounded-lg text-xs text-warm-text">Reason: {deactivateReason}</div>
              </div>
            ) : isEditing ? (
              <div className="bg-white border border-warm-border rounded-xl p-6 mb-5">
                <h3 className="font-bold text-ink mb-1">Edit sale record</h3>
                <p className="text-xs text-warm-muted mb-4">This is your {editCount === 0 ? "first and only" : "final"} allowed edit. After saving, this record will be permanently locked.</p>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Reason for edit <span className="text-red-400">*</span></label>
                  <textarea value={editReason} onChange={e => { setEditReason(e.target.value); setErrors({}); }}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white resize-none h-20 placeholder:text-warm-muted ${errors.editReason ? "border-red-300" : "border-warm-border"}`}
                    placeholder="Explain why this record needs to be edited (min 20 characters)..." />
                  {errors.editReason && <p className="text-xs text-red-500 mt-1">{errors.editReason}</p>}
                  <p className="text-[11px] text-warm-muted mt-1">{editReason.length}/20 minimum characters</p>
                </div>
                {formSection}
                <div className="flex gap-3 mt-5">
                  <button onClick={handleEditSubmit} disabled={submitting}
                    className="bg-gold hover:bg-gold-mid text-ink font-bold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2">
                    <Check size={15}/> Save edit
                  </button>
                  <button onClick={() => { setIsEditing(false); setErrors({}); }}
                    className="border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-warm-border rounded-xl p-6 mb-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Check size={18} className="text-green-500"/>
                    </div>
                    <div>
                      <div className="font-bold text-ink">Sale recorded</div>
                      <div className="font-mono text-xs text-warm-muted">{submittedRef}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${canEdit ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-warm-bg text-warm-muted border border-warm-border"}`}>
                    {canEdit ? <Edit2 size={11}/> : <Lock size={11}/>}
                    {canEdit ? "1 edit remaining" : "Record locked"}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-5">
                  {[
                    ["Buyer", buyer?.name],
                    ["Product", selectedProduct?.name],
                    ["Quantity", `${parseInt(form.quantity).toLocaleString()} ${form.unit}`],
                    ["Price/unit", `UGX ${parseInt(form.pricePerUnit).toLocaleString()}`],
                    ["Total", formatUGX(total)],
                    ["Payment", form.paymentMethod],
                    ["Delivery", form.deliveryOption],
                    ["Date", form.saleDate],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-warm-bg rounded-lg p-2.5">
                      <div className="text-[10px] text-warm-muted uppercase tracking-wider">{l}</div>
                      <div className="font-semibold text-ink text-xs mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
                {form.note && <div className="p-3 bg-warm-bg rounded-lg text-xs text-warm-text mb-4">Note: {form.note}</div>}
                <div className="flex items-center gap-2 pt-4 border-t border-warm-border">
                  {canEdit && !deactivated && (
                    <button onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg hover:bg-amber-100 transition-all">
                      <Edit2 size={13}/> Edit record (1 edit allowed)
                    </button>
                  )}
                  {!deactivated && (
                    <button onClick={() => setShowDeactivate(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-warm-text border border-warm-border px-3 py-2 rounded-lg hover:text-ink hover:border-ink transition-all">
                      <EyeOff size={13}/> Deactivate record
                    </button>
                  )}
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-warm-muted">
                    <Lock size={11}/> Cannot be deleted
                  </div>
                </div>
              </div>
            )}

            {showDeactivate && (
              <div className="bg-white border border-red-200 rounded-xl p-5 mb-5">
                <h3 className="font-bold text-ink mb-1 flex items-center gap-2"><EyeOff size={16}/> Deactivate record</h3>
                <p className="text-xs text-warm-text mb-3">This record will be hidden from your active ledger view but remains in the audit trail. Admin will be notified. This cannot be undone.</p>
                <textarea value={deactivateReason} onChange={e => { setDeactivateReason(e.target.value); setErrors({}); }}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white resize-none h-20 placeholder:text-warm-muted ${errors.deactivateReason ? "border-red-300" : "border-warm-border"}`}
                  placeholder="Mandatory reason for deactivation (min 20 characters)..." />
                {errors.deactivateReason && <p className="text-xs text-red-500 mt-1">{errors.deactivateReason}</p>}
                <p className="text-[11px] text-warm-muted mt-1 mb-3">{deactivateReason.length}/20 minimum</p>
                <div className="flex gap-3">
                  <button onClick={handleDeactivate}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all">
                    Confirm deactivation
                  </button>
                  <button onClick={() => { setShowDeactivate(false); setErrors({}); }}
                    className="border border-warm-border text-warm-text hover:text-ink px-4 py-2 rounded-lg text-sm transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white border border-warm-border rounded-xl p-5 mb-4">
              <h3 className="font-semibold text-ink text-sm mb-3">What you can do</h3>
              <div className="space-y-2.5 text-xs">
                {[
                  [canEdit ? "amber" : "gray", canEdit ? Edit2 : Lock, canEdit ? "Edit once within 24 hours" : "Edit window closed", canEdit ? "1 edit remaining  -  requires a reason" : "Record is permanently locked"],
                  ["gray", EyeOff, "Deactivate (not delete)", "Hides from active view. Admin notified. Audit trail retained."],
                  ["gray", Lock, "Cannot be deleted", "Transaction records are permanent commercial history."],
                ].map(([color, Icon, title, desc]) => (
                  <div key={title} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${color === "amber" ? "bg-amber-50" : "bg-warm-bg"}`}>
                    <Icon size={14} className={`flex-shrink-0 mt-0.5 ${color === "amber" ? "text-amber-600" : "text-warm-muted"}`}/>
                    <div>
                      <div className={`font-semibold ${color === "amber" ? "text-amber-700" : "text-ink"}`}>{title}</div>
                      <div className="text-warm-muted leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/ledger")}
                className="w-full bg-ink hover:bg-ink-mid text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
                View in ledger
              </button>
              <button onClick={() => { setSubmitted(false); setBuyer(null); setForm({ productId:"", quantity:"", unit:"kg", pricePerUnit:"", paymentMethod:"", deliveryOption:"", saleDate: new Date().toISOString().split("T")[0], note:"", reference:"" }); setEditCount(0); setDeactivated(false); }}
                className="w-full border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
                Record another sale
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
            <ArrowLeft size={15}/> Dashboard
          </button>
          <h1 className="text-xl font-bold text-ink">Record a Sale</h1>
          <p className="text-sm text-warm-text">Record a completed sale and add it to your permanent ledger.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5"/>
            <div className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold block mb-0.5">Before you submit</span>
              Once submitted this record is permanent. You may edit it once within 24 hours with a mandatory reason. Records cannot be deleted  -  only deactivated with admin notification. Verify all details carefully.
            </div>
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-6">
            {formSection}
            <div className="mt-4">
              <button onClick={addEntry}
                className="w-full border-2 border-dashed border-warm-border hover:border-gold text-warm-text hover:text-ink py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                + Add this item to batch
              </button>
            </div>
            {entries.length > 0 && (
              <div className="mt-4 border border-warm-border rounded-xl overflow-hidden">
                <div className="bg-warm-bg px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-warm-text uppercase tracking-wider">{entries.length} item{entries.length > 1 ? "s" : ""} in batch</span>
                  <span className="text-sm font-bold text-ink">{formatUGX(grandTotal)} total</span>
                </div>
                {entries.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-3 px-4 py-3 border-t border-warm-border">
                    <div className="w-6 h-6 bg-warm-bg rounded-lg flex items-center justify-center text-xs font-bold text-warm-muted flex-shrink-0">{i+1}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink">{e.productName}</div>
                      <div className="text-xs text-warm-muted">{parseInt(e.quantity).toLocaleString()} {e.unit} at UGX {parseInt(e.pricePerUnit).toLocaleString()}/{e.unit}</div>
                    </div>
                    <div className="text-sm font-bold text-green-600 mr-2">{formatUGX(e.total)}</div>
                    <button onClick={() => removeEntry(e.id)} className="text-warm-muted hover:text-red-500 transition-colors text-xs">Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-5 pt-5 border-t border-warm-border">
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 bg-gold hover:bg-gold-mid disabled:opacity-50 text-ink font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Recording sale...
                  </span>
                ) : <span className="flex items-center gap-2"><Check size={16}/> Submit {entries.length > 1 ? `${entries.length} sale records` : "sale record"}</span>}
              </button>
              <button onClick={() => navigate("/dashboard")}
                className="px-5 py-3 border border-warm-border text-warm-text hover:text-ink rounded-lg text-sm transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <h3 className="font-semibold text-ink text-sm mb-3 flex items-center gap-2"><Info size={15}/> Record rules</h3>
            <div className="space-y-3 text-xs text-warm-text">
              {[
                ["Once submitted, this sale is permanent."],
                ["You may edit it once within 24 hours. A reason is required."],
                ["After the edit window or after 1 edit, the record is locked."],
                ["Records cannot be deleted  -  only deactivated with a reason. Admin is notified."],
                ["All versions are retained in the audit trail."],
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-warm-bg border border-warm-border rounded-full flex items-center justify-center text-[9px] font-bold text-warm-muted flex-shrink-0 mt-0.5">{i+1}</div>
                  <p className="leading-relaxed">{t[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
