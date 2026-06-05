import LanguageSwitcher from "../components/LanguageSwitcher";
import PublicNav from "../components/PublicNav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Search, ShoppingBag, TrendingUp, ArrowRight, Shield, HelpCircle,
  Fingerprint, BookOpen, Link, BarChart3,
  Sprout, Factory, Building2, Handshake, Ship, PackageOpen,
  ShoppingCart, Truck, User, Smartphone, QrCode, X, Menu,
  CheckCircle
} from "lucide-react";
import { ACTOR_TYPES } from "../data/constants";

const ICONS = {
  Sprout, Factory, Building2, Handshake, Ship, PackageOpen,
  ShoppingCart, Truck, User, Fingerprint, BookOpen, ShoppingBag,
  TrendingUp, Link, BarChart3,
};
function Icon({ name, size = 18, className = "" }) {
  const C = ICONS[name]; return C ? <C size={size} className={className} /> : null;
}

function AppModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-warm-muted hover:text-ink"><X size={18} /></button>
        <div className="w-12 h-12 bg-ink rounded-xl flex items-center justify-center mb-4 mx-auto"><Smartphone size={22} className="text-gold" /></div>
        <h3 className="text-lg font-bold text-ink text-center mb-2">Mobile App</h3>
        <p className="text-warm-text text-sm text-center leading-relaxed mb-5">The DTP mobile app is in development. Full Android, iOS and USSD support for feature phones.</p>
        <div className="space-y-2">
          {["Android app  -  coming Q3 2026","iOS app  -  coming Q3 2026","USSD access  -  all networks"].map(t => (
            <div key={t} className="flex items-center gap-2.5 p-2.5 bg-warm-bg rounded-lg">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              <span className="text-xs text-warm-text">{t}</span>
            </div>
          ))}
        </div>
        <p className="text-warm-muted text-xs text-center mt-4">Use the web platform on your phone browser in the meantime.</p>
      </div>
    </div>
  );
}

