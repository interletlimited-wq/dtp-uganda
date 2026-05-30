import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ArrowLeft, Check, X, MessageSquare, Clock, Shield,
  Package, ChevronDown, ChevronUp, Search, Filter,
  ArrowRight, AlertCircle, CheckCircle, XCircle, RefreshCw
} from "lucide-react";
import DeliveryTermsModal from "../components/DeliveryTermsModal";
import { PURCHASE_REQUESTS, getSellerRequests, formatUGX } from "../data/demo";

const STATUS_STYLES = {
  pending:   { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  label: "Pending response" },
  countered: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   label: "Counter-offer sent" },
  accepted:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  label: "Accepted" },
  declined:  { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200",    label: "Declined" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      {status === "pending"   && <Clock size={10} />}
      {status === "countered" && <RefreshCw size={10} />}
      {status === "accepted"  && <CheckCircle size={10} />}
      {status === "declined"  && <XCircle size={10} />}
      {s.label}
    </span>
  );
}

function RequestCard({ req, expanded, onToggle, onAccept, onDecline, onCounter }) {
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMsg, setCounterMsg] = useState("");
  const [showCounterForm, setShowCounterForm] = useState(false);
  const daysLeft = Math.ceil((new Date(req.expires) - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all ${req.status === "pending" ? "border-amber-200 shadow-sm" : "border-warm-border"}`}>
      {/* Header */}
      <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={onToggle}>
        <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {req.buyerName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-bold text-ink text-sm">{req.buyerName}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
              req.buyerVerified === "URSB" ? "bg-purple-50 text-purple-700 border-purple-200" :
              req.buyerVerified === "URA" ? "bg-green-50 text-green-700 border-green-200" :
              "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              <Shield size={8} className="inline mr-0.5" />{req.buyerVerified}
            </span>
          </div>
          <div className="text-warm-muted text-xs font-mono mb-1">{req.buyerTradeId}</div>
          <div className="flex items-center gap-3 flex-wrap text-xs text-warm-muted">
            <span className="font-semibold text-ink">{req.product} · {req.grade}</span>
            <span>{req.quantityRequested.toLocaleString()} {req.unit}</span>
            <span className="font-semibold text-ink">{formatUGX(req.offeredPrice)}/{req.unit}</span>
            <span className="text-gold font-bold">Total: {formatUGX(req.totalValue)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <StatusBadge status={req.status} />
          {req.status === "pending" && !isExpired && (
            <span className="text-xs text-warm-muted">{daysLeft}d left</span>
          )}
          {isExpired && <span className="text-xs text-red-500 font-semibold">Expired</span>}
          {expanded ? <ChevronUp size={16} className="text-warm-muted" /> : <ChevronDown size={16} className="text-warm-muted" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-warm-border">
          <div className="p-5 space-y-4">

            {/* Request details grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-warm-bg rounded-xl">
              {[
                ["Product", req.product],
                ["Grade", req.grade],
                ["Quantity", `${req.quantityRequested.toLocaleString()} ${req.unit}`],
                ["Offered price", formatUGX(req.offeredPrice) + "/" + req.unit],
                ["Total value", formatUGX(req.totalValue)],
                ["Listing", req.listingId],
                ["Requested", new Date(req.created).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
                ["Expires", new Date(req.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
              ].map(([l, v]) => (
                <div key={l}>
                  <div className="text-[10px] text-warm-muted font-medium uppercase tracking-wider mb-0.5">{l}</div>
                  <div className="text-sm font-semibold text-ink">{v}</div>
                </div>
              ))}
            </div>

            {/* Buyer message */}
            <div>
              <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-2">Buyer message</div>
              <div className="bg-white border border-warm-border rounded-xl p-4">
                <p className="text-sm text-warm-text leading-relaxed italic">"{req.message}"</p>
              </div>
            </div>

            {/* Counter-offer details if countered */}
            {req.status === "countered" && req.counterMessage && (
              <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Your counter-offer</div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-sm font-bold text-blue-700 mb-1">
                    {formatUGX(req.counterPrice)}/{req.unit} · {formatUGX(req.counterPrice * req.quantityRequested)} total
                  </div>
                  <p className="text-sm text-blue-600 italic">"{req.counterMessage}"</p>
                </div>
              </div>
            )}

            {/* Actions for pending */}
            {req.status === "pending" && !isExpired && (
              <div className="space-y-3">
                {!showCounterForm ? (
                  <div className="flex gap-3">
                    <button onClick={() => onAccept(req)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                      <Check size={15} /> Accept request
                    </button>
                    <button onClick={() => setShowCounterForm(true)}
                      className="flex-1 bg-ink hover:bg-ink-mid text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={14} /> Counter-offer
                    </button>
                    <button onClick={() => onDecline(req)}
                      className="px-5 py-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all">
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="border border-warm-border rounded-xl p-4 space-y-3">
                    <div className="text-sm font-bold text-ink mb-2">Send counter-offer</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-warm-muted uppercase tracking-wider mb-1">Your price (UGX/{req.unit})</label>
                        <input type="number" value={counterPrice} onChange={e => setCounterPrice(e.target.value)}
                          placeholder={req.offeredPrice}
                          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink outline-none focus:border-gold" />
                        {counterPrice && (
                          <p className="text-xs text-warm-muted mt-1">Total: {formatUGX(parseInt(counterPrice) * req.quantityRequested)}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-warm-muted uppercase tracking-wider mb-1">Original offer</label>
                        <div className="px-3 py-2.5 bg-warm-bg rounded-lg text-sm text-warm-muted">
                          {formatUGX(req.offeredPrice)}/{req.unit}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-muted uppercase tracking-wider mb-1">Message to buyer</label>
                      <textarea value={counterMsg} onChange={e => setCounterMsg(e.target.value)}
                        rows={2} placeholder="Explain your counter-offer..."
                        className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink outline-none focus:border-gold resize-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onCounter(req, counterPrice, counterMsg)}
                        disabled={!counterPrice || !counterMsg}
                        className="flex-1 bg-ink hover:bg-ink-mid disabled:opacity-40 text-white font-bold py-2.5 rounded-lg text-sm transition-all">
                        Send counter-offer
                      </button>
                      <button onClick={() => setShowCounterForm(false)}
                        className="px-4 py-2.5 border border-warm-border text-warm-muted rounded-lg text-sm hover:text-ink transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-warm-muted text-center">
                  Accepting will create an order and notify the buyer to proceed with payment.
                </p>
              </div>
            )}

            {/* Accepted state */}
            {req.status === "accepted" && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-green-700">Request accepted — order created</div>
                  <div className="text-xs text-green-600">The buyer has been notified. Awaiting payment confirmation.</div>
                </div>
              </div>
            )}

            {/* Declined state */}
            {req.status === "declined" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <XCircle size={20} className="text-red-400 flex-shrink-0" />
                <div className="text-sm text-red-600">Request declined. The buyer has been notified.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function IncomingRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState(getSellerRequests(user?.username));
  const [deliveryReq, setDeliveryReq] = useState(null);
  const [expanded, setExpanded] = useState(requests[0]?.id || null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const pending  = requests.filter(r => r.status === "pending").length;
  const countered = requests.filter(r => r.status === "countered").length;

  const filtered = requests
    .filter(r => filter === "all" || r.status === filter)
    .filter(r => !search || r.buyerName.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase()));

  function handleAccept(req) {
    setDeliveryReq(req);
  }

  function handleDeliveryConfirmed(terms) {
    setRequests(prev => prev.map(r => r.id === deliveryReq.id ? {...r, status: "accepted", deliveryTerms: terms} : r));
    setDeliveryReq(null);
    setExpanded(null);
  }

  function handleDecline(req) {
    setRequests(prev => prev.map(r => r.id === req.id ? {...r, status: "declined"} : r));
  }

  function handleCounter(req, price, msg) {
    setRequests(prev => prev.map(r => r.id === req.id ? {
      ...r, status: "countered",
      counterPrice: parseInt(price),
      counterMessage: msg,
    } : r));
    setExpanded(null);
  }

  return (
    <DashboardLayout>
      {deliveryReq && <DeliveryTermsModal request={deliveryReq} onConfirm={handleDeliveryConfirmed} onClose={() => setDeliveryReq(null)} />}
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-2">
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-ink">Incoming Requests</h1>
              {pending > 0 && (
                <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  {pending} pending
                </span>
              )}
              {countered > 0 && (
                <span className="text-xs font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  {countered} awaiting reply
                </span>
              )}
            </div>
            <p className="text-sm text-warm-muted mt-0.5">{requests.length} total requests on your listings</p>
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-1 bg-warm-bg border border-warm-border rounded-lg p-1">
          {[["all", "All"], ["pending", "Pending"], ["countered", "Awaiting reply"], ["accepted", "Accepted"], ["declined", "Declined"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filter === val ? "bg-white text-ink shadow-sm" : "text-warm-muted hover:text-ink"}`}>
              {label}
              {val === "pending" && pending > 0 && <span className="ml-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{pending}</span>}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search buyer or product..."
            className="pl-8 pr-4 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold w-56" />
        </div>
      </div>

      {/* Request list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(req => (
            <RequestCard
              key={req.id}
              req={req}
              expanded={expanded === req.id}
              onToggle={() => setExpanded(expanded === req.id ? null : req.id)}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onCounter={handleCounter}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
          <Package size={28} className="text-warm-muted mx-auto mb-3" />
          <p className="font-semibold text-ink mb-1">No requests found</p>
          <p className="text-sm text-warm-muted">
            {filter !== "all" ? "Try changing the filter above" : "Purchase requests from buyers will appear here"}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
