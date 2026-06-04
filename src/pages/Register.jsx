import { useState } from "react";
import PublicNav from "../components/PublicNav";
import LanguageSwitcher from "../components/LanguageSwitcher";
import PublicFooter from "../components/PublicFooter";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Shield, Check, X,
  Sprout, Factory, Building2, Handshake, Ship, PackageOpen,
  ShoppingCart, Truck, Globe, User as UserIcon
} from "lucide-react";
import { ACTOR_TYPES } from "../data/constants";

const LUCIDE_ICONS = {
  Sprout, Factory, Building2, Handshake, Ship, PackageOpen,
  ShoppingCart, Truck, Globe, User: UserIcon,
};

function RoleIcon({ name, size = 18, className = "" }) {
  const C = LUCIDE_ICONS[name] || UserIcon;
  return <C size={size} className={className} />;
}

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Number", met: /\d/.test(password) },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
  ];
  const score = checks.filter(c => c.met).length;
  const colors = ["bg-red-400", "bg-amber-400", "bg-green-500"];
  const labels = ["Weak", "Fair", "Strong"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0,1,2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score-1] : "bg-warm-border"}`} />
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1 text-[11px] ${c.met ? "text-green-600" : "text-warm-muted"}`}>
            {c.met ? <Check size={10} /> : <X size={10} />} {c.label}
          </div>
        ))}
        {score > 0 && (
          <span className={`text-[11px] font-semibold ml-auto ${score === 3 ? "text-green-600" : score === 2 ? "text-amber-600" : "text-red-500"}`}>
            {labels[score-1]}
          </span>
        )}
      </div>
    </div>
  );
}

