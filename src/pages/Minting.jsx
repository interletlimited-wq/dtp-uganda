import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Check, ArrowRight, Copy } from "lucide-react";

const STEPS = [
  { label: "Initialising", duration: 600 },
  { label: "Validating identity", duration: 900 },
  { label: "Registering actor", duration: 800 },
  { label: "Assigning Trade ID", duration: 700 },
  { label: "Writing to registry", duration: 900 },
  { label: "Finalising", duration: 600 },
  { label: "Issued", duration: 400 },
];

export default function Minting() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const tradeId = location.state?.tradeId || user?.tradeId || "UG-DTP-AGR-00000";
  const name = location.state?.name || user?.name || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const progress = Math.round((currentStep / STEPS.length) * 100);

  useEffect(() => {
    let step = 0;
    function runNext() {
      if (step >= STEPS.length) {
        setDone(true);
        return;
      }
      setCurrentStep(step + 1);
      setTimeout(() => {
        step++;
        runNext();
      }, STEPS[step].duration);
    }
    const t = setTimeout(runNext, 400);
    return () => clearTimeout(t);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(tradeId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold opacity-[0.04] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gold opacity-[0.03] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {!done ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 relative">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(247,185,15,0.15)" strokeWidth="4" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#F7B90F" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield size={24} className="text-gold" />
              </div>
            </div>

            <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-2">
              Digital Trade Platform · Uganda
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Generating your Trade ID</h1>
            <p className="text-white/45 text-sm mb-8">Please wait while your identity is registered</p>

            <div className="space-y-2 mb-8 text-left">
              {STEPS.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                  i < currentStep ? "opacity-100" :
                  i === currentStep ? "opacity-100 bg-white/5" :
                  "opacity-20"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    i < currentStep ? "bg-green-500" :
                    i === currentStep ? "bg-gold/20 border border-gold" :
                    "border border-white/20"
                  }`}>
                    {i < currentStep
                      ? <Check size={11} className="text-white" />
                      : i === currentStep
                      ? <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                      : null
                    }
                  </div>
                  <span className={`text-sm ${
                    i < currentStep ? "text-green-400" :
                    i === currentStep ? "text-white font-medium" :
                    "text-white/30"
                  }`}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }} />
            </div>
            <p className="text-white/25 text-xs mt-2">{progress}% complete</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
              <Check size={32} className="text-green-400" />
            </div>

            <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-2">
              Digital Trade Platform · Uganda
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Trade ID issued</h1>
            {name && <p className="text-white/50 text-sm mb-6">Welcome to the platform, {name}</p>}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Your Digital Trade ID</p>
              <div className="font-mono text-gold font-bold text-2xl tracking-wider mb-4">{tradeId}</div>
              <button onClick={handleCopy}
                className="flex items-center gap-2 mx-auto text-xs text-white/40 hover:text-white transition-colors">
                {copied ? <><Check size={12} className="text-green-400" /> Copied</> : <><Copy size={12} /> Copy ID</>}
              </button>
            </div>

            <div className="space-y-2 mb-6 text-left">
              {[
                "Your Trade ID is permanent and linked to your verified identity",
                "It is now searchable on the public verification portal",
                "Full platform access is now unlocked",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-white/50">
                  <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" /> {t}
                </div>
              ))}
            </div>

            <button onClick={() => navigate("/dashboard")}
              className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
              Go to my dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
