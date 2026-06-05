import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles, Plus, X, MapPin, Calendar, Package, Clock, Filter,
  CheckCircle, ArrowRight, Loader2, Globe, ShoppingCart, Repeat, AlertCircle, MessageSquare,
} from "lucide-react";
import GovShell from "../components/GovShell";
import TrustTick from "../components/TrustTick";
import { useAuth } from "../context/AuthContext";
import { formatUGX, MARKET_PRICES, getActorStores } from "../data/demo";
import { REGIONS, DISTRICTS } from "../data/geo";
import {
  getSupplyRequests, getSupplyRequest, createSupplyRequest, updateSupplyRequest, postOffer,
  acceptOffer, counterOffer, declineOffer, isClosingSoon, STATUS_LABELS,
  canPost, canRespond, RECURRENCE_OPTIONS, PAYMENT_METHODS, TRANSPORT_TERMS,
  CUSTOMS_OPTIONS, CERTIFICATION_OPTIONS,
} from "../data/supplyRequests";

const COMMODITIES = [...new Set(MARKET_PRICES.map((p) => p.commodity))].sort();
// Ugandan ports / border posts of exit for export-bound (foreign-buyer) requests.
const PORTS_OF_EXIT = ["Mombasa (Sea Port)", "Dar es Salaam (Sea Port)", "Entebbe (Airport)", "Malaba (Border post)", "Elegu (Border post)", "Mutukula (Border post)", "Katuna (Border post)"];
const BUYER_TYPES = [
  ["All", "All buyers"], ["FBR", "Foreign buyers"], ["CSM", "Consumers (retail)"],
  ["BYR", "Buyers / Offtakers"], ["AGT", "Aggregators"], ["MFR", "Manufacturers"],
  ["VAP", "Processors"], ["EXP", "Exporters"], ["IMP", "Importers"],
];

const STATUS_STYLE = {
  live: "bg-blue-50 text-blue-700 border-blue-200",
  offers: "bg-amber-50 text-amber-700 border-amber-200",
  partially_filled: "bg-purple-50 text-purple-700 border-purple-200",
  filled: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-50 text-gray-600 border-gray-200",
  expired: "bg-gray-50 text-gray-600 border-gray-200",
};

const labelField = "block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5";
const inputCls = "w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted";

function Chip({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${on ? "border-gold bg-gold-light font-semibold text-ink" : "border-warm-border hover:border-gold/50 text-warm-text"}`}>
      {children}
    </button>
  );
}

// ── Request card ───────────────────────────────────────────────────────────
function RequestCard({ req, onOpen }) {
  const closing = isClosingSoon(req);
  return (
    <button onClick={onOpen}
      className="text-left bg-white border border-warm-border rounded-xl p-5 hover:border-gold hover:shadow-sm transition-all flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="font-bold text-ink leading-tight">{req.commodity}</div>
          <div className="text-xs text-warm-muted mt-0.5">{req.grade}{req.recurrence !== "one-off" ? ` · ${req.recurrence}` : ""}</div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLE[req.status]}`}>{STATUS_LABELS[req.status]}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-xl font-bold text-ink">{Number(req.quantity).toLocaleString()}</span>
        <span className="text-sm text-warm-muted">{req.unit} required</span>
        <span className="ml-auto text-sm font-semibold text-ink">{req.targetPrice ? `${formatUGX(req.targetPrice)}/${req.unit}` : "Open to offers"}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-warm-text mb-3">
        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-warm-muted" /> {req.deliveryDistrict}</span>
        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-warm-muted" /> {req.deliveryWindow}</span>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-warm-border">
        <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center text-gold text-[10px] font-bold flex-shrink-0">{req.buyerName?.charAt(0)}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs font-semibold text-ink truncate">{req.buyerName}</span>
            <TrustTick seller={req.buyer} size={13} className="flex-shrink-0" />
            {req.isForeign && <Globe size={11} className="text-cyan-600 flex-shrink-0" />}
            {req.consumerOrigin && <span className="text-[9px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-1 rounded flex-shrink-0">RETAIL</span>}
          </div>
          <div className="text-[10px] font-mono text-warm-muted truncate">{req.buyerTradeId}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[11px] text-warm-muted">{req.offers.length} offer{req.offers.length !== 1 ? "s" : ""}</div>
          <div className={`text-[10px] ${closing ? "text-red-500 font-semibold" : "text-warm-muted"}`}>{closing ? "Closing soon" : `Closes ${req.validUntil}`}</div>
        </div>
      </div>
    </button>
  );
}

