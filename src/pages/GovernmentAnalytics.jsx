import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Landmark, Building2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import GovShell from "../components/GovShell";
import { AlignmentView } from "../components/ReportPanels";
import { useAuth } from "../context/AuthContext";
import { getGovernmentAnalytics } from "../data/governance";

const TABS = [
  { id: "npa", label: "NPA / Planning", icon: Landmark },
  { id: "mtic", label: "MTIC / Trade & Industry", icon: Building2 },
];

// One navigable entry per report - opens that report's own page.
function ReportLinkCard({ report, index, onOpen }) {
  const top = report.stats?.[0];
  return (
    <button
      onClick={onOpen}
      className="text-left bg-white border border-warm-border rounded-xl p-5 hover:border-gold hover:shadow-sm transition-all group flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-md bg-ink text-gold text-xs font-bold flex items-center justify-center flex-shrink-0">
          {report.priority || index + 1}
        </span>
        <h3 className="font-bold text-ink text-sm leading-tight">{report.title}</h3>
      </div>
      {report.description && (
        <p className="text-xs text-warm-text leading-relaxed mb-3">{report.description}</p>
      )}
      {top && (
        <div className="mt-auto">
          <span className="text-xl font-bold text-ink">{top.value}</span>{" "}
          <span className="text-[11px] text-warm-muted">{top.label}</span>
        </div>
      )}
      <span className="text-gold text-xs font-semibold flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
        Open report <ArrowRight size={12} />
      </span>
    </button>
  );
}

export default function GovernmentAnalytics() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialTab = new URLSearchParams(location.search).get("tab") === "mtic" ? "mtic" : "npa";
  const [tab, setTab] = useState(initialTab);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getGovernmentAnalytics()
      .then((d) => { if (active) { setData(d); setLoading(false); } })
      .catch(() => { if (active) { setError(true); setLoading(false); } });
    return () => { active = false; };
  }, []);

  const institution = user?.institution; // "NPA" | "MTIC" | undefined
  const scoped = institution === "NPA" || institution === "MTIC";
  const activeKey = scoped ? institution.toLowerCase() : tab;
  const activeInst = activeKey === "mtic" ? "MTIC" : "NPA";
  const activeSet = data ? (activeKey === "mtic" ? data.mtic : data.npa) : null;
  const openReport = (id) => navigate(`/government-analytics/${id}`);

  return (
    <GovShell>
      {/* Hero */}
      <div className="bg-ink rounded-xl p-6 md:p-8 mb-4 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold opacity-[0.05] rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-2">
            <Landmark size={14} /> {scoped ? `${activeInst} Reports` : "Government Planning & Trade Reports"}
          </div>
          <h1 className="text-white font-bold text-2xl md:text-3xl mb-2">
            {scoped && activeSet ? activeSet.label : "Government Planning & Trade Analytics"}
          </h1>
          <p className="text-white/50 text-sm max-w-3xl leading-relaxed">
            {scoped
              ? "Your institutional report set. Each report is an independent page with its own stats, insights, detailed entries and CSV / Excel / PDF download. Select a report below or from the Reports menu."
              : "Institution-facing reports for the National Planning Authority (NPA), framed against NDP IV, and the Ministry of Trade, Industry and Cooperatives (MTIC). Computed from recorded platform activity, aggregated and anonymised."}
          </p>
        </div>
      </div>

      {/* Tabs - only for public (logged-out) view; analysts are scoped to their set */}
      {!scoped && (
        <div className="border-b border-warm-border mb-6 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                tab === t.id ? "border-gold text-ink" : "border-transparent text-warm-muted hover:text-ink"
              }`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-warm-muted">
          <Loader2 size={28} className="animate-spin mb-3" />
          <p className="text-sm">Computing government analytics…</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-warm-muted">
          <AlertCircle size={28} className="mb-3 text-red-400" />
          <p className="text-sm">Unable to load analytics. Please try again.</p>
        </div>
      )}

      {!loading && !error && data && activeSet && (
        <>
          {activeKey === "npa" && <AlignmentView view={data.npa.alignmentView} />}

          <h2 className="font-bold text-sm uppercase tracking-wider text-warm-muted mb-3">
            {activeInst} Report Set{" "}
            <span className="text-warm-muted/70 font-normal normal-case">· {activeSet.reports.length} independent reports - open each for detail &amp; downloads</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...activeSet.reports]
              .sort((a, b) => (a.priority || 99) - (b.priority || 99))
              .map((r, i) => <ReportLinkCard key={r.id} report={r} index={i} onOpen={() => openReport(r.id)} />)}
          </div>

          <p className="text-[11px] text-warm-muted mt-6 text-center">
            Data as of {data.meta.asOf} · Aggregated and anonymised for institutional viewing (spec A22 / A6.1)
          </p>
        </>
      )}
    </GovShell>
  );
}
