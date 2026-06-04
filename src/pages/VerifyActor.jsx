import { useState } from "react";
import PublicNav from "../components/PublicNav";
import { useNavigate } from "react-router-dom";
import { Search, Shield, CheckCircle, XCircle, AlertCircle, MapPin, Package, Store, ArrowRight, User, Building2, Truck, Sprout, Factory, Handshake, Ship, ShoppingCart, PackageOpen, BarChart3 } from "lucide-react";
import { SAMPLE_ACCOUNTS } from "../data/constants";
import { STORES, PRODUCTS_DATA, getSellerRatingCount, getTrustTick } from "../data/demo";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../context/AuthContext";
import TrustTick from "../components/TrustTick";

const ROLE_ICONS = { AGR: Sprout, VAP: Factory, MFR: Building2, AGT: Handshake, EXP: Ship, IMP: PackageOpen, BYR: ShoppingCart, TRP: Truck, CSM: User, ADMIN: Shield, GOU: BarChart3 };
const ROLE_NAMES = { AGR: "Farmer / Agro-producer", VAP: "Value-added Processor", MFR: "Manufacturer", AGT: "Aggregator / Trader", EXP: "Exporter", IMP: "Importer", BYR: "Buyer / Offtaker", TRP: "Transporter", CSM: "Consumer", ADMIN: "Platform Administrator", GOU: "GoU Oversight" };
const ROLE_COLORS = { AGR: "bg-green-500", VAP: "bg-amber-500", MFR: "bg-blue-500", AGT: "bg-purple-500", EXP: "bg-red-500", IMP: "bg-orange-500", BYR: "bg-teal-500", TRP: "bg-slate-500", CSM: "bg-pink-500", ADMIN: "bg-gray-700", GOU: "bg-indigo-600" };