// ── New request / Supply Note form ──────────────────────────────────────────
const EMPTY_FORM = {
  commodity: "", quantity: "", unit: "kg", recurrence: "one-off", grade: "",
  certifications: [], packaging: "", targetPrice: "", deliveryDistrict: "",
  deliveryWindow: "", validUntil: "", visibility: "public", description: "",
  paymentMethods: [], transportTerms: TRANSPORT_TERMS[0], customs: CUSTOMS_OPTIONS[0],
  // delivery location detail (context-aware by poster)
  deliveryStore: "", deliveryAddress: "", deliveryCity: "", deliveryCountry: "",
};

// Context-aware delivery point: Ugandan posters pick a registered store or a
// district (+ optional address); foreign (FBR) posters deliver to their own
// country (address pre-filled from their account) or a Ugandan port of exit.
function DeliveryPointFields({ f, set, user }) {
  const isFBR = user?.role === "FBR";
  const myStores = user ? getActorStores(user.username, user.role) : [];
  const hasStores = myStores.length > 0;
  const [mode, setMode] = useState(isFBR ? "address" : (hasStores ? "store" : "district"));

  useEffect(() => {
    // Pre-fill a foreign buyer's destination from their registered account.
    if (isFBR && mode === "address" && !f.deliveryDistrict) {
      set({
        deliveryCountry: user.country || "",
        deliveryCity: user.city || "",
        deliveryAddress: user.addressLine || "",
        deliveryDistrict: [user.city, user.country].filter(Boolean).join(", "),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pickStore(id) {
    const s = myStores.find((x) => x.id === id);
    if (!s) return set({ deliveryStore: "", deliveryDistrict: "", deliveryAddress: "" });
    set({ deliveryStore: `${s.name} (${s.id})`, deliveryDistrict: s.district, deliveryAddress: s.address, deliveryCountry: "Uganda" });
  }
  const selectedStoreId = (myStores.find((s) => `${s.name} (${s.id})` === f.deliveryStore) || {}).id || "";

  return (
    <div>
      <label className={labelField}>Delivery point <span className="text-red-400">*</span></label>

      {isFBR ? (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Chip on={mode === "address"} onClick={() => { setMode("address"); set({ deliveryCountry: user.country || "", deliveryCity: user.city || "", deliveryAddress: user.addressLine || "", deliveryDistrict: [user.city, user.country].filter(Boolean).join(", ") }); }}>Deliver to my country</Chip>
            <Chip on={mode === "port"} onClick={() => { setMode("port"); set({ deliveryCountry: "Uganda (port of exit)", deliveryAddress: "", deliveryDistrict: "" }); }}>Ugandan port of exit</Chip>
          </div>
          {mode === "address" ? (
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-warm-muted">Destination country</span>
                <div className={`${inputCls} bg-warm-bg text-warm-text flex items-center gap-1.5 mt-1`}><Globe size={13} /> {user.country || "-"}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-warm-muted">City</span>
                <input value={f.deliveryCity} onChange={(e) => set({ deliveryCity: e.target.value, deliveryDistrict: [e.target.value, f.deliveryCountry || user.country].filter(Boolean).join(", ") })} className={`${inputCls} mt-1`} placeholder="City" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-warm-muted">Address</span>
                <input value={f.deliveryAddress} onChange={(e) => set({ deliveryAddress: e.target.value })} className={`${inputCls} mt-1`} placeholder="Street / delivery address" />
              </div>
            </div>
          ) : (
            <select value={f.deliveryDistrict} onChange={(e) => set({ deliveryDistrict: e.target.value })} className={inputCls}>
              <option value="">Select port / border of exit</option>
              {PORTS_OF_EXIT.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {hasStores && (
            <div className="flex gap-2 flex-wrap">
              <Chip on={mode === "store"} onClick={() => setMode("store")}>Use a registered store</Chip>
              <Chip on={mode === "district"} onClick={() => { setMode("district"); set({ deliveryStore: "" }); }}>Specify a district</Chip>
            </div>
          )}
          {mode === "store" && hasStores ? (
            <div>
              <select value={selectedStoreId} onChange={(e) => pickStore(e.target.value)} className={inputCls}>
                <option value="">Select one of your registered stores</option>
                {myStores.map((s) => <option key={s.id} value={s.id}>{s.name} - {s.district}</option>)}
              </select>
              {f.deliveryAddress && <p className="text-[11px] text-warm-muted mt-1 flex items-center gap-1"><MapPin size={11} /> {f.deliveryAddress}, {f.deliveryDistrict}</p>}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              <select value={f.deliveryDistrict} onChange={(e) => set({ deliveryDistrict: e.target.value, deliveryStore: "" })} className={inputCls}>
                <option value="">Select a district</option>
                {DISTRICTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
              <input value={f.deliveryAddress} onChange={(e) => set({ deliveryAddress: e.target.value })} className={inputCls} placeholder="Specific address / landmark (optional)" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function NewRequestModal({ user, onClose, onCreated, existing = null }) {
  const isFBR = user?.role === "FBR";
  const initial = existing
    ? {
        ...EMPTY_FORM, ...existing,
        quantity: String(existing.quantity ?? ""),
        targetPrice: existing.targetPrice != null ? String(existing.targetPrice) : "",
        certifications: existing.certifications || [],
        paymentMethods: existing.paymentMethods || [],
      }
    : { ...EMPTY_FORM, customs: isFBR ? CUSTOMS_OPTIONS[1] : CUSTOMS_OPTIONS[0] };
  const [f, setF] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (fields) => setF((p) => ({ ...p, ...fields }));
  const toggle = (key, v) => set({ [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] });

  async function submit() {
    if (!f.commodity) return setError("Select a commodity.");
    if (!f.quantity || Number(f.quantity) <= 0) return setError("Enter the quantity required.");
    if (!f.deliveryDistrict) return setError("Select a delivery point.");
    if (!f.deliveryWindow.trim()) return setError("State a delivery window.");
    if (!f.validUntil) return setError("Set a validity (closing) date.");
    if (f.description.trim().length < 30) return setError("Description must be at least 30 characters.");
    if (f.paymentMethods.length === 0) return setError("Select at least one preferred payment method.");
    setSaving(true);
    const payload = {
      ...f,
      quantity: Number(f.quantity),
      targetPrice: f.targetPrice ? Number(f.targetPrice) : null,
      deliveryMode: f.transportTerms,
    };
    const res = existing ? await updateSupplyRequest(existing.id, payload) : await createSupplyRequest(payload, user);
    setSaving(false);
    onCreated(res);
  }

  const verb = existing ? "Edit" : isFBR ? "Raise a" : "Post a";
  const noun = isFBR ? "Supply Note" : "supply request";
  return (
    <Modal onClose={onClose} title={`${verb} ${noun}`}
      subtitle={existing ? "Update the details of your request." : (isFBR ? "State what you wish to source from verified Ugandan suppliers." : "Post what you need; matched suppliers respond with offers.")}>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelField}>Commodity <span className="text-red-400">*</span></label>
            <select value={f.commodity} onChange={(e) => set({ commodity: e.target.value })} className={inputCls}>
              <option value="">Select commodity</option>
              {COMMODITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelField}>Quality / grade</label>
            <input value={f.grade} onChange={(e) => set({ grade: e.target.value })} className={inputCls} placeholder="e.g. Screen 15+, Grade 1" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={labelField}>Quantity required <span className="text-red-400">*</span></label>
            <input type="number" value={f.quantity} onChange={(e) => set({ quantity: e.target.value })} className={inputCls} placeholder="e.g. 40000" />
          </div>
          <div>
            <label className={labelField}>Unit</label>
            <select value={f.unit} onChange={(e) => set({ unit: e.target.value })} className={inputCls}>
              {["kg", "tonne", "bag", "litre", "piece"].map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className={labelField}>Recurrence</label>
            <select value={f.recurrence} onChange={(e) => set({ recurrence: e.target.value })} className={inputCls}>
              {RECURRENCE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelField}>Target price / unit <span className="text-warm-muted normal-case font-normal">(optional - leave blank for open)</span></label>
            <input type="number" value={f.targetPrice} onChange={(e) => set({ targetPrice: e.target.value })} className={inputCls} placeholder="UGX per unit" />
          </div>
          <div>
            <label className={labelField}>Packaging</label>
            <input value={f.packaging} onChange={(e) => set({ packaging: e.target.value })} className={inputCls} placeholder="e.g. 50kg bags, GrainPro" />
          </div>
        </div>

        <div>
          <label className={labelField}>Certifications required</label>
          <div className="flex flex-wrap gap-2">
            {CERTIFICATION_OPTIONS.map((c) => <Chip key={c} on={f.certifications.includes(c)} onClick={() => toggle("certifications", c)}>{c}</Chip>)}
          </div>
        </div>

        <DeliveryPointFields f={f} set={set} user={user} />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelField}>Delivery window <span className="text-red-400">*</span></label>
            <input value={f.deliveryWindow} onChange={(e) => set({ deliveryWindow: e.target.value })} className={inputCls} placeholder="e.g. Within 30 days" />
          </div>
          <div>
            <label className={labelField}>Validity / closing date <span className="text-red-400">*</span></label>
            <input type="date" value={f.validUntil} onChange={(e) => set({ validUntil: e.target.value })} className={inputCls} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelField}>Transportation terms</label>
            <select value={f.transportTerms} onChange={(e) => set({ transportTerms: e.target.value })} className={inputCls}>
              {TRANSPORT_TERMS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelField}>Customs clearance responsibility</label>
            <select value={f.customs} onChange={(e) => set({ customs: e.target.value })} className={inputCls}>
              {CUSTOMS_OPTIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelField}>Preferred payment methods <span className="text-red-400">*</span></label>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((p) => <Chip key={p} on={f.paymentMethods.includes(p)} onClick={() => toggle("paymentMethods", p)}>{p}</Chip>)}
          </div>
        </div>

        <div>
          <label className={labelField}>Description &amp; notes <span className="text-red-400">*</span> <span className="text-warm-muted normal-case font-normal">(min 30 characters)</span></label>
          <textarea value={f.description} onChange={(e) => set({ description: e.target.value })} className={`${inputCls} h-20 resize-none`} placeholder="Additional requirements, quality notes, origin preferences..." />
        </div>

        <div>
          <label className={labelField}>Visibility</label>
          <div className="flex gap-2">
            {[["public", "Public - any verified seller"], ["private", "Private - my value chain only"]].map(([v, l]) => (
              <Chip key={v} on={f.visibility === v} onClick={() => set({ visibility: v })}>{l}</Chip>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="px-5 py-2.5 border border-warm-border rounded-lg text-sm font-medium text-warm-text hover:text-ink hover:border-ink transition-all">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="flex-1 bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} {existing ? "Save changes" : isFBR ? "Raise Supply Note" : "Post supply request"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Request detail + offers ──────────────────────────────────────────────────
function OfferForm({ unit, onSubmit, onCancel }) {
  const [f, setF] = useState({ product: "", quantity: "", pricePerUnit: "", availableFrom: "", deliveryTerms: TRANSPORT_TERMS[0], certifications: [], message: "" });
  const [error, setError] = useState("");
  const set = (x) => setF((p) => ({ ...p, ...x }));
  function submit() {
    if (!f.product.trim()) return setError("Name the product you are offering.");
    if (!f.quantity || Number(f.quantity) <= 0) return setError("Enter offered quantity.");
    if (!f.pricePerUnit || Number(f.pricePerUnit) <= 0) return setError("Enter your price per unit.");
    if (!f.availableFrom) return setError("Set an available-from date.");
    setError("");
    onSubmit({ ...f, quantity: Number(f.quantity), pricePerUnit: Number(f.pricePerUnit) });
  }
  return (
    <div className="bg-warm-bg border border-warm-border rounded-xl p-4 space-y-3">
      <div className="text-sm font-bold text-ink">Respond with an offer</div>
      <div className="grid grid-cols-2 gap-3">
        <input value={f.product} onChange={(e) => set({ product: e.target.value })} className={inputCls} placeholder="Product offered" />
        <input type="number" value={f.quantity} onChange={(e) => set({ quantity: e.target.value })} className={inputCls} placeholder={`Quantity (${unit})`} />
        <input type="number" value={f.pricePerUnit} onChange={(e) => set({ pricePerUnit: e.target.value })} className={inputCls} placeholder={`Price / ${unit}`} />
        <input type="date" value={f.availableFrom} onChange={(e) => set({ availableFrom: e.target.value })} className={inputCls} />
      </div>
      <select value={f.deliveryTerms} onChange={(e) => set({ deliveryTerms: e.target.value })} className={inputCls}>
        {TRANSPORT_TERMS.map((t) => <option key={t}>{t}</option>)}
      </select>
      <textarea value={f.message} onChange={(e) => set({ message: e.target.value })} className={`${inputCls} h-16 resize-none`} placeholder="Optional message to the buyer" />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onCancel} className="px-4 py-2 border border-warm-border rounded-lg text-xs font-medium text-warm-text hover:border-ink">Cancel</button>
        <button onClick={submit} className="flex-1 bg-ink hover:bg-ink-mid text-white font-semibold py-2 rounded-lg text-xs">Submit offer</button>
      </div>
    </div>
  );
}

function OfferRow({ offer, unit, isOwner, onAccept, onCounter, onDecline }) {
  const [counter, setCounter] = useState(null);
  const STYLE = { submitted: "text-blue-700 bg-blue-50 border-blue-200", countered: "text-amber-700 bg-amber-50 border-amber-200", accepted: "text-green-700 bg-green-50 border-green-200", declined: "text-red-600 bg-red-50 border-red-200" };
  return (
    <div className="border border-warm-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-ink truncate">{offer.sellerName || offer.seller}</span>
          <TrustTick seller={offer.seller} size={13} className="flex-shrink-0" />
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STYLE[offer.status]}`}>{offer.status}</span>
      </div>
      <div className="text-xs font-mono text-warm-muted mb-2">{offer.sellerTradeId} · {offer.id}</div>
      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
        <div><div className="text-warm-muted">Offered</div><div className="font-semibold text-ink">{Number(offer.quantity).toLocaleString()} {unit}</div></div>
        <div><div className="text-warm-muted">Price</div><div className="font-semibold text-ink">{formatUGX(offer.pricePerUnit)}/{unit}</div></div>
        <div><div className="text-warm-muted">From</div><div className="font-semibold text-ink">{offer.availableFrom}</div></div>
      </div>
      <div className="text-xs text-warm-text mb-1">{offer.deliveryTerms}{offer.product ? ` · ${offer.product}` : ""}</div>
      {offer.message && <p className="text-xs text-warm-muted italic mb-2">“{offer.message}”</p>}
      {(offer.counters || []).length > 0 && (
        <div className="text-[11px] text-amber-700 mb-2">{offer.counters.length} counter round{offer.counters.length !== 1 ? "s" : ""} · latest {formatUGX(offer.counters[offer.counters.length - 1].pricePerUnit)}/{unit}</div>
      )}
      {isOwner && offer.status !== "accepted" && offer.status !== "declined" && (
        counter ? (
          <div className="bg-warm-bg border border-warm-border rounded-lg p-3 mt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" defaultValue={offer.quantity} onChange={(e) => setCounter({ ...counter, quantity: Number(e.target.value) })} className={inputCls} placeholder={`Quantity (${unit})`} />
              <input type="number" defaultValue={offer.pricePerUnit} onChange={(e) => setCounter({ ...counter, pricePerUnit: Number(e.target.value) })} className={inputCls} placeholder={`Price / ${unit}`} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCounter(null)} className="px-3 py-1.5 border border-warm-border rounded-lg text-xs">Cancel</button>
              <button onClick={() => { onCounter(offer, counter); setCounter(null); }} className="flex-1 bg-ink text-white rounded-lg text-xs font-semibold py-1.5">Send counter</button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mt-2">
            <button onClick={() => onAccept(offer)} className="flex-1 bg-gold hover:bg-gold-mid text-ink font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1"><CheckCircle size={13} /> Accept</button>
            <button onClick={() => setCounter({ quantity: offer.quantity, pricePerUnit: offer.pricePerUnit })} className="px-3 py-2 border border-warm-border hover:border-ink rounded-lg text-xs font-semibold text-ink">Counter</button>
            <button onClick={() => onDecline(offer)} className="px-3 py-2 border border-warm-border hover:border-red-300 rounded-lg text-xs font-semibold text-red-500">Decline</button>
          </div>
        )
      )}
    </div>
  );
}

function RequestDetailModal({ id, user, onClose, onChanged }) {
  const [req, setReq] = useState(null);
  const [responding, setResponding] = useState(false);
  const [banner, setBanner] = useState("");

  const load = useCallback(async () => setReq(await getSupplyRequest(id)), [id]);
  useEffect(() => { load(); }, [load]);

  if (!req) {
    return <Modal onClose={onClose} title="Loading…"><div className="py-10 text-center text-warm-muted"><Loader2 size={24} className="animate-spin mx-auto" /></div></Modal>;
  }

  const isOwner = user && req.buyer === user.username;
  const canMakeOffer = user && canRespond(user.role) && !isOwner;

  async function submitOffer(form) {
    await postOffer(req.id, form, user);
    setResponding(false);
    setBanner("Offer submitted. The buyer has been notified.");
    await load(); onChanged?.();
  }
  async function accept(offer) {
    const res = await acceptOffer(req.id, offer.id, user);
    setBanner(`Offer accepted - order ${res.order.id} created in the purchase flow (Step 3: Quotation confirmed).`);
    await load(); onChanged?.();
  }
  async function counter(offer, c) { await counterOffer(req.id, offer.id, c, user); await load(); onChanged?.(); }
  async function decline(offer) { await declineOffer(req.id, offer.id); await load(); onChanged?.(); }

  return (
    <Modal onClose={onClose}
      title={req.commodity}
      subtitle={`${req.id} · ${req.isForeign ? "Supply Note" : "Supply request"} from ${req.buyerName}`}>
      <div className="space-y-4">
        {banner && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2.5 text-sm flex items-center gap-2"><CheckCircle size={15} /> {banner}</div>}

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[req.status]}`}>{STATUS_LABELS[req.status]}</span>
          {req.recurrence !== "one-off" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-warm-bg border-warm-border text-warm-text flex items-center gap-1"><Repeat size={10} /> {req.recurrence}</span>}
          {req.isForeign && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-cyan-50 border-cyan-200 text-cyan-700 flex items-center gap-1"><Globe size={10} /> Foreign buyer</span>}
          {req.consumerOrigin && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-pink-50 border-pink-200 text-pink-700">Consumer / retail</span>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ["Quantity", `${Number(req.quantity).toLocaleString()} ${req.unit}`],
            ["Grade", req.grade || "-"],
            ["Target price", req.targetPrice ? `${formatUGX(req.targetPrice)}/${req.unit}` : "Open to offers"],
            ["Delivery point", req.deliveryDistrict],
            ...(req.deliveryStore ? [["Store / facility", req.deliveryStore]] : []),
            ...(req.deliveryAddress ? [["Address", req.deliveryAddress]] : []),
            ...(req.deliveryCountry && req.deliveryCountry !== "Uganda" ? [["Destination", req.deliveryCountry]] : []),
            ["Delivery window", req.deliveryWindow],
            ["Closes", req.validUntil],
            ["Transport", req.transportTerms],
            ["Customs", req.customs],
            ["Payment", (req.paymentMethods || []).join(", ") || "-"],
          ].map(([l, v]) => (
            <div key={l} className="bg-warm-bg border border-warm-border rounded-lg p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-warm-muted">{l}</div>
              <div className="text-xs font-semibold text-ink mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        {(req.certifications || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {req.certifications.map((c) => <span key={c} className="text-[10px] bg-gold-light border border-gold-border text-gold-dark px-2 py-0.5 rounded-full font-semibold">{c}</span>)}
          </div>
        )}

        <p className="text-sm text-warm-text leading-relaxed">{req.description}</p>

        <div className="flex items-center gap-2 p-3 bg-warm-bg rounded-lg">
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-gold text-xs font-bold">{req.buyerName?.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1"><span className="text-sm font-semibold text-ink">{req.buyerName}</span><TrustTick seller={req.buyer} size={14} /></div>
            <div className="text-[11px] font-mono text-warm-muted">{req.buyerTradeId}</div>
          </div>
        </div>

        {/* Offers */}
        <div className="border-t border-warm-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-ink text-sm">Offers <span className="text-warm-muted font-normal">({req.offers.length})</span></h3>
            {canMakeOffer && !responding && (
              <button onClick={() => setResponding(true)} className="flex items-center gap-1.5 bg-ink hover:bg-ink-mid text-white text-xs font-semibold px-3 py-1.5 rounded-lg"><MessageSquare size={13} /> Respond with an offer</button>
            )}
          </div>
          {responding && <div className="mb-3"><OfferForm unit={req.unit} onSubmit={submitOffer} onCancel={() => setResponding(false)} /></div>}
          {req.offers.length === 0 && !responding && (
            <p className="text-sm text-warm-muted text-center py-6">No offers yet.{canMakeOffer ? " Be the first to respond." : ""}</p>
          )}
          <div className="space-y-3">
            {[...req.offers].sort((a, b) => a.pricePerUnit - b.pricePerUnit).map((o) => (
              <OfferRow key={o.id} offer={o} unit={req.unit} isOwner={isOwner} onAccept={accept} onCounter={counter} onDecline={decline} />
            ))}
          </div>
          {!user && <p className="text-xs text-warm-muted text-center mt-3">Sign in as a verified seller to respond with an offer.</p>}
        </div>
      </div>
    </Modal>
  );
}

// ── Generic modal shell ──────────────────────────────────────────────────────
function Modal({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex items-start justify-between gap-3 p-5 border-b border-warm-border sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            {subtitle && <p className="text-xs text-warm-muted mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-warm-muted hover:text-ink p-1"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const EMPTY_FILTERS = { commodity: "", region: "", district: "", buyerType: "All", recurrence: "All", trust: "All", minQty: "", maxQty: "", closingSoon: false, sort: "newest" };

export default function SourcingBoard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [openId, setOpenId] = useState(null);

  const isFBR = user?.role === "FBR";
  const userCanPost = user && canPost(user.role);

  const load = useCallback(async () => {
    setLoading(true);
    setRequests(await getSupplyRequests({ ...filters, visibility: "public" }));
    setLoading(false);
  }, [filters]);
  useEffect(() => { load(); }, [load]);

  // Deep links: ?new=1 opens the post form; ?open=SRQ-XXXX opens that request's
  // detail (used by the "My Supply Requests" management page).
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") {
      if (userCanPost) setShowNew(true);
      navigate("/sourcing-board", { replace: true });
    }
    const openParam = params.get("open");
    if (openParam) {
      setOpenId(openParam);
      navigate("/sourcing-board", { replace: true });
    }
  }, [location.search, userCanPost, navigate]);

  const setF = (x) => setFilters((p) => ({ ...p, ...x }));

  return (
    <GovShell>
      {/* Hero */}
      <div className="bg-ink rounded-xl p-6 md:p-8 mb-4 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold opacity-[0.05] rounded-full" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-2"><Sparkles size={14} /> Sourcing Board</div>
            <h1 className="text-white font-bold text-2xl md:text-3xl mb-2">Supply Requests &amp; Sourcing Board</h1>
            <p className="text-white/50 text-sm max-w-2xl leading-relaxed">The demand side of trade: buyers - including foreign traders - post what they want to source, and verified Ugandan suppliers respond with offers. Requests to buy your existing listings appear separately under Purchase Requests.</p>
          </div>
          {userCanPost && (
            <button onClick={() => setShowNew(true)}
              className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap">
              <Plus size={16} /> {isFBR ? "Raise a Supply Note" : "Post a supply request"}
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-warm-border rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <select value={filters.commodity} onChange={(e) => setF({ commodity: e.target.value })} className="px-3 py-2 border border-warm-border rounded-lg text-xs text-ink bg-white">
            <option value="">All commodities</option>
            {COMMODITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.region} onChange={(e) => setF({ region: e.target.value })} className="px-3 py-2 border border-warm-border rounded-lg text-xs text-ink bg-white">
            <option value="">All regions</option>
            {REGIONS.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
          <select value={filters.buyerType} onChange={(e) => setF({ buyerType: e.target.value })} className="px-3 py-2 border border-warm-border rounded-lg text-xs text-ink bg-white">
            {BUYER_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={filters.sort} onChange={(e) => setF({ sort: e.target.value })} className="px-3 py-2 border border-warm-border rounded-lg text-xs text-ink bg-white ml-auto">
            <option value="newest">Newest</option>
            <option value="closing">Closing soonest</option>
            <option value="quantity">Highest quantity</option>
            <option value="price">Highest target price</option>
          </select>
          <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-1.5 px-3 py-2 border border-warm-border rounded-lg text-xs font-semibold text-ink hover:border-gold"><Filter size={13} /> More</button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-warm-border">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-warm-muted">District</label>
              <input value={filters.district} onChange={(e) => setF({ district: e.target.value })} className={inputCls + " mt-1"} placeholder="District" list="district-list" />
              <datalist id="district-list">{DISTRICTS.map((d) => <option key={d.id} value={d.name} />)}</datalist>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-warm-muted">Recurrence</label>
              <select value={filters.recurrence} onChange={(e) => setF({ recurrence: e.target.value })} className={inputCls + " mt-1"}>
                <option value="All">All</option><option value="one-off">One-off</option><option value="recurring">Recurring</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-warm-muted">Verification (trust tick)</label>
              <select value={filters.trust} onChange={(e) => setF({ trust: e.target.value })} className={inputCls + " mt-1"}>
                <option value="All">All</option><option value="green">Green tick</option><option value="gray">Gray tick</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-warm-muted">Quantity range</label>
              <div className="flex gap-2 mt-1">
                <input type="number" value={filters.minQty} onChange={(e) => setF({ minQty: e.target.value })} className={inputCls} placeholder="Min" />
                <input type="number" value={filters.maxQty} onChange={(e) => setF({ maxQty: e.target.value })} className={inputCls} placeholder="Max" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-warm-text">
              <input type="checkbox" checked={filters.closingSoon} onChange={(e) => setF({ closingSoon: e.target.checked })} /> Closing soon (≤ 7 days)
            </label>
            <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs text-gold font-semibold text-left">Reset filters</button>
          </div>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-warm-muted"><Loader2 size={28} className="animate-spin mb-3" /><p className="text-sm">Loading sourcing board…</p></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 text-warm-muted">
          <Package size={32} className="mx-auto mb-3" />
          <p className="text-sm">No supply requests match your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-warm-muted mb-3">{requests.length} open request{requests.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((r) => <RequestCard key={r.id} req={r} onOpen={() => setOpenId(r.id)} />)}
          </div>
        </>
      )}

      {showNew && <NewRequestModal user={user} onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }} />}
      {openId && <RequestDetailModal id={openId} user={user} onClose={() => setOpenId(null)} onChanged={load} />}
    </GovShell>
  );
}
