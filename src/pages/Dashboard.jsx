import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getGovernmentAnalytics } from "../data/governance";
import {
  TrendingUp, TrendingDown, ArrowRight, Shield, Check,
  AlertCircle, Clock, Package, Truck, Star, Bell,
  FileText, Users, BarChart3, ShoppingBag, BookOpen,
  MapPin, Calendar, ChevronRight, Activity, Zap,
  Ship, Factory, Sprout, Award, CheckCircle, XCircle
} from "lucide-react";
import {
  TRANSACTIONS, LISTINGS, BATCHES, MARKET_PRICES,
  NOTIFICATIONS, GOV_STATS, ADMIN_STATS, VEHICLES,
  EUDR_DOCUMENTS, CERTIFICATIONS, COMPLAINTS,
  getActorTransactions, getActorListings,
  getActorNotifications, formatUGX, formatNumber,
  getActorTransactionsFallback, getActorListingsFallback,
  getActorBatchesFallback, getActorNotificationsFallback, getSellerRequests, getBuyerRequests} from "../data/demo";

// ─── Shared UI components ─────────────────────────────────────

function StatCard({ label, value, sub, trend, icon: Icon, color = "bg-warm-bg", iconColor = "text-ink" }) {
  const up = trend > 0;
  return (
    <div className="bg-white border border-warm-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={17} className={iconColor} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-ink tracking-tight">{value}</div>
      <div className="text-xs text-warm-muted mt-0.5">{label}</div>
      {sub && <div className="text-xs text-warm-text mt-1">{sub}</div>}
    </div>
  );
}

function TradeIDCard({ user }) {
  return (
    <div className="bg-ink rounded-2xl p-6 relative overflow-hidden mb-6">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gold opacity-[0.06] rounded-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-[0.02] rounded-full" />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1">Digital Trade Platform - Uganda</div>
        <div className="font-mono text-gold font-bold text-xl tracking-wider mb-4">{user?.tradeId}</div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-4">
          {[["Name", user?.name], ["Role", user?.role], ["Grade", user?.grade || "-"],
            ["District", user?.district || "-"], ["Verified", user?.verified || "-"], ["Status", "Active"]
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[9px] uppercase tracking-wider text-white/25">{l}</div>
              <div className="text-white text-xs mt-0.5 font-medium">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/25 text-gold text-xs font-medium px-3 py-1.5 rounded-full">
            <Shield size={11} /> {user?.verified} Verified - Active
          </div>
        </div>
      </div>
    </div>
  );
}

function TxnRow({ txn, username }) {
  const isSeller = txn.seller === username;
  const statusColors = {
    completed: "bg-green-50 text-green-700",
    pending_payment: "bg-amber-50 text-amber-700",
    in_transit: "bg-blue-50 text-blue-700",
    customs_clearance: "bg-purple-50 text-purple-700",
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-warm-border last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSeller ? "bg-green-50" : "bg-blue-50"}`}>
        {isSeller ? <TrendingUp size={14} className="text-green-600" /> : <ShoppingBag size={14} className="text-blue-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink truncate">
          {isSeller ? txn.buyerName : txn.sellerName}
        </div>
        <div className="text-xs text-warm-muted">{txn.product} - {txn.quantity.toLocaleString()} {txn.unit}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`text-sm font-bold ${isSeller ? "text-green-600" : "text-red-500"}`}>
          {isSeller ? "+" : "-"}{formatUGX(txn.total)}
        </div>
        <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${statusColors[txn.status] || "bg-warm-bg text-warm-text"}`}>
          {txn.status.replace("_", " ")}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      {action && <button onClick={onAction} className="text-xs text-gold font-semibold flex items-center gap-1 hover:underline">{action} <ChevronRight size={12} /></button>}
    </div>
  );
}

function PriceTag({ commodity, prices }) {
  const p = prices.find(x => x.commodity === commodity);
  if (!p) return null;
  const up = p.trend > 0;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-warm-border last:border-0">
      <div>
        <div className="text-sm font-medium text-ink">{p.commodity}</div>
        <div className="text-xs text-warm-muted">{p.source} - {p.updated}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-ink">UGX {p.sell.toLocaleString()}/{p.unit}</div>
        <div className={`text-xs font-semibold flex items-center gap-1 justify-end ${up ? "text-green-600" : "text-red-500"}`}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {Math.abs(p.trend)}% today
        </div>
      </div>
    </div>
  );
}

