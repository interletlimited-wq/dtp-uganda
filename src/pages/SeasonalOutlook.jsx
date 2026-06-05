import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Sprout, Leaf, Info, ArrowRight } from "lucide-react";
import PublicNav from "../components/PublicNav";
import PublicFooter from "../components/PublicFooter";
import { getSeasonalOutlook, seasonalCommodities, MONTHS } from "../data/seasonal";

const GOLD = "#F7B90F";
const INK = "#292929";

function MiniCurve({ data }) {
  // data: [{ price, phase }]  - simple inline SVG line with phase shading
  const w = 640, h = 160, pad = 28;
  const prices = data.map(d => d.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  const span = max - min || 1;
  const x = i => pad + (i * (w - pad * 2)) / (data.length - 1);
  const y = p => h - pad - ((p - min) / span) * (h - pad * 2);
  const pts = data.map((d, i) => `${x(i)},${y(d.price)}`).join(" ");
  const now = new Date().getMonth();

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      {/* harvest / lean month shading */}
      {data.map((d, i) => {
        if (d.phase === "shoulder") return null;
        const cx = x(i);
        const half = (w - pad * 2) / (data.length - 1) / 2;
        return (
          <rect key={i} x={cx - half} y={pad - 10} width={half * 2} height={h - pad * 2 + 20}
            fill={d.phase === "lean" ? "rgba(247,185,15,0.14)" : "rgba(41,41,41,0.05)"} />
        );
      })}
      {/* current-month marker */}
      <line x1={x(now)} y1={pad - 10} x2={x(now)} y2={h - pad + 10} stroke={INK} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      {/* line */}
      <polyline points={pts} fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => (
        <circle key={i} cx={x(i)} cy={y(d.price)} r="3"
          fill={i === now ? INK : GOLD} />
      ))}
      {/* month labels */}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={h - 6} textAnchor="middle" fontSize="9" fill="rgba(41,41,41,0.45)">
          {MONTHS[i][0]}
        </text>
      ))}
    </svg>
  );
}

function DirectionBadge({ direction }) {
  const map = {
    rising:  { Icon: TrendingUp,   text: "Firming next quarter",  cls: "text-green-700 bg-green-50" },
    falling: { Icon: TrendingDown, text: "Softening next quarter", cls: "text-red-700 bg-red-50" },
    stable:  { Icon: Minus,        text: "Stable next quarter",    cls: "text-ink/70 bg-warm-bg" },
  };
  const { Icon, text, cls } = map[direction] || map.stable;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${cls}`}>
      <Icon size={13} /> {text}
    </span>
  );
}

export default function SeasonalOutlook() {
  const commodities = seasonalCommodities();
  const [selected, setSelected] = useState(commodities[0]?.name);
  const [outlook, setOutlook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getSeasonalOutlook(selected).then(res => {
      if (active) { setOutlook(res); setLoading(false); }
    });
    return () => { active = false; };
  }, [selected]);

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <PublicNav activeRoute="/seasonal-outlook" />

      {/* intro */}
      <section className="bg-ink py-14 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-gold text-[10px] font-bold tracking-[0.14em] uppercase mb-3 flex items-center gap-2">
            <Sprout size={13} /> Seasonal Outlook
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight max-w-2xl leading-tight">
            Seasonal Price Intelligence for Uganda's Agro-Industrial Value Chains
          </h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-2xl mt-3">
            When to procure, when to build buffer stock, and when the export window opens - outlooks
            built on Uganda's harvest seasonality, for processors, aggregators, and exporters.
          </p>
        </div>
      </section>

      {/* commodity selector */}
      <section className="px-5 md:px-10 -mt-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl border border-warm-border p-3 flex flex-wrap gap-2 shadow-sm">
            {commodities.map(c => (
              <button key={c.name} onClick={() => setSelected(c.name)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  selected === c.name ? "bg-ink text-white" : "text-ink/70 hover:bg-warm-bg"}`}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* body */}
      <section className="px-5 md:px-10 py-10 flex-1">
        <div className="max-w-6xl mx-auto">
          {loading || !outlook ? (
            <div className="text-warm-muted text-sm py-20 text-center">Loading seasonal outlook…</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* left - curve */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-warm-border p-6">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="text-gold text-[10px] font-bold uppercase tracking-wider">{outlook.valueChain}</div>
                    <h2 className="text-xl font-bold text-ink">{outlook.commodity}</h2>
                  </div>
                  <DirectionBadge direction={outlook.direction} />
                </div>
                <div className="text-ink text-2xl font-bold mt-2">
                  UGX {outlook.currentPrice.toLocaleString()}
                  <span className="text-warm-muted text-xs font-normal ml-1">/{outlook.unit} · latest</span>
                </div>

                <div className="mt-4">
                  <MiniCurve data={outlook.monthlyOutlook} />
                </div>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-warm-muted">
                  <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ background: "rgba(247,185,15,0.4)" }} /> Lean season (firm)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ background: "rgba(41,41,41,0.12)" }} /> Harvest (soft)</span>
                  <span className="flex items-center gap-1"><span className="w-3 border-t border-dashed border-ink/40" /> This month</span>
                </div>
              </div>

              {/* right - facts + recommendation */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl border border-warm-border p-4">
                    <div className="text-[10px] text-warm-muted uppercase tracking-wider mb-1">Peak window</div>
                    <div className="text-ink font-bold text-sm">{outlook.peakWindow}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-warm-border p-4">
                    <div className="text-[10px] text-warm-muted uppercase tracking-wider mb-1">Confidence</div>
                    <div className="text-ink font-bold text-sm">{outlook.confidence}%</div>
                  </div>
                  <div className="bg-white rounded-xl border border-warm-border p-4">
                    <div className="text-[10px] text-warm-muted uppercase tracking-wider mb-1">Harvest months</div>
                    <div className="text-ink font-semibold text-xs">{outlook.harvestMonths}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-warm-border p-4">
                    <div className="text-[10px] text-warm-muted uppercase tracking-wider mb-1">Lean months</div>
                    <div className="text-ink font-semibold text-xs">{outlook.leanWindow}</div>
                  </div>
                </div>

                <div className="bg-gold/15 border border-gold/40 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 text-ink text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Leaf size={12} /> Agro-industrial signal
                  </div>
                  <p className="text-ink/80 text-xs leading-relaxed">{outlook.recommendation}</p>
                </div>

                <div className="bg-white rounded-xl border border-warm-border p-4">
                  <p className="text-warm-muted text-[11px] leading-relaxed">{outlook.note}</p>
                </div>
              </div>
            </div>
          )}

          {/* methodology - always visible, honest */}
          {outlook && (
            <div className="mt-6 flex items-start gap-2 text-warm-muted text-[11px] leading-relaxed max-w-3xl">
              <Info size={13} className="flex-shrink-0 mt-0.5" />
              <span>{outlook.methodology}</span>
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
