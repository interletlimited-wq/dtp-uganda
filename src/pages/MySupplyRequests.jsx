import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Inbox, ArrowRight, Loader2, Package, Plus, MessageSquare, Edit2, Eye, EyeOff } from "lucide-react";
import GovShell from "../components/GovShell";
import { useAuth } from "../context/AuthContext";
import { formatUGX } from "../data/demo";
import { getMyRequests, getMyOffers, canPost, canRespond, STATUS_LABELS, setRequestActive } from "../data/supplyRequests";
import { NewRequestModal } from "./SourcingBoard";

const REQ_STATUS_STYLE = {
  live: "bg-blue-50 text-blue-700 border-blue-200",
  offers: "bg-amber-50 text-amber-700 border-amber-200",
  partially_filled: "bg-purple-50 text-purple-700 border-purple-200",
  filled: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-50 text-gray-600 border-gray-200",
  expired: "bg-gray-50 text-gray-600 border-gray-200",
};
const OFFER_STATUS_STYLE = {
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  countered: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  declined: "bg-red-50 text-red-600 border-red-200",
};

export default function MySupplyRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reqs, setReqs] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const isFBR = user?.role === "FBR";
  const noun = isFBR ? "Supply Notes" : "Supply Requests";
  const poster = user && canPost(user.role);
  const responder = user && canRespond(user.role);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const [r, o] = await Promise.all([getMyRequests(user.username), getMyOffers(user.username)]);
    setReqs(r); setOffers(o); setLoading(false);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const open = (id) => navigate(`/sourcing-board?open=${id}`);
  async function toggleActive(r) { await setRequestActive(r.id, r.published === false); load(); }

  return (
    <GovShell>
      <div className="bg-ink rounded-xl p-6 md:p-8 mb-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold opacity-[0.05] rounded-full" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-2"><ClipboardList size={14} /> {poster ? `My ${noun}` : "My offers"}</div>
            <h1 className="text-white font-bold text-2xl md:text-3xl mb-2">{poster ? `My ${noun} & offers` : "My offers"}</h1>
            <p className="text-white/50 text-sm max-w-2xl leading-relaxed">
              {poster
                ? "Demand you have posted to the Sourcing Board and the offers you have made - manage offers or convert accepted ones to orders here."
                : "The offers you have made in response to open sourcing requests - manage them or convert accepted offers to orders here."}
            </p>
          </div>
          {poster && (
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap">
              <Plus size={16} /> {isFBR ? "Raise a Supply Note" : "Post a supply request"}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-warm-muted"><Loader2 size={28} className="animate-spin mb-3" /><p className="text-sm">Loading…</p></div>
      ) : (
        <div className="space-y-8">
          {/* Posted requests */}
          {poster && (
            <section>
              <h2 className="font-bold text-ink text-sm uppercase tracking-wider text-warm-muted mb-3 flex items-center gap-2"><ClipboardList size={14} /> {isFBR ? "Supply notes you've raised" : "Supply requests you've posted"}</h2>
              {reqs.length === 0 ? (
                <div className="bg-white border border-warm-border rounded-xl p-8 text-center text-warm-muted text-sm">
                  <Package size={26} className="mx-auto mb-2" /> You haven't posted any {noun.toLowerCase()} yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {reqs.map((r) => (
                    <div key={r.id} className="bg-white border border-warm-border rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-ink text-sm">{r.commodity}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${REQ_STATUS_STYLE[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                            {r.published === false && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">Unpublished</span>}
                          </div>
                          <div className="text-xs text-warm-muted mt-0.5 font-mono">{r.id}</div>
                          <div className="text-xs text-warm-text mt-1">{Number(r.quantity).toLocaleString()} {r.unit} · {r.deliveryDistrict} · closes {r.validUntil}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-ink">{r.offers.length}</div>
                          <div className="text-[10px] text-warm-muted">offer{r.offers.length !== 1 ? "s" : ""}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-warm-border flex-wrap">
                        <button onClick={() => open(r.id)} className="flex items-center gap-1 bg-ink hover:bg-ink-mid text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">Manage offers <ArrowRight size={12} /></button>
                        <button onClick={() => setEditing(r)} className="flex items-center gap-1 border border-warm-border hover:border-ink text-ink text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"><Edit2 size={12} /> Edit</button>
                        <button onClick={() => toggleActive(r)} className="flex items-center gap-1 border border-warm-border hover:border-ink text-warm-text text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                          {r.published === false ? <><Eye size={12} /> Reactivate</> : <><EyeOff size={12} /> Deactivate</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Offers made */}
          {responder && (
            <section>
              <h2 className="font-bold text-ink text-sm uppercase tracking-wider text-warm-muted mb-3 flex items-center gap-2"><Inbox size={14} /> Offers you've made</h2>
              {offers.length === 0 ? (
                <div className="bg-white border border-warm-border rounded-xl p-8 text-center text-warm-muted text-sm">
                  <MessageSquare size={26} className="mx-auto mb-2" /> You haven't responded to any requests yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {offers.map((o) => (
                    <button key={o.id} onClick={() => open(o.request.id)}
                      className="w-full text-left bg-white border border-warm-border rounded-xl p-4 hover:border-gold transition-all flex items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-ink text-sm">{o.request.commodity}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${OFFER_STATUS_STYLE[o.status]}`}>{o.status}</span>
                        </div>
                        <div className="text-xs text-warm-muted mt-0.5 font-mono">{o.id} · for {o.request.buyerName}</div>
                        <div className="text-xs text-warm-text mt-1">Offered {Number(o.quantity).toLocaleString()} at {formatUGX(o.pricePerUnit)}/unit</div>
                      </div>
                      <span className="text-gold text-xs font-semibold flex items-center gap-1 flex-shrink-0">View request <ArrowRight size={12} /></span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {(showAdd || editing) && (
        <NewRequestModal
          user={user}
          existing={editing}
          onClose={() => { setShowAdd(false); setEditing(null); }}
          onCreated={() => { setShowAdd(false); setEditing(null); load(); }}
        />
      )}
    </GovShell>
  );
}
