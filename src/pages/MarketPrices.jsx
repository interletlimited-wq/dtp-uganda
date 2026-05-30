import { useState, useEffect, useRef } from "react";
import PublicNav from "../components/PublicNav";
import PublicFooter from "../components/PublicFooter";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, TrendingDown, Search, RefreshCw, MapPin, Clock,
  Star, ChevronLeft, ChevronRight, X, BarChart3, Zap,
  ArrowUpRight, ArrowDownRight, Minus, Eye, Filter,
  BookmarkPlus, Bookmark, Info, Activity
} from "lucide-react";
import { MARKET_PRICES, PRICE_HISTORY } from "../data/demo";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

const PERIODS = [
  { key: "week", label: "7D" },
  { key: "month", label: "30D" },
  { key: "sixmonth", label: "6M" },
  { key: "quarter", label: "3M" },
  { key: "year", label: "1Y" },
];

const COMMODITY_CATEGORIES = {
  "Coffee (Arabica)": "Cash Crops", "Coffee (Robusta)": "Cash Crops",
  "Vanilla": "Cash Crops", "Cocoa": "Cash Crops", "Tea": "Cash Crops",
  "Cotton (Lint)": "Cash Crops", "Simsim / Sesame": "Cash Crops", "Sugarcane": "Cash Crops",
  "Maize": "Food Crops", "Beans (Common)": "Food Crops", "Groundnuts": "Food Crops",
  "Rice (Milled)": "Food Crops", "Sweet Potatoes": "Food Crops", "Cassava": "Food Crops",
  "Sunflower": "Food Crops", "Plantain / Matoke": "Food Crops",
  "Tomatoes": "Food Crops", "Onions": "Food Crops",
  "Cattle (Beef)": "Livestock", "Milk (Raw)": "Livestock",
  "Nile Perch (Fresh)": "Fish", "Tilapia (Fresh)": "Fish", "Fish (Dried)": "Fish",
  "Honey (Raw)": "Processed", "Sugar (Refined)": "Processed", "Salt (Iodised)": "Processed",
  "Sunflower Oil": "Processed", "Bran (Wheat)": "Processed", "Maize Flour": "Processed",
  "Wheat Flour": "Processed", "Palm Oil (Crude)": "Processed",
  "Steel Roofing Sheets": "Manufacturing", "Cement (Portland)": "Manufacturing",
  "Timber (Hardwood)": "Manufacturing", "Charcoal": "Manufacturing",
  "Hides and Skins": "Manufacturing", "Sorghum": "Food Crops", "Millet (Finger)": "Food Crops",
  "Cocoa (Fermented)": "Cash Crops", "Nile Perch (Fillet)": "Fish",
};

