import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ArrowLeft, User, Shield, Edit2, Check, X,
  Phone, Mail, MapPin, CreditCard, Plus, Trash2,
  Lock, Eye, EyeOff
} from "lucide-react";
import { UGANDAN_BANKS } from "../data/constants";

const ACTOR_TYPE_NAMES = {
  AGR: "Farmer / Agro-producer", VAP: "Value-added Processor",
  MFR: "Manufacturer", AGT: "Aggregator / Trader",
  EXP: "Exporter", IMP: "Importer", BYR: "Buyer / Offtaker",
  TRP: "Transporter", CSM: "Consumer", ADMIN: "Platform Administrator",
  GOU: "GoU Oversight (MTIC)", FBR: "Foreign Buyer / International Trader"
};

const VERIFICATION_COLORS = {
  NIRA: "bg-blue-50 text-blue-700 border-blue-200",
  URA: "bg-purple-50 text-purple-700 border-purple-200",
  URSB: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editSection, setEditSection] = useState(null);
  const [saved, setSaved] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    altPhone: "",
    email: user?.email || "",
    district: user?.district || "",
    subCounty: "",
    village: "",
    bio: "",
  });

  const [payments, setPayments] = useState([
    { id: 1, type: "momo", provider: "MTN MoMo", phone: "0772441829", name: user?.name || "", default: true },
  ]);

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");

  const [newPayment, setNewPayment] = useState({ type: "momo", provider: "MTN MoMo", phone: "", name: "", bank: "", account: "", accName: "" });
  const [showAddPayment, setShowAddPayment] = useState(false);

  function saveProfile() {
    setSaved("Profile updated.");
    setEditSection(null);
    setTimeout(() => setSaved(""), 3000);
  }

  function savePassword() {
    if (!passwords.current) { setPwError("Enter your current password"); return; }
    if (passwords.new.length < 8) { setPwError("New password must be at least 8 characters"); return; }
    if (passwords.new !== passwords.confirm) { setPwError("Passwords do not match"); return; }
    setPwError("");
    setSaved("Password changed successfully.");
    setEditSection(null);
    setPasswords({ current: "", new: "", confirm: "" });
    setTimeout(() => setSaved(""), 3000);
  }

  function addPayment() {
    const p = newPayment.type === "momo"
      ? { ...newPayment, id: Date.now(), default: payments.length === 0 }
      : { ...newPayment, id: Date.now(), default: payments.length === 0 };
    if (newPayment.type === "momo" && !newPayment.phone) return;
    if (newPayment.type === "bank" && !newPayment.account) return;
    setPayments([...payments, p]);
    setShowAddPayment(false);
    setNewPayment({ type: "momo", provider: "MTN MoMo", phone: "", name: "", bank: "", account: "", accName: "" });
    setSaved("Payment method added.");
    setTimeout(() => setSaved(""), 3000);
  }

  function removePayment(id) {
    setPayments(payments.filter(p => p.id !== id));
  }

  function setDefault(id) {
    setPayments(payments.map(p => ({ ...p, default: p.id === id })));
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
          <ArrowLeft size={15} /> Dashboard
        </button>
        <h1 className="text-xl font-bold text-ink">My Profile</h1>
        <p className="text-sm text-warm-text">Manage your personal details, contact information and payment methods</p>
      </div>

      {saved && (
        <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Check size={15} className="flex-shrink-0" /> {saved}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">

          {/* Trade ID Card */}
          <div className="bg-ink rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gold opacity-[0.06] rounded-full" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1">Digital Trade Platform - Uganda</div>
              <div className="font-mono text-gold font-bold text-xl tracking-wider mb-4">{user?.tradeId}</div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-4">
                {(user?.role === "FBR"
                  ? [
                      ["Full name", user?.name],
                      ["Actor type", ACTOR_TYPE_NAMES[user?.role] || user?.role],
                      ["Country of origin", user?.country || "-"],
                      ["Business", (user?.natureOfBusiness || []).join(", ") || "-"],
                      ["Verified by", user?.verifiedLabel || `${user?.verified} Verified`],
                      ["Status", "Active"],
                    ]
                  : [
                      ["Full name", user?.name],
                      ["Actor type", ACTOR_TYPE_NAMES[user?.role] || user?.role],
                      ["Grade", user?.grade || "-"],
                      ["District", user?.district || "-"],
                      ["Verified by", user?.verifiedLabel || user?.verified || "-"],
                      ["Status", "Active"],
                    ]
                ).map(([l, v]) => (
                  <div key={l}>
                    <div className="text-[9px] uppercase tracking-wider text-white/25">{l}</div>
                    <div className="text-white text-xs mt-0.5 font-medium">{v}</div>
                  </div>
                ))}
              </div>
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${VERIFICATION_COLORS[user?.verified] || "bg-gold/10 border-gold/25 text-gold"}`}>
                <Shield size={11} /> {user?.verified === "International" ? "International Verified" : `${user?.verified} Verified`} - Active
              </div>
            </div>
          </div>

          {/* FBR contact & location */}
          {user?.role === "FBR" && (
            <div className="bg-white border border-warm-border rounded-xl p-5">
              <h2 className="font-bold text-ink mb-4">Contact &amp; location</h2>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  ["Contact person", user?.contactPerson],
                  ["Email", user?.contactEmail],
                  ["Phone", user?.contactPhone],
                  ["Website", user?.website],
                  ["Address", user?.addressLine],
                  ["City / Town", user?.city],
                  ["State / Province", user?.stateProvince],
                  ["Postal code", user?.postalCode],
                  ["Country", user?.country],
                ].filter(([, v]) => v).map(([l, v]) => (
                  <div key={l} className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-warm-muted">{l}</span>
                    <span className="text-sm text-ink font-medium break-words">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Details */}
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">Personal details</h2>
              <button onClick={() => setEditSection(editSection === "profile" ? null : "profile")}
                className="flex items-center gap-1.5 text-xs font-medium text-warm-text hover:text-ink border border-warm-border hover:border-ink px-3 py-1.5 rounded-lg transition-all">
                <Edit2 size={12} /> {editSection === "profile" ? "Cancel" : "Edit"}
              </button>
            </div>
            {editSection === "profile" ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  ["Full name", "name", "text", "e.g. Nalwanga Sarah"],
                  ["Phone number", "phone", "tel", "e.g. 0772441829"],
                  ["Alternative phone", "altPhone", "tel", "e.g. 0700123456"],
                  ["Email address", "email", "email", "e.g. name@example.com"],
                  ["District", "district", "text", "e.g. Mbale"],
                  ["Sub-county", "subCounty", "text", "e.g. Sipi"],
                  ["Village", "village", "text", "e.g. Kapkwai"],
                ].map(([label, key, type, placeholder]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">{label}</label>
                    <input type={type} value={profile[key]} onChange={e => setProfile({...profile, [key]: e.target.value})}
                      className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                      placeholder={placeholder} />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Bio / Business description</label>
                  <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}
                    className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white resize-none h-20"
                    placeholder="Brief description of your business or farming operation..." />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button onClick={saveProfile}
                    className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
                    <Check size={15} /> Save changes
                  </button>
                  <button onClick={() => setEditSection(null)}
                    className="flex items-center gap-2 border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
                    <X size={15} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  ["Full name", profile.name || user?.name, <User size={14}/>],
                  ["Phone", profile.phone || user?.phone || "-", <Phone size={14}/>],
                  ["Alt phone", profile.altPhone || "-", <Phone size={14}/>],
                  ["Email", profile.email || user?.email || "-", <Mail size={14}/>],
                  ["District", profile.district || user?.district || "-", <MapPin size={14}/>],
                  ["Sub-county", profile.subCounty || "-", <MapPin size={14}/>],
                ].map(([l, v, icon]) => (
                  <div key={l} className="flex items-center gap-3 p-3 bg-warm-bg rounded-lg">
                    <div className="text-warm-muted flex-shrink-0">{icon}</div>
                    <div>
                      <div className="text-[10px] text-warm-muted uppercase tracking-wider">{l}</div>
                      <div className="text-sm font-medium text-ink">{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">Payment methods</h2>
              <button onClick={() => setShowAddPayment(!showAddPayment)}
                className="flex items-center gap-1.5 text-xs font-medium text-warm-text hover:text-ink border border-warm-border hover:border-ink px-3 py-1.5 rounded-lg transition-all">
                <Plus size={12} /> Add method
              </button>
            </div>

            {showAddPayment && (
              <div className="mb-4 p-4 bg-warm-bg border border-warm-border rounded-xl">
                <div className="flex gap-2 mb-3">
                  {["momo", "bank"].map(t => (
                    <button key={t} onClick={() => setNewPayment({...newPayment, type: t})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${newPayment.type === t ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border"}`}>
                      {t === "momo" ? "Mobile Money" : "Bank Account"}
                    </button>
                  ))}
                </div>
                {newPayment.type === "momo" ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Provider</label>
                      <select value={newPayment.provider} onChange={e => setNewPayment({...newPayment, provider: e.target.value})}
                        className="w-full px-3 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white">
                        <option>MTN MoMo</option>
                        <option>Airtel Money</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Phone</label>
                      <input value={newPayment.phone} onChange={e => setNewPayment({...newPayment, phone: e.target.value.replace(/\D/g,"").slice(0,10)})}
                        className="w-full px-3 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder="0772..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Account name</label>
                      <input value={newPayment.name} onChange={e => setNewPayment({...newPayment, name: e.target.value})}
                        className="w-full px-3 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder="Name on account" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Bank</label>
                      <select value={newPayment.bank} onChange={e => setNewPayment({...newPayment, bank: e.target.value})}
                        className="w-full px-3 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white">
                        <option value="">Select bank</option>
                        {UGANDAN_BANKS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Account number</label>
                      <input value={newPayment.account} onChange={e => setNewPayment({...newPayment, account: e.target.value.replace(/\D/g,"").slice(0,14)})}
                        className="w-full px-3 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder="10-14 digits" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Account name</label>
                      <input value={newPayment.accName} onChange={e => setNewPayment({...newPayment, accName: e.target.value})}
                        className="w-full px-3 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder="Name on account" />
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={addPayment}
                    className="flex items-center gap-1.5 bg-gold hover:bg-gold-mid text-ink font-semibold px-4 py-2 rounded-lg text-sm transition-all">
                    <Check size={13} /> Add
                  </button>
                  <button onClick={() => setShowAddPayment(false)}
                    className="border border-warm-border text-warm-text hover:text-ink px-4 py-2 rounded-lg text-sm transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {payments.map(p => (
                <div key={p.id} className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${p.default ? "bg-gold/5 border-gold/30" : "bg-white border-warm-border"}`}>
                  <div className="w-9 h-9 bg-warm-bg rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard size={16} className="text-warm-muted" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink">
                      {p.type === "momo" ? `${p.provider} - ${p.phone}` : `${p.bank} - ****${p.account?.slice(-4)}`}
                    </div>
                    <div className="text-xs text-warm-muted">{p.name || p.accName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.default ? (
                      <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">Default</span>
                    ) : (
                      <button onClick={() => setDefault(p.id)}
                        className="text-xs text-warm-muted hover:text-ink border border-warm-border hover:border-ink px-2 py-1 rounded-lg transition-all">
                        Set default
                      </button>
                    )}
                    <button onClick={() => removePayment(p.id)}
                      className="text-warm-muted hover:text-red-500 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <div className="text-center py-6 text-warm-muted text-sm">
                  No payment methods added yet.
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">Password and security</h2>
              <button onClick={() => setEditSection(editSection === "password" ? null : "password")}
                className="flex items-center gap-1.5 text-xs font-medium text-warm-text hover:text-ink border border-warm-border hover:border-ink px-3 py-1.5 rounded-lg transition-all">
                <Lock size={12} /> Change password
              </button>
            </div>
            {editSection === "password" ? (
              <div className="space-y-3">
                {[
                  ["Current password", "current"],
                  ["New password", "new"],
                  ["Confirm new password", "confirm"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">{label}</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"}
                        value={passwords[key]} onChange={e => setPasswords({...passwords, [key]: e.target.value})}
                        className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white pr-10"
                        placeholder="••••••••" />
                      <button onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-ink transition-colors">
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
                {pwError && <p className="text-xs text-red-500 flex items-center gap-1"><X size={10} /> {pwError}</p>}
                <div className="flex gap-3 pt-1">
                  <button onClick={savePassword}
                    className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
                    <Check size={15} /> Update password
                  </button>
                  <button onClick={() => { setEditSection(null); setPwError(""); }}
                    className="border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-warm-bg rounded-lg">
                <Lock size={16} className="text-warm-muted" />
                <div className="text-sm text-warm-text">Password last changed: not recorded in this session</div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <h2 className="font-bold text-ink mb-4">Account summary</h2>
            <div className="space-y-3">
              {[
                ["Trade ID", user?.tradeId, "font-mono text-gold font-bold"],
                ["Role", ACTOR_TYPE_NAMES[user?.role] || user?.role, ""],
                ...(user?.role === "FBR"
                  ? [["Country", user?.country || "-", ""]]
                  : [["Grade", user?.grade || "-", ""], ["District", user?.district || "-", ""]]),
                ["Verified by", user?.verifiedLabel || user?.verified || "-", ""],
                ["Account status", "Active", "text-green-600 font-semibold"],
              ].map(([l, v, cls]) => (
                <div key={l} className="flex items-center justify-between py-2 border-b border-warm-border last:border-0">
                  <span className="text-xs text-warm-muted">{l}</span>
                  <span className={`text-xs font-medium text-ink text-right max-w-[150px] truncate ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-warm-border rounded-xl p-5">
            <h2 className="font-bold text-ink mb-4">Verification</h2>
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${VERIFICATION_COLORS[user?.verified] || "bg-warm-bg border-warm-border"}`}>
              <Shield size={18} className="flex-shrink-0" />
              <div>
                <div className="text-sm font-bold">{user?.verifiedLabel || `${user?.verified} Verified`}</div>
                <div className="text-xs opacity-70">{user?.role === "FBR" ? "International identity confirmed · private" : "Identity confirmed"}</div>
              </div>
            </div>
            <p className="text-xs text-warm-muted mt-3 leading-relaxed">
              Your identity was verified during registration. To update your verification details contact support.
            </p>
          </div>

          <div className="bg-white border border-warm-border rounded-xl p-5">
            <h2 className="font-bold text-ink mb-3">Danger zone</h2>
            <p className="text-xs text-warm-muted mb-3 leading-relaxed">These actions are permanent and cannot be undone. Contact support if you need assistance.</p>
            <button onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
              Sign out of all devices
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