function Hero({ onRegister, onLogin }) {
  return (
    <section className="relative min-h-[520px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=80"
          alt="Uganda trade"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(41,41,41,0.96) 0%, rgba(41,41,41,0.88) 45%, rgba(41,41,41,0.5) 100%)" }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 py-16 w-full grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
            <Shield size={11} /> Uganda Digital Public Infrastructure
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.07] tracking-tight mb-5">
            Uganda's Unified<br />
            <span className="text-gold">Digital Trade</span><br />
            Infrastructure
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
            One platform connects every farmer, manufacturer, trader, and buyer with a verified Digital Trade ID, a permanent transaction record, and direct market access.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={onRegister} className="bg-gold hover:bg-gold-mid text-ink font-bold px-6 py-3 rounded-lg transition-all flex items-center gap-2">
              Register free <ArrowRight size={15} />
            </button>
            <button onClick={onLogin} className="border border-white/25 hover:border-white/60 text-white font-medium px-6 py-3 rounded-lg transition-all">
              Sign in
            </button>
          </div>
          <div className="flex items-center gap-6 mt-8">
            {[["179","Districts covered"],["Free","Registration"],["11","Actor types"]].map(([v,l]) => (
              <div key={l}>
                <div className="text-gold font-bold text-lg leading-none">{v}</div>
                <div className="text-white/40 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-6 max-w-xs ml-auto">
            <div className="text-[9px] uppercase tracking-[0.12em] text-white/30 mb-1.5">Digital Trade Platform · Uganda</div>
            <div className="font-mono text-gold font-bold text-lg tracking-wider mb-5">UG-DTP-AGR-14729</div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[["Name","Nalwanga Sarah"],["Type","Farmer (AGR)"],["District","Mbale"],["Commodity","Coffee (Arabica)"],["Status","Active"],["Issued","12 Jan 2026"]].map(([l,v]) => (
                <div key={l}>
                  <div className="text-[9px] uppercase tracking-wider text-white/25">{l}</div>
                  <div className="text-white text-xs font-medium mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 bg-gold/12 border border-gold/25 text-gold text-[11px] font-medium px-2.5 py-1.5 rounded-full">
                <Shield size={10} /> NIRA verified
              </div>
              <QrCode size={18} className="text-white/20" />
            </div>
          </div>
          <p className="text-white/25 text-xs text-center mt-3">Every registered actor receives a Trade ID like this one</p>
        </div>
      </div>
    </section>
  );
}

function QuickAccess({ onVerify, onPrices, onMarketplace, onRegister }) {
  const tiles = [
    { icon: Search,      title: "Verify a Trade Actor",   desc: "Look up any registered actor by Trade ID, name or registration number.", action: onVerify,      cta: "Verify now" },
    { icon: ShoppingBag, title: "Browse the Marketplace", desc: "View verified listings from farmers, processors, and manufacturers.",      action: onMarketplace, cta: "Browse listings" },
    { icon: TrendingUp,  title: "Check Market Prices",    desc: "Live commodity prices from regional markets across all 179 districts.",    action: onPrices,      cta: "View prices" },
    { icon: Fingerprint, title: "Get your Trade ID",      desc: "Register free in under five minutes. Your permanent digital trade identity.", action: onRegister,  cta: "Register free" },
  ];
  return (
    <section className="bg-warm-bg border-b border-warm-border">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map(t => (
            <button key={t.title} onClick={t.action}
              className="bg-white border border-warm-border rounded-xl p-5 text-left hover:border-gold hover:shadow-md transition-all duration-150 group flex flex-col">
              <div className="w-9 h-9 bg-ink rounded-lg flex items-center justify-center mb-3 flex-shrink-0 group-hover:bg-gold transition-all">
                <t.icon size={16} className="text-gold group-hover:text-ink transition-all" />
              </div>
              <div className="font-semibold text-ink text-sm mb-1.5">{t.title}</div>
              <div className="text-warm-text text-xs leading-relaxed flex-1 mb-3">{t.desc}</div>
              <div className="flex items-center gap-1 text-gold text-xs font-bold group-hover:gap-2 transition-all">
                {t.cta} <ArrowRight size={11} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatItDelivers() {
  const items = [
    { img: "/digital_trade_identity.png",  bg: "bg-blue-50",   title: "Verified Digital Trade ID",    desc: "Every actor gets a persistent digital identity anchored to NIRA, valid across all commodities and borders." },
    { img: "/transaction-ledger.png",       bg: "bg-green-50",  title: "Permanent Transaction Ledger", desc: "Every sale recorded in an immutable ledger. Free from day one. Builds the financial history that unlocks credit." },
    { img: "/easy_market-access.png",       bg: "bg-amber-50",  title: "Direct Market Access",         desc: "Verified sellers connected directly to domestic and international buyers. Real prices. Real buyers." },
    { img: "/market_intelligence.png",      bg: "bg-purple-50", title: "Market Intelligence",          desc: "Real-time commodity prices, demand forecasting, seasonal analysis, and personalised intelligence per actor." },
    { img: "/value_chain_traceability.png", bg: "bg-red-50",    title: "Value Chain Traceability",     desc: "EUDR-compliant blockchain-backed provenance from farm to buyer. One shared infrastructure for every commodity." },
    { img: "/government_analytics.png",     bg: "bg-indigo-50", title: "Government Analytics",         desc: "Real-time dashboards for MTIC, URA, MAAIF, and NPA. Trade formalization made visible and measurable." },
  ];
  return (
    <section className="py-16 px-5 md:px-10 bg-warm-bg border-b border-warm-border">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 text-gold text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4">
            What the platform delivers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-3">One Platform. Every Capability.</h2>
          <p className="text-warm-text text-sm leading-relaxed max-w-lg mx-auto">Everything tied to your Trade ID - from identity to credit, from traceability to market access.</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div key={i}
              className="group bg-white rounded-2xl p-6 border border-warm-border hover:border-gold/40 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-warm-bg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              {/* Number badge */}
              <div className="absolute top-5 right-5 text-[11px] font-bold text-warm-border group-hover:text-gold/40 transition-colors">
                0{i + 1}
              </div>
              <div className="relative">
                {/* Icon */}
                <div className={"w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-sm " + (item.bg || "bg-warm-bg")}>
                  <img src={item.img} alt={item.title} className="w-8 h-8 object-contain" />
                </div>
                {/* Title */}
                <div className="font-bold text-ink text-base mb-2 leading-snug pr-6">{item.title}</div>
                {/* Desc */}
                <div className="text-warm-text text-sm leading-relaxed">{item.desc}</div>
                {/* Bottom accent line */}
                <div className="mt-5 h-0.5 w-8 bg-warm-border group-hover:bg-gold group-hover:w-16 transition-all duration-300 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoIsItFor({ onRoleClick }) {
  const actors = ACTOR_TYPES.slice(0, 8);
  const pages = [actors.slice(0, 4), actors.slice(4, 8)];
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setPage((p) => (p + 1) % pages.length), 6000);
    return () => clearInterval(id);
  }, [paused, pages.length]);

  return (
    <section className="relative overflow-hidden bg-warm-bg border-b border-warm-border py-16 px-5 md:px-10">
      <svg className="pointer-events-none absolute -top-10 -left-10 w-80 h-80 opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dtp-hex" width="28" height="24" patternUnits="userSpaceOnUse">
            <path d="M14 1 L27 8 V16 L14 23 L1 16 V8 Z" fill="none" stroke="#292929" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dtp-hex)" />
      </svg>

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1">
          <div className="text-gold text-[10px] font-bold tracking-[0.14em] uppercase mb-3">Who is it for</div>
          <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight leading-tight">Built for every actor in Uganda's trade ecosystem</h2>
          <div className="h-1 w-12 bg-gold rounded-full mt-4 mb-6" />
          <p className="text-warm-text text-sm leading-relaxed max-w-md">Registration is free. From the smallholder farmer to the licensed exporter, there is a verified Trade ID and a full dashboard waiting for you.</p>
          <button onClick={() => onRoleClick(null)} className="mt-8 text-gold text-sm font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
            View all actor types <ArrowRight size={14} />
          </button>
          <div className="mt-8 h-px w-full bg-warm-border relative">
            <span className="absolute left-0 -top-px h-[3px] w-16 bg-gold rounded-full" />
          </div>
        </div>

        <div className="lg:col-span-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${page * 100}%)` }}>
              {pages.map((group, gi) => (
                <div key={gi} className="w-full shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {group.map((r, idx) => {
                      const num = String(gi * 4 + idx + 1).padStart(2, "0");
                      return (
                        <button key={r.code} onClick={() => onRoleClick(r.code)} className="group relative bg-white rounded-xl border border-warm-border p-5 text-left hover:border-gold hover:shadow-md transition-all">
                          <span className="absolute top-0 right-0 px-2.5 py-1.5 border-l border-b border-warm-border text-warm-muted text-[11px] font-semibold rounded-bl-lg">{num}</span>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-11 h-11 rounded-lg bg-gold flex items-center justify-center shadow-[4px_5px_10px_rgba(41,41,41,0.12)] group-hover:-translate-y-0.5 transition-transform">
                              <Icon name={r.icon} size={20} className="text-ink" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-gold text-[9px] font-bold tracking-wider uppercase">{r.code}</div>
                              <div className="font-semibold text-ink text-sm leading-tight">{r.name}</div>
                            </div>
                          </div>
                          <p className="text-warm-muted text-xs leading-relaxed line-clamp-3">{r.desc}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-gold text-xs font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                            Read more <ArrowRight size={12} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6">
            {pages.map((_, i) => (
              <button key={i} onClick={() => setPage(i)} aria-label={`Slide ${i + 1}`} className="h-2 rounded-full transition-all" style={{ width: i === page ? 28 : 8, backgroundColor: i === page ? "#F7B90F" : "rgba(41,41,41,0.18)" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function HowItWorks() {
  const steps = [
    { n: "01", title: "Register free",          desc: "Create your account in under five minutes. Choose your actor type and start your profile." },
    { n: "02", title: "Verify your identity",    desc: "Link your NIRA national ID, TIN, or business registration for instant verification." },
    { n: "03", title: "Receive your Trade ID",   desc: "Get your permanent Digital Trade ID  -  your verified identity across all platform services." },
    { n: "04", title: "Start trading",           desc: "Access your dashboard, list products, browse buyers, record transactions, and check market prices." },
  ];
  return (
    <section className="bg-ink py-14 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-gold text-[10px] font-bold tracking-[0.12em] uppercase mb-2">How it works</div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-10">From registration to Trade ID in under five minutes</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map(s => (
            <div key={s.n}>
              <div className="font-bold text-5xl text-gold/15 mb-4 leading-none font-mono">{s.n}</div>
              <div className="font-semibold text-white text-sm mb-2">{s.title}</div>
              <div className="text-white/40 text-sm leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-gold py-10 px-5 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {[["179","Districts covered across all 4 regions"],["3 - 4M","Target trade actors Uganda-wide"],["Free","Registration and Digital Trade ID"],["USD 820M","Trade infrastructure enabled"]].map(([n,l]) => (
          <div key={n}>
            <div className="font-bold text-3xl text-ink leading-none mb-1.5">{n}</div>
            <div className="text-ink/50 text-sm leading-snug">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTABanner({ onRegister }) {
  return (
    <section className="bg-white border-y border-warm-border py-12 px-5 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-ink mb-1.5">Have products to sell?</h3>
          <p className="text-warm-text text-sm">Register free, get your Trade ID, and start trading across Uganda and beyond.</p>
        </div>
        <button onClick={onRegister} className="bg-ink hover:bg-ink-mid text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap">
          Register free today <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

function Footer({ onVerify, onPrices, onMarketplace, onRegister, onLogin, onAppClick }) {
  return (
    <footer className="bg-ink px-5 md:px-10">
      <div className="max-w-6xl mx-auto py-10 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center text-ink font-bold text-xs flex-shrink-0">DTP</div>
            <div>
              <div className="text-white font-semibold text-sm">Digital Trade Platform</div>
              <div className="text-white/25 text-[10px]">Empowering Digital Economy</div>
            </div>
          </div>
          <p className="text-white/30 text-xs leading-relaxed">Uganda's unified digital trade infrastructure. Connecting farmers, manufacturers, traders and buyers with verified identities and direct market access.</p>
        </div>
        <div>
          <div className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-4">Platform</div>
          <div className="space-y-2">
            {[{l:"Verify a Trade Actor",a:onVerify},{l:"Marketplace",a:onMarketplace},{l:"Market Prices",a:onPrices},{l:"Download App",a:onAppClick},{l:"Help and Support",a:() => window.location.href="/help"}].map(x => (
              <button key={x.l} onClick={x.a} className="block text-white/40 hover:text-white text-sm transition-colors text-left">{x.l}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-4">For traders</div>
          <div className="space-y-2">
            {[{l:"Register free",a:onRegister},{l:"Sign in",a:onLogin},{l:"How it works",a:null},{l:"All actor types",a:null}].map(x => (
              <button key={x.l} onClick={x.a} className="block text-white/40 hover:text-white text-sm transition-colors text-left">{x.l}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-4">Organisation</div>
          <div className="space-y-2 mb-5">
            {["About Interlet","Contact us","Privacy policy","Terms of use"].map(l => (
              <button key={l} className="block text-white/40 hover:text-white text-sm transition-colors text-left">{l}</button>
            ))}
          </div>
          <div className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-2">Contact</div>
          <div className="text-white/30 text-xs space-y-0.5">
            <div>www.interlet.net</div><div>+256 774 910 575</div><div>Kampala, Uganda</div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="text-white/20 text-xs">© 2026 Interlet Limited. All rights reserved.</div>
        <div className="text-white/20 text-xs">MoICT&amp;NG Innovator Showcase 2026</div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [showApp, setShowApp] = useState(false);
  const nav = {
    onRegister:    () => navigate("/register"),
    onLogin:       () => navigate("/login"),
    onVerify:      () => navigate("/verify"),
    onPrices:      () => navigate("/market-prices"),
    onMarketplace: () => navigate("/marketplace"),
    onAppClick:    () => setShowApp(true),
    onHelp:        () => navigate('/help'),
  };
  return (
    <div className="min-h-screen">
      {showApp && <AppModal onClose={() => setShowApp(false)} />}
      <PublicNav activeRoute="/" />
      <Hero onRegister={nav.onRegister} onLogin={nav.onLogin} />
      <QuickAccess onVerify={nav.onVerify} onPrices={nav.onPrices} onMarketplace={nav.onMarketplace} onRegister={nav.onRegister} />
      <HowItWorks />
      <WhatItDelivers />
      <WhoIsItFor onRoleClick={code => navigate("/register", { state: { role: code } })} />
      <Stats />
      <CTABanner onRegister={nav.onRegister} />
      <Footer {...nav} />
    </div>
  );
}
