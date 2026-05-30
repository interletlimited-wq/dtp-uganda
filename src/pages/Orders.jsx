import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ShoppingCart, Check, Clock, Truck, Package,
  ChevronDown, ChevronUp, ArrowLeft, Search,
  Shield, MapPin, AlertCircle, CheckCircle
} from "lucide-react";
import { formatUGX, TRANSACTIONS, getActorTransactionsFallback } from "../data/demo";

const STEP_LABELS = [
  "Request sent", "Response received", "Quotation confirmed",
  "Payment sent", "Payment confirmed", "Dispatched",
  "Receipt confirmed", "Complete"
];

const STEP_ICONS = [ShoppingCart, Clock, Check, Clock, CheckCircle, Truck, Package, CheckCircle];

const SAMPLE_ORDERS = [
  {
    id: "ORD-2026-00041",
    quotationRef: "QTN-2026-84291",
    product: "Coffee (Arabica)",
    grade: "AA Screen 18",
    quantity: 1000,
    unit: "kg",
    unitPrice: 9800,
    seller: "Mbale Coffee Hullers Ltd",
    sellerTradeId: "UG-DTP-VAP-00056",
    sellerVerified: "URSB",
    district: "Mbale",
    step: 6,
    delivery: "Third-party transporter",
    proposedDate: "2026-06-05",
    created: "2026-05-24",
    updated: "2026-05-27",
  },
  {
    id: "ORD-2026-00038",
    quotationRef: "QTN-2026-71044",
    product: "Maize Flour",
    grade: "Fortified Grade A",
    quantity: 5000,
    unit: "kg",
    unitPrice: 1900,
    seller: "Kampala Mills Limited",
    sellerTradeId: "UG-DTP-MFR-00312",
    sellerVerified: "URSB",
    district: "Kampala",
    step: 8,
    delivery: "Seller delivers",
    proposedDate: "2026-05-20",
    created: "2026-05-15",
    updated: "2026-05-21",
  },
  {
    id: "ORD-2026-00035",
    quotationRef: "QTN-2026-63182",
    product: "Honey (Raw)",
    grade: "Grade A Organic",
    quantity: 100,
    unit: "kg",
    unitPrice: 23000,
    seller: "Mbale Coffee Hullers Ltd",
    sellerTradeId: "UG-DTP-VAP-00056",
    sellerVerified: "URSB",
    district: "Mbale",
    step: 3,
    delivery: "Buyer collects",
    proposedDate: "2026-06-10",
    created: "2026-05-26",
    updated: "2026-05-27",
  },
  {
    id: "ORD-2026-00029",
    quotationRef: "QTN-2026-55091",
    product: "Steel Roofing Sheets",
    grade: "Gauge 30 Galvanised",
    quantity: 200,
    unit: "piece",
    unitPrice: 28000,
    seller: "Kampala Mills Limited",
    sellerTradeId: "UG-DTP-MFR-00312",
    sellerVerified: "URSB",
    district: "Kampala",
    step: 8,
    delivery: "Seller delivers",
    proposedDate: "2026-05-10",
    created: "2026-05-05",
    updated: "2026-05-12",
  },
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center overflow-x-auto pb-1">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const done = current > step;
        const active = current === step;
        const Icon = STEP_ICONS[i];
        return (
          <div key={step} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all
                ${done ? "bg-green-500 border-green-500 text-white"
                : active ? "bg-gold border-gold text-ink"
                : "bg-white border-warm-border text-warm-muted"}`}>
                {done ? <Check size={11}/> : <Icon size={11}/>}
              </div>
              <div className={`text-[9px] mt-1 text-center max-w-[52px] leading-tight
                ${active ? "text-ink font-semibold" : done ? "text-green-600" : "text-warm-muted"}`}>
                {label}
              </div>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-5 h-0.5 mb-4 mx-0.5 flex-shrink-0 ${done ? "bg-green-400" : "bg-warm-border"}`}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const total = order.quantity * order.unitPrice;
  const isComplete = order.step === 8;
  const isActive = order.step < 8;

  const statusLabel = isComplete ? "Completed" : order.step >= 6 ? "In transit" : order.step >= 4 ? "Payment" : "In progress";
  const statusColor = isComplete
    ? "bg-green-50 text-green-700 border-green-200"
    : order.step >= 6 ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all ${isComplete ? "border-warm-border" : "border-gold/30"}`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-ink">{order.product}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            {order.grade && <p className="text-xs text-warm-muted">{order.grade}</p>}
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <div className="font-bold text-ink">{formatUGX(total)}</div>
            <div className="text-xs text-warm-muted">{order.quantity.toLocaleString()} {order.unit}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-warm-bg rounded-lg mb-4 text-xs">
          <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center text-gold font-bold text-xs flex-shrink-0">
            {order.seller.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-ink truncate">{order.seller}</div>
            <div className="flex items-center gap-1 text-warm-muted"><MapPin size={9}/> {order.district}</div>
          </div>
          <div className={`text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 ${order.sellerVerified === "URSB" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
            <Shield size={9}/> {order.sellerVerified}
          </div>
        </div>

        <div className="mb-4">
          <StepIndicator current={order.step}/>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-4">
          <div className="bg-warm-bg rounded-lg p-2.5">
            <div className="text-warm-muted mb-0.5">Order ref</div>
            <div className="font-mono font-semibold text-ink truncate">{order.id}</div>
          </div>
          <div className="bg-warm-bg rounded-lg p-2.5">
            <div className="text-warm-muted mb-0.5">Payment</div>
            <div className="font-semibold text-ink">{order.paymentMethod || "Pending"}</div>
          </div>
          <div className="bg-warm-bg rounded-lg p-2.5">
            <div className="text-warm-muted mb-0.5">Source</div>
            <div className="font-semibold text-ink">{order.district || "—"}</div>
          </div>
          <div className="bg-warm-bg rounded-lg p-2.5">
            <div className="text-warm-muted mb-0.5">Date</div>
            <div className="font-semibold text-ink">{order.created}</div>
          </div>
        </div>

        {isActive && (
          <div className="flex gap-2">
            {order.step === 7 && (
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all">
                <Check size={14}/> Confirm receipt
              </button>
            )}
            {order.step < 7 && (
              <div className="flex-1 bg-warm-bg border border-warm-border text-warm-text text-sm py-2.5 rounded-lg text-center font-medium">
                Awaiting step {order.step + 1}
              </div>
            )}
            <button onClick={() => setExpanded(!expanded)}
              className="border border-warm-border text-warm-muted hover:text-ink px-3 py-2.5 rounded-lg transition-all">
              {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
          </div>
        )}

        {isComplete && (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm py-2.5 px-3 rounded-lg font-medium">
              <CheckCircle size={14}/> Transaction complete
            </div>
            <button onClick={() => setExpanded(!expanded)}
              className="border border-warm-border text-warm-muted hover:text-ink px-3 py-2.5 rounded-lg transition-all">
              {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
          </div>
        )}

        {expanded && (
          <div className="mt-4 pt-4 border-t border-warm-border space-y-2 text-xs text-warm-text">
            {order.quotationRef && <div className="flex justify-between"><span className="text-warm-muted">Quotation ref</span><span className="font-mono font-semibold text-ink">{order.quotationRef}</span></div>}
            <div className="flex justify-between"><span className="text-warm-muted">Unit price</span><span className="font-semibold text-ink">UGX {order.unitPrice?.toLocaleString()}/{order.unit}</span></div>
            {order.buyer && <div className="flex justify-between"><span className="text-warm-muted">Buyer</span><span className="font-semibold text-ink">{order.buyer}</span></div>}
            {order.buyerTradeId && <div className="flex justify-between"><span className="text-warm-muted">Buyer Trade ID</span><span className="font-mono font-semibold text-ink">{order.buyerTradeId}</span></div>}
            {order.paymentMethod && <div className="flex justify-between"><span className="text-warm-muted">Payment method</span><span className="font-semibold text-ink">{order.paymentMethod}</span></div>}
            {order.delivery && <div className="flex justify-between"><span className="text-warm-muted">Delivery</span><span className="font-semibold text-ink">{order.delivery}</span></div>}
            {order.proposedDate && <div className="flex justify-between"><span className="text-warm-muted">Proposed date</span><span className="font-semibold text-ink">{order.proposedDate}</span></div>}
            <div className="flex justify-between"><span className="text-warm-muted">Order created</span><span className="font-semibold text-ink">{order.created}</span></div>
            <div className="flex justify-between border-t border-warm-border pt-2 mt-2"><span className="text-warm-muted font-bold">Total value</span><span className="font-bold text-ink">{formatUGX(order.total || order.quantity * order.unitPrice)}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const isSeller = ["AGR","VAP","MFR","AGT","EXP"].includes(user?.role);
  const isBuyer  = ["BYR","IMP","AGT","EXP","MFR","CSM"].includes(user?.role);
  const [view, setView] = useState(isSeller && !isBuyer ? "selling" : "buying");

  // Get real transactions for this user
  const txns = getActorTransactionsFallback(user?.username, user?.role);
  // Map transactions to order format
  const toOrder = (t) => ({
    id: t.id,
    product: t.product,
    grade: "",
    quantity: t.quantity,
    unit: t.unit,
    unitPrice: t.pricePerUnit,
    seller: t.sellerName,
    sellerTradeId: t.sellerTradeId,
    sellerVerified: t.status === "completed" ? "URSB" : "NIRA",
    buyer: t.buyerName,
    buyerTradeId: t.buyerTradeId,
    district: t.district,
    step: t.status === "completed" ? 8 : t.status === "in_transit" ? 6 : t.status === "pending_payment" ? 4 : 3,
    total: t.total,
    paymentMethod: t.paymentMethod,
    created: t.date,
    updated: t.date,
    isSelling: t.seller === user?.username,
  });

  const sellingOrders = txns.filter(t => t.seller === user?.username).map(toOrder);
  const buyingOrders  = txns.filter(t => t.buyer === user?.username).map(toOrder);
  const displayOrders = view === "selling" ? sellingOrders : buyingOrders;

  // Fall back to SAMPLE_ORDERS if no real data
  const orders = displayOrders.length > 0 ? displayOrders : SAMPLE_ORDERS;

  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || (filter === "active" && o.step < 8) || (filter === "complete" && o.step === 8);
    const matchSearch = !search || o.product.toLowerCase().includes(search.toLowerCase()) || o.seller.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const active = orders.filter(o => o.step < 8).length;
  const complete = orders.filter(o => o.step === 8).length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
          <ArrowLeft size={15}/> Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">My Orders</h1>
            <p className="text-sm text-warm-text">{active} active · {complete} completed</p>
          </div>
          <div className="flex items-center gap-2">
            {isSeller && isBuyer && (
              <div className="flex bg-warm-bg border border-warm-border rounded-lg p-1 gap-1">
                <button onClick={() => setView("buying")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === "buying" ? "bg-white text-ink shadow-sm" : "text-warm-muted"}`}>
                  Buying
                </button>
                <button onClick={() => setView("selling")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === "selling" ? "bg-white text-ink shadow-sm" : "text-warm-muted"}`}>
                  Selling
                </button>
              </div>
            )}
            <button onClick={() => navigate("/marketplace")}
              className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-4 py-2 rounded-lg text-sm transition-all">
              <ShoppingCart size={14}/> Browse marketplace
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          ["Total orders", orders.length, "text-ink"],
          ["Active", active, "text-amber-600"],
          ["Completed", complete, "text-green-600"],
        ].map(([l, v, cls]) => (
          <div key={l} className="bg-white border border-warm-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${cls}`}>{v}</div>
            <div className="text-xs text-warm-muted mt-1">{l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted outline-none"
            placeholder="Search by product, seller, buyer or order ID..."/>
        </div>
        <div className="flex gap-2">
          {[["all","All"],["active","Active"],["complete","Completed"]].map(([key,label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${filter === key ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border hover:border-ink"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
          <ShoppingCart size={28} className="text-warm-muted mx-auto mb-3"/>
          <p className="font-semibold text-ink mb-2">No orders found</p>
          <p className="text-sm text-warm-text mb-4">Start by browsing the marketplace and submitting a purchase request.</p>
          <button onClick={() => navigate("/marketplace")}
            className="bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
            Browse marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(o => <OrderCard key={o.id} order={o}/>)}
        </div>
      )}
    </DashboardLayout>
  );
}