function NotificationFeed({ username, role }) {
  const notifs = role ? getActorNotificationsFallback(username, role) : getActorNotifications(username);
  if (!notifs.length) return null;
  const icons = { payment: CheckCircle, offer: ShoppingBag, price: TrendingUp, order: Package, batch: Factory, transport: Truck, eudr: Shield, shipment: Ship, rating: Star, registration: Users, alert: AlertCircle, complaint: AlertCircle };
  const colors = { payment: "text-green-500", offer: "text-gold", price: "text-blue-500", order: "text-purple-500", batch: "text-amber-500", transport: "text-slate-500", eudr: "text-indigo-500", shipment: "text-blue-600", rating: "text-gold", registration: "text-green-500", alert: "text-red-500", complaint: "text-red-400" };
  return (
    <div className="space-y-2">
      {notifs.slice(0, 5).map(n => {
        const Icon = icons[n.type] || Bell;
        return (
          <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${!n.read ? "bg-gold/5 border-gold/20" : "bg-white border-warm-border"}`}>
            <Icon size={16} className={`flex-shrink-0 mt-0.5 ${colors[n.type] || "text-warm-muted"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-ink leading-relaxed">{n.message}</div>
              <div className="text-[10px] text-warm-muted mt-1">{n.time}</div>
            </div>
            {!n.read && <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0 mt-1" />}
          </div>
        );
      })}
    </div>
  );
}


function PageHeader({ user, subtitle }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{subtitle}</h1>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="font-mono text-sm text-warm-text font-semibold">{user?.tradeId}</span>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle size={9} /> {user?.verified} Verified
          </span>
          {user?.district && <span className="text-[10px] text-warm-muted">{user.district}</span>}
          {user?.grade && <span className="text-[10px] text-warm-muted">{user.grade}</span>}
        </div>
      </div>
      <div className="text-right hidden md:block">
        <div className="text-xs text-warm-muted">Last updated</div>
        <div className="text-xs font-semibold text-ink">{new Date().toLocaleTimeString("en-UG", {hour:"2-digit", minute:"2-digit"})}</div>
      </div>
    </div>
  );
}

function RegionalPrices({ products }) {
  const regions = ["Eastern", "Central", "Western", "Northern"];
  const variations = [1.00, 0.97, 0.95, 0.92];
  const display = MARKET_PRICES.filter(p =>
    (products || []).some(prod => p.commodity.toLowerCase().includes(prod.toLowerCase().split(" ")[0]))
  ).slice(0, 4);
  const prices = display.length > 0 ? display : MARKET_PRICES.slice(0, 4);
  return (
    <div className="bg-white border border-warm-border rounded-xl p-5 mb-6 overflow-x-auto">
      <SectionHeader title="Your products across regions" action="Full prices" />
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="border-b border-warm-border">
            <th className="text-left text-xs font-semibold text-warm-text uppercase tracking-wider pb-3 pr-4">Commodity</th>
            {regions.map(r => <th key={r} className="text-right text-xs font-semibold text-warm-text uppercase tracking-wider pb-3 px-3">{r}</th>)}
            <th className="text-right text-xs font-semibold text-warm-text uppercase tracking-wider pb-3 pl-3">Trend</th>
          </tr>
        </thead>
        <tbody>
          {prices.map(p => (
            <tr key={p.commodity} className="border-b border-warm-border last:border-0">
              <td className="py-3 pr-4">
                <div className="font-medium text-ink">{p.commodity}</div>
                <div className="text-xs text-warm-muted">{p.source}</div>
              </td>
              {regions.map((r, i) => (
                <td key={r} className="py-3 px-3 text-right">
                  <div className="font-semibold text-ink">UGX {Math.round(p.sell * variations[i]).toLocaleString()}</div>
                  <div className="text-[10px] text-warm-muted">per {p.unit}</div>
                </td>
              ))}
              <td className="py-3 pl-3 text-right">
                <div className={`flex items-center justify-end gap-1 text-xs font-bold ${p.trend > 0 ? "text-green-600" : "text-red-500"}`}>
                  {p.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {Math.abs(p.trend)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendingProducts() {
  const rising = [...MARKET_PRICES].filter(p => p.trend > 0).sort((a,b) => b.trend - a.trend).slice(0, 6);
  const falling = [...MARKET_PRICES].filter(p => p.trend < 0).sort((a,b) => a.trend - b.trend).slice(0, 3);
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white border border-warm-border rounded-xl p-5">
        <SectionHeader title="Rising prices today" />
        <div className="space-y-2.5">
          {rising.map((p, i) => (
            <div key={p.commodity} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-green-700 flex-shrink-0">{i+1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink truncate">{p.commodity}</div>
                <div className="text-xs text-warm-muted">UGX {p.sell.toLocaleString()}/{p.unit} - {p.region}</div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-600 flex-shrink-0">
                <TrendingUp size={12} /> +{p.trend}%
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-warm-border rounded-xl p-5">
        <SectionHeader title="Falling prices today" />
        <div className="space-y-2.5 mb-4">
          {falling.map((p, i) => (
            <div key={p.commodity} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-red-500 flex-shrink-0">{i+1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink truncate">{p.commodity}</div>
                <div className="text-xs text-warm-muted">UGX {p.sell.toLocaleString()}/{p.unit} - {p.region}</div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-red-500 flex-shrink-0">
                <TrendingDown size={12} /> {p.trend}%
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1"><Zap size={11} /> Market insight</div>
          <div className="text-xs text-amber-700 leading-relaxed">Tomato and matoke prices are down today. Consider holding stock or pivoting to higher-value commodities like Vanilla (+8.3%) and Nile Perch (+6.2%).</div>
        </div>
      </div>
    </div>
  );
}

// ─── AGR Dashboard ────────────────────────────────────────────

function AGRDashboard({ user }) {
  const txns = getActorTransactionsFallback(user.username, user.role);
  const listings = getActorListingsFallback(user.username, user.role);
  const totalRevenue = txns.filter(t => t.seller === user.username && t.status === "completed").reduce((s, t) => s + t.total, 0);
  const completedTxns = txns.filter(t => t.status === "completed").length;
  const coffeePrice = MARKET_PRICES.find(p => p.commodity === "Coffee (Arabica)");
  const userProducts = user.products?.length ? user.products : ["Coffee (Arabica)", "Maize"];

  return (
    <div>
      <PageHeader user={user} subtitle="Farmer Dashboard" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total revenue (season)" value={formatUGX(totalRevenue)} trend={8.3} icon={TrendingUp} color="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Completed sales" value={completedTxns} sub="Verified transactions" icon={CheckCircle} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Active listings" value={listings.filter(l => l.status === "active").length} sub="On marketplace" icon={ShoppingBag} color="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="Coffee price today" value={`UGX ${coffeePrice?.sell.toLocaleString()}/kg`} trend={coffeePrice?.trend} icon={Activity} color="bg-amber-50" iconColor="text-amber-600" />
      </div>
      <RegionalPrices products={userProducts} />
      <TrendingProducts />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <SectionHeader title="Recent sales" action="View all" />
            {txns.filter(t => t.seller === user.username).slice(0, 5).map(t => <TxnRow key={t.id} txn={t} username={user.username} />)}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="My active listings" action="Manage" />
            {listings.filter(l => l.status === "active").length === 0 ? (
              <div className="text-center py-6 text-warm-muted text-sm">No active listings. <button className="text-gold font-semibold">Create one</button></div>
            ) : listings.filter(l => l.status === "active").map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 border-b border-warm-border last:border-0">
                <div>
                  <div className="text-sm font-medium text-ink">{l.product} - {l.grade}</div>
                  <div className="text-xs text-warm-muted">{l.quantity.toLocaleString()} {l.unit} available - {l.district}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-ink">UGX {l.pricePerUnit.toLocaleString()}/{l.unit}</div>
                  <div className="text-xs text-warm-muted">{l.views} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Market prices" action="Full view" />
            {["Coffee (Arabica)", "Coffee (Robusta)", "Maize", "Beans (Common)"].map(c => <PriceTag key={c} commodity={c} prices={MARKET_PRICES} />)}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Notifications" />
            <NotificationFeed username={user.username} role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VAP Dashboard ────────────────────────────────────────────

function VAPDashboard({ user }) {
  const txns = getActorTransactionsFallback(user.username, user.role);
  const batches = getActorBatchesFallback(user.username, user.role);
  const totalProcessed = batches.reduce((s, b) => s + b.inputQuantity, 0);
  const totalOutput = batches.reduce((s, b) => s + b.outputQuantity, 0);
  const revenue = txns.filter(t => t.seller === user.username && t.status === "completed").reduce((s, t) => s + t.total, 0);

  return (
    <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total input processed" value={`${(totalProcessed / 1000).toFixed(1)}T`} trend={12.4} icon={Factory} color="bg-amber-50" iconColor="text-amber-600" sub="This season" />
        <StatCard label="Output delivered" value={`${(totalOutput / 1000).toFixed(1)}T`} trend={11.8} icon={Package} color="bg-green-50" iconColor="text-green-600" sub="Parchment coffee" />
        <StatCard label="Revenue earned" value={formatUGX(revenue)} trend={9.2} icon={TrendingUp} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="EUDR eligible batches" value={batches.filter(b => b.eudrEligible).length} sub="Fully traceable" icon={Shield} color="bg-indigo-50" iconColor="text-indigo-600" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <SectionHeader title="Processing batches" action="View all" />
            {batches.map(b => (
              <div key={b.id} className="py-3 border-b border-warm-border last:border-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="text-sm font-semibold text-ink">{b.id}</div>
                    <div className="text-xs text-warm-muted">{b.processDate} - {b.facility}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.traceability === "full" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {b.traceability === "full" ? "Fully traceable" : "Partial"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="bg-warm-bg rounded-lg p-2 text-center">
                    <div className="text-xs text-warm-muted">Input</div>
                    <div className="text-sm font-bold text-ink">{(b.inputQuantity / 1000).toFixed(1)}T</div>
                    <div className="text-[10px] text-warm-muted">Cherry</div>
                  </div>
                  <div className="bg-warm-bg rounded-lg p-2 text-center">
                    <div className="text-xs text-warm-muted">Ratio</div>
                    <div className="text-sm font-bold text-ink">{b.conversionRatio}</div>
                    <div className="text-[10px] text-warm-muted">Conversion</div>
                  </div>
                  <div className="bg-warm-bg rounded-lg p-2 text-center">
                    <div className="text-xs text-warm-muted">Output</div>
                    <div className="text-sm font-bold text-green-600">{(b.outputQuantity / 1000).toFixed(1)}T</div>
                    <div className="text-[10px] text-warm-muted">Parchment</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-[10px] text-warm-muted">Source farmers: {b.sourceActors.length}</div>
                  {b.eudrEligible && <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-semibold"><Shield size={10} /> EUDR eligible</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <IncomingRequests username={user.username} role={user.role} />
            <SectionHeader title="Recent transactions" action="View all" />
            {txns.slice(0, 4).map(t => <TxnRow key={t.id} txn={t} username={user.username} />)}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Traceability score" />
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-green-600 mb-1">98%</div>
              <div className="text-sm text-warm-text">EUDR compliance readiness</div>
              <div className="mt-3 h-3 bg-warm-bg rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{width:"98%"}} />
              </div>
              <div className="mt-3 space-y-2 text-left">
                {[["Farmer registration", "47/47", true], ["GPS coordinates", "47/47", true], ["Deforestation check", "Passed", true], ["Chain of custody", "Complete", true]].map(([l, v, ok]) => (
                  <div key={l} className="flex items-center justify-between text-xs">
                    <span className="text-warm-text">{l}</span>
                    <span className={`font-semibold flex items-center gap-1 ${ok ? "text-green-600" : "text-red-500"}`}>{ok ? <CheckCircle size={11} /> : <XCircle size={11} />} {v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Notifications" />
            <NotificationFeed username={user.username} role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AGT Dashboard ────────────────────────────────────────────

function AGTDashboard({ user }) {
  const txns = getActorTransactionsFallback(user.username, user.role);
  const listings = getActorListingsFallback(user.username, user.role);
  const salesRevenue = txns.filter(t => t.seller === user.username && t.status === "completed").reduce((s, t) => s + t.total, 0);
  const purchaseSpend = txns.filter(t => t.buyer === user.username && t.status === "completed").reduce((s, t) => s + t.total, 0);

  return (
    <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Sales revenue" value={formatUGX(salesRevenue)} trend={14.2} icon={TrendingUp} color="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Purchase spend" value={formatUGX(purchaseSpend)} trend={11.8} icon={ShoppingBag} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Active listings" value={listings.filter(l => l.status === "active").length} sub="On marketplace" icon={Package} color="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="Transactions" value={txns.length} sub="All time" icon={Activity} color="bg-amber-50" iconColor="text-amber-600" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <IncomingRequests username={user.username} role={user.role} />
            <SectionHeader title="Recent transactions" action="View all" />
            {txns.slice(0, 6).map(t => <TxnRow key={t.id} txn={t} username={user.username} />)}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="My active listings" action="Manage" />
            {listings.filter(l => l.status === "active").map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 border-b border-warm-border last:border-0">
                <div>
                  <div className="text-sm font-medium text-ink">{l.product} - {l.grade}</div>
                  <div className="text-xs text-warm-muted">{l.quantity.toLocaleString()} {l.unit} - {l.district}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-ink">UGX {l.pricePerUnit.toLocaleString()}/{l.unit}</div>
                  <div className="text-xs text-warm-muted">{l.views} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Market prices" />
            {["Coffee (Arabica)", "Coffee (Robusta)", "Maize", "Beans (Common)", "Groundnuts"].map(c => <PriceTag key={c} commodity={c} prices={MARKET_PRICES} />)}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Notifications" />
            <NotificationFeed username={user.username} role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EXP Dashboard ────────────────────────────────────────────

function EXPDashboard({ user }) {
  const txns = getActorTransactionsFallback(user.username, user.role);
  const batches = getActorBatchesFallback(user.username, user.role);
  const eudrDocs = EUDR_DOCUMENTS.filter(d => batches.some(b => b.id === d.batchId));
  const exportRevenue = txns.filter(t => t.seller === user.username).reduce((s, t) => s + t.total, 0);

  return (
    <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Export revenue (YTD)" value={formatUGX(exportRevenue)} trend={22.4} icon={TrendingUp} color="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Active shipments" value={batches.filter(b => b.status === "in_transit").length} sub="In transit" icon={Ship} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="EUDR documents" value={eudrDocs.length} sub="Filed this year" icon={Shield} color="bg-indigo-50" iconColor="text-indigo-600" />
        <StatCard label="Compliance score" value="97%" trend={2.1} icon={CheckCircle} color="bg-green-50" iconColor="text-green-600" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <SectionHeader title="Export batches" action="View all" />
            {batches.map(b => (
              <div key={b.id} className="py-3 border-b border-warm-border last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-ink">{b.id}</div>
                    <div className="text-xs text-warm-muted">{b.buyer} - {b.destination}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.status === "in_transit" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
                    {b.status.replace("_", " ")}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[["Quantity", `${(b.inputQuantity / 1000).toFixed(0)}T`], ["Container", b.containerRef?.split("-")[1] || "-"], ["Port", b.portOfExit], ["ETA", b.etaDestination || "-"]].map(([l, v]) => (
                    <div key={l} className="bg-warm-bg rounded-lg p-2">
                      <div className="text-[10px] text-warm-muted">{l}</div>
                      <div className="text-xs font-semibold text-ink">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="EUDR documentation" action="View all" />
            {eudrDocs.map(d => (
              <div key={d.id} className="py-3 border-b border-warm-border last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-ink">{d.id}</div>
                    <div className="text-xs text-warm-muted">EU Ref: {d.euRefNumber}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${d.status === "approved" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                    {d.status}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-warm-muted">
                  <span>{d.verifiedFarmers} farmers verified</span>
                  <span>Compliance: {d.complianceScore}%</span>
                  <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle size={11} /> Deforestation free</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Chain of custody" />
            <div className="space-y-3">
              {["Farmers (47)", "Processors (1)", "Aggregators (1)", "Exporter (you)", "EU Buyer"].map((node, i, arr) => (
                <div key={node}>
                  <div className={`flex items-center gap-2 p-2.5 rounded-lg ${i === 3 ? "bg-gold/10 border border-gold/30" : "bg-warm-bg border border-warm-border"}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i <= 3 ? "bg-green-500" : "bg-warm-border"}`} />
                    <span className="text-xs font-medium text-ink">{node}</span>
                    {i <= 3 && <CheckCircle size={12} className="text-green-500 ml-auto" />}
                  </div>
                  {i < arr.length - 1 && <div className="w-0.5 h-3 bg-warm-border ml-3.5" />}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Notifications" />
            <NotificationFeed username={user.username} role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MFR Dashboard ────────────────────────────────────────────

function MFRDashboard({ user }) {
  const txns = getActorTransactionsFallback(user.username, user.role);
  const listings = getActorListingsFallback(user.username, user.role);
  const certs = CERTIFICATIONS.filter(c => c.holder === user.username);
  const revenue = txns.filter(t => t.seller === user.username && t.status === "completed").reduce((s, t) => s + t.total, 0);

  return (
    <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Sales revenue" value={formatUGX(revenue)} trend={18.2} icon={TrendingUp} color="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Active listings" value={listings.filter(l => l.status === "active").length} sub="Products listed" icon={Package} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="UNBS certifications" value={certs.filter(c => c.status === "active").length} sub="Active" icon={Award} color="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Transactions" value={txns.length} sub="All time" icon={Activity} color="bg-purple-50" iconColor="text-purple-600" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <IncomingRequests username={user.username} role={user.role} />
            <SectionHeader title="Recent transactions" action="View all" />
            {txns.slice(0, 5).map(t => <TxnRow key={t.id} txn={t} username={user.username} />)}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="My listings" action="Manage" />
            {listings.map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 border-b border-warm-border last:border-0">
                <div>
                  <div className="text-sm font-medium text-ink">{l.product} - {l.grade}</div>
                  <div className="text-xs text-warm-muted">{l.quantity.toLocaleString()} {l.unit} available</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-ink">UGX {l.pricePerUnit.toLocaleString()}/{l.unit}</div>
                  <div className="text-xs text-warm-muted">{l.views} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Certifications" />
            {certs.map(c => (
              <div key={c.id} className="py-3 border-b border-warm-border last:border-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="text-xs font-semibold text-ink">{c.standard}</div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{c.status}</div>
                </div>
                <div className="text-[10px] text-warm-muted">Cert: {c.certNumber}</div>
                <div className="text-[10px] text-warm-muted">Expires: {c.expires}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Notifications" />
            <NotificationFeed username={user.username} role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TRP Dashboard ────────────────────────────────────────────

function TRPDashboard({ user }) {
  const jobs = TRANSACTIONS.filter(t => t.transporter === user.username).length > 0 ? TRANSACTIONS.filter(t => t.transporter === user.username) : TRANSACTIONS.filter(t => t.transporter === "ssekandi_transport");
  const vehicles = VEHICLES.filter(v => v.owner === user.username);
  const revenue = jobs.filter(j => j.status === "completed").reduce((s, j) => s + j.total, 0);
  const activeJobs = jobs.filter(j => j.status === "in_transit");

  return (
    <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Revenue this month" value={formatUGX(revenue)} trend={6.8} icon={TrendingUp} color="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Active jobs" value={activeJobs.length} sub="In transit" icon={Truck} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Fleet size" value={vehicles.length} sub="Registered vehicles" icon={Package} color="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Completed jobs" value={jobs.filter(j => j.status === "completed").length} sub="All time" icon={CheckCircle} color="bg-purple-50" iconColor="text-purple-600" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <SectionHeader title="My fleet" action="Manage vehicles" />
            {vehicles.map(v => (
              <div key={v.id} className="py-3 border-b border-warm-border last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-ink">{v.regNumber} - {v.make}</div>
                    <div className="text-xs text-warm-muted">{v.type} - {v.capacity.toLocaleString()} {v.unit} capacity</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v.status === "available" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                    {v.status.replace("_", " ")}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {v.goodsTypes.map(g => <span key={g} className="text-[10px] bg-warm-bg border border-warm-border px-2 py-0.5 rounded-full text-warm-text">{g}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Recent jobs" action="View all" />
            {jobs.map(j => (
              <div key={j.id} className="py-3 border-b border-warm-border last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-ink">{j.origin} - {j.destination}</div>
                    <div className="text-xs text-warm-muted">{j.cargo} - {j.quantity.toLocaleString()} {j.unit} - {j.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">+{formatUGX(j.total)}</div>
                    <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${j.status === "completed" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>{j.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Routes served" />
            <div className="space-y-2">
              {[["Mbale", "Kampala", "245km"], ["Kampala", "Gulu", "340km"], ["Mbale", "Tororo", "80km"]].map(([o, d, dist]) => (
                <div key={o+d} className="flex items-center gap-2 p-2.5 bg-warm-bg rounded-lg">
                  <MapPin size={12} className="text-gold flex-shrink-0" />
                  <span className="text-xs font-medium text-ink">{o} - {d}</span>
                  <span className="text-xs text-warm-muted ml-auto">{dist}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Notifications" />
            <NotificationFeed username={user.username} role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BYR Dashboard ────────────────────────────────────────────

function BYRDashboard({ user }) {
  const txns = getActorTransactionsFallback(user.username, user.role);
  const spend = txns.filter(t => t.buyer === user.username && t.status === "completed").reduce((s, t) => s + t.total, 0);

  return (
    <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total procurement" value={formatUGX(spend)} trend={9.4} icon={ShoppingBag} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Orders completed" value={txns.filter(t => t.status === "completed").length} icon={CheckCircle} color="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Active orders" value={txns.filter(t => t.status === "pending_payment" || t.status === "in_transit").length} icon={Clock} color="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Verified suppliers" value={4} sub="NIRA/URSB verified" icon={Shield} color="bg-indigo-50" iconColor="text-indigo-600" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <SectionHeader title="Purchase history" action="View all" />
            {txns.map(t => <TxnRow key={t.id} txn={t} username={user.username} />)}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Market prices" />
            {["Coffee (Arabica)", "Coffee (Robusta)", "Maize"].map(c => <PriceTag key={c} commodity={c} prices={MARKET_PRICES} />)}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Notifications" />
            <NotificationFeed username={user.username} role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── IMP Dashboard ────────────────────────────────────────────

function IMPDashboard({ user }) {
  const txns = getActorTransactionsFallback(user.username, user.role);
  const importValue = txns.filter(t => t.buyer === user.username).reduce((s, t) => s + t.total, 0);

  return (
    <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Import value (YTD)" value={formatUGX(importValue)} trend={5.2} icon={PackageOpen} color="bg-orange-50" iconColor="text-orange-600" />
        <StatCard label="Active shipments" value={txns.filter(t => t.status === "customs_clearance" || t.status === "in_transit").length} icon={Ship} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Cleared shipments" value={txns.filter(t => t.status === "completed").length} icon={CheckCircle} color="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Source countries" value={2} sub="Kenya, China" icon={MapPin} color="bg-purple-50" iconColor="text-purple-600" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-warm-border rounded-xl p-5">
          <SectionHeader title="Import records" action="View all" />
          {txns.map(t => (
            <div key={t.id} className="py-3 border-b border-warm-border last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-ink">{t.sellerName}</div>
                  <div className="text-xs text-warm-muted">{t.product} - {t.quantity.toLocaleString()} {t.unit}</div>
                  <div className="text-xs text-warm-muted">{t.date} - Ref: {t.reference}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-ink">{formatUGX(t.total)}</div>
                  <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${t.status === "customs_clearance" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                    {t.status.replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Market prices" />
            {["Maize", "Beans (Common)", "Groundnuts"].map(c => <PriceTag key={c} commodity={c} prices={MARKET_PRICES} />)}
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Notifications" />
            <NotificationFeed username={user.username} role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CSM Dashboard ────────────────────────────────────────────

function CSMDashboard({ user }) {
  const txns = getActorTransactionsFallback(user.username, user.role);
  const spend = txns.filter(t => t.buyer === user.username && t.status === "completed").reduce((s, t) => s + t.total, 0);

  return (
    <div>
      <PageHeader user={user} subtitle="Consumer Dashboard" />
      <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-white" />
          </div>
          <div>
            <div className="text-xs text-warm-muted">Consumer ID</div>
            <div className="font-mono text-ink font-bold text-lg">{user?.tradeId}</div>
            <div className="text-sm text-warm-text">{user?.name} - {user?.district}</div>
          </div>
          <div className="ml-auto">
            <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={11} /> Verified Consumer
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Total spent" value={formatUGX(spend)} icon={ShoppingBag} color="bg-pink-50" iconColor="text-pink-600" />
        <StatCard label="Purchases" value={txns.filter(t => t.status === "completed").length} sub="Completed" icon={CheckCircle} color="bg-green-50" iconColor="text-green-600" />
      </div>
      <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
        <SectionHeader title="Browse the marketplace" />
        <p className="text-sm text-warm-text mb-4">Shop directly from verified farmers, processors and manufacturers across Uganda.</p>
        <div className="grid grid-cols-2 gap-3">
          {LISTINGS.slice(0, 4).map(l => (
            <div key={l.id} className="p-3 border border-warm-border rounded-xl hover:border-gold transition-all cursor-pointer">
              <div className="text-xs font-semibold text-ink mb-1">{l.product}</div>
              <div className="text-xs text-warm-muted mb-2">{l.sellerName}</div>
              <div className="text-sm font-bold text-ink">UGX {l.pricePerUnit.toLocaleString()}/{l.unit}</div>
              <div className="text-[10px] text-warm-muted">{l.district} - Min {l.minOrder} {l.unit}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-warm-border rounded-xl p-5">
        <SectionHeader title="Purchase history" />
        {txns.length === 0
          ? <p className="text-sm text-warm-muted text-center py-4">No purchases yet. Browse the marketplace to get started.</p>
          : txns.map(t => <TxnRow key={t.id} txn={t} username={user.username} />)
        }
      </div>
    </div>
  );
}

// ─── ADMIN Dashboard ─────────────────────────────────────────

function ADMINDashboard({ user }) {
  const stats = ADMIN_STATS;
  const notifs = getActorNotifications("dtp_admin");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Platform Administration</h1>
          <p className="text-sm text-warm-text">System health: <span className="text-green-600 font-semibold">{stats.systemHealth}</span> - Uptime {stats.uptime} - Last backup {stats.lastBackup}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-700">All systems operational</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total registered" value={formatNumber(stats.totalUsers)} trend={12.4} icon={Users} color="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Active Trade IDs" value={formatNumber(stats.activeTradeIds)} trend={11.8} icon={Shield} color="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Today registrations" value={stats.todayRegistrations} sub={`${stats.pendingApproval} pending review`} icon={Activity} color="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Open complaints" value={stats.openComplaints} sub={`${stats.resolvedComplaints} resolved all-time`} icon={AlertCircle} color="bg-red-50" iconColor="text-red-500" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <SectionHeader title="Account status overview" />
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Active", stats.activeUsers, "bg-green-50 text-green-700"],
                ["Profile incomplete", stats.profileIncomplete, "bg-amber-50 text-amber-700"],
                ["Pending approval", stats.pendingApproval, "bg-blue-50 text-blue-700"],
                ["Suspended", stats.suspendedAccounts, "bg-red-50 text-red-600"],
                ["Trade IDs active", stats.activeTradeIds, "bg-indigo-50 text-indigo-700"],
                ["Trade IDs frozen", stats.frozenTradeIds, "bg-orange-50 text-orange-700"],
              ].map(([label, val, cls]) => (
                <div key={label} className={`p-3 rounded-xl ${cls.split(" ")[0]}`}>
                  <div className={`text-2xl font-bold ${cls.split(" ")[1]}`}>{val.toLocaleString()}</div>
                  <div className="text-xs text-warm-text mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Open complaints" action="View all" />
            {COMPLAINTS.filter(c => c.status === "open").map(c => (
              <div key={c.id} className="py-3 border-b border-warm-border last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-ink">{c.id}</div>
                    <div className="text-xs text-warm-muted">{c.complainantName} vs {c.againstName}</div>
                    <div className="text-xs text-warm-text mt-1">{c.issue}</div>
                  </div>
                  <div className="text-[10px] font-semibold px-2 py-0.5 bg-red-50 text-red-600 rounded-full">Open</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="Today's activity" />
            <div className="space-y-3">
              {[["Registrations", stats.todayRegistrations, "text-green-600"],
                ["Logins", stats.todayLogins, "text-blue-600"],
                ["Pending review", stats.pendingApproval, "text-amber-600"],
              ].map(([l, v, cls]) => (
                <div key={l} className="flex items-center justify-between py-2 border-b border-warm-border last:border-0">
                  <span className="text-sm text-warm-text">{l}</span>
                  <span className={`text-sm font-bold ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="System notifications" />
            <NotificationFeed username="dtp_admin" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GOU Dashboard ────────────────────────────────────────────

// Priority-ordered key reports for the analyst's institution (spec A22).
// Pulls from the same seam as the Reports page; full detail/downloads live there.
function GovReportHighlights({ institution }) {
  const navigate = useNavigate();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    let active = true;
    getGovernmentAnalytics().then((d) => {
      if (!active) return;
      const set = institution === "MTIC" ? d.mtic : d.npa;
      setReports([...set.reports].sort((a, b) => (a.priority || 99) - (b.priority || 99)));
    });
    return () => { active = false; };
  }, [institution]);

  return (
    <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <SectionHeader title={`${institution} key reports — priority order`} />
        <button onClick={() => navigate("/government-analytics")}
          className="text-gold text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
          Open full reports <ChevronRight size={12} />
        </button>
      </div>
      {!reports ? (
        <div className="text-sm text-warm-muted py-6 text-center">Loading reports…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reports.map((r, i) => {
            const top = r.stats?.[0];
            return (
              <button key={r.id} onClick={() => navigate(`/government-analytics/${r.id}`)}
                className="text-left bg-warm-bg border border-warm-border rounded-xl p-3.5 hover:border-gold transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md bg-ink text-gold text-[10px] font-bold flex items-center justify-center flex-shrink-0">{r.priority || i + 1}</span>
                  <span className="text-xs font-bold text-ink leading-tight">{r.title}</span>
                </div>
                {top && (
                  <div className="mb-1">
                    <span className="text-lg font-bold text-ink">{top.value}</span>{" "}
                    <span className="text-[10px] text-warm-muted">{top.label}</span>
                  </div>
                )}
                {r.insights?.[0] && <p className="text-[11px] text-warm-text leading-snug">{r.insights[0]}</p>}
                <span className="text-gold text-[10px] font-semibold flex items-center gap-1 mt-2 group-hover:gap-1.5 transition-all">
                  View report <ArrowRight size={10} />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GOUDashboard({ user }) {
  const stats = GOV_STATS;
  const institution = user?.institution || "MTIC";
  const HEAD = {
    NPA: { title: "National Planning Authority — Planning Dashboard", sub: "NDP IV monitoring & evaluation · Results & Resources Framework" },
    MTIC: { title: "Ministry of Trade, Industry & Cooperatives — Trade Dashboard", sub: "Trade formalisation, value addition and cooperatives oversight" },
  };
  const head = HEAD[institution] || HEAD.MTIC;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">{head.title}</h1>
          <p className="text-sm text-warm-text">{head.sub}</p>
        </div>
        <div className="text-xs text-warm-muted px-3 py-2 bg-warm-bg border border-warm-border rounded-xl">
          Data as of {new Date().toLocaleDateString("en-UG")}
        </div>
      </div>

      {/* Institution report set — priority order (A22), in addition to national stats */}
      <GovReportHighlights institution={institution} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Registered trade actors" value={formatNumber(stats.totalActors)} trend={14.2} icon={Users} color="bg-blue-50" iconColor="text-blue-600" sub="Active Trade IDs issued" />
        <StatCard label="Total transaction value" value={formatUGX(stats.totalTransactionValue)} trend={22.8} icon={TrendingUp} color="bg-green-50" iconColor="text-green-600" sub="Recorded on platform" />
        <StatCard label="Export value (YTD)" value={formatUGX(stats.exportValue)} trend={18.4} icon={Ship} color="bg-indigo-50" iconColor="text-indigo-600" sub="Documented exports" />
        <StatCard label="EUDR compliant batches" value={stats.eudrCompliantBatches} trend={31.2} icon={Shield} color="bg-green-50" iconColor="text-green-600" sub={`${stats.eudrPendingBatches} pending`} />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-6">
            <SectionHeader title="Formalization progress" />
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-warm-text">Registered actors vs target (3-4M)</span>
                <span className="text-sm font-bold text-ink">{((stats.totalActors / stats.targetActors) * 100).toFixed(2)}%</span>
              </div>
              <div className="h-4 bg-warm-bg rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-full transition-all" style={{width:`${(stats.totalActors / stats.targetActors) * 100}%`}} />
              </div>
              <div className="flex justify-between text-xs text-warm-muted mt-1">
                <span>{formatNumber(stats.totalActors)} registered</span>
                <span>Target: {formatNumber(stats.targetActors)}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {stats.regionBreakdown.map(r => (
                <div key={r.region} className="bg-warm-bg rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-ink">{r.region}</div>
                  <div className="text-lg font-bold text-gold mt-1">{formatNumber(r.actors)}</div>
                  <div className="text-[10px] text-warm-muted">actors</div>
                  <div className="text-xs font-semibold text-ink mt-1">{formatUGX(r.value)}</div>
                  <div className="text-[10px] text-warm-muted">trade value</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Top commodities by value" />
            {stats.topCommodities.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 py-2.5 border-b border-warm-border last:border-0">
                <div className="w-6 h-6 bg-warm-bg rounded-lg flex items-center justify-center text-xs font-bold text-warm-text flex-shrink-0">{i+1}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{c.name}</div>
                  <div className="text-xs text-warm-muted">{formatNumber(c.actors)} actors - {formatNumber(c.volume)} kg volume</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-ink">{formatUGX(c.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white border border-warm-border rounded-xl p-5 mb-5">
            <SectionHeader title="EUDR compliance" />
            <div className="text-center py-3">
              <div className="text-4xl font-bold text-green-600">{Math.round((stats.eudrCompliantBatches / (stats.eudrCompliantBatches + stats.eudrPendingBatches)) * 100)}%</div>
              <div className="text-xs text-warm-text mt-1">Batch compliance rate</div>
              <div className="h-3 bg-warm-bg rounded-full overflow-hidden mt-3">
                <div className="h-full bg-green-500 rounded-full" style={{width:`${Math.round((stats.eudrCompliantBatches / (stats.eudrCompliantBatches + stats.eudrPendingBatches)) * 100)}%`}} />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {[["Compliant", stats.eudrCompliantBatches, "text-green-600"], ["Pending", stats.eudrPendingBatches, "text-amber-600"]].map(([l, v, cls]) => (
                <div key={l} className="flex justify-between text-xs">
                  <span className="text-warm-text">{l}</span>
                  <span className={`font-bold ${cls}`}>{v} batches</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <SectionHeader title="Registration trend" />
            <div className="space-y-2">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
                <div key={m} className="flex items-center gap-2">
                  <span className="text-xs text-warm-muted w-6">{m}</span>
                  <div className="flex-1 h-5 bg-warm-bg rounded overflow-hidden">
                    <div className="h-full bg-gold/70 rounded transition-all"
                      style={{width:`${(stats.monthlyRegistrations[i] / Math.max(...stats.monthlyRegistrations)) * 100}%`}} />
                  </div>
                  <span className="text-xs font-medium text-ink w-10 text-right">{stats.monthlyRegistrations[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard router ────────────────────────────────────

function getActorBatches(username) {
  return BATCHES.filter(b => b.actor === username);
}


// ── Incoming Purchase Requests Component ─────────────────────────────────────
function IncomingRequests({ username, role }) {
  const navigate = useNavigate();
  const requests = getSellerRequests(username);
  const pending = requests.filter(r => r.status === "pending" || r.status === "countered");
  const recent = requests.filter(r => r.status === "accepted" || r.status === "declined").slice(0, 2);

  const STATUS_STYLES = {
    pending:   "bg-amber-50 text-amber-700 border-amber-200",
    countered: "bg-blue-50 text-blue-700 border-blue-200",
    accepted:  "bg-green-50 text-green-700 border-green-200",
    declined:  "bg-red-50 text-red-600 border-red-200",
  };

  if (requests.length === 0) return null;

  return (
    <div className="bg-white border border-warm-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-warm-border">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-ink text-sm">Incoming Purchase Requests</h2>
          {pending.length > 0 && (
            <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
              {pending.length} pending
            </span>
          )}
        </div>
        <button onClick={() => navigate("/requests")}
          className="text-xs text-gold font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          My Listings <ArrowRight size={11} />
        </button>
      </div>
      <div className="divide-y divide-warm-border">
        {[...pending, ...recent].map(req => (
          <div key={req.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {req.buyerName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-ink text-sm">{req.buyerName}</div>
                  <div className="text-warm-muted text-xs font-mono">{req.buyerTradeId}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLES[req.status]}`}>
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </div>
            <div className="bg-warm-bg rounded-lg p-3 mb-3">
              <div className="grid grid-cols-3 gap-3 mb-2">
                <div>
                  <div className="text-[10px] text-warm-muted font-medium">Product</div>
                  <div className="text-xs font-semibold text-ink">{req.product}</div>
                  <div className="text-[10px] text-warm-muted">{req.grade}</div>
                </div>
                <div>
                  <div className="text-[10px] text-warm-muted font-medium">Quantity</div>
                  <div className="text-xs font-semibold text-ink">{req.quantityRequested.toLocaleString()} {req.unit}</div>
                </div>
                <div>
                  <div className="text-[10px] text-warm-muted font-medium">Offered price</div>
                  <div className="text-xs font-semibold text-ink">UGX {req.offeredPrice.toLocaleString()}/{req.unit}</div>
                  <div className="text-[10px] text-gold font-semibold">Total: UGX {req.totalValue.toLocaleString()}</div>
                </div>
              </div>
              <p className="text-xs text-warm-text leading-relaxed italic">"{req.message}"</p>
              {req.status === "countered" && req.counterMessage && (
                <div className="mt-2 pt-2 border-t border-warm-border">
                  <div className="text-[10px] font-bold text-blue-600 mb-1">Your counter-offer: UGX {req.counterPrice?.toLocaleString()}/{req.unit}</div>
                  <p className="text-xs text-warm-muted italic">"{req.counterMessage}"</p>
                </div>
              )}
            </div>
            {req.status === "pending" && (
              <div className="flex gap-2">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-xs transition-all">
                  Accept
                </button>
                <button className="flex-1 bg-ink hover:bg-ink-mid text-white font-bold py-2 rounded-lg text-xs transition-all">
                  Counter-offer
                </button>
                <button className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium transition-all">
                  Decline
                </button>
              </div>
            )}
            {req.status === "countered" && (
              <div className="flex gap-2">
                <button className="flex-1 border border-warm-border text-warm-muted text-xs py-2 rounded-lg">Awaiting buyer response</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// ── Incoming Purchase Requests Component ─────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();

  const dashboards = {
    AGR: AGRDashboard,
    VAP: VAPDashboard,
    MFR: MFRDashboard,
    AGT: AGTDashboard,
    EXP: EXPDashboard,
    IMP: IMPDashboard,
    BYR: BYRDashboard,
    TRP: TRPDashboard,
    CSM: CSMDashboard,
    ADMIN: ADMINDashboard,
    GOU: GOUDashboard,
  };

  const RoleDashboard = dashboards[user?.role] || AGRDashboard;

  return (
    <DashboardLayout>
      <RoleDashboard user={user} />
    </DashboardLayout>
  );
}
