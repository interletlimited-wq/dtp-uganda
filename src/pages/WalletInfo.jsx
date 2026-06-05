import {
  Wallet, Smartphone, Landmark, ArrowLeftRight, Receipt, Send,
  FileText, ShieldCheck, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import PublicFooter from "../components/PublicFooter";

const INK = "#292929";
const GOLD = "#F7B90F";

const CAPABILITIES = [
  { icon: Wallet, title: "Multi-currency account",
    desc: "Hold and transact in UGX, USD, and EUR. Ugandan actors typically hold UGX; foreign buyers fund in USD or EUR." },
  { icon: Smartphone, title: "Mobile money funding",
    desc: "Top up the wallet directly from mobile money for fast, familiar, low-barrier access." },
  { icon: Landmark, title: "Bank & international funding",
    desc: "Fund from local banks and, for foreign actors, international bank transfer or card in the chosen currency." },
  { icon: ArrowLeftRight, title: "Currency conversion",
    desc: "Convert between currencies at a recorded rate, bridging foreign buyers and Ugandan sellers." },
  { icon: Receipt, title: "Pay orders and freight",
    desc: "Settle marketplace orders and transport directly from the wallet, linked to the transaction record." },
  { icon: Send, title: "Transfers out",
    desc: "Move funds out to bank accounts or mobile money when needed." },
  { icon: FileText, title: "Statements & ledger",
    desc: "A full statement and ledger of every credit, debit, payment, and conversion." },
  { icon: ShieldCheck, title: "Security & limits",
    desc: "Security controls and transaction limits tied to the actor's verification and trust status." },
];

export default function WalletInfo() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <PublicNav activeRoute="/wallet-info" />

      <section className="bg-ink py-16 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-gold text-[10px] font-bold tracking-[0.14em] uppercase mb-3">
            <Wallet size={13} /> Digital Trade Wallet
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight max-w-3xl leading-tight">
            One wallet to fund, convert, and settle trade
          </h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-2xl mt-3">
            The Digital Trade Wallet lets every verified actor fund from mobile money or banks, hold
            multiple currencies, and pay for orders and freight directly, with a full ledger behind it.
          </p>
          <div className="mt-5 inline-block text-[11px] font-semibold px-3 py-1.5 rounded-lg"
            style={{ color: INK, backgroundColor: "rgba(247,185,15,0.85)" }}>
            Planned capability, in development
          </div>
        </div>
      </section>

      <section className="px-5 md:px-10 py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-warm-border p-5">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: GOLD }}>
                  <c.icon className="w-5 h-5" style={{ color: INK }} strokeWidth={1.9} />
                </div>
                <h3 className="font-semibold text-ink text-[15px] mb-1.5">{c.title}</h3>
                <p className="text-warm-muted text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-ink rounded-2xl p-8 text-center mt-12">
            <h3 className="text-white text-xl font-bold mb-2">Built on your Trade ID</h3>
            <p className="text-white/55 text-sm mb-5 max-w-md mx-auto">
              The wallet ties to your verified identity and trade history. Register free to be ready when it launches.
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
