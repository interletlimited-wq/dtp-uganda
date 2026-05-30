import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, LogOut, Shield, CheckCircle, Circle } from "lucide-react";
import { ACTOR_TYPES } from "../data/constants";

export default function Incomplete() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = ACTOR_TYPES.find(r => r.code === user?.role);

  const steps = [
    { label: "Account created", done: true, desc: "Username, phone and password set" },
    { label: "Phone verified", done: true, desc: "One-time code confirmed" },
    { label: "Identity verification", done: false, desc: "NIN, TIN or BRN verification" },
    { label: "Products and regions", done: false, desc: "What you trade and where" },
    { label: "Payment details", done: false, desc: "How you send and receive payment" },
    { label: "Trade ID issued", done: false, desc: "Your permanent digital identity" },
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <div className="bg-ink h-14 flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center font-bold text-ink text-[10px]">DTP</div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">Digital Trade Platform</div>
            <div className="text-white/35 text-[10px]">Empowering Digital Economy</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="text-white/45 hover:text-white text-sm transition-colors flex items-center gap-1.5">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">

          <div className="bg-white border border-warm-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-ink p-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold opacity-[0.06] rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/25 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Welcome, {user?.username}</div>
                    <div className="text-white/45 text-xs">
                      {role?.name || user?.role} account created
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Complete your profile to receive your Trade ID
                </h1>
                <p className="text-white/50 text-sm leading-relaxed">
                  Your account is created. Complete the steps below to verify your identity and receive your permanent Digital Trade ID. Full platform access unlocks once your Trade ID is issued.
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-warm-text uppercase tracking-wider">Progress</span>
                  <span className="text-xs font-semibold text-ink">2 of 6 steps complete</span>
                </div>
                <div className="h-2 bg-warm-bg rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: "33%" }} />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {steps.map((step, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    step.done
                      ? "bg-green-50 border-green-200"
                      : i === 2
                      ? "bg-gold-light border-gold/40"
                      : "bg-warm-bg border-warm-border"
                  }`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {step.done
                        ? <CheckCircle size={18} className="text-green-500" />
                        : i === 2
                        ? <div className="w-[18px] h-[18px] rounded-full border-2 border-gold bg-gold/10 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-gold" /></div>
                        : <Circle size={18} className="text-warm-border" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${step.done ? "text-green-700" : i === 2 ? "text-ink" : "text-warm-text"}`}>
                        {step.label}
                        {i === 2 && <span className="ml-2 text-[10px] font-bold text-gold uppercase tracking-wider">Next step</span>}
                      </div>
                      <div className="text-xs text-warm-muted mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/profile-setup")}
                className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                Continue completing your profile <ArrowRight size={16} />
              </button>

              <p className="text-center text-xs text-warm-muted mt-4">
                You can save your progress and continue at any time.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
