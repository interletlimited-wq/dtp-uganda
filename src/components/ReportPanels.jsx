import { Target, Info, TrendingUp, Download, Lightbulb, Table2 } from "lucide-react";
import { exportReport } from "../utils/exportReport";

export const DOWNLOAD_FORMATS = ["csv", "xlsx", "pdf"];

// ── CSS-only horizontal bar chart (no chart library, per A6.1) ──────────────
export function BarChart({ chart }) {
  if (!chart || !chart.items?.length) return null;
  const max = Math.max(...chart.items.map((i) => i.value || 0), 1);
  return (
    <div className="mt-4">
      <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted mb-3">{chart.title}</div>
      <div className="space-y-2.5">
        {chart.items.map((it, idx) => (
          <div key={`${it.label}-${idx}`} className="flex items-center gap-3">
            <div className="w-28 md:w-44 text-xs text-ink truncate flex-shrink-0" title={it.label}>{it.label}</div>
            <div className="flex-1 h-5 bg-warm-bg rounded-md overflow-hidden">
              <div className="h-full bg-gold rounded-md transition-all" style={{ width: `${Math.max((it.value / max) * 100, 2)}%` }} />
            </div>
            <div className="w-24 text-right text-xs font-semibold text-ink flex-shrink-0">{it.display}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatTile({ stat }) {
  return (
    <div className="bg-warm-bg border border-warm-border rounded-lg p-3">
      <div className="text-lg font-bold text-ink leading-tight">{stat.value}</div>
      <div className="text-[11px] text-warm-text font-medium mt-0.5">{stat.label}</div>
      {stat.sub && <div className="text-[10px] text-warm-muted mt-0.5">{stat.sub}</div>}
    </div>
  );
}

export function DetailTable({ detail, full = false }) {
  if (!detail?.rows?.length) return null;
  const rows = full ? detail.rows : detail.rows.slice(0, 8);
  const extra = detail.rows.length - rows.length;
  return (
    <>
      <div className="overflow-x-auto border border-warm-border rounded-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-warm-bg">
              {detail.columns.map((c) => (
                <th key={c} className="text-left font-semibold text-warm-text px-2.5 py-2 whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-warm-border">
                {r.map((c, ci) => (
                  <td key={ci} className="px-2.5 py-1.5 text-ink whitespace-nowrap">{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {extra > 0 && (
        <p className="text-[10px] text-warm-muted mt-1.5">
          Showing {rows.length} of {detail.rows.length} entries · download for the full set.
        </p>
      )}
    </>
  );
}

// Full hybrid report panel: stats + visualisation + insights + detailed entries + downloads.
export function ReportCard({ report, meta, fullDetail = false }) {
  return (
    <div className="bg-white border border-warm-border rounded-xl p-5">
      <h3 className="font-bold text-ink text-base leading-tight">{report.title}</h3>
      {report.description && (
        <p className="text-xs text-warm-text leading-relaxed mt-1.5">{report.description}</p>
      )}
      {report.alignment && (
        <div className="flex items-start gap-1.5 mt-1.5 mb-4">
          <Target size={12} className="text-gold-dark mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-gold-dark font-semibold leading-snug">{report.alignment}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {report.stats.map((s, i) => <StatTile key={i} stat={s} />)}
      </div>

      <BarChart chart={report.bars} />

      {report.insights?.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warm-muted mb-2">
            <Lightbulb size={12} className="text-gold-dark" /> Insights
          </div>
          <ul className="space-y-1">
            {report.insights.map((ins, i) => (
              <li key={i} className="text-xs text-warm-text leading-relaxed flex gap-1.5">
                <span className="text-gold-dark font-bold flex-shrink-0">›</span> {ins}
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.detail && (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warm-muted">
              <Table2 size={12} className="text-gold-dark" /> Detailed entries
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-warm-muted mr-0.5">Download:</span>
              {DOWNLOAD_FORMATS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => exportReport(report, fmt, meta)}
                  title={`Download deep report as ${fmt.toUpperCase()}`}
                  className="flex items-center gap-1 text-[10px] font-bold text-ink border border-warm-border hover:border-gold hover:bg-gold-light px-2 py-1 rounded-md transition-all">
                  <Download size={11} /> {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <DetailTable detail={report.detail} full={fullDetail} />
        </div>
      )}

      {report.note && (
        <p className="text-[11px] text-warm-muted italic mt-4 leading-relaxed flex items-start gap-1.5">
          <Info size={12} className="flex-shrink-0 mt-0.5" /> {report.note}
        </p>
      )}
    </div>
  );
}

export function AlignmentView({ view }) {
  return (
    <div className="bg-ink rounded-xl p-6 mb-6 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold opacity-[0.06] rounded-full" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} className="text-gold" />
          <h2 className="text-white font-bold text-lg">{view.title}</h2>
        </div>
        <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-3xl">{view.intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {view.mappings.map((m, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/10 rounded-lg p-4">
              <div className="text-[10px] uppercase tracking-wider text-gold font-bold mb-1.5">{m.ndpElement}</div>
              <div className="text-white/45 text-xs leading-snug mb-3">{m.feeds}</div>
              <div className="flex items-baseline justify-between border-t border-white/10 pt-2.5">
                <span className="text-white font-bold text-lg">{m.value}</span>
                <span className="text-white/40 text-[11px] text-right">{m.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