const CATEGORY_COLORS = {
  "Cash Crops":    { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400" },
  "Food Crops":    { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  "Livestock":     { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  "Fish":          { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"  },
  "Processed":     { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500"},
  "Manufacturing": { bg: "bg-slate-50",  text: "text-slate-700",  dot: "bg-slate-400" },
};

function fmtK(n) {
  if (!n && n !== 0) return "—";
  if (n >= 1000000) return (n/1000000).toFixed(1) + "M";
  if (n >= 1000)    return (n/1000).toFixed(0) + "K";
  return n.toLocaleString();
}

// ── Sparkline SVG ─────────────────────────────────────────────
function Sparkline({ data = [], color = "#F7B90F", height = 36, width = 100 }) {
  if (!data || data.length < 2) return <div style={{ width, height }} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const fill = `${pts.join(" L ")} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`M ${fill}`} fill={`url(#g${color.replace("#","")})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle cx={pts[pts.length-1].split(",")[0]} cy={pts[pts.length-1].split(",")[1]} r="2.5" fill={color} />
    </svg>
  );
}

// ── Full chart ────────────────────────────────────────────────
function PriceChart({ data = [], commodity, period, unit }) {
  const [hovered, setHovered] = useState(null);
  const svgRef = useRef(null);
  const W = 600, H = 180;
  if (!data || data.length < 2) return <div className="h-44 flex items-center justify-center text-warm-muted text-sm">No history data</div>;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = { t: 16, r: 8, b: 28, l: 56 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * cw,
    y: pad.t + ch - ((v - min) / range) * ch,
    v,
  }));

  const linePath = "M " + pts.map(p => `${p.x},${p.y}`).join(" L ");
  const areaPath = linePath + ` L ${pts[pts.length-1].x},${pad.t+ch} L ${pts[0].x},${pad.t+ch} Z`;

  // Y axis labels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => ({
    y: pad.t + ch - r * ch,
    v: Math.round(min + r * range),
  }));

  // X axis labels
  const xCount = Math.min(6, data.length);
  const xStep = Math.floor((data.length - 1) / (xCount - 1));
  const xLabels = Array.from({ length: xCount }, (_, i) => {
    const idx = i * xStep;
    return { x: pad.l + (idx / (data.length - 1)) * cw, label: `D${idx + 1}` };
  });

  const trend = data[data.length-1] - data[0];
  const trendPct = ((trend / data[0]) * 100).toFixed(1);
  const trendColor = trend >= 0 ? "#22C55E" : "#EF4444";

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 180 }}
        onMouseMove={e => {
          const rect = svgRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width * W;
          const idx = Math.round(((x - pad.l) / cw) * (data.length - 1));
          if (idx >= 0 && idx < pts.length) setHovered(idx);
        }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7B90F" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F7B90F" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} y1={t.y} x2={W-pad.r} y2={t.y} stroke="#E4E2DA" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x={pad.l - 6} y={t.y + 4} textAnchor="end" fontSize="9" fill="#8A8A99">{fmtK(t.v)}</text>
          </g>
        ))}
        {/* X labels */}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={H - 8} textAnchor="middle" fontSize="9" fill="#8A8A99">{l.label}</text>
        ))}
        {/* Area */}
        <path d={areaPath} fill="url(#chartGrad)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="#F7B90F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Hover */}
        {hovered !== null && pts[hovered] && (
          <>
            <line x1={pts[hovered].x} y1={pad.t} x2={pts[hovered].x} y2={pad.t+ch} stroke="#F7B90F" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
            <circle cx={pts[hovered].x} cy={pts[hovered].y} r="4" fill="#F7B90F" stroke="white" strokeWidth="2" />
          </>
        )}
      </svg>
      {/* Hover tooltip */}
      {hovered !== null && pts[hovered] && (
        <div className="absolute top-2 left-14 bg-ink text-white text-xs px-2.5 py-1.5 rounded-lg pointer-events-none">
          <span className="font-bold">UGX {pts[hovered].v.toLocaleString()}</span>
          <span className="text-white/50 ml-1">/{unit}</span>
        </div>
      )}
      {/* Period trend badge */}
      <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
        {trend >= 0 ? "+" : ""}{trendPct}% this period
      </div>
    </div>
  );
}