function OTPInput({ value, onChange }) {
  const vals = value.split("").slice(0, 6);
  function handleKey(e, idx) {
    if (e.key === "Backspace") {
      onChange(value.slice(0, idx) + value.slice(idx + 1));
      if (idx > 0) document.getElementById(`otp-${idx-1}`)?.focus();
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = (value.slice(0, idx) + e.key + value.slice(idx + 1)).slice(0, 6);
    onChange(next);
    if (idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
  }
  return (
    <div className="flex gap-2 justify-center">
      {Array(6).fill("").map((_, idx) => (
        <input key={idx} id={`otp-${idx}`} type="text" inputMode="numeric"
          maxLength={1} value={vals[idx] || ""} onChange={() => {}} onKeyDown={e => handleKey(e, idx)}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-warm-border rounded-xl text-ink bg-white transition-all focus:border-gold focus:shadow-[0_0_0_3px_rgba(247,185,15,0.12)]" />
      ))}
    </div>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={10} /> {msg}</p>;
}

function FieldOk({ msg }) {
  if (!msg) return null;
  return <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check size={10} /> {msg}</p>;
}

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateReg } = useAuth();
  const preselectedRole = location.state?.role || "";

  const [role, setRole] = useState(preselectedRole);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phone2, setPhone2] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [maskedPhone, setMaskedPhone] = useState("");

  function touch(field) { setTouched(t => ({ ...t, [field]: true })); }

  const validations = {
    role: !role ? "Please select your role" : "",
    username: !username.trim() ? "Username is required" :
      username.length < 3 ? "At least 3 characters" :
      !/^[a-zA-Z0-9_]+$/.test(username) ? "Letters, numbers and underscores only" : "",
    phone: !phone.trim() ? "Phone number is required" :
      !/^\d{10}$/.test(phone) ? "Enter exactly 10 digits (e.g. 0772123456)" : "",
    email: email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address" : email && email.length < 5 ? "Enter a valid email address" : "",
    password: password.length < 8 ? "At least 8 characters required" : "",
    confirm: !confirm ? "Please confirm your password" :
      confirm !== password ? "Passwords do not match" : "",
    agreed: !agreed ? "You must accept the terms to continue" : "",
  };

  const isValid = Object.values(validations).every(v => !v);

  function showErr(field) { return touched[field] ? validations[field] : ""; }
  function showOk(field) {
    if (!touched[field] || validations[field]) return "";
    const ok = { username: "Username looks good", phone: "Phone number valid", email: "Email valid", password: "", confirm: "Passwords match" };
    return ok[field] || "";
  }

  async function handleSubmit() {
    setTouched({ role: true, username: true, phone: true, email: !!email, password: true, confirm: true, agreed: true });
    setSubmitError("");
    if (!isValid) { setSubmitError("Please fix the errors above before continuing."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    const masked = phone.length > 6 ? phone.slice(0, 4) + "****" + phone.slice(-3) : phone;
    setMaskedPhone(masked);
    setOtpSent(true);
    setResendTimer(60);
    const iv = setInterval(() => setResendTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
  }

  async function handleVerifyOTP() {
    setOtpError("");
    if (otp.length < 6) { setOtpError("Please enter the full 6-digit code."); return; }
    setOtpLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setOtpLoading(false);
    setOtpVerified(true);
    updateReg({ role, username, phone, phone2, email, password, phase: 1, type: "individual" });
    await new Promise(r => setTimeout(r, 700));
    navigate("/incomplete");
  }

  function handleResend() {
    if (resendTimer > 0) return;
    setOtp(""); setOtpError("");
    setResendTimer(60);
    const iv = setInterval(() => setResendTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
  }

  const NavBar = <PublicNav activeRoute="/register" />;

  if (otpSent) {
    return (
      <div className="min-h-screen bg-warm-bg flex flex-col">
        {NavBar}
        <div className="flex-1 flex items-start justify-center pt-16 px-4 pb-16">
          <div className="w-full max-w-md">
            <div className="bg-white border border-warm-border rounded-2xl p-8 shadow-sm text-center">
              {otpVerified ? (
                <>
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-ink mb-2">Phone verified</h2>
                  <p className="text-warm-text text-sm">Account created. Taking you to complete your profile...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Shield size={28} className="text-gold" />
                  </div>
                  <h2 className="text-2xl font-bold text-ink mb-2">Verify your phone</h2>
                  <p className="text-warm-text text-sm mb-1">Enter the 6-digit code sent to</p>
                  <p className="font-mono font-semibold text-ink mb-7">{maskedPhone}</p>
                  <OTPInput value={otp} onChange={setOtp} />
                  {otpError && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2.5 text-sm">{otpError}</div>}
                  <button onClick={handleVerifyOTP} disabled={otpLoading || otp.length < 6}
                    className="w-full mt-6 bg-ink hover:bg-ink-mid disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                    {otpLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Verifying...
                      </span>
                    ) : "Verify and create account"}
                  </button>
                  <div className="mt-4 text-sm text-warm-muted">
                    {resendTimer > 0
                      ? <span>Resend in <span className="font-mono font-medium text-ink">{resendTimer}s</span></span>
                      : <button onClick={handleResend} className="text-ink font-medium hover:underline">Resend code</button>
                    }
                  </div>
                  <div className="mt-5 p-3 bg-warm-bg rounded-lg text-xs text-warm-muted">
                    Any 6-digit code is accepted in this environment.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      {NavBar}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl">
          <div className="bg-white border border-warm-border rounded-2xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 min-h-[600px]">

              {/* LEFT COLUMN  -  Role selection */}
              <div className="bg-warm-bg border-b md:border-b-0 md:border-r border-warm-border p-8 flex flex-col">
                <div className="mb-5">
                  <h1 className="text-2xl font-bold text-ink mb-1 tracking-tight">Create your account</h1>
                  <p className="text-warm-text text-sm leading-relaxed">Select your role in Uganda's trade ecosystem. This determines your dashboard and Trade ID.</p>
                </div>

                {touched.role && validations.role && (
                  <div className="mb-3 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-xs flex items-center gap-2">
                    <X size={11} /> Please select your role to continue
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 flex-1">
                  {ACTOR_TYPES.map(r => (
                    <button key={r.code} type="button"
                      onClick={() => { setRole(r.code); touch("role"); }}
                      className={`border rounded-xl p-3 text-center transition-all flex flex-col items-center justify-center gap-1.5 min-h-[80px] ${
                        role === r.code
                          ? "border-gold bg-gold-light shadow-sm"
                          : "border-warm-border hover:border-gold/50 hover:bg-white bg-white"
                      }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === r.code ? "bg-gold/20" : "bg-warm-bg"}`}>
                        <RoleIcon name={r.icon} size={16} className={role === r.code ? "text-ink" : "text-warm-text"} />
                      </div>
                      <div className="text-xs font-semibold text-ink leading-tight">{r.short}</div>
                      <div className={`text-[10px] font-bold tracking-wider ${role === r.code ? "text-gold-dark" : "text-gold"}`}>{r.code}</div>
                    </button>
                  ))}
                </div>

                {role && (
                  <div className="mt-4 p-3 bg-white border border-warm-border rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <RoleIcon name={ACTOR_TYPES.find(r2 => r2.code === role)?.icon || "User"} size={13} className="text-ink" />
                      </div>
                      <span className="text-xs font-semibold text-ink">{ACTOR_TYPES.find(r2 => r2.code === role)?.name}</span>
                    </div>
                    <p className="text-[11px] text-warm-muted leading-relaxed pl-8">
                      {ACTOR_TYPES.find(r2 => r2.code === role)?.desc}
                    </p>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-warm-muted">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-ink font-semibold hover:underline underline-offset-2">Sign in</button>
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN  -  Form fields */}
              <div className="p-8 flex flex-col">
                <h2 className="text-base font-bold text-ink mb-5 pb-4 border-b border-warm-border">Account details</h2>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">
                        Username <span className="text-red-400">*</span>
                      </label>
                      <input value={username}
                        onChange={e => { setUsername(e.target.value); setSubmitError(""); }}
                        onBlur={() => touch("username")}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted transition-colors ${
                          showErr("username") ? "border-red-300 bg-red-50/30" :
                          touched.username && !validations.username ? "border-green-300" : "border-warm-border"
                        }`}
                        placeholder="e.g. nalwanga_s" />
                      <FieldError msg={showErr("username")} />
                      <FieldOk msg={showOk("username")} />
                      {!touched.username && <p className="text-[11px] text-warm-muted mt-1">Letters, numbers, underscores</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <input value={phone}
                        onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setPhone(v); setSubmitError(""); }}
                        onBlur={() => touch("phone")}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted transition-colors ${
                          showErr("phone") ? "border-red-300 bg-red-50/30" :
                          touched.phone && !validations.phone ? "border-green-300" : "border-warm-border"
                        }`}
                        placeholder="+256 7XX XXX XXX" type="tel" />
                      <FieldError msg={showErr("phone")} />
                      <FieldOk msg={showOk("phone")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">
                        Email <span className="text-warm-muted font-normal normal-case">(optional)</span>
                      </label>
                      <input value={email}
                        onChange={e => { setEmail(e.target.value); setSubmitError(""); }}
                        onBlur={() => { if (email) touch("email"); }}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted transition-colors ${
                          showErr("email") ? "border-red-300 bg-red-50/30" : "border-warm-border"
                        }`}
                        placeholder="your@email.com" type="email" />
                      <FieldError msg={showErr("email")} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">
                        Secondary phone <span className="text-warm-muted font-normal normal-case">(optional)</span>
                      </label>
                      <input value={phone2}
                        onChange={e => { if (/^\d{0,10}$/.test(e.target.value)) setPhone2(e.target.value); }}
                        className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted"
                        placeholder="e.g. 0772123456"
                        maxLength={10}
                        onKeyPress={e => { if (!/\d/.test(e.key)) e.preventDefault(); }}
                        inputMode="numeric"
                        type="tel" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input value={password}
                        onChange={e => { setPassword(e.target.value); setSubmitError(""); }}
                        onBlur={() => touch("password")}
                        type={showPw ? "text" : "password"}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white pr-10 placeholder:text-warm-muted transition-colors ${
                          showErr("password") ? "border-red-300 bg-red-50/30" :
                          touched.password && !validations.password ? "border-green-300" : "border-warm-border"
                        }`}
                        placeholder="Min. 8 characters" />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-ink transition-colors">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <PasswordStrength password={password} />
                    <FieldError msg={showErr("password")} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">
                      Confirm password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input value={confirm}
                        onChange={e => { setConfirm(e.target.value); setSubmitError(""); }}
                        onBlur={() => touch("confirm")}
                        type={showConfirm ? "text" : "password"}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white pr-10 placeholder:text-warm-muted transition-colors ${
                          showErr("confirm") ? "border-red-300 bg-red-50/30" :
                          touched.confirm && !validations.confirm ? "border-green-300" : "border-warm-border"
                        }`}
                        placeholder="Repeat password" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-ink transition-colors">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <FieldError msg={showErr("confirm")} />
                    <FieldOk msg={showOk("confirm")} />
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    touched.agreed && validations.agreed ? "bg-red-50/30 border-red-200" : "bg-warm-bg border-warm-border"
                  }`}>
                    <input type="checkbox" id="terms" checked={agreed}
                      onChange={e => { setAgreed(e.target.checked); touch("agreed"); setSubmitError(""); }}
                      className="mt-0.5 accent-gold flex-shrink-0 w-4 h-4 cursor-pointer" />
                    <label htmlFor="terms" className="text-xs text-warm-text leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <span className="text-ink font-semibold underline underline-offset-2">Terms and Conditions</span>
                      {" "}and{" "}
                      <span className="text-ink font-semibold underline underline-offset-2">Privacy Policy</span>
                    </label>
                  </div>
                  <FieldError msg={touched.agreed ? validations.agreed : ""} />
                </div>

                {submitError && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <X size={14} className="flex-shrink-0" /> {submitError}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={loading}
                  className="w-full mt-5 bg-gold hover:bg-gold-mid disabled:opacity-50 disabled:cursor-not-allowed text-ink font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Sending verification code...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Create account <ArrowRight size={16} /></span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
