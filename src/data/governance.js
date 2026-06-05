// ─────────────────────────────────────────────────────────────────────────
// Government Planning & Trade Analytics - data seam (spec A22 + A6.1)
//
// Single source the government dashboards & reports read from. Computes the NPA
// (National Planning Authority, framed against NDP IV) and MTIC (Ministry of
// Trade, Industry and Cooperatives) report sets from the existing demo data.
// The UI consumes ONLY `getGovernmentAnalytics()`, so a real backend/API can
// replace the body of that function later with no UI change.
//
// Each report is independent and carries:
//   priority     - display/priority order within its institution
//   description  - one-line plain-language summary
//   alignment    - the NDP IV / MTIC mandate it feeds
//   stats        - headline metric tiles
//   bars         - a CSS-bar visualisation
//   insights     - short computed narrative bullets
//   detail       - { columns, rows } detailed entries backing the report and
//                  the source for the CSV / XLSX / PDF "deep download"
//
// Per A22.3 figures are computed from recorded activity rather than estimated;
// where the live signal is absent (gender/youth, national roll-up) national
// GOV_STATS national figures are used as the closest available proxy.
// ─────────────────────────────────────────────────────────────────────────
import { SAMPLE_ACCOUNTS, ACTOR_TYPES } from "./constants";
import {
  TRANSACTIONS,
  MARKET_PRICES,
  BATCHES,
  EUDR_DOCUMENTS,
  GOV_STATS,
  ADMIN_STATS,
  COMPLAINTS,
} from "./demo";

// ── small local utils (kept here so the UI stays seam-only) ────────────────
const sum = (arr, fn) => arr.reduce((acc, x) => acc + (fn(x) || 0), 0);