// ── Insight chip ──────────────────────────────────────────────
function InsightChip({ commodity, trend, price, unit }) {
  const up = trend > 0;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${up ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      {up ? <ArrowUpRight size={13} className="text-green-600 flex-shrink-0" /> : <ArrowDownRight size={13} className="text-red-500 flex-shrink-0" />}
      <div>
        <div className="text-xs font-bold text-ink">{commodity}</div>
        <div className={`text-[10px] font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
          {up ? "+" : ""}{trend.toFixed(1)}% · UGX {fmtK(price)}/{unit}
        </div>
      </div>
    </div>
  );
}

// ── Price Card ────────────────────────────────────────────────
function PriceCard({ item, saved, onToggleSave, onClick, isSelected }) {
  const history = PRICE_HISTORY[item.commodity];
  const weekData = history?.week || [];
  const cat = COMMODITY_CATEGORIES[item.commodity] || "Other";
  const catStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Cash Crops"];
  const up = item.trend > 0;
  const trendColor = up ? "#22C55E" : item.trend < 0 ? "#EF4444" : "#8A8A99";

  return (
    <div
      onClick={onClick}
      className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group ${isSelected ? "border-gold shadow-md" : "border-warm-border hover:border-gold/50"}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink text-sm truncate">{item.commodity}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${catStyle.bg} ${catStyle.text}`}>{cat}</span>
            <span className="text-[10px] text-warm-muted flex items-center gap-0.5"><MapPin size={9} />{item.region}</span>
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); onToggleSave(item.commodity); }}
          className={`p-1 rounded-lg transition-all flex-shrink-0 ${saved ? "text-gold" : "text-warm-border hover:text-gold"}`}>
          {saved ? <Bookmark size={13} fill="currentColor" /> : <BookmarkPlus size={13} />}
        </button>
      </div>

      {/* Sparkline */}
      <div className="my-2">
        <Sparkline data={weekData} color={trendColor} height={32} width={120} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-bold text-ink leading-none">UGX {fmtK(item.sell)}</div>
          <div className="text-[10px] text-warm-muted mt-0.5">/{item.unit} · sell</div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${up ? "text-green-600" : item.trend < 0 ? "text-red-500" : "text-warm-muted"}`}>
          {up ? <ArrowUpRight size={14} /> : item.trend < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />}
          {Math.abs(item.trend).toFixed(1)}%
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-warm-border text-[10px] text-warm-muted">
        <span>Buy: UGX {fmtK(item.buy)}</span>
        <span className="flex items-center gap-1"><Clock size={9} />{item.updated}</span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function MarketPrices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState(MARKET_PRICES[0]);
  const [period, setPeriod] = useState("month");
  const [savedItems, setSavedItems] = useState(["Coffee (Arabica)", "Vanilla"]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const categories = ["All", ...Array.from(new Set(Object.values(COMMODITY_CATEGORIES)))];
  const regions = ["All", "Central", "Eastern", "Western", "Northern"];

  // Filter
  const filtered = MARKET_PRICES.filter(p => {
    const cat = COMMODITY_CATEGORIES[p.commodity] || "Other";
    const matchSearch = !search || p.commodity.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || cat === category;
    const matchRegion = region === "All" || p.region === region;
    const matchSaved = !showSavedOnly || savedItems.includes(p.commodity);
    return matchSearch && matchCat && matchRegion && matchSaved;
  });

  // Top movers
  const topGainers = [...MARKET_PRICES].sort((a, b) => b.trend - a.trend).slice(0, 4);
  const topLosers  = [...MARKET_PRICES].sort((a, b) => a.trend - b.trend).slice(0, 4);

  const selectedHistory = PRICE_HISTORY[selected?.commodity];
  const chartData = selectedHistory?.[period] || selectedHistory?.month || [];

  function toggleSave(commodity) {
    setSavedItems(prev => prev.includes(commodity) ? prev.filter(x => x !== commodity) : [...prev, commodity]);
  }

  const content = (
    <div className="max-w-7xl mx-auto">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Market Prices</h1>
          <p className="text-sm text-warm-muted">Live commodity prices from verified sources across Uganda</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-warm-muted flex items-center gap-1">
            <Clock size={11} /> Updated {lastRefresh.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button onClick={() => setLastRefresh(new Date())}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink bg-warm-bg border border-warm-border hover:border-ink px-3 py-2 rounded-lg transition-all">
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Search and filters hero ── */}
      <div className="bg-white border border-warm-border rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search any commodity — coffee, maize, vanilla, fish..."
              className="w-full pl-11 pr-4 py-3 border-2 border-warm-border rounded-xl text-sm text-ink bg-white outline-none focus:border-gold transition-colors font-medium" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-ink"><X size={14} /></button>}
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="px-4 py-3 border-2 border-warm-border rounded-xl text-sm text-ink bg-white outline-none focus:border-gold font-medium min-w-36">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={region} onChange={e => setRegion(e.target.value)}
            className="px-4 py-3 border-2 border-warm-border rounded-xl text-sm text-ink bg-white outline-none focus:border-gold font-medium min-w-36">
            {regions.map(r => <option key={r}>{r === "All" ? "All regions" : r + " Region"}</option>)}
          </select>
          <button onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={"flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all " + (showSavedOnly ? "bg-gold text-ink border-gold" : "border-warm-border text-warm-text hover:border-gold")}>
            <Bookmark size={14} /> {showSavedOnly ? "Watchlist" : "Watchlist (" + savedItems.length + ")"}
          </button>
        </div>
        {(search || category !== "All" || region !== "All" || showSavedOnly) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-warm-border">
            <span className="text-xs text-warm-muted">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <button onClick={() => { setSearch(""); setCategory("All"); setRegion("All"); setShowSavedOnly(false); }}
              className="ml-auto text-xs text-warm-muted hover:text-red-500 flex items-center gap-1 transition-colors">
              <X size={11} /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Market snapshot ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Commodities tracked", value: MARKET_PRICES.length, sub: "All sectors", icon: Activity },
          { label: "Rising today",  value: MARKET_PRICES.filter(p => p.trend > 0).length, sub: "Price up", icon: TrendingUp, color: "text-green-600" },
          { label: "Falling today", value: MARKET_PRICES.filter(p => p.trend < 0).length, sub: "Price down", icon: TrendingDown, color: "text-red-500" },
          { label: "My watchlist",  value: savedItems.length, sub: "Saved commodities", icon: Bookmark, color: "text-gold" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-warm-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-warm-muted">{s.label}</span>
                <Icon size={14} className={s.color || "text-warm-muted"} />
              </div>
              <div className={`text-2xl font-bold ${s.color || "text-ink"}`}>{s.value}</div>
              <div className="text-xs text-warm-muted mt-0.5">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── Insights strip ── */}
      <div className="bg-gold rounded-xl p-4 mb-6 ring-1 ring-ink/10 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-ink" />
          <span className="text-ink font-bold text-sm">Today's Market Insights</span>
          <span className="text-ink/50 text-xs ml-auto">Price movements vs yesterday</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <div className="text-[9px] font-bold text-ink/70 uppercase tracking-wider mb-2">Top gainers</div>
            <div className="space-y-1.5">
              {topGainers.map(p => (
                <button key={p.commodity} onClick={() => setSelected(p)}
                  className="w-full flex items-center justify-between hover:bg-white/40 px-2 py-1 rounded-lg transition-colors">
                  <span className="text-xs text-ink/80 truncate">{p.commodity}</span>
                  <span className="text-[11px] font-bold text-green-700 bg-white rounded px-1.5 py-0.5 flex-shrink-0 ml-2">+{p.trend.toFixed(1)}%</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-bold text-ink/70 uppercase tracking-wider mb-2">Top fallers</div>
            <div className="space-y-1.5">
              {topLosers.map(p => (
                <button key={p.commodity} onClick={() => setSelected(p)}
                  className="w-full flex items-center justify-between hover:bg-white/40 px-2 py-1 rounded-lg transition-colors">
                  <span className="text-xs text-ink/80 truncate">{p.commodity}</span>
                  <span className="text-[11px] font-bold text-red-700 bg-white rounded px-1.5 py-0.5 flex-shrink-0 ml-2">{p.trend.toFixed(1)}%</span>
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-[9px] font-bold text-ink/70 uppercase tracking-wider mb-2">Price signals</div>
            <div className="space-y-1.5 text-xs text-ink/75 leading-relaxed">
              <p>• <span className="text-ink font-semibold">Vanilla</span> up 8.3% — peak export season driving EU buyer demand.</p>
              <p>• <span className="text-ink font-semibold">Maize</span> down 2.1% — post-harvest pressure in Northern region.</p>
              <p>• <span className="text-ink font-semibold">Nile Perch</span> up 6.2% — strong export orders from EU processors.</p>
              <p>• <span className="text-ink font-semibold">Tomatoes</span> down 5.3% — seasonal glut from Central region.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT — price cards grid ── */}
        <div className="lg:col-span-2">
          {/* Count */}
          <div className="text-xs text-warm-muted mb-3">{filtered.length} commodities</div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map(item => (
              <PriceCard
                key={item.commodity}
                item={item}
                saved={savedItems.includes(item.commodity)}
                onToggleSave={toggleSave}
                onClick={() => setSelected(item)}
                isSelected={selected?.commodity === item.commodity}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-white border border-warm-border rounded-xl">
              <BarChart3 size={28} className="text-warm-muted mx-auto mb-3" />
              <p className="font-semibold text-ink mb-1">No commodities found</p>
              <p className="text-sm text-warm-muted">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* ── RIGHT — detail panel ── */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {selected && (() => {
            const cat = COMMODITY_CATEGORIES[selected.commodity] || "Other";
            const catStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Cash Crops"];
            const up = selected.trend > 0;
            const weekData = PRICE_HISTORY[selected.commodity]?.week || [];
            const prevPrice = weekData.length > 1 ? weekData[0] : selected.sell;
            const change = selected.sell - prevPrice;
            return (
              <div className="bg-white border border-warm-border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-ink p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${catStyle.bg} ${catStyle.text}`}>{cat}</span>
                        <span className="text-white/40 text-[10px] flex items-center gap-1"><MapPin size={9} />{selected.region}</span>
                      </div>
                      <h2 className="text-white font-bold text-lg leading-tight">{selected.commodity}</h2>
                    </div>
                    <button onClick={() => toggleSave(selected.commodity)}
                      className={`p-1.5 rounded-lg transition-all ${savedItems.includes(selected.commodity) ? "text-gold" : "text-white/30 hover:text-gold"}`}>
                      {savedItems.includes(selected.commodity) ? <Bookmark size={16} fill="currentColor" /> : <BookmarkPlus size={16} />}
                    </button>
                  </div>
                  <div className="flex items-end gap-3">
                    <div>
                      <div className="text-3xl font-bold text-white leading-none">UGX {fmtK(selected.sell)}</div>
                      <div className="text-white/40 text-xs mt-1">per {selected.unit} · sell price</div>
                    </div>
                    <div className={`flex items-center gap-1 text-base font-bold pb-1 ${up ? "text-green-400" : selected.trend < 0 ? "text-red-400" : "text-white/40"}`}>
                      {up ? <ArrowUpRight size={18} /> : selected.trend < 0 ? <ArrowDownRight size={18} /> : <Minus size={16} />}
                      {Math.abs(selected.trend).toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-white/40">
                    <span>Buy: UGX {fmtK(selected.buy)}/{selected.unit}</span>
                    <span>Spread: UGX {fmtK(selected.sell - selected.buy)}</span>
                    <span className="ml-auto flex items-center gap-1"><Info size={10} />{selected.source}</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="p-4 border-b border-warm-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-ink">Price history</span>
                    <div className="flex gap-1">
                      {PERIODS.map(p => (
                        <button key={p.key} onClick={() => setPeriod(p.key)}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-all ${period === p.key ? "bg-ink text-white" : "text-warm-muted hover:text-ink"}`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <PriceChart data={chartData} commodity={selected.commodity} period={period} unit={selected.unit} />
                </div>

                {/* Stats */}
                <div className="p-4 grid grid-cols-2 gap-3 text-xs border-b border-warm-border">
                  {[
                    ["Period high", `UGX ${fmtK(Math.max(...chartData))}`, "text-green-600"],
                    ["Period low",  `UGX ${fmtK(Math.min(...chartData))}`, "text-red-500"],
                    ["Buy price",  `UGX ${fmtK(selected.buy)}`, "text-ink"],
                    ["Spread",     `UGX ${fmtK(selected.sell - selected.buy)}`, "text-ink"],
                  ].map(([l, v, cls]) => (
                    <div key={l} className="bg-warm-bg rounded-lg p-2.5">
                      <div className="text-warm-muted mb-0.5">{l}</div>
                      <div className={`font-bold ${cls}`}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Prediction / signal */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={12} className="text-gold" />
                    <span className="text-xs font-bold text-ink">Price signal</span>
                    <span className="text-[9px] bg-warm-bg text-warm-muted px-1.5 py-0.5 rounded-full ml-auto">Based on 30-day trend</span>
                  </div>
                  <div className={`text-xs leading-relaxed ${up ? "text-green-700" : selected.trend < 0 ? "text-red-600" : "text-warm-text"}`}>
                    {up
                      ? `${selected.commodity} has risen ${selected.trend.toFixed(1)}% recently. Current momentum is bullish. Consider listing soon to capture peak pricing.`
                      : selected.trend < 0
                      ? `${selected.commodity} has declined ${Math.abs(selected.trend).toFixed(1)}% recently. Seasonal or supply pressure may continue. Monitor before listing.`
                      : `${selected.commodity} prices are stable. Good conditions for forward contracts and pre-agreed delivery pricing.`
                    }
                  </div>
                  {user && (
                    <button onClick={() => navigate("/listings")}
                      className="w-full mt-3 bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-xs transition-all">
                      List this commodity
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );

  // Public layout (no sidebar)
  if (!user) {
    return (
      <div className="min-h-screen bg-warm-bg">
<PublicNav activeRoute="/market-prices" />
        <div className="px-4 md:px-8 py-6">{content}</div>
        <PublicFooter />
      </div>
    );
  }

  return <DashboardLayout>{content}</DashboardLayout>;
}
