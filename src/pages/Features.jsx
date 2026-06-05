import {
  BadgeCheck, ShieldCheck, Globe, Store, Send, Boxes, Route as RouteIcon,
  FileCheck, TrendingUp, Sprout, Wallet, Receipt, Warehouse, BarChart3,
  Building2, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import PublicFooter from "../components/PublicFooter";

const INK = "#292929";
const GOLD = "#F7B90F";

// Single maintainable source for all features.
// status: "live" (built) or "planned" (specified, building)
const GROUPS = [
  {
    section: "Identity & Verification",
    blurb: "One verifiable identity for every trade actor, anchored to national systems.",
    features: [
      { icon: BadgeCheck, title: "Digital Trade ID", status: "live",
        desc: "A persistent, verifiable digital identity for every actor, from smallholder farmer to manufacturer to foreign buyer, valid across commodities and borders." },
      { icon: ShieldCheck, title: "Verification & Trust Tick", status: "live",
        desc: "Identity verified against NIRA, URA, URSB, or an international path. Verification stays private; the public sees only a rating-based trust tick." },
      { icon: Globe, title: "Foreign Buyer / International Trader", status: "live",
        desc: "Non-resident actors register and verify through an international path, capturing country of origin and nature of business to source from or sell into Uganda." },
    ],
  },
  {
    section: "Marketplace & Sourcing",
    blurb: "Both sides of trade: sellers list, buyers source, offers become orders.",
    features: [
      { icon: Store, title: "Public & Private Marketplace", status: "live",
        desc: "Verified sellers connected directly to domestic, regional, and international buyers. Real prices, real buyers." },
      { icon: Send, title: "Supply Requests & Sourcing Board", status: "live",
        desc: "Buyers, foreign traders, and retail consumers post what they want to source; suppliers respond with offers that convert into orders." },
      { icon: RouteIcon, title: "Logistics & Transport", status: "live",
        desc: "Transporters register vehicles and routes across all delivery modes and connect with trade actors moving goods." },
    ],
  },
  {
    section: "Traceability & Compliance",
    blurb: "Origin-to-market provenance that meets international market requirements.",
    features: [
      { icon: FileCheck, title: "Value Chain Traceability", status: "live",
        desc: "Track goods and actors from origin to final market, with chain-of-custody and the farm-level provenance EUDR requires." },
      { icon: BadgeCheck, title: "EUDR & AfCFTA Documentation", status: "live",
        desc: "Compliance records and rules-of-origin documentation generated at the export step across seeded end-to-end traceability journeys." },
    ],
  },
  {
    section: "Market Intelligence",
    blurb: "Prices, demand, and seasonal insight tailored to each actor.",
    features: [
      { icon: TrendingUp, title: "Market Prices", status: "live",
        desc: "Live commodity prices from verified sources across Uganda's regions, with history and price signals." },
      { icon: Sprout, title: "Seasonal Outlook", status: "live",
        desc: "Seasonal price intelligence built on Uganda's harvest calendars, guiding when to procure, build buffer stock, and sell." },
    ],
  },
  {
    section: "Finance & Wallet",
    blurb: "Trade histories that unlock credit, and a wallet to settle trade.",
    features: [
      { icon: Wallet, title: "Digital Trade Wallet", status: "planned",
        desc: "A multi-currency account (UGX, USD, EUR) to fund from mobile money and banks, convert currency, pay orders and freight, and transfer out." },
      { icon: BadgeCheck, title: "Credit & Insurance Readiness", status: "planned",
        desc: "Verifiable trade histories that unlock alternative credit scoring, microinsurance, and structured market access." },
    ],
  },
  {
    section: "Records & Operations",
    blurb: "The everyday tools that build the verified record of trade.",
    features: [
      { icon: Receipt, title: "Expenses Management", status: "planned",
        desc: "A shared expense ledger for every actor, classifying production, input, processing, transport, administrative, and compliance costs." },
      { icon: Warehouse, title: "Stock & Shop Management", status: "planned",
        desc: "Inventory, sales recording, debts and credits, and a simple profit view for wholesalers, distributors, and large shops." },
      { icon: Boxes, title: "Sales & Transaction Ledger", status: "live",
        desc: "An immutable record of commercial transactions and a free business-records tool for all traders from day one." },
    ],
  },
  {
    section: "Government & Analytics",
    blurb: "Trade data turned into planning and policy intelligence.",
    features: [
      { icon: BarChart3, title: "Government Planning & Trade Reports", status: "live",
        desc: "Planner-facing analytics for NPA and MTIC, aligned to NDP IV indicators, formalisation, value addition, and economic activity." },
      { icon: Building2, title: "Physical Markets & Stalls", status: "planned",
        desc: "Government markets and stalls profiled and configured by authorities, connecting retail consumers and sellers at physical locations." },
    ],
  },
];

function StatusPill({ status }) {
  const live = status === "live";
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{
        color: live ? "#15803d" : INK,
        backgroundColor: live ? "#dcfce7" : "rgba(247,185,15,0.25)",
      }}
    >
      {live ? "Live" : "In development"}
    </span>
  );
}

export default function Features() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <PublicNav activeRoute="/features" />

      <section className="bg-ink py-16 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-gold text-[10px] font-bold tracking-[0.14em] uppercase mb-3">
            Platform Capabilities
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight max-w-3xl leading-tight">
            Everything tied to your Trade ID
          </h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-2xl mt-3">
            One unified infrastructure for the whole trade ecosystem: identity, marketplace and sourcing,
            traceability, market intelligence, finance, day-to-day records, and government analytics.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-10 py-12 flex-1">
        <div className="max-w-6xl mx-auto space-y-12">
          {GROUPS.map((g) => (
            <div key={g.section}>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-ink tracking-tight">{g.section}</h2>
                <p className="text-warm-muted text-sm mt-1">{g.blurb}</p>
                <div className="h-1 w-10 bg-gold rounded-full mt-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.features.map((f) => (
                  <div key={f.title} className="bg-white rounded-xl border border-warm-border p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: GOLD }}
                      >
                        <f.icon className="w-5 h-5" style={{ color: INK }} strokeWidth={1.9} />
                      </div>
                      <StatusPill status={f.status} />
                    </div>
                    <h3 className="font-semibold text-ink text-[15px] mb-1.5">{f.title}</h3>
                    <p className="text-warm-muted text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-ink rounded-2xl p-8 text-center">
            <h3 className="text-white text-xl font-bold mb-2">Get your Trade ID</h3>
            <p className="text-white/55 text-sm mb-5 max-w-md mx-auto">
              Registration is free. Join the verified trade ecosystem and access every capability above.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-gold hover:bg-gold-mid text-ink font-bold text-sm px-6 py-2.5 rounded-lg inline-flex items-center gap-1.5 transition-all"
            >
              Register free <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