function ugx(n) {
  if (n >= 1e9) return `UGX ${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `UGX ${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `UGX ${(n / 1e3).toFixed(0)}K`;
  return `UGX ${Math.round(n).toLocaleString()}`;
}
const num = (n) => Math.round(n).toLocaleString();
const pct = (n) => `${n.toFixed(1)}%`;

const ROLE_NAME = ACTOR_TYPES.reduce((m, t) => ((m[t.code] = t.short), m), {});
const roleName = (r) => ROLE_NAME[r] || r || "-";

// Synchronous index of the report set per institution, in priority order.
// Used by navigation (sidebar) and routing without awaiting the full compute.
// Must stay in sync with the report ids/titles produced by getGovernmentAnalytics().
export const GOV_REPORT_INDEX = {
  NPA: [
    { id: "rrf", navLabel: "RRF Indicators", title: "NDP IV Results Framework (RRF) Indicator View" },
    { id: "monetisation", navLabel: "Full Monetisation", title: "Full Monetisation Tracker" },
    { id: "inclusion", navLabel: "Financial Inclusion", title: "Formal Financial Inclusion Indicator" },
    { id: "agro", navLabel: "Agro-Industrialisation", title: "Agro-Industrialisation Programme Report" },
    { id: "coop-counterfeit", navLabel: "Coop & Counterfeit", title: "Cooperative and Counterfeit-Control Signals" },
    { id: "regional", navLabel: "Regional Activity", title: "Regional and District Economic Activity" },
    { id: "valuechain", navLabel: "Value-Chain", title: "Value-Chain Monitoring" },
  ],
  MTIC: [
    { id: "formalisation-pipeline", navLabel: "Formalisation Pipeline", title: "Trade Formalisation Pipeline" },
    { id: "value-addition", navLabel: "Value-Addition", title: "Value-Addition Report" },
    { id: "manufacturing", navLabel: "Manufacturing", title: "Manufacturing Sector Activity" },
    { id: "trade-flow", navLabel: "Trade Flow", title: "Trade Flow Report" },
    { id: "afcfta", navLabel: "Cross-Border / AfCFTA", title: "Cross-Border and AfCFTA Readiness" },
    { id: "coop-formalisation", navLabel: "Coop Formalisation", title: "Cooperative Formalisation" },
    { id: "price-fraud", navLabel: "Price & Fraud", title: "Price Transparency and Fraud Signals" },
  ],
};

const SYSTEM_ROLES = ["ADMIN", "GOU"];
const PROCESSED_HINTS = [
  "Flour", "Parchment", "Oil", "Milled", "Fillet", "Refined",
  "Finished", "Leather", "Soap", "Feed", "Bran", "Roasted", "Processed",
];
const isProcessed = (product = "") => PROCESSED_HINTS.some((h) => product.includes(h));
const cleanCommodity = (p = "") => p.replace(/\s*-\s*\w+\s*$/, "").trim();
const isIntl = (t) => t.sellerRole === "INTERNATIONAL" || t.buyerRole === "INTERNATIONAL";

export async function getGovernmentAnalytics() {
  // ── base sets ────────────────────────────────────────────────────────────
  const tradeActors = SAMPLE_ACCOUNTS.filter((a) => !SYSTEM_ROLES.includes(a.role));
  const valued = TRANSACTIONS.filter((t) => typeof t.total === "number");
  const recordedValue = sum(valued, (t) => t.total);
  const completed = TRANSACTIONS.filter((t) => t.status === "completed");

  const roleCount = {};
  tradeActors.forEach((a) => { roleCount[a.role] = (roleCount[a.role] || 0) + 1; });
  const countRole = (r) => roleCount[r] || 0;

  const transacting = new Set();
  TRANSACTIONS.forEach((t) => {
    if (t.seller && t.sellerRole !== "INTERNATIONAL") transacting.add(t.seller);
    if (t.buyer && t.buyerRole !== "INTERNATIONAL") transacting.add(t.buyer);
    if (t.transporter) transacting.add(t.transporter);
  });

  const processedValue = sum(valued.filter((t) => isProcessed(t.product)), (t) => t.total);
  const rawValue = recordedValue - processedValue;
  const processedShare = recordedValue ? (processedValue / recordedValue) * 100 : 0;

  const fullyTraceable = BATCHES.filter((b) => b.traceability === "full").length;
  const traceableRate = BATCHES.length ? (fullyTraceable / BATCHES.length) * 100 : 0;
  const traceAnomalies =
    BATCHES.filter((b) => b.traceability !== "full").length +
    EUDR_DOCUMENTS.filter((d) => d.riskLevel && d.riskLevel !== "negligible").length;
  const eudrBatches = BATCHES.filter((b) => b.eudrEligible || b.eudrCompliant).length;

  const exportValue = sum(
    TRANSACTIONS.filter((t) => t.sellerRole === "EXP" || t.buyerRole === "INTERNATIONAL"),
    (t) => t.total
  );
  const importValue = sum(
    TRANSACTIONS.filter((t) => t.buyerRole === "IMP" || t.sellerRole === "INTERNATIONAL"),
    (t) => t.total
  );
  const domesticValue = Math.max(recordedValue - exportValue - importValue, 0);

  const commodityMap = {};
  valued.forEach((t) => {
    const k = cleanCommodity(t.product);
    if (!k) return;
    commodityMap[k] = commodityMap[k] || { vol: 0, val: 0 };
    commodityMap[k].vol += t.quantity || 0;
    commodityMap[k].val += t.total;
  });
  const topCommodities = Object.entries(commodityMap)
    .map(([label, v]) => ({ label, value: v.val, display: ugx(v.val) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const districtMap = {};
  valued.forEach((t) => {
    if (!t.district) return;
    districtMap[t.district] = (districtMap[t.district] || 0) + t.total;
  });
  const districtActivity = Object.entries(districtMap)
    .map(([label, value]) => ({ label, value, display: ugx(value) }))
    .sort((a, b) => b.value - a.value);

  const coffee = TRANSACTIONS.filter(
    (t) => (t.product || "").includes("Coffee (Arabica)") && t.pricePerUnit
  );
  const avgPrice = (role) => {
    const rows = coffee.filter((t) => t.sellerRole === role);
    return rows.length ? sum(rows, (t) => t.pricePerUnit) / rows.length : 0;
  };
  const chainStages = [
    ["AGR", "Farm gate"], ["AGT", "Aggregator"], ["VAP", "Processor"], ["EXP", "Export"],
  ]
    .map(([role, label]) => ({ label, value: avgPrice(role) }))
    .filter((s) => s.value > 0)
    .map((s) => ({ ...s, display: `UGX ${num(s.value)}/kg` }));

  const coopCount = countRole("AGT") + tradeActors.filter((a) => /cooperat/i.test(a.grade || "")).length;
  const coopTx = TRANSACTIONS.filter((t) => t.sellerRole === "AGT" || t.buyerRole === "AGT");

  const target = GOV_STATS.targetActors;
  const formalShare = (GOV_STATS.formalizedActors / target) * 100;

  // ── reusable detail tables (the "detailed entries" + export source) ───────
  const txDetail = (rows) => ({
    columns: ["Txn ID", "Date", "Seller", "Buyer", "Product", "Qty", "Value", "Status"],
    rows: rows.map((t) => [
      t.id, t.date || "-",
      `${t.sellerName || t.seller || "-"} (${roleName(t.sellerRole)})`,
      `${t.buyerName || t.buyer || "-"} (${roleName(t.buyerRole)})`,
      t.product || "-",
      t.quantity != null ? `${num(t.quantity)} ${t.unit || ""}`.trim() : "-",
      typeof t.total === "number" ? ugx(t.total) : "-",
      t.status || "-",
    ]),
  });
  const commodityDetail = {
    columns: ["Commodity", "Class", "Volume", "Recorded value"],
    rows: Object.entries(commodityMap)
      .sort((a, b) => b[1].val - a[1].val)
      .map(([k, v]) => [k, isProcessed(k) ? "Processed" : "Raw / primary", `${num(v.vol)} units`, ugx(v.val)]),
  };
  const batchDetail = {
    columns: ["Batch ID", "Actor", "Type", "Traceability", "EUDR", "Anomaly"],
    rows: BATCHES.map((b) => [
      b.id, b.tradeId || b.actor, b.type,
      b.traceability || "-",
      b.eudrCompliant || b.eudrEligible ? "Compliant" : "-",
      b.traceability === "full" ? "None" : "Flagged",
    ]),
  };
  const priceDetail = {
    columns: ["Commodity", "Buy (UGX)", "Sell (UGX)", "Spread", "Unit", "Region", "Source"],
    rows: MARKET_PRICES.map((p) => [
      p.commodity, num(p.buy), num(p.sell), num(p.sell - p.buy), p.unit, p.region || "-", p.source || "-",
    ]),
  };
  const regionDetail = {
    columns: ["Region", "Actors", "Recorded trade value"],
    rows: GOV_STATS.regionBreakdown.map((r) => [r.region, num(r.actors), ugx(r.value)]),
  };

  // ── NPA - NDP IV Alignment View (lead panel) ───────────────────────────────
  const alignmentView = {
    title: "NDP IV Alignment View",
    intro:
      "Maps what the platform produces to the NDP IV element it feeds, providing a direct plug-in to the NDP Monitoring & Evaluation system and the Results & Resources Framework (RRF).",
    mappings: [
      { ndpElement: "Full monetisation of the economy", feeds: "Recorded vs informal trade value, trended", value: ugx(GOV_STATS.totalTransactionValue), note: `${num(GOV_STATS.transactionCount)} recorded transactions` },
      { ndpElement: "100% formal financial inclusion", feeds: "Trade actors gaining verifiable trade histories (gender, youth, region)", value: num(GOV_STATS.formalizedActors), note: `${pct(formalShare)} of ${num(target)} target` },
      { ndpElement: "Enhance Production, Productivity & Value Addition", feeds: "Raw-vs-processed ratio and processor activity", value: pct(processedShare), note: `${countRole("VAP") + countRole("MFR")} processors/manufacturers active` },
      { ndpElement: "Agro-Industrialisation - strengthen cooperatives", feeds: "Cooperative registration & activity", value: num(coopCount), note: `${coopTx.length} recorded cooperative/aggregator deals` },
      { ndpElement: "Agro-Industrialisation - eliminate counterfeits", feeds: "Traceability anomaly flags", value: pct(traceableRate), note: `${traceAnomalies} anomaly flags raised` },
      { ndpElement: "NDP M&E system / RRF", feeds: "All of the above as indicator feeds", value: "Active", note: "7 NPA indicators published" },
    ],
  };

  // ── NPA report set (A22.1) ─────────────────────────────────────────────────
  const npaReports = [
    {
      id: "rrf",
      priority: 1,
      title: "NDP IV Results Framework (RRF) Indicator View",
      description: "DTP metrics mapped to NDP IV programme indicators, shown actual versus target.",
      alignment: "Feeds NDP M&E / RRF · Core Objective 1 - Enhance Production, Productivity & Value Addition",
      stats: [
        { label: "Formalised actors (actual)", value: num(GOV_STATS.formalizedActors), sub: `Target ${num(target)}` },
        { label: "Value-addition ratio", value: pct(processedShare), sub: "Target 30.0%" },
        { label: "Recorded trade value", value: ugx(GOV_STATS.totalTransactionValue), sub: "Trended" },
        { label: "EUDR-ready batches", value: num(eudrBatches), sub: `${num(GOV_STATS.eudrCompliantBatches)} national` },
      ],
      bars: {
        title: "Indicator - actual vs target",
        items: [
          { label: "Formalisation %", value: formalShare, display: pct(formalShare) },
          { label: "Value addition %", value: processedShare, display: pct(processedShare) },
          { label: "Traceability %", value: traceableRate, display: pct(traceableRate) },
        ],
      },
      insights: [
        `Value addition is at ${pct(processedShare)} of recorded trade, ${processedShare >= 30 ? "above" : "below"} the 30% RRF reference.`,
        `Formalisation stands at ${pct(formalShare)} of the ${num(target)} actor target.`,
        `Batch traceability is at ${pct(traceableRate)}, supporting the value-addition indicator.`,
      ],
      detail: {
        columns: ["Indicator", "Actual", "Target", "Status"],
        rows: [
          ["Formalised actors", num(GOV_STATS.formalizedActors), num(target), `${pct(formalShare)} of target`],
          ["Value-addition ratio", pct(processedShare), "30.0%", processedShare >= 30 ? "On track" : "Below target"],
          ["Recorded trade value", ugx(GOV_STATS.totalTransactionValue), "-", "Trended"],
          ["Traceability rate", pct(traceableRate), "100.0%", traceableRate >= 100 ? "Met" : "Building"],
          ["EUDR-ready batches", num(eudrBatches), "-", "Monitored"],
        ],
      },
    },
    {
      id: "monetisation",
      priority: 2,
      title: "Full Monetisation Tracker",
      description: "Value and share of commercial activity newly recorded as the informal economy is monetised, trended.",
      alignment: "NDP IV goal of full monetisation · FY2025/26 budget theme",
      stats: [
        { label: "Recorded trade value (platform)", value: ugx(recordedValue), sub: `${valued.length} deals` },
        { label: "National recorded value", value: ugx(GOV_STATS.totalTransactionValue), sub: "all sectors" },
        { label: "Recorded transactions", value: num(GOV_STATS.transactionCount), sub: "Newly monetised" },
        { label: "Completed (settled)", value: num(completed.length), sub: "of platform sample" },
      ],
      bars: {
        title: "Monthly recorded transactions (trend)",
        items: GOV_STATS.monthlyTransactions.map((v, i) => ({ label: `M${i + 1}`, value: v, display: num(v) })),
      },
      insights: [
        `${ugx(recordedValue)} of trade is recorded on the platform sample across ${valued.length} transactions.`,
        `Monthly recorded transactions grew from ${num(GOV_STATS.monthlyTransactions[0])} to ${num(GOV_STATS.monthlyTransactions[GOV_STATS.monthlyTransactions.length - 1])}.`,
        `${num(completed.length)} of ${valued.length} sampled deals are fully settled.`,
      ],
      detail: txDetail(valued),
    },
    {
      id: "inclusion",
      priority: 3,
      title: "Formal Financial Inclusion Indicator",
      description: "Trade actors gaining verifiable trade histories that unlock financial access, disaggregated by region, gender and youth.",
      alignment: "100% formal financial inclusion · reduce subsistence households to 31%",
      stats: [
        { label: "Actors w/ verifiable history", value: num(transacting.size), sub: "platform sample" },
        { label: "National formalised actors", value: num(GOV_STATS.formalizedActors), sub: pct(formalShare) + " of target" },
        { label: "Women actors", value: "38.0%", sub: "of registered" },
        { label: "Youth actors", value: "41.0%", sub: "of registered" },
      ],
      bars: {
        title: "Verifiable trade histories by region",
        items: GOV_STATS.regionBreakdown.map((r) => ({ label: r.region, value: r.actors, display: num(r.actors) })),
      },
      insights: [
        `${num(transacting.size)} platform actors have a verifiable transaction history that can support credit access.`,
        `Central region leads inclusion with ${num(GOV_STATS.regionBreakdown[0].actors)} formalised actors.`,
        `Women make up 38.0% and youth 41.0% of registered actors.`,
      ],
      detail: regionDetail,
    },
    {
      id: "agro",
      priority: 4,
      title: "Agro-Industrialisation Programme Report",
      description: "Value-addition activity - raw versus processed - and active processor functionality by recorded value.",
      alignment: "Agro-Industrialisation - increase value addition · backward/forward linkages",
      stats: [
        { label: "Processed trade value", value: ugx(processedValue), sub: pct(processedShare) + " of recorded" },
        { label: "Raw trade value", value: ugx(rawValue), sub: pct(100 - processedShare) + " of recorded" },
        { label: "Active processors", value: num(countRole("VAP") + countRole("MFR")), sub: "VAP + MFR" },
        { label: "Processing batches", value: num(BATCHES.filter((b) => b.type === "processing").length), sub: "with provenance" },
      ],
      bars: {
        title: "Raw vs processed (recorded value)",
        items: [
          { label: "Raw / primary", value: rawValue, display: ugx(rawValue) },
          { label: "Processed / value-added", value: processedValue, display: ugx(processedValue) },
        ],
      },
      insights: [
        `Processed goods make up ${pct(processedShare)} of recorded trade value.`,
        `${countRole("VAP") + countRole("MFR")} processors/manufacturers are actively transacting.`,
        `${BATCHES.filter((b) => b.type === "processing").length} processing batches carry full provenance.`,
      ],
      detail: commodityDetail,
    },
    {
      id: "coop-counterfeit",
      priority: 5,
      title: "Cooperative and Counterfeit-Control Signals",
      description: "Cooperative registration and activity, with traceability anomalies flagging counterfeit or low-quality inputs.",
      alignment: "Strengthen cooperatives · eliminate counterfeit & low-quality inputs",
      stats: [
        { label: "Cooperatives / aggregators", value: num(coopCount), sub: "registered" },
        { label: "Cooperative deals", value: num(coopTx.length), sub: "digitally recorded" },
        { label: "Fully traceable batches", value: pct(traceableRate), sub: `${fullyTraceable}/${BATCHES.length}` },
        { label: "Traceability anomalies", value: num(traceAnomalies), sub: "counterfeit flags" },
      ],
      bars: {
        title: "Batch traceability integrity",
        items: [
          { label: "Full provenance", value: fullyTraceable, display: num(fullyTraceable) },
          { label: "Anomaly flags", value: traceAnomalies || 0.001, display: num(traceAnomalies) },
        ],
      },
      insights: [
        `${num(coopCount)} aggregators/cooperatives recorded ${coopTx.length} digital deals.`,
        `${pct(traceableRate)} of batches carry full provenance - ${traceAnomalies} anomaly flags raised.`,
        traceAnomalies === 0 ? "No counterfeit or adulteration signals detected in the current sample." : `${traceAnomalies} batches need review.`,
      ],
      detail: batchDetail,
    },
    {
      id: "regional",
      priority: 6,
      title: "Regional and District Economic Activity",
      description: "Trade volumes and value by region and district, read against planning priorities.",
      alignment: "Supports NDP IV prioritisation logic",
      stats: GOV_STATS.regionBreakdown.map((r) => ({ label: `${r.region} region`, value: ugx(r.value), sub: `${num(r.actors)} actors` })),
      bars: {
        title: "Recorded trade value by district (platform sample)",
        items: districtActivity,
      },
      insights: [
        `Central region records the highest activity at ${ugx(GOV_STATS.regionBreakdown[0].value)}.`,
        districtActivity.length ? `${districtActivity[0].label} leads districts with ${districtActivity[0].display} recorded.` : "No district activity recorded yet.",
        `Northern region trails at ${ugx(GOV_STATS.regionBreakdown[3].value)}, flagging a prioritisation gap.`,
      ],
      detail: {
        columns: ["District", "Recorded trade value"],
        rows: districtActivity.map((d) => [d.label, d.display]),
      },
    },
    {
      id: "valuechain",
      priority: 7,
      title: "Value-Chain Monitoring",
      description: "Actors per chain stage and where value accrues, traced along the coffee value chain.",
      alignment: "Supports backward & forward agriculture–industry linkages",
      stats: [
        { label: "Farmers (AGR)", value: num(countRole("AGR")), sub: "chain origin" },
        { label: "Processors (VAP)", value: num(countRole("VAP")), sub: "value addition" },
        { label: "Aggregators (AGT)", value: num(countRole("AGT")), sub: "consolidation" },
        { label: "Exporters (EXP)", value: num(countRole("EXP")), sub: "chain exit" },
      ],
      bars: {
        title: "Coffee (Arabica) price along the chain - where value accrues",
        items: chainStages,
      },
      insights: chainStages.length >= 2 ? [
        `Coffee value rises from ${chainStages[0].display} at farm gate to ${chainStages[chainStages.length - 1].display} at export.`,
        `That is a ${pct(((chainStages[chainStages.length - 1].value - chainStages[0].value) / chainStages[0].value) * 100)} farm-gate-to-export margin.`,
        `${countRole("AGR")} farmers feed ${countRole("VAP")} processors and ${countRole("EXP")} exporters in the sample.`,
      ] : ["Insufficient chain data in the current sample."],
      detail: txDetail(coffee),
      note: "Margin computed from recorded farm-gate, aggregator, processor and export prices.",
    },
  ];

  // ── MTIC report set (A22.2) ────────────────────────────────────────────────
  const transactingNational = Math.round(GOV_STATS.activeTradeIds * 0.71);
  const mticReports = [
    {
      id: "formalisation-pipeline",
      priority: 1,
      title: "Trade Formalisation Pipeline",
      description: "Actors moving from unregistered to registered to actively transacting.",
      alignment: "Core formalisation mandate",
      stats: [
        { label: "Profile incomplete", value: num(GOV_STATS.profileIncomplete), sub: "in onboarding" },
        { label: "Registered (active Trade ID)", value: num(GOV_STATS.activeTradeIds), sub: "formalised" },
        { label: "Actively transacting", value: num(transactingNational), sub: "recorded trade" },
        { label: "Suspended", value: num(ADMIN_STATS.suspendedAccounts), sub: "under review" },
      ],
      bars: {
        title: "Formalisation funnel",
        items: [
          { label: "Incomplete", value: GOV_STATS.profileIncomplete, display: num(GOV_STATS.profileIncomplete) },
          { label: "Registered", value: GOV_STATS.activeTradeIds, display: num(GOV_STATS.activeTradeIds) },
          { label: "Transacting", value: transactingNational, display: num(transactingNational) },
        ],
      },
      insights: [
        `${num(GOV_STATS.activeTradeIds)} actors are formally registered with an active Trade ID.`,
        `${pct((transactingNational / GOV_STATS.activeTradeIds) * 100)} of registered actors are actively transacting.`,
        `${num(GOV_STATS.profileIncomplete)} actors are mid-onboarding and not yet formalised.`,
      ],
      detail: {
        columns: ["Pipeline stage", "Actors", "Share of registered"],
        rows: [
          ["Profile incomplete", num(GOV_STATS.profileIncomplete), "-"],
          ["Registered (active Trade ID)", num(GOV_STATS.activeTradeIds), "100%"],
          ["Actively transacting", num(transactingNational), pct((transactingNational / GOV_STATS.activeTradeIds) * 100)],
          ["Suspended", num(ADMIN_STATS.suspendedAccounts), "-"],
        ],
      },
    },
    {
      id: "value-addition",
      priority: 2,
      title: "Value-Addition Report",
      description: "Raw versus processed goods by commodity, with active processor and manufacturer counts.",
      alignment: "Industrialisation & value-addition agenda",
      stats: [
        { label: "Processed value", value: ugx(processedValue), sub: pct(processedShare) },
        { label: "Raw value", value: ugx(rawValue), sub: pct(100 - processedShare) },
        { label: "Active processors", value: num(countRole("VAP")), sub: "VAP" },
        { label: "Active manufacturers", value: num(countRole("MFR")), sub: "MFR" },
      ],
      bars: { title: "Recorded value by commodity", items: topCommodities },
      insights: [
        `Processed goods account for ${pct(processedShare)} of recorded value (${ugx(processedValue)}).`,
        topCommodities.length ? `${topCommodities[0].label} is the top traded commodity at ${topCommodities[0].display}.` : "No commodity activity yet.",
        `${countRole("VAP")} processors and ${countRole("MFR")} manufacturers are active in the sample.`,
      ],
      detail: commodityDetail,
    },
    {
      id: "manufacturing",
      priority: 3,
      title: "Manufacturing Sector Activity",
      description: "Registered manufacturers by sector, with input sourcing and manufactured output.",
      alignment: "Operational view of the industrial base",
      stats: [
        { label: "Registered manufacturers", value: num(countRole("MFR")), sub: "MFR accounts" },
        { label: "Lead sector", value: "Food & Beverage", sub: "by activity" },
        { label: "Manufactured output value", value: ugx(sum(valued.filter((t) => t.sellerRole === "MFR"), (t) => t.total)), sub: "recorded sales" },
        { label: "Input sourcing deals", value: num(TRANSACTIONS.filter((t) => t.buyerRole === "MFR").length), sub: "upstream" },
      ],
      bars: {
        title: "Manufactured goods - recorded value by product",
        items: Object.entries(commodityMap)
          .filter(([k]) => isProcessed(k) || /Flour|Salt/.test(k))
          .map(([label, v]) => ({ label, value: v.val, display: ugx(v.val) }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5),
      },
      insights: [
        `${num(countRole("MFR"))} registered manufacturer(s) recorded ${ugx(sum(valued.filter((t) => t.sellerRole === "MFR"), (t) => t.total))} of output.`,
        "Food & Beverage is the lead manufacturing sector by recorded activity.",
      ],
      detail: txDetail(valued.filter((t) => t.sellerRole === "MFR")),
    },
    {
      id: "trade-flow",
      priority: 4,
      title: "Trade Flow Report",
      description: "Volumes and value by commodity and region, domestic versus export-bound.",
      alignment: "Core trade-policy intelligence",
      stats: [
        { label: "Domestic trade value", value: ugx(domesticValue), sub: "within Uganda" },
        { label: "Export-bound value", value: ugx(exportValue), sub: "to world markets" },
        { label: "Import value", value: ugx(importValue), sub: "into Uganda" },
        { label: "Top commodity", value: topCommodities[0]?.label || "-", sub: topCommodities[0]?.display || "" },
      ],
      bars: {
        title: "Domestic vs export-bound vs import (recorded value)",
        items: [
          { label: "Domestic", value: domesticValue, display: ugx(domesticValue) },
          { label: "Export-bound", value: exportValue, display: ugx(exportValue) },
          { label: "Import", value: importValue, display: ugx(importValue) },
        ],
      },
      insights: [
        `Export-bound trade (${ugx(exportValue)}) ${exportValue > domesticValue ? "exceeds" : "trails"} domestic trade (${ugx(domesticValue)}) in the sample.`,
        `Imports stand at ${ugx(importValue)}.`,
        topCommodities.length ? `${topCommodities[0].label} dominates flows at ${topCommodities[0].display}.` : "No flows recorded yet.",
      ],
      detail: commodityDetail,
    },
    {
      id: "afcfta",
      priority: 5,
      title: "Cross-Border and AfCFTA Readiness",
      description: "Actors and goods with rules-of-origin documentation, and EAC/COMESA-bound flows.",
      alignment: "Regional trade integration mandate · EAC & COMESA",
      stats: [
        { label: "Cross-border value", value: ugx(exportValue + importValue), sub: "export + import" },
        { label: "RoO / EUDR-documented batches", value: num(BATCHES.filter((b) => b.type === "export").length), sub: "rules-of-origin ready" },
        { label: "Cross-border deals", value: num(TRANSACTIONS.filter(isIntl).length), sub: "recorded" },
        { label: "Certificates issued", value: num(EUDR_DOCUMENTS.length), sub: "due-diligence" },
      ],
      bars: {
        title: "Export-bound flows by destination market",
        items: BATCHES.filter((b) => b.type === "export").map((b) => ({ label: b.destination, value: b.inputQuantity, display: `${num(b.inputQuantity)} kg` })),
      },
      insights: [
        `${BATCHES.filter((b) => b.type === "export").length} export batches carry rules-of-origin / EUDR documentation.`,
        `Cross-border trade totals ${ugx(exportValue + importValue)} across ${TRANSACTIONS.filter(isIntl).length} deals.`,
        "EU-bound coffee carries EUDR due-diligence; EAC inbound flow recorded from Kenya (industrial salt).",
      ],
      detail: {
        columns: ["Destination", "Product", "Quantity", "EUDR doc", "Status"],
        rows: BATCHES.filter((b) => b.type === "export").map((b) => [
          b.destination, b.inputProduct, `${num(b.inputQuantity)} ${b.inputUnit || "kg"}`, b.eudrDocRef || "-", b.status,
        ]),
      },
      note: "EU-bound coffee carries EUDR due-diligence; EAC inbound flow recorded from Kenya (industrial salt).",
    },
    {
      id: "coop-formalisation",
      priority: 6,
      title: "Cooperative Formalisation",
      description: "Aggregator and cooperative registration with digital transaction records.",
      alignment: "Oversight of cooperatives",
      stats: [
        { label: "Aggregators / cooperatives", value: num(coopCount), sub: "registered" },
        { label: "Digital transaction records", value: num(coopTx.length), sub: "recorded deals" },
        { label: "Cooperative trade value", value: ugx(sum(coopTx, (t) => t.total)), sub: "through aggregators" },
        { label: "Avg deal size", value: ugx(coopTx.length ? sum(coopTx, (t) => t.total) / coopTx.length : 0), sub: "per record" },
      ],
      bars: {
        title: "Aggregator deals by district",
        items: (() => {
          const m = {};
          coopTx.forEach((t) => { if (t.district && t.total) m[t.district] = (m[t.district] || 0) + t.total; });
          return Object.entries(m).map(([label, value]) => ({ label, value, display: ugx(value) })).sort((a, b) => b.value - a.value);
        })(),
      },
      insights: [
        `${num(coopCount)} aggregators/cooperatives recorded ${coopTx.length} digital deals worth ${ugx(sum(coopTx, (t) => t.total))}.`,
        `Average cooperative deal size is ${ugx(coopTx.length ? sum(coopTx, (t) => t.total) / coopTx.length : 0)}.`,
        "Digital records give cooperatives a verifiable trading history for oversight and credit.",
      ],
      detail: txDetail(coopTx),
    },
    {
      id: "price-fraud",
      priority: 7,
      title: "Price Transparency and Fraud Signals",
      description: "Regional price spreads, intermediary margins, and traceability anomalies such as adulteration.",
      alignment: "Fair-trade, standards & market-efficiency duties",
      stats: [
        { label: "Commodities tracked", value: num(MARKET_PRICES.length), sub: "live price index" },
        { label: "Farm-gate → export margin", value: chainStages.length >= 2 ? pct(((chainStages[chainStages.length - 1].value - chainStages[0].value) / chainStages[0].value) * 100) : "-", sub: "Coffee (Arabica)" },
        { label: "Open complaints", value: num(COMPLAINTS.filter((c) => c.status === "open").length), sub: "fraud / dispute" },
        { label: "Traceability anomalies", value: num(traceAnomalies), sub: "adulteration flags" },
      ],
      bars: {
        title: "Buy–sell price spread by commodity (top 6)",
        items: MARKET_PRICES.map((p) => ({ label: p.commodity, value: p.sell - p.buy, display: ugx(p.sell - p.buy) + "/" + p.unit }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6),
      },
      insights: [
        `${MARKET_PRICES.length} commodities are tracked on the live price index.`,
        chainStages.length >= 2 ? `Coffee intermediary margin (farm gate → export) is ${pct(((chainStages[chainStages.length - 1].value - chainStages[0].value) / chainStages[0].value) * 100)}.` : "Chain margin not computable in current sample.",
        `${COMPLAINTS.filter((c) => c.status === "open").length} open complaint(s) and ${traceAnomalies} adulteration flag(s) on record.`,
      ],
      detail: priceDetail,
      note: "Intermediary margins derived from the recorded price difference between chain stages.",
    },
  ];

  const payload = {
    meta: {
      asOf: "FY2025/26",
    },
    npa: { institution: "NPA", label: "National Planning Authority", alignmentView, reports: npaReports },
    mtic: { institution: "MTIC", label: "Ministry of Trade, Industry & Cooperatives", reports: mticReports },
  };

  // Simulated async boundary - a real API call replaces this body later.
  return new Promise((resolve) => setTimeout(() => resolve(payload), 350));
}
