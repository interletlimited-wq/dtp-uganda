import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  TrendingUp, TrendingDown, ArrowLeft, Download,
  Filter, Search, ChevronDown, CheckCircle,
  Clock, Truck, AlertCircle, Eye
} from "lucide-react";
import {
  getActorTransactionsFallback, formatUGX, MARKET_PRICES
} from "../data/demo";

const STATUS_STYLES = {
  completed: "bg-green-50 text-green-700 border-green-200",
  pending_payment: "bg-amber-50 text-amber-700 border-amber-200",
  in_transit: "bg-blue-50 text-blue-700 border-blue-200",
  customs_clearance: "bg-purple-50 text-purple-700 border-purple-200",
  disputed: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_ICONS = {
  completed: CheckCircle,
  pending_payment: Clock,
  in_transit: Truck,
  customs_clearance: Clock,
  disputed: AlertCircle,
};

function SummaryCard({ label, value, sub, color = "bg-warm-bg", textColor = "text-ink" }) {
  return (
    <div className={`${color} border border-warm-border rounded-xl p-5`}>
      <div className={`text-2xl font-bold ${textColor} tracking-tight`}>{value}</div>
      <div className="text-xs font-semibold text-warm-text mt-1">{label}</div>
      {sub && <div className="text-xs text-warm-muted mt-0.5">{sub}</div>}
    </div>
  );
}

export default function Ledger() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const allTxns = getActorTransactionsFallback(user?.username, user?.role);

  const filtered = allTxns.filter(t => {
    const matchSearch = !search ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()) ||
      (t.buyerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.sellerName || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const completed = allTxns.filter(t => t.status === "completed");
  const totalIn = completed
    .filter(t => t.seller === user?.username)
    .reduce((s, t) => s + t.total, 0);
  const totalOut = completed
    .filter(t => t.buyer === user?.username)
    .reduce((s, t) => s + t.total, 0);
  const totalVolume = completed.reduce((s, t) => s + t.quantity, 0);

  const isSeller = (t) => t.seller === user?.username;
  const isTransporter = (t) => t.transporter === user?.username;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors">
          <ArrowLeft size={15} /> Dashboard
        </button>
        <span className="text-warm-border">/</span>
        <span className="text-sm font-semibold text-ink">
          {user?.role === "TRP" ? "Job Ledger" :
           user?.role === "BYR" || user?.role === "CSM" ? "Purchase Ledger" :
           user?.role === "IMP" ? "Import Records" : "Transaction History"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          label="Total received"
          value={formatUGX(totalIn)}
          sub={`${completed.filter(t => t.seller === user?.username).length} sales`}
          color="bg-green-50"
          textColor="text-green-700"
        />
        <SummaryCard
          label="Total paid out"
          value={formatUGX(totalOut)}
          sub={`${completed.filter(t => t.buyer === user?.username).length} purchases`}
          color="bg-blue-50"
          textColor="text-blue-700"
        />
        <SummaryCard
          label="Total transactions"
          value={allTxns.length}
          sub={`${completed.length} completed`}
        />
        <SummaryCard
          label="Total volume"
          value={totalVolume >= 1000 ? `${(totalVolume/1000).toFixed(1)}T` : `${totalVolume} kg`}
          sub="All commodities"
        />
      </div>

      <div className="bg-white border border-warm-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-warm-border flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by reference, product, or counterparty..."
              className="w-full pl-9 pr-4 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "completed", "pending_payment", "in_transit"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === s
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-warm-text border-warm-border hover:border-ink"
                }`}>
                {s === "all" ? "All" :
                 s === "pending_payment" ? "Pending" :
                 s === "in_transit" ? "In transit" : "Completed"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-warm-border rounded-lg text-sm text-warm-text hover:text-ink hover:border-ink transition-all flex-shrink-0">
            <Download size={14} /> Export
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-warm-muted">
            <div className="text-4xl mb-3">📋</div>
            <div className="font-medium text-ink mb-1">No transactions found</div>
            <div className="text-sm">Try adjusting your search or filters</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-bg">
                <tr>
                  {["Reference", "Date", "Counterparty", "Product", "Volume", "Unit price", "Total", "Method", "Status", ""].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-warm-text uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const selling = isSeller(t);
                  const transporting = isTransporter(t);
                  const StatusIcon = STATUS_ICONS[t.status] || CheckCircle;
                  const counterparty = transporting
                    ? t.sellerName
                    : selling ? t.buyerName : t.sellerName;
                  const counterRole = transporting
                    ? t.sellerRole
                    : selling ? t.buyerRole : t.sellerRole;

                  return (
                    <>
                      <tr key={t.id}
                        className="border-t border-warm-border hover:bg-warm-bg/50 transition-colors cursor-pointer"
                        onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                        <td className="px-4 py-3">
                          <div className="font-mono text-xs font-semibold text-ink">{t.id}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-warm-text whitespace-nowrap">{t.date}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-ink whitespace-nowrap">{counterparty}</div>
                          <div className="text-xs text-warm-muted">{counterRole}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-ink">{t.product}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-ink whitespace-nowrap">
                            {t.quantity.toLocaleString()} {t.unit}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-ink whitespace-nowrap">
                            UGX {t.pricePerUnit?.toLocaleString()}/{t.unit}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`text-sm font-bold whitespace-nowrap ${
                            selling || transporting ? "text-green-600" : "text-red-500"
                          }`}>
                            {selling || transporting ? "+" : "-"}{formatUGX(t.total)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-warm-text whitespace-nowrap">{t.paymentMethod}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${STATUS_STYLES[t.status] || STATUS_STYLES.completed}`}>
                            <StatusIcon size={10} />
                            {t.status.replace(/_/g, " ")}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-warm-muted hover:text-ink transition-colors">
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                      {expanded === t.id && (
                        <tr key={`${t.id}-detail`} className="bg-warm-bg/50">
                          <td colSpan={10} className="px-6 py-4">
                            <div className="grid md:grid-cols-4 gap-4 text-xs">
                              <div>
                                <div className="text-warm-muted uppercase tracking-wider font-semibold mb-2">Transaction details</div>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-warm-text">Reference</span><span className="font-mono font-semibold text-ink">{t.id}</span></div>
                                  <div className="flex justify-between"><span className="text-warm-text">Date</span><span className="text-ink">{t.date}</span></div>
                                  <div className="flex justify-between"><span className="text-warm-text">District</span><span className="text-ink">{t.district}</span></div>
                                </div>
                              </div>
                              <div>
                                <div className="text-warm-muted uppercase tracking-wider font-semibold mb-2">Seller</div>
                                <div className="space-y-1">
                                  <div className="text-ink font-medium">{t.sellerName}</div>
                                  <div className="font-mono text-warm-muted">{t.sellerTradeId}</div>
                                  <div className="text-warm-text">{t.sellerRole}</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-warm-muted uppercase tracking-wider font-semibold mb-2">Buyer</div>
                                <div className="space-y-1">
                                  <div className="text-ink font-medium">{t.buyerName}</div>
                                  <div className="font-mono text-warm-muted">{t.buyerTradeId}</div>
                                  <div className="text-warm-text">{t.buyerRole}</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-warm-muted uppercase tracking-wider font-semibold mb-2">Payment</div>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-warm-text">Method</span><span className="text-ink">{t.paymentMethod}</span></div>
                                  <div className="flex justify-between"><span className="text-warm-text">Reference</span><span className="font-mono text-ink">{t.reference}</span></div>
                                  <div className="flex justify-between"><span className="text-warm-text">Total</span><span className="font-bold text-ink">{formatUGX(t.total)}</span></div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
              <tfoot className="bg-warm-bg border-t-2 border-warm-border">
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-xs font-semibold text-warm-text uppercase tracking-wider">
                    {filtered.length} transactions shown
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-green-600">
                      +{formatUGX(filtered.filter(t => t.seller === user?.username && t.status === "completed").reduce((s,t) => s+t.total, 0))}
                    </div>
                    <div className="text-xs text-warm-muted">received</div>
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
