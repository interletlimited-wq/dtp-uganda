import { PRICE_HISTORY } from "./demo";

/**
 * Seasonal Outlook — data seam
 * ----------------------------
 * The page depends ONLY on getSeasonalOutlook(). Today it computes the outlook
 * locally from Uganda's harvest calendar (a credible agronomic prior) and uses
 * PRICE_HISTORY only for the current price anchor. When the backend + database
 * land, replace the body of getSeasonalOutlook with a fetch — the returned
 * contract stays identical, so the page never changes.
 *
 *   Phase 2:  return fetch(`/api/seasonal-outlook/${encodeURIComponent(name)}`)
 *               .then(r => r.json());
 *
 * Contract returned:
 *   { commodity, valueChain, currentPrice, unit, monthlyOutlook[12],
 *     peakWindow, leanWindow, harvestMonths[], confidence, direction,
 *     recommendation, methodology }
 */

export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * Uganda cropping seasonality. Months are 0-indexed (Jan = 0).
 * harvest = main supply months (prices soften — glut)
 * lean    = scarcity months (prices firm — lean season)
 * Grounded in Uganda's bimodal calendar (two rain seasons in most regions;
 * unimodal north). Sources: UCDA, MAAIF crop calendars, FEWS NET seasonal
 * monitors. Refined by real observed series once the database is in place.
 */
export const SEASONAL_CALENDAR = {
  "Coffee (Arabica)": { chain: "Cash Crops", unit: "kg", amplitude: 0.14,
    harvest: [9, 10, 11, 0, 1], lean: [5, 6, 7],
    note: "Main Arabica harvest Oct–Feb (Mt Elgon, Rwenzori). Prices soften at peak picking, firm into the mid-year lean window as EU demand builds." },
  "Coffee (Robusta)": { chain: "Cash Crops", unit: "kg", amplitude: 0.12,
    harvest: [10, 11, 0, 1], lean: [4, 5, 6],
    note: "Robusta main crop Nov–Feb (central, western, Masaka). Procurement cheapest at harvest; lean-season firming April–June." },
  "Maize": { chain: "Food Crops", unit: "kg", amplitude: 0.30,
    harvest: [6, 7, 11, 0], lean: [2, 3, 4, 8, 9],
    note: "Bimodal: first-season harvest Jul–Aug, second-season Dec–Jan. Two annual price troughs at harvest, two lean spikes — strongest procurement signal of any staple." },
  "Beans (Common)": { chain: "Food Crops", unit: "kg", amplitude: 0.24,
    harvest: [5, 6, 11, 0], lean: [2, 3, 8, 9],
    note: "Bimodal harvests Jun–Jul and Dec–Jan. Reliable lean-season firming; storable, so buffer-stocking at harvest pays." },
  "Sesame / Simsim": { chain: "Cash Crops", unit: "kg", amplitude: 0.22,
    harvest: [10, 11, 0], lean: [4, 5, 6, 7],
    note: "Northern/eastern harvest Nov–Jan (largely unimodal). Export-grade demand firms prices through the long lean window." },
  "Cocoa": { chain: "Cash Crops", unit: "kg", amplitude: 0.16,
    harvest: [8, 9, 10, 2, 3], lean: [5, 6, 11],
    note: "Main crop Sep–Nov, lighter mid-crop Mar–Apr (Bundibugyo, central). EU buyer interest underpins lean-period pricing." },
  "Sunflower": { chain: "Food Crops", unit: "kg", amplitude: 0.20,
    harvest: [6, 7, 11, 0], lean: [3, 4, 8, 9],
    note: "Bimodal in northern oilseed belt. Edible-oil processors should procure at harvest troughs; lean-season firming is pronounced." },
  "Cassava": { chain: "Food Crops", unit: "kg", amplitude: 0.15,
    harvest: [0, 1, 6, 7], lean: [3, 4, 9, 10],
    note: "Harvestable year-round but supply concentrates after each rains. Mild seasonality; flour processors gain from staggered procurement." },
  "Groundnuts": { chain: "Food Crops", unit: "kg", amplitude: 0.21,
    harvest: [6, 7, 11, 0], lean: [3, 4, 8, 9],
    note: "Bimodal harvests; storable. Lean-season firming supports buffer-stock strategy for processors." },
  "Cotton (Lint)": { chain: "Cash Crops", unit: "kg", amplitude: 0.17,
    harvest: [11, 0, 1], lean: [5, 6, 7, 8],
    note: "Single ginning season Dec–Feb. Textile manufacturers should lock input volumes at harvest; long lean window after." },
};

