import { useNavigate } from "react-router-dom";

export default function PublicFooter() {
  const navigate = useNavigate();
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
            {[
              { l: "Verify a Trade Actor", a: () => navigate("/verify") },
              { l: "Public Marketplace",   a: () => navigate("/marketplace") },
              { l: "Market Prices",        a: () => navigate("/market-prices") },
              { l: "Help and Support",     a: () => navigate("/help") },
            ].map(x => (
              <button key={x.l} onClick={x.a} className="block text-white/40 hover:text-white text-sm transition-colors text-left">{x.l}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-4">For traders</div>
          <div className="space-y-2">
            {[
              { l: "Register free", a: () => navigate("/register") },
              { l: "Sign in",       a: () => navigate("/login") },
              { l: "How it works",  a: () => navigate("/help") },
            ].map(x => (
              <button key={x.l} onClick={x.a} className="block text-white/40 hover:text-white text-sm transition-colors text-left">{x.l}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-4">Contact</div>
          <div className="text-white/30 text-xs space-y-1.5">
            <div>www.interlet.net</div>
            <div>+256 774 910 575</div>
            <div>+256 703 525 418</div>
            <div>Kampala, Uganda</div>
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
