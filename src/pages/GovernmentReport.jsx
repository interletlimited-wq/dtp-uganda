import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2, Landmark } from "lucide-react";
import GovShell from "../components/GovShell";
import { ReportCard } from "../components/ReportPanels";
import { useAuth } from "../context/AuthContext";
import { getGovernmentAnalytics } from "../data/governance";

export default function GovernmentReport() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Resolve the report and its institution. Analysts are scoped to their own
  // set; public/other users may open a report from either set.
  let report = null;
  let reportInst = null;
  if (data) {
    const sets =
      institution === "NPA" ? [["NPA", data.npa]]
      : institution === "MTIC" ? [["MTIC", data.mtic]]
      : [["NPA", data.npa], ["MTIC", data.mtic]];
    for (const [inst, set] of sets) {
      const found = set.reports.find((r) => r.id === reportId);
      if (found) { report = found; reportInst = inst; break; }
    }
  }

  const exportMeta = report ? { institution: reportInst, asOf: data.meta.asOf } : {};

  return (
    <GovShell>
      <button
        onClick={() => navigate(institution ? "/government-analytics" : "/government-analytics?tab=" + (reportInst || "npa").toLowerCase())}
        className="flex items-center gap-2 text-warm-muted hover:text-ink text-sm mb-5 transition-colors">
        <ArrowLeft size={15} /> All {reportInst || ""} reports
      </button>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-warm-muted">
          <Loader2 size={28} className="animate-spin mb-3" />
          <p className="text-sm">Loading report…</p>
        </div>
      )}

      {!loading && (error || (data && !report)) && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle size={28} className="mb-3 text-warm-muted" />
          <h2 className="font-bold text-ink mb-1">Report not available</h2>
          <p className="text-sm text-warm-muted mb-4">This report could not be found{institution ? ` in the ${institution} set` : ""}.</p>
          <button onClick={() => navigate("/government-analytics")} className="bg-gold text-ink font-bold px-5 py-2.5 rounded-lg text-sm">
            Back to reports
          </button>
        </div>
      )}

      {!loading && report && (
        <>
          <div className="flex items-center gap-2 text-gold-dark text-xs font-bold uppercase tracking-wider mb-4">
            <Landmark size={13} /> {reportInst} Report {report.priority ? `· ${report.priority} of 7` : ""}
          </div>

          <ReportCard report={report} meta={exportMeta} fullDetail />

          <p className="text-[11px] text-warm-muted mt-6 text-center">
            Data as of {data.meta.asOf} · Aggregated and anonymised for institutional viewing (spec A22 / A6.1)
          </p>
        </>
      )}
    </GovShell>
  );
}