/** Build a 12-point seasonal multiplier curve from harvest/lean months. */
function seasonalCurve(cal) {
  const amp = cal.amplitude ?? 0.15;
  const harvest = new Set(cal.harvest || []);
  const lean = new Set(cal.lean || []);
  return MONTHS.map((_, m) => {
    if (lean.has(m)) return 1 + amp;       // scarcity → prices firm
    if (harvest.has(m)) return 1 - amp;    // glut → prices soften
    return 1;                              // shoulder month
  });
}

/** Confidence reflects how pronounced the seasonality is (amplitude → %). */
function confidenceFor(cal) {
  const amp = cal.amplitude ?? 0.15;
  const pct = Math.round(55 + amp * 130);
  return Math.min(88, Math.max(60, pct)); // bounded 60–88% — never overclaim
}

function currentPriceFor(name) {
  const h = PRICE_HISTORY[name];
  if (h && Array.isArray(h.year) && h.year.length) return h.year[h.year.length - 1];
  return null;
}

function fmtMonths(idxs) {
  return (idxs || []).slice().sort((a, b) => a - b).map(i => MONTHS[i]).join(", ");
}

/**
 * The seam. ASYNC by design so the page already handles loading — swapping in
 * a real fetch() later requires zero UI changes.
 */
export async function getSeasonalOutlook(name) {
  const cal = SEASONAL_CALENDAR[name];
  if (!cal) return null;

  const base = currentPriceFor(name) ?? 1000;
  const curve = seasonalCurve(cal);
  const monthlyOutlook = curve.map((mult, m) => ({
    month: MONTHS[m],
    monthIndex: m,
    price: Math.round((base * mult) / 50) * 50,
    phase: cal.lean?.includes(m) ? "lean" : cal.harvest?.includes(m) ? "harvest" : "shoulder",
  }));

  const peakIdx = monthlyOutlook.reduce((a, b) => (b.price > a.price ? b : a)).monthIndex;
  const troughIdx = monthlyOutlook.reduce((a, b) => (b.price < a.price ? b : a)).monthIndex;

  const now = new Date().getMonth();
  const nextQ = [(now + 1) % 12, (now + 2) % 12, (now + 3) % 12];
  const nextQAvg = nextQ.reduce((s, m) => s + monthlyOutlook[m].price, 0) / 3;
  const direction = nextQAvg > base * 1.03 ? "rising" : nextQAvg < base * 0.97 ? "falling" : "stable";

  const recommendation = direction === "falling"
    ? `Supply is entering a harvest window. ${name} is likely to be cheapest to procure over the next quarter — favourable timing for processors and exporters to buy and build buffer stock ahead of the lean season.`
    : direction === "rising"
    ? `${name} is heading into a lean window with firming prices. Producers and aggregators holding stock are positioned to sell into strength; buyers should secure volumes early before the seasonal peak.`
    : `${name} prices look broadly stable over the next quarter. Steady, staggered procurement is reasonable; watch the ${fmtMonths([troughIdx])} harvest trough for the best entry.`;

  return {
    commodity: name,
    valueChain: cal.chain,
    currentPrice: base,
    unit: cal.unit || "kg",
    monthlyOutlook,
    peakWindow: fmtMonths([peakIdx]),
    leanWindow: fmtMonths(cal.lean),
    harvestMonths: fmtMonths(cal.harvest),
    confidence: confidenceFor(cal),
    direction,
    note: cal.note,
    recommendation,
    methodology: "Outlook modelled on Uganda's seasonal harvest calendar (UCDA / MAAIF / FEWS NET) anchored to the latest recorded price. A machine-learning forecasting layer trained on observed price series is planned for Phase 2.",
  };
}

/** Commodities available for outlook (those with a calendar entry). */
export function seasonalCommodities() {
  return Object.keys(SEASONAL_CALENDAR).map(name => ({
    name,
    chain: SEASONAL_CALENDAR[name].chain,
  }));
}
