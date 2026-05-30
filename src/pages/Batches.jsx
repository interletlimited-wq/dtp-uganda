import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ArrowLeft, Plus, Eye, Shield, Check, X, Package,
  ChevronDown, ChevronUp, Search, FileText, Link2,
  AlertCircle, CheckCircle, Clock, Truck, BarChart2
} from "lucide-react";
import { BATCHES, EUDR_DOCUMENTS, getActorBatchesFallback, formatUGX } from "../data/demo";

const STATUS_STYLES = {
  completed:    "bg-green-50 text-green-700 border-green-200",
  in_transit:   "bg-blue-50 text-blue-700 border-blue-200",
  forming:      "bg-amber-50 text-amber-700 border-amber-200",
  pending:      "bg-warm-bg text-warm-muted border-warm-border",
};

const EUDR_STYLES = {
  full:    { label: "Fully traceable",        style: "bg-green-50 text-green-700 border-green-200",  icon: CheckCircle },
  partial: { label: "Partially traceable",    style: "bg-amber-50 text-amber-700 border-amber-200",  icon: AlertCircle },
  none:    { label: "Not EUDR eligible",       style: "bg-red-50 text-red-600 border-red-200",        icon: X },
};

function TraceabilityBadge({ status }) {
  const s = EUDR_STYLES[status] || EUDR_STYLES.none;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.style}`}>
      <Icon size={9} /> {s.label}
    </span>
  );
}

function BatchCard({ batch, eudrDocs, role, expanded, onToggle }) {
  const eudrDoc = eudrDocs.find(d => d.batchId === batch.id);
  const convRatio = batch.conversionRatio || "—";
  const isExport = batch.type === "export";

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all ${expanded ? "border-gold/30 shadow-sm" : "border-warm-border"}`}>
      {/* Header */}
      <div className="p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono font-bold text-ink text-sm">{batch.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[batch.status] || STATUS_STYLES.pending}`}>
                {batch.status?.replace("_", " ")}
              </span>
              {batch.eudrEligible && <TraceabilityBadge status={batch.traceability === "full" ? "full" : "partial"} />}
            </div>
            <div className="text-sm text-warm-muted">
              {isExport ? `${batch.inputProduct} → ${batch.destination}` : `${batch.inputProduct} → ${batch.outputProduct}`}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-sm font-bold text-ink">{batch.inputQuantity?.toLocaleString()} {batch.inputUnit}</div>
              {!isExport && <div className="text-xs text-warm-muted">→ {batch.outputQuantity?.toLocaleString()} {batch.outputUnit} output</div>}
              {isExport && <div className="text-xs text-warm-muted">{batch.buyer}</div>}
            </div>
            {expanded ? <ChevronUp size={16} className="text-warm-muted" /> : <ChevronDown size={16} className="text-warm-muted" />}
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          <div><div className="text-warm-muted mb-0.5">Type</div><div className="font-semibold text-ink capitalize">{batch.type}</div></div>
          <div><div className="text-warm-muted mb-0.5">Date</div><div className="font-semibold text-ink">{batch.processDate || batch.shipDate}</div></div>
          {!isExport && <div><div className="text-warm-muted mb-0.5">Ratio</div><div className="font-semibold text-ink">{convRatio}</div></div>}
          {!isExport && <div><div className="text-warm-muted mb-0.5">Facility</div><div className="font-semibold text-ink truncate">{batch.facility}</div></div>}
          {isExport && <div><div className="text-warm-muted mb-0.5">Container</div><div className="font-semibold text-ink truncate">{batch.containerRef}</div></div>}
          {isExport && <div><div className="text-warm-muted mb-0.5">Port</div><div className="font-semibold text-ink">{batch.portOfExit}</div></div>}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-warm-border p-5 space-y-4">

          {/* Processing detail */}
          {!isExport && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-warm-bg rounded-xl p-3 text-center">
                <div className="text-xs text-warm-muted mb-1">Input</div>
                <div className="font-bold text-ink text-lg">{(batch.inputQuantity / 1000).toFixed(1)}T</div>
                <div className="text-xs text-warm-muted">{batch.inputProduct?.split(" - ")[1] || batch.inputProduct}</div>
              </div>
              <div className="bg-warm-bg rounded-xl p-3 text-center flex items-center justify-center">
                <div>
                  <div className="text-xs text-warm-muted mb-1">Conversion</div>
                  <div className="font-bold text-gold text-lg">{convRatio}</div>
                </div>
              </div>
              <div className="bg-warm-bg rounded-xl p-3 text-center">
                <div className="text-xs text-warm-muted mb-1">Output</div>
                <div className="font-bold text-green-600 text-lg">{(batch.outputQuantity / 1000).toFixed(1)}T</div>
                <div className="text-xs text-warm-muted">{batch.outputProduct?.split(" - ")[1] || batch.outputProduct}</div>
              </div>
            </div>
          )}

          {/* Export detail */}
          {isExport && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ["Destination", batch.destination],
                ["Buyer", batch.buyer],
                ["Shipping line", batch.shippingLine],
                ["Container ref", batch.containerRef],
                ["Port of exit", batch.portOfExit],
                ["ETA destination", batch.etaDestination],
              ].filter(([, v]) => v).map(([l, v]) => (
                <div key={l} className="bg-warm-bg rounded-lg p-3">
                  <div className="text-xs text-warm-muted mb-0.5">{l}</div>
                  <div className="text-sm font-semibold text-ink">{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Source farmers / actors */}
          {batch.sourceActors && (
            <div>
              <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-2">
                Source actors ({batch.sourceActors.length} — {batch.traceability === "full" ? "all verified" : "partially verified"})
              </div>
              <div className="flex flex-wrap gap-2">
                {batch.sourceActors.map(id => (
                  <span key={id} className="inline-flex items-center gap-1 text-xs font-mono bg-warm-bg border border-warm-border text-ink px-2 py-1 rounded-lg">
                    <Shield size={10} className="text-gold" /> {id}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* EUDR document */}
          {eudrDoc && (
            <div className="border border-warm-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-warm-bg border-b border-warm-border">
                <FileText size={14} className="text-gold" />
                <span className="font-bold text-ink text-sm">EUDR Document</span>
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${eudrDoc.status === "approved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                  {eudrDoc.status}
                </span>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div><div className="text-warm-muted mb-0.5">DTP Reference</div><div className="font-mono font-semibold text-ink">{eudrDoc.id}</div></div>
                <div><div className="text-warm-muted mb-0.5">EU Reference</div><div className="font-mono font-semibold text-ink">{eudrDoc.euRefNumber}</div></div>
                <div><div className="text-warm-muted mb-0.5">Compliance score</div><div className="font-bold text-green-600 text-base">{eudrDoc.complianceScore}%</div></div>
                <div><div className="text-warm-muted mb-0.5">Verified farmers</div><div className="font-semibold text-ink">{eudrDoc.verifiedFarmers}/{eudrDoc.totalFarmers}</div></div>
                <div><div className="text-warm-muted mb-0.5">Deforestation free</div><div className="font-semibold text-green-600">{eudrDoc.deforestationFree ? "Yes - confirmed" : "Pending"}</div></div>
                <div><div className="text-warm-muted mb-0.5">Risk level</div><div className="font-semibold text-ink capitalize">{eudrDoc.riskLevel}</div></div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <button className="flex items-center gap-1.5 bg-ink text-white font-bold px-4 py-2 rounded-lg text-xs transition-all hover:bg-ink-mid">
                  <FileText size={12} /> Download PDF
                </button>
                <button className="flex items-center gap-1.5 border border-warm-border text-ink font-semibold px-4 py-2 rounded-lg text-xs hover:bg-warm-bg transition-all">
                  <Link2 size={12} /> Chain of custody
                </button>
              </div>
            </div>
          )}

          {!eudrDoc && batch.eudrEligible && (
            <button className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-xl text-sm transition-all">
              <FileText size={15} /> Generate EUDR Document
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function BatchesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const batches = getActorBatchesFallback(user?.username, user?.role);
  const eudrDocs = EUDR_DOCUMENTS;
  const isEXP = user?.role === "EXP";

  const filtered = batches.filter(b => {
    const matchFilter = filter === "all" || b.status === filter ||
      (filter === "eudr" && b.eudrEligible) ||
      (filter === "export" && b.type === "export") ||
      (filter === "processing" && b.type === "processing");
    const matchSearch = !search || b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.inputProduct?.toLowerCase().includes(search.toLowerCase()) ||
      b.outputProduct?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const eudrReady = batches.filter(b => b.eudrEligible && b.traceability === "full").length;
  const completed = batches.filter(b => b.status === "completed").length;
  const inTransit = batches.filter(b => b.status === "in_transit").length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-2">
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">
              {isEXP ? "Export Batch Inventory" : "Processing Batches"}
            </h1>
            <p className="text-sm text-warm-muted">
              {batches.length} batches · {eudrReady} EUDR-ready · {completed} completed
            </p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold px-4 py-2.5 rounded-lg text-sm transition-all">
            <Plus size={15} /> New batch
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["Total batches", batches.length, "text-ink"],
          ["EUDR eligible", eudrReady, "text-green-600"],
          [isEXP ? "In transit" : "Completed", isEXP ? inTransit : completed, "text-gold"],
        ].map(([l, v, cls]) => (
          <div key={l} className="bg-white border border-warm-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${cls}`}>{v}</div>
            <div className="text-xs text-warm-muted mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold"
            placeholder="Search by batch ID or product..." />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            ["all", "All"],
            ["eudr", "EUDR eligible"],
            ["completed", "Completed"],
            ...(isEXP ? [["export", "Export"], ["in_transit", "In transit"]] : [["processing", "Processing"]]),
          ].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${filter === key ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border hover:border-ink"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Batch list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(b => (
            <BatchCard
              key={b.id}
              batch={b}
              eudrDocs={eudrDocs}
              role={user?.role}
              expanded={expanded === b.id}
              onToggle={() => setExpanded(expanded === b.id ? null : b.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
          <Package size={28} className="text-warm-muted mx-auto mb-3" />
          <p className="font-semibold text-ink mb-1">No batches found</p>
          <p className="text-sm text-warm-muted mb-4">
            {isEXP ? "Create export batches from your purchased inventory" : "Record processing batches from your input purchases"}
          </p>
          <button onClick={() => setShowForm(true)} className="bg-gold text-ink font-bold px-5 py-2.5 rounded-lg text-sm">
            Create first batch
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
