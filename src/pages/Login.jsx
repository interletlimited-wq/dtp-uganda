import { useState } from "react";
import PublicNav from "../components/PublicNav";
import PublicFooter from "../components/PublicFooter";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Shield, ArrowRight, ChevronDown, ChevronUp, Check } from "lucide-react";
import { SAMPLE_ACCOUNTS } from "../data/constants";

const ROLE_COLORS = {
  AGR: "bg-green-50 text-green-700 border-green-200",
  VAP: "bg-amber-50 text-amber-700 border-amber-200",
  MFR: "bg-blue-50 text-blue-700 border-blue-200",
  AGT: "bg-purple-50 text-purple-700 border-purple-200",
  EXP: "bg-red-50 text-red-700 border-red-200",
  IMP: "bg-orange-50 text-orange-700 border-orange-200",
  BYR: "bg-teal-50 text-teal-700 border-teal-200",
  TRP: "bg-slate-50 text-slate-700 border-slate-200",
  CSM: "bg-pink-50 text-pink-700 border-pink-200",
  ADMIN: "bg-gray-50 text-gray-700 border-gray-200",
  GOU: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);

  const fromRegistration = location.state?.registered;

  function fillAccount(acc) {
    setUsername(acc.username);
    setPassword(acc.password);
    setError("");
    setShowAccounts(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username.trim()) { setError("Please enter your username or phone number."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(username.trim(), password);
    setLoading(false);
    if (result.success) {
      const acc = result.account;
      if (!acc.tradeId && acc.role !== "ADMIN" && acc.role !== "GOU") {
        navigate("/incomplete");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <PublicNav activeRoute="/login" />

      <div className="flex-1 flex">

        {/* ── LEFT PANEL — Uganda branding ── */}
        <div className="hidden lg:flex flex-col w-[45%] bg-ink relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-[#1a1a1a]" />
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 20% 80%, rgba(247,185,15,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(247,185,15,0.04) 0%, transparent 50%)"
          }} />
          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(247,185,15,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(247,185,15,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }} />

          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            {/* Top spacer */}
            <div />

            {/* Centre — Coat of arms + text */}
            <div className="flex flex-col items-center text-center">
              {/* Coat of arms */}
              <div className="relative mb-8">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-gold/8 blur-3xl scale-150" />
                {/* Frame */}
                <div className="relative w-56 h-56 rounded-full border border-white/10 flex items-center justify-center"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)" }}>
                  <img
                    src="/uganda-coat-of-arms.png"
                    alt="Coat of Arms of Uganda"
                    className="w-48 h-48 object-contain"
                    style={{ filter: "drop-shadow(0 0 24px rgba(247,185,15,0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}
                  />
                </div>
              </div>
              <div className="text-gold font-bold text-xs tracking-[0.25em] uppercase mb-3">Republic of Uganda</div>
              <h2 className="text-white font-bold text-2xl leading-tight mb-3">
                Uganda's Unified<br />Digital Trade Infrastructure
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                A verified Digital Trade ID for every farmer, manufacturer, trader and buyer across Uganda's 179 districts.
              </p>
            </div>

            {/* Bottom — stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                ["179", "Districts"],
                ["Free", "Registration"],
                ["11", "Actor types"],
              ].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="text-gold font-bold text-xl leading-none mb-1">{v}</div>
                  <div className="text-white/30 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Login form ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {fromRegistration && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
                <Check size={15} className="flex-shrink-0" />
                Account created successfully. Sign in to continue.
              </div>
            )}

            {/* Form card */}
            <div className="bg-white border border-warm-border rounded-2xl p-8 shadow-sm mb-4">
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-ink tracking-tight mb-1">Welcome back</h1>
                <p className="text-warm-text text-sm">Sign in to your Digital Trade Platform account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-warm-text uppercase tracking-wider mb-1.5">
                    Username or phone number
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(""); }}
                    className="w-full px-4 py-3 border-2 border-warm-border rounded-xl text-sm text-ink bg-white transition-colors placeholder:text-warm-muted outline-none focus:border-gold"
                    placeholder="e.g. nalwanga_sarah"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-warm-text uppercase tracking-wider">Password</label>
                    <button type="button" className="text-xs text-gold hover:underline font-medium">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      className="w-full px-4 py-3 border-2 border-warm-border rounded-xl text-sm text-ink bg-white transition-colors pr-12 placeholder:text-warm-muted outline-none focus:border-gold"
                      placeholder="Your password"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-ink transition-colors p-1">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-ink hover:bg-ink-mid disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Sign in <ArrowRight size={16} /></span>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-warm-border" />
                <span className="text-xs text-warm-muted">or</span>
                <div className="flex-1 h-px bg-warm-border" />
              </div>

              <button onClick={() => navigate("/register")}
                className="w-full border-2 border-warm-border hover:border-gold text-ink font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                Create a free account <ArrowRight size={15} />
              </button>
            </div>

            {/* Sample accounts */}
            <div className="bg-white border border-warm-border rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setShowAccounts(!showAccounts)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-warm-text hover:text-ink hover:bg-warm-bg transition-all">
                <span className="flex items-center gap-2">
                  <Shield size={15} className="text-gold" />
                  Sign in with a demo account
                </span>
                {showAccounts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showAccounts && (
                <div className="border-t border-warm-border">
                  <div className="p-3 grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto">
                    {SAMPLE_ACCOUNTS.map((acc) => (
                      <button key={acc.username} onClick={() => fillAccount(acc)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-warm-bg transition-all text-left group">
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${ROLE_COLORS[acc.role] || ROLE_COLORS.ADMIN}`}>
                          {acc.role}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-ink truncate">{acc.name}</div>
                          <div className="text-xs text-warm-muted truncate">{acc.username}</div>
                        </div>
                        {acc.tradeId && (
                          <div className="text-[10px] font-mono text-warm-muted group-hover:text-ink transition-colors flex-shrink-0">
                            {acc.tradeId.split("-").slice(-1)[0]}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-warm-border px-4 py-3 bg-warm-bg">
                    <p className="text-xs text-warm-muted">All demo accounts use password: <span className="font-mono font-bold text-ink">password123</span></p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