function ActorProfile({ actor }) {
  const RoleIcon = ROLE_ICONS[actor.role] || User;
  const roleColor = ROLE_COLORS[actor.role] || "bg-gray-500";
  const ratingCount = getSellerRatingCount(actor.username || actor.tradeId);
  const trustLevel = getTrustTick(ratingCount);
  const stores = STORES.filter(s => s.owner === actor.username);
  const products = PRODUCTS_DATA.filter(p => p.owner === actor.username);
  const districts = [...new Set([
    ...(actor.districts || []).map(d => typeof d === "string" ? d : d.name),
    ...stores.map(s => s.district).filter(Boolean)
  ])];
  const activeListings = products.filter(p => p.status === "active").length;
  const totalCapacity = stores.reduce((s, st) => s + (parseFloat(st.capacity) || 0), 0);
  const capacityLabel = totalCapacity >= 1000
    ? `${(totalCapacity/1000).toFixed(1)}T`
    : totalCapacity > 0 ? `${totalCapacity.toLocaleString()} kg` : "-";

  return (
    <div className="space-y-5">
      <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
        <div>
          <div className="text-sm font-bold text-green-700">Verified Trade Actor</div>
          <div className="text-xs text-green-600">This Trade ID is active and registered on the Uganda Digital Trade Platform</div>
        </div>
      </div>
      <div className="bg-ink rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-gold opacity-[0.06] rounded-full" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1">Digital Trade Platform - Uganda</div>
          <div className="font-mono text-gold font-bold text-xl tracking-wider mb-4">{actor.tradeId}</div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 ${roleColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <RoleIcon size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">{actor.name}</span>
                <TrustTick ratingCount={ratingCount} size={20} />
              </div>
              <div className="text-white/50 text-sm">{ROLE_NAMES[actor.role]}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-4">
            {[["Role", actor.role], ["Grade", actor.grade || "-"], ["District", actor.district || "-"], ["Status", "Active"], ["Member since", "2026"]].map(([l, v]) => (
              <div key={l}><div className="text-[9px] uppercase tracking-wider text-white/25">{l}</div><div className="text-white text-xs mt-0.5 font-medium">{v}</div></div>
            ))}
          </div>
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${trustLevel === "green" ? "bg-green-500/10 border-green-400/30 text-green-300" : "bg-white/10 border-white/20 text-white/70"}`}>
            <TrustTick ratingCount={ratingCount} size={13} />
            {trustLevel === "green" ? "Trusted Trade Actor" : "Registered Trade Actor"}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["Products listed", activeListings || products.length, "text-green-600"],
          ["Supply capacity", capacityLabel, "text-amber-600"],
          ["Districts served", districts.length || (actor.district ? 1 : 0), "text-blue-600"],
          ["Registered stores", stores.length, "text-purple-600"],
        ].map(([l, v, cls]) => (
          <div key={l} className="bg-white border border-warm-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${cls}`}>{v}</div>
            <div className="text-xs text-warm-muted mt-1">{l}</div>
          </div>
        ))}
      </div>
      {products.length > 0 && (
        <div className="bg-white border border-warm-border rounded-xl p-5">
          <h3 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Package size={15} /> Products traded</h3>
          <div className="flex flex-wrap gap-2">
            {products.map(p => <span key={p.id} className="text-xs bg-warm-bg border border-warm-border px-3 py-1.5 rounded-full text-warm-text">{p.name}</span>)}
          </div>
        </div>
      )}
      {stores.length > 0 && (
        <div className="bg-white border border-warm-border rounded-xl p-5">
          <h3 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Store size={15} /> Registered locations</h3>
          <div className="space-y-2">
            {stores.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-warm-bg rounded-xl">
                <MapPin size={14} className="text-gold flex-shrink-0" />
                <div className="flex-1"><div className="text-sm font-medium text-ink">{s.name}</div><div className="text-xs text-warm-muted">{s.type} - {s.address}, {s.district}</div></div>
                <div className="font-mono text-[10px] text-warm-muted">{s.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white border border-warm-border rounded-xl p-5">
        <h3 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Shield size={15} /> Trust &amp; status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-warm-border">
            <span className="text-sm text-warm-text">Trust tick</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <TrustTick ratingCount={ratingCount} size={14} />
              {trustLevel === "green" ? "Green — 100+ verified ratings" : "Gray — building trust rating"}
            </span>
          </div>
          {[["Trade ID status", "Active", true], ["Platform registration", "Complete", true], ["Account standing", "Good standing", true]].map(([l, v, ok]) => (
            <div key={l} className="flex items-center justify-between py-2 border-b border-warm-border last:border-0">
              <span className="text-sm text-warm-text">{l}</span>
              <span className={`flex items-center gap-1.5 text-xs font-semibold ${ok ? "text-green-600" : "text-red-500"}`}>
                {ok ? <CheckCircle size={12} /> : <XCircle size={12} />} {v}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-warm-muted mt-3 leading-relaxed">
          Identity verification (NIRA / URA / URSB) is held privately and is not shown publicly. The trust tick above is earned from ratings on completed transactions.
        </p>
      </div>
        <footer className="bg-ink mt-8 px-6 py-6 border-t border-white/10">
          <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="text-white/30 text-xs">© 2026 Interlet Limited · Digital Trade Platform Uganda</div>
            <div className="flex gap-4 text-xs text-white/30">
              <button onClick={() => navigate("/marketplace")} className="hover:text-white transition-colors">Marketplace</button>
              <button onClick={() => navigate("/market-prices")} className="hover:text-white transition-colors">Market Prices</button>
              <button onClick={() => navigate("/help")} className="hover:text-white transition-colors">Help</button>
            </div>
          </div>
        </footer>
    </div>
  );
}

export default function VerifyActor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    await new Promise(r => setTimeout(r, 800));
    const q = query.toLowerCase().trim();
    const found = SAMPLE_ACCOUNTS.find(a =>
      a.tradeId?.toLowerCase() === q ||
      a.tradeId?.toLowerCase().endsWith(q) ||
      a.tradeId?.toLowerCase().includes(q) ||
      a.name?.toLowerCase().includes(q) ||
      a.username?.toLowerCase() === q
    );
    setResult(found || null);
    setSearched(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      <PublicNav activeRoute="/verify" />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-ink rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield size={28} className="text-gold" />
          </div>
          <h1 className="text-3xl font-bold text-ink mb-3">Verify a Trade Actor</h1>
          <p className="text-warm-text text-sm max-w-lg mx-auto leading-relaxed">
            Enter a Trade ID, business name or username to verify that an actor is registered and in good standing on the Uganda Digital Trade Platform.
          </p>
        </div>

        <div className="flex gap-3 mb-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input value={query} onChange={e => { setQuery(e.target.value); setSearched(false); setResult(null); }}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full px-5 border-2 border-warm-border focus:border-gold rounded-xl text-sm text-ink bg-white placeholder:text-warm-muted transition-colors outline-none" style={{height:"56px"}}
              placeholder="Trade ID, last digits (e.g. 14729), name or username..." />
          </div>
          <button onClick={handleSearch} disabled={loading || !query.trim()}
            className="flex-shrink-0 bg-gold hover:bg-gold-mid active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-ink font-bold rounded-xl transition-all shadow-sm"
            style={{minWidth: "140px", padding: "0 28px", height: "56px"}}>
            <span className="flex items-center justify-center gap-2.5">
              {loading
                ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                : <Search size={16} strokeWidth={2.5} />
              }
              <span className="text-sm tracking-wide">Verify Actor</span>
            </span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {["UG-DTP-AGR-14729", "UG-DTP-EXP-00034", "UG-DTP-TRP-00019", "UG-DTP-MFR-00312"].map(id => (
            <button key={id} onClick={() => { setQuery(id); setResult(null); setSearched(false); }}
              className="text-xs font-mono text-warm-muted hover:text-gold border border-warm-border hover:border-gold px-3 py-1.5 rounded-full transition-all bg-white">
              {id}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-warm-bg border border-warm-border rounded-2xl flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Shield size={20} className="text-warm-muted" />
            </div>
            <p className="text-warm-text text-sm">Checking registry...</p>
          </div>
        )}

        {searched && !loading && result && <ActorProfile actor={result} />}

        {searched && !loading && !result && (
          <div className="text-center py-12 bg-white border border-warm-border rounded-2xl">
            <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle size={24} className="text-red-400" />
            </div>
            <h3 className="font-bold text-ink mb-2">No actor found</h3>
            <p className="text-sm text-warm-text max-w-sm mx-auto mb-4">
              No registered actor found for <span className="font-mono font-semibold text-ink">{query}</span>.
            </p>
            <div className="space-y-2 max-w-sm mx-auto text-left mb-4">
              <p className="text-xs font-semibold text-warm-text uppercase tracking-wider">Try searching by:</p>
              <div className="space-y-1.5 text-xs text-warm-text">
                <div className="flex items-center gap-2 p-2.5 bg-warm-bg rounded-lg"><span className="font-mono text-ink bg-white border border-warm-border px-2 py-0.5 rounded">UG-DTP-AGR-14729</span> Full Trade ID</div>
                <div className="flex items-center gap-2 p-2.5 bg-warm-bg rounded-lg"><span className="font-mono text-ink bg-white border border-warm-border px-2 py-0.5 rounded">14729</span> Last 5 digits only</div>
                <div className="flex items-center gap-2 p-2.5 bg-warm-bg rounded-lg"><span className="font-mono text-ink bg-white border border-warm-border px-2 py-0.5 rounded">Nalwanga Sarah</span> Full name</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left max-w-sm mx-auto">
              <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">If this actor should be registered, ask them to sign up at dtp.go.ug or contact the <a href="mailto:support@dtp.go.ug" className="font-semibold underline hover:text-amber-900 transition-colors">Platform Help and Support Centre</a>.</p>
            </div>
          </div>
        )}

        {!searched && !loading && (
          <div className="bg-white border border-warm-border rounded-2xl p-6">
            <h3 className="font-bold text-ink mb-4 text-sm">How to verify an actor</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[["Enter their Trade ID", "Every registered actor has a unique Trade ID in the format UG-DTP-XXX-XXXXX", "1"], ["Or search by name", "You can also search by business name or individual name", "2"], ["See their full profile", "View verification status, registered products, store locations and transaction history", "3"]].map(([title, desc, num]) => (
                <div key={num} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-gold/10 border border-gold/30 rounded-lg flex items-center justify-center text-xs font-bold text-gold flex-shrink-0">{num}</div>
                  <div><div className="text-sm font-semibold text-ink mb-1">{title}</div><div className="text-xs text-warm-muted leading-relaxed">{desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 p-5 bg-ink rounded-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-semibold mb-1">Are you a trade actor?</div>
            <div className="text-white/50 text-sm">Register on DTP to get your verified Trade ID and start trading formally.</div>
          </div>
          <button onClick={() => navigate("/register")}
            className="bg-gold hover:bg-gold-mid text-ink font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap transition-all">
            Register free <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
