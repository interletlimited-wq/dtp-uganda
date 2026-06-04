import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight, ArrowLeft, Check, X, ChevronDown, LogOut,
  Sprout, Factory, Building2, Handshake, Ship, PackageOpen,
  ShoppingCart, Truck, Globe, User as UserIcon
} from "lucide-react";

const LUCIDE_ICONS = {
  Sprout, Factory, Building2, Handshake, Ship, PackageOpen,
  ShoppingCart, Truck, Globe, User: UserIcon,
};

function RoleIcon({ name, size = 16, className = "" }) {
  const C = LUCIDE_ICONS[name] || UserIcon;
  return <C size={size} className={className} />;
}
import {
  ACTOR_TYPES, ENTITY_TYPES, MFR_SECTORS, VAP_PROCESSING_TYPES,
  PRODUCTS, UGANDAN_BANKS, COUNTRIES, FBR_NATURE_OF_BUSINESS
} from "../data/constants";
import {
  REGIONS as GEO_REGIONS, SUB_REGIONS as GEO_SUB,
  DISTRICTS as GEO_DISTRICTS, getSubRegionsByRegion, getDistrictsBySubRegion
} from "../data/geo";

const STEPS = [
  { id: 1, label: "Role & type" },
  { id: 2, label: "Identity" },
  { id: 3, label: "Products" },
  { id: 4, label: "Regions" },
  { id: 5, label: "Payment" },
];

// Foreign actors capture country/business, an international identity, and their
// own contact & location details instead of Ugandan regions.
const FBR_STEPS = [
  { id: 1, label: "Country & business" },
  { id: 2, label: "Identity" },
  { id: 3, label: "Products" },
  { id: 4, label: "Contact & location" },
  { id: 5, label: "Payment" },
];

function StepBar({ current, steps = STEPS }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              current > s.id ? "bg-green-500 border-green-500 text-white" :
              current === s.id ? "bg-ink border-ink text-white" :
              "bg-white border-warm-border text-warm-muted"
            }`}>
              {current > s.id ? <Check size={14} /> : s.id}
            </div>
            <div className={`text-[10px] mt-1 font-medium whitespace-nowrap ${current === s.id ? "text-ink" : "text-warm-muted"}`}>
              {s.label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${current > s.id ? "bg-green-400" : "bg-warm-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function RegisteringAs({ actor }) {
  if (!actor) return null;
  return (
    <div className="flex items-center gap-3 p-3 bg-warm-bg border border-warm-border rounded-xl mb-2">
      <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center flex-shrink-0">
        <RoleIcon name={actor.icon} size={16} className="text-gold" />
      </div>
      <div>
        <div className="text-xs text-warm-muted">Registering as</div>
        <div className="text-sm font-bold text-ink">{actor.name} <span className="text-gold font-mono text-xs">({actor.code})</span></div>
      </div>
    </div>
  );
}

// FBR (Foreign Buyer / International Trader): country of origin + nature of business.
function Step1FBR({ data, onChange, actor }) {
  const nature = data.natureOfBusiness || [];
  function toggleNature(n) {
    onChange({ natureOfBusiness: nature.includes(n) ? nature.filter(x => x !== n) : [...nature, n] });
  }
  return (
    <div className="space-y-5">
      <RegisteringAs actor={actor} />
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Country of origin <span className="text-red-400">*</span></label>
        <select value={data.country} onChange={e => onChange({ country: e.target.value })}
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
          <option value="">Select country</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <p className="text-[11px] text-warm-muted mt-1">Used for analytics, customs routing and display of the sourcing origin.</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-2">Nature of business <span className="text-red-400">*</span> <span className="text-warm-muted normal-case font-normal">(select all that apply)</span></label>
        <div className="grid grid-cols-2 gap-2">
          {FBR_NATURE_OF_BUSINESS.map(n => {
            const on = nature.includes(n);
            return (
              <button key={n} type="button" onClick={() => toggleNature(n)}
                className={`p-2.5 border rounded-xl text-xs text-left transition-all ${on ? "border-gold bg-gold-light font-semibold text-ink" : "border-warm-border hover:border-gold/50 text-warm-text"}`}>
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step1({ data, onChange, role }) {
  const actor = ACTOR_TYPES.find(a => a.code === role);
  const isMFR = role === "MFR";
  if (actor?.foreign) return <Step1FBR data={data} onChange={onChange} actor={actor} />;
  return (
    <div className="space-y-5">
      <RegisteringAs actor={actor} />
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-2">Registration type <span className="text-red-400">*</span></label>
        <div className="grid grid-cols-2 gap-3">
          {["individual", "entity"].map(t => (
            <button key={t} type="button" onClick={() => onChange({ type: t })}
              className={`p-4 border-2 rounded-xl text-center transition-all ${data.type === t ? "border-gold bg-gold-light" : "border-warm-border hover:border-gold/50"}`}>
              <div className="font-semibold text-ink capitalize text-sm">{t === "individual" ? "Individual" : "Entity / Organisation"}</div>
              <div className="text-xs text-warm-muted mt-1">{t === "individual" ? "Natural person  -  NIN required" : "Company, cooperative, SACCO  -  TIN or BRN required"}</div>
            </button>
          ))}
        </div>
      </div>
      {data.type === "entity" && (
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Entity type <span className="text-red-400">*</span></label>
          <select value={data.entityType} onChange={e => onChange({ entityType: e.target.value })}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            <option value="">Select entity type</option>
            {ENTITY_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-2">Grade / Scale <span className="text-red-400">*</span></label>
        <div className="grid grid-cols-2 gap-2">
          {(actor?.grades || []).map(g => (
            <button key={g} type="button" onClick={() => onChange({ grade: g })}
              className={`p-3 border rounded-xl text-sm text-left transition-all ${data.grade === g ? "border-gold bg-gold-light font-semibold text-ink" : "border-warm-border hover:border-gold/50 text-warm-text"}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
      {isMFR && (
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Production sector <span className="text-red-400">*</span></label>
          <select value={data.sector} onChange={e => onChange({ sector: e.target.value })}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            <option value="">Select production sector</option>
            {MFR_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

// FBR international identity path — passport (individual) or business registration (entity).
function Step2FBR({ data, onChange }) {
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const method = data.verifyMethod === "intl_brn" ? "intl_brn" : "passport";

  function setMethod(m) {
    onChange({ verifyMethod: m, verified: false, verifiedLabel: "" });
    setVerifyError("");
  }

  async function handleVerify() {
    setVerifyError("");
    const name = (data.verifiedName || "").trim();
    if (!name) { setVerifyError("Please enter the registered legal name."); return; }
    if (method === "passport" && (!data.passport || data.passport.length < 5)) { setVerifyError("Please enter a valid passport number."); return; }
    if (method === "intl_brn" && (!data.intlReg || data.intlReg.length < 4)) { setVerifyError("Please enter a valid business registration number."); return; }
    if (!data.verifyCountry) { setVerifyError("Please select the issuing country."); return; }
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1500));
    setVerifying(false);
    const docLabel = method === "passport" ? "Passport Verified" : "Business Registration Verified";
    onChange({
      verified: true,
      type: method === "passport" ? "individual" : "entity",
      verifiedLabel: `${docLabel} (${data.verifyCountry})`,
    });
  }

  return (
    <div className="space-y-5">
      <div className="bg-gold-light border border-gold-border rounded-xl p-3 text-xs text-gold-dark leading-relaxed">
        Foreign actors hold no Ugandan identity, so you are verified through an international identity path — not NIRA, URA or URSB. This detail stays private to you and platform admins; the public sees only your rating-based trust tick.
      </div>

      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-2">Verification method</label>
        <div className="grid grid-cols-2 gap-2">
          {[{ id: "passport", label: "Passport", desc: "Individual" }, { id: "intl_brn", label: "Business Registration", desc: "Entity" }].map(m => (
            <button key={m.id} type="button" onClick={() => setMethod(m.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${method === m.id ? "border-gold bg-gold-light" : "border-warm-border hover:border-gold/50"}`}>
              <div className="font-bold text-ink text-sm">{m.label}</div>
              <div className="text-[11px] text-warm-muted">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">{method === "passport" ? "Full name (as on passport)" : "Registered entity name"} <span className="text-red-400">*</span></label>
        <input value={data.verifiedName} onChange={e => onChange({ verifiedName: e.target.value, verified: false })}
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted"
          placeholder={method === "passport" ? "e.g. Hans Müller" : "e.g. Neumann Gruppe GmbH"} />
      </div>

      {method === "passport" ? (
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Passport number <span className="text-red-400">*</span></label>
          <input value={data.passport} onChange={e => onChange({ passport: e.target.value.toUpperCase(), verified: false })}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm font-mono text-ink bg-white placeholder:text-warm-muted"
            placeholder="Passport number" />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">International business registration number <span className="text-red-400">*</span></label>
            <input value={data.intlReg} onChange={e => onChange({ intlReg: e.target.value.toUpperCase(), verified: false })}
              className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm font-mono text-ink bg-white placeholder:text-warm-muted"
              placeholder="Registration number" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Tax identifier <span className="text-warm-muted normal-case font-normal">(optional)</span></label>
            <input value={data.intlTin} onChange={e => onChange({ intlTin: e.target.value.toUpperCase(), verified: false })}
              className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm font-mono text-ink bg-white placeholder:text-warm-muted"
              placeholder="VAT / tax ID" />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">{method === "passport" ? "Country of issue" : "Country of registration"} <span className="text-red-400">*</span></label>
        <select value={data.verifyCountry} onChange={e => onChange({ verifyCountry: e.target.value, verified: false })}
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
          <option value="">Select country</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {verifyError && <p className="text-xs text-red-500 flex items-center gap-1"><X size={11} />{verifyError}</p>}

      {data.verified ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <Check size={18} className="text-green-500 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-green-700">International Verified</div>
            <div className="text-xs text-green-600">{data.verifiedLabel} · {data.verifiedName}</div>
          </div>
        </div>
      ) : (
        <button onClick={handleVerify} disabled={verifying}
          className="w-full bg-ink hover:bg-ink-mid disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
          {verifying ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Verifying international identity...
            </span>
          ) : "Verify international identity"}
        </button>
      )}
      <p className="text-xs text-warm-muted text-center">Verification is simulated in this environment. Any valid-length input will verify.</p>
    </div>
  );
}

function Step2({ data, onChange }) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  async function handleVerify() {
    setVerifyError("");
    const val = data.verifyMethod === "nin" ? data.nin :
                data.verifyMethod === "tin" ? data.tin : data.brn;
    const minLen = data.verifyMethod === "tin" ? 10 : 14;
    if (!val || val.length < minLen) {
      setVerifyError(`Please enter a valid ${data.verifyMethod.toUpperCase()} (${minLen} characters)`);
      return;
    }
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1500));
    setVerifying(false);
    setVerified(true);
    const names = { nin: "Nalwanga Sarah", tin: "Kampala Mills Limited", brn: "Interlet Limited" };
    onChange({ verified: true, verifiedName: names[data.verifyMethod] || "Verified Actor" });
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-2">Verification method</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "nin", label: "NIN", desc: "Individual  -  NIRA", len: "14 chars" },
            { id: "tin", label: "TIN", desc: "Entity  -  URA", len: "10 digits" },
            { id: "brn", label: "BRN", desc: "Entity  -  URSB", len: "14 chars" },
          ].map(m => (
            <button key={m.id} type="button" onClick={() => { onChange({ verifyMethod: m.id, verified: false, verifiedName: "" }); setVerified(false); setVerifyError(""); }}
              className={`p-3 border-2 rounded-xl text-center transition-all ${data.verifyMethod === m.id ? "border-gold bg-gold-light" : "border-warm-border hover:border-gold/50"}`}>
              <div className="font-bold text-ink text-sm">{m.label}</div>
              <div className="text-[11px] text-warm-muted">{m.desc}</div>
              <div className="text-[10px] text-gold font-medium">{m.len}</div>
            </button>
          ))}
        </div>
      </div>
      {data.verifyMethod === "nin" && (
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">National Identification Number (NIN) <span className="text-red-400">*</span></label>
          <input value={data.nin} onChange={e => { onChange({ nin: e.target.value.toUpperCase(), verified: false, verifiedName: "" }); setVerified(false); }}
            maxLength={14}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm font-mono text-ink bg-white placeholder:text-warm-muted"
            placeholder="CF XXXXXXXXXX XXXXX" />
          <div className="flex justify-between mt-1">
            <p className="text-[11px] text-warm-muted">Exactly 14 characters  -  verified against NIRA</p>
            <p className={`text-[11px] font-mono ${data.nin.length === 14 ? "text-green-600" : "text-warm-muted"}`}>{data.nin.length}/14</p>
          </div>
        </div>
      )}
      {data.verifyMethod === "tin" && (
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Tax Identification Number (TIN) <span className="text-red-400">*</span></label>
          <input value={data.tin} onChange={e => { onChange({ tin: e.target.value, verified: false, verifiedName: "" }); setVerified(false); }}
            maxLength={10}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm font-mono text-ink bg-white placeholder:text-warm-muted"
            placeholder="10-digit TIN" />
          <div className="flex justify-between mt-1">
            <p className="text-[11px] text-warm-muted">10 digits  -  verified against URA</p>
            <p className={`text-[11px] font-mono ${data.tin.length === 10 ? "text-green-600" : "text-warm-muted"}`}>{data.tin.length}/10</p>
          </div>
        </div>
      )}
      {data.verifyMethod === "brn" && (
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Business Registration Number (BRN) <span className="text-red-400">*</span></label>
          <input value={data.brn} onChange={e => { onChange({ brn: e.target.value.toUpperCase(), verified: false, verifiedName: "" }); setVerified(false); }}
            maxLength={14}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm font-mono text-ink bg-white placeholder:text-warm-muted"
            placeholder="14-character BRN" />
          <div className="flex justify-between mt-1">
            <p className="text-[11px] text-warm-muted">14 characters  -  verified against URSB</p>
            <p className={`text-[11px] font-mono ${data.brn.length === 14 ? "text-green-600" : "text-warm-muted"}`}>{data.brn.length}/14</p>
          </div>
        </div>
      )}
      {verifyError && <p className="text-xs text-red-500 flex items-center gap-1"><X size={11} />{verifyError}</p>}
      {verified || data.verified ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <Check size={18} className="text-green-500 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-green-700">Identity verified</div>
            <div className="text-xs text-green-600">{data.verifiedName}</div>
          </div>
        </div>
      ) : (
        <button onClick={handleVerify} disabled={verifying}
          className="w-full bg-ink hover:bg-ink-mid disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
          {verifying ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Verifying with {data.verifyMethod === "nin" ? "NIRA" : data.verifyMethod === "tin" ? "URA" : "URSB"}...
            </span>
          ) : `Verify with ${data.verifyMethod === "nin" ? "NIRA" : data.verifyMethod === "tin" ? "URA" : "URSB"}`}
        </button>
      )}
      <p className="text-xs text-warm-muted text-center">Verification is simulated in this environment. Any valid-length input will verify.</p>
    </div>
  );
}

function Step3({ data, onChange }) {
  const selected = data.products || [];
  function toggle(p) {
    const next = selected.includes(p) ? selected.filter(x => x !== p) : [...selected, p];
    onChange({ products: next });
  }
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-warm-text">Select all products and commodities you trade, produce or process.</p>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${selected.length > 0 ? "bg-gold-light text-ink" : "bg-warm-bg text-warm-muted"}`}>
          {selected.length} selected
        </span>
      </div>
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {Object.entries(PRODUCTS).map(([cat, items]) => (
          <div key={cat}>
            <div className="text-xs font-bold text-warm-text uppercase tracking-wider mb-2 sticky top-0 bg-white py-1">{cat}</div>
            <div className="flex flex-wrap gap-1.5">
              {items.map(p => (
                <button key={p} type="button" onClick={() => toggle(p)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    selected.includes(p)
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-warm-text border-warm-border hover:border-ink hover:text-ink"
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="p-3 bg-warm-bg rounded-xl border border-warm-border">
          <p className="text-xs font-semibold text-warm-text mb-2">Selected ({selected.length}):</p>
          <div className="flex flex-wrap gap-1">
            {selected.map(p => (
              <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 bg-ink text-white text-xs rounded-full">
                {p}
                <button onClick={() => toggle(p)} className="hover:text-red-300 transition-colors"><X size={10} /></button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// FBR contact information & location (address) — replaces the Ugandan regions step.
function Step4FBR({ data, onChange }) {
  const field = (key, label, opts = {}) => (
    <div>
      <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">
        {label} {opts.required ? <span className="text-red-400">*</span> : <span className="text-warm-muted normal-case font-normal">(optional)</span>}
      </label>
      <input
        type={opts.type || "text"}
        value={data[key] || ""}
        onChange={e => onChange({ [key]: e.target.value })}
        placeholder={opts.placeholder || ""}
        className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted" />
    </div>
  );
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-ink mb-1">Contact information</h3>
        <p className="text-xs text-warm-muted mb-3">How verified Ugandan suppliers and the platform reach you.</p>
        <div className="space-y-4">
          {field("contactPerson", "Contact person", { placeholder: "Full name of primary contact", required: true })}
          <div className="grid grid-cols-2 gap-3">
            {field("contactEmail", "Business email", { type: "email", placeholder: "name@company.com", required: true })}
            {field("contactPhone", "Phone (with country code)", { placeholder: "+49 ...", required: true })}
          </div>
          {field("website", "Website", { placeholder: "https://" })}
        </div>
      </div>

      <div className="border-t border-warm-border pt-5">
        <h3 className="text-sm font-bold text-ink mb-1">Location &amp; address</h3>
        <p className="text-xs text-warm-muted mb-3">Your business address in your country of origin.</p>
        <div className="space-y-4">
          {field("addressLine", "Address", { placeholder: "Street and number", required: true })}
          <div className="grid grid-cols-2 gap-3">
            {field("city", "City / Town", { placeholder: "City", required: true })}
            {field("stateProvince", "State / Province")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("postalCode", "Postal / ZIP code")}
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Country</label>
              <div className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-warm-text bg-warm-bg">
                {data.country || "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4({ data, onChange }) {
  const [region, setRegion] = useState("");
  const [subRegion, setSubRegion] = useState("");
  const [district, setDistrict] = useState("");
  const districts = data.districts || [];

  const subRegions = region ? getSubRegionsByRegion(parseInt(region)) : [];
  const districtList = subRegion ? getDistrictsBySubRegion(parseInt(subRegion)) : [];

  function addDistrict() {
    if (!district) return;
    const d = GEO_DISTRICTS.find(x => x.id === parseInt(district));
    const sr = GEO_SUB.find(x => x.id === parseInt(subRegion));
    const r = GEO_REGIONS.find(x => x.id === parseInt(region));
    if (!d || districts.find(x => x.id === d.id)) return;
    onChange({ districts: [...districts, { id: d.id, name: d.name, subRegion: sr?.name, region: r?.name }] });
    setDistrict("");
  }

  function removeDistrict(id) {
    onChange({ districts: districts.filter(d => d.id !== id) });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-text">Select the districts where you operate. You can add multiple districts across regions.</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Region</label>
          <select value={region} onChange={e => { setRegion(e.target.value); setSubRegion(""); setDistrict(""); }}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            <option value="">Select region</option>
            {GEO_REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Sub-region</label>
          <select value={subRegion} onChange={e => { setSubRegion(e.target.value); setDistrict(""); }}
            disabled={!region}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white disabled:opacity-50">
            <option value="">Select sub-region</option>
            {subRegions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">District</label>
          <select value={district} onChange={e => setDistrict(e.target.value)}
            disabled={!subRegion}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white disabled:opacity-50">
            <option value="">Select district</option>
            {districtList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      <button onClick={addDistrict} disabled={!district}
        className="w-full border-2 border-dashed border-warm-border hover:border-gold disabled:opacity-40 text-warm-text hover:text-ink py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
        + Add this district
      </button>
      {districts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-warm-text uppercase tracking-wider">Operating districts ({districts.length})</p>
          {districts.map(d => (
            <div key={d.id} className="flex items-center justify-between px-3 py-2 bg-warm-bg border border-warm-border rounded-lg">
              <div>
                <span className="text-sm font-medium text-ink">{d.name}</span>
                <span className="text-xs text-warm-muted ml-2">{d.subRegion} · {d.region}</span>
              </div>
              <button onClick={() => removeDistrict(d.id)} className="text-warm-muted hover:text-red-500 transition-colors"><X size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step5({ data, onChange }) {
  const [method, setMethod] = useState("momo");
  const payments = data.payments || [];

  function addMoMo(e) {
    e.preventDefault();
    const provider = e.target.provider.value;
    const phone = e.target.phone.value;
    const name = e.target.name.value;
    if (!provider || !phone || !name) return;
    onChange({ payments: [...payments, { type: "momo", provider, phone, name, default: payments.length === 0 }] });
    e.target.reset();
  }

  function addBank(e) {
    e.preventDefault();
    const bank = e.target.bank.value;
    const account = e.target.account.value;
    const accName = e.target.accName.value;
    if (!bank || !accName) return;
    if (!/^\d{10,14}$/.test(account)) {
      alert("Account number must be between 10 and 14 digits.");
      return;
    }
    onChange({ payments: [...payments, { type: "bank", bank, account, accName, default: payments.length === 0 }] });
    e.target.reset();
  }

  function setDefault(idx) {
    const updated = payments.map((p, i) => ({ ...p, default: i === idx }));
    onChange({ payments: updated });
  }

  function removePayment(idx) {
    onChange({ payments: payments.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-text">Add at least one payment method. This is how you receive payments for sales.</p>
      <div className="flex gap-2">
        {["momo", "bank"].map(m => (
          <button key={m} type="button" onClick={() => setMethod(m)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${method === m ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border hover:border-ink"}`}>
            {m === "momo" ? "Mobile Money" : "Bank Account"}
          </button>
        ))}
      </div>
      {method === "momo" && (
        <form onSubmit={addMoMo} className="space-y-3 p-4 bg-warm-bg border border-warm-border rounded-xl">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Provider</label>
              <select name="provider" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
                <option value="">Select provider</option>
                <option>MTN MoMo</option>
                <option>Airtel Money</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Phone number</label>
              <input name="phone" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder="+256 7XX XXX XXX" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Account name</label>
            <input name="name" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder="Name on account" />
          </div>
          <button type="submit" className="w-full bg-gold hover:bg-gold-mid text-ink font-semibold py-2.5 rounded-lg text-sm transition-all">
            Add mobile money account
          </button>
        </form>
      )}
      {method === "bank" && (
        <form onSubmit={addBank} className="space-y-3 p-4 bg-warm-bg border border-warm-border rounded-xl">
          <div>
            <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Bank</label>
            <select name="bank" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
              <option value="">Select bank</option>
              {UGANDAN_BANKS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Account number</label>
              <input name="account"
                maxLength={14}
                onKeyPress={e => { if (!/\d/.test(e.key)) e.preventDefault(); }}
                inputMode="numeric"
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="10 to 14 digits" />
              <p className="text-[11px] text-warm-muted mt-1">Between 10 and 14 digits</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Account name</label>
              <input name="accName" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder="Name on account" />
            </div>
          </div>
          <button type="submit" className="w-full bg-gold hover:bg-gold-mid text-ink font-semibold py-2.5 rounded-lg text-sm transition-all">
            Add bank account
          </button>
        </form>
      )}
      {payments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-warm-text uppercase tracking-wider">Payment methods ({payments.length})</p>
          {payments.map((p, i) => (
            <div key={i} className={`flex items-center justify-between px-3 py-2.5 border rounded-lg transition-all ${p.default ? "bg-gold-light border-gold/40" : "bg-white border-warm-border"}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink">
                    {p.type === "momo" ? `${p.provider}  -  ${p.phone}` : `${p.bank}  -  ${p.account}`}
                  </span>
                  {p.default && <span className="text-[10px] font-bold text-gold uppercase tracking-wider bg-gold/10 px-1.5 py-0.5 rounded">Default</span>}
                </div>
                <span className="text-xs text-warm-muted">{p.name || p.accName}</span>
              </div>
              <div className="flex items-center gap-2">
                {!p.default && (
                  <button onClick={() => setDefault(i)}
                    className="text-xs text-warm-muted hover:text-ink border border-warm-border hover:border-ink px-2 py-1 rounded-lg transition-all">
                    Set default
                  </button>
                )}
                <button onClick={() => removePayment(i)} className="text-warm-muted hover:text-red-500 transition-colors"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, regData, updateReg, completeRegistration } = useAuth();

  const role = user?.role || regData.role || "AGR";
  const isFBR = role === "FBR";

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    type: regData.type || "",
    entityType: regData.entityType || "",
    grade: regData.grade || "",
    sector: regData.sector || "",
    verifyMethod: isFBR ? "passport" : "nin",
    nin: "", tin: "", brn: "",
    verified: false,
    verifiedName: "",
    products: regData.products || [],
    districts: regData.districts || [],
    payments: [],
    // FBR international identity path
    country: regData.country || "",
    natureOfBusiness: regData.natureOfBusiness || [],
    passport: "", intlReg: "", intlTin: "",
    verifyCountry: "", verifiedLabel: "",
    // FBR contact & location (replaces Ugandan regions)
    contactPerson: "", contactEmail: regData.email || "", contactPhone: regData.phone || "",
    website: "", addressLine: "", city: "", stateProvince: "", postalCode: "",
  });
  const [error, setError] = useState("");
  const steps = isFBR ? FBR_STEPS : STEPS;

  function onChange(fields) {
    setData(prev => ({ ...prev, ...fields }));
    setError("");
  }

  function validateStep() {
    if (step === 1) {
      if (isFBR) {
        if (!data.country) { setError("Please select your country of origin."); return false; }
        if (!(data.natureOfBusiness && data.natureOfBusiness.length)) { setError("Please select at least one nature of business."); return false; }
      } else {
        if (!data.type) { setError("Please select Individual or Entity."); return false; }
        if (data.type === "entity" && !data.entityType) { setError("Please select your entity type."); return false; }
        if (!data.grade) { setError("Please select your grade or scale."); return false; }
        if (role === "MFR" && !data.sector) { setError("Please select your production sector."); return false; }
      }
    }
    if (step === 2) {
      if (!data.verified) { setError("Please verify your identity before continuing."); return false; }
    }
    if (step === 3) {
      if (data.products.length === 0) { setError("Please select at least one product or commodity."); return false; }
    }
    if (step === 4) {
      if (isFBR) {
        if (!data.contactPerson?.trim()) { setError("Please enter a contact person."); return false; }
        if (!data.contactEmail?.trim()) { setError("Please enter a business email."); return false; }
        if (!data.contactPhone?.trim()) { setError("Please enter a phone number."); return false; }
        if (!data.addressLine?.trim()) { setError("Please enter your address."); return false; }
        if (!data.city?.trim()) { setError("Please enter your city or town."); return false; }
      } else if (data.districts.length === 0) {
        setError("Please add at least one district."); return false;
      }
    }
    if (step === 5) {
      // Ugandan payment methods are optional for foreign (FBR) actors.
      if (!isFBR && data.payments.length === 0) { setError("Please add at least one payment method."); return false; }
    }
    return true;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step < 5) {
      setStep(s => s + 1);
      setError("");
    } else {
      handleMint();
    }
  }

  function handleMint() {
    const role = user?.role || regData.role || "AGR";
    const consumerRoles = { CSM: true };
    const prefix = consumerRoles[role] ? `UG-CSM` : `UG-DTP-${role}`;
    const num = String(Math.floor(10000 + Math.random() * 89999));
    const tradeId = `${prefix}-${num}`;
    updateReg({ ...data });
    completeRegistration(tradeId, data);
    navigate("/minting", { state: { tradeId, role, name: data.verifiedName } });
  }

  function handleLogout() {
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
        <button onClick={handleLogout} className="text-white/45 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-ink mb-1">Complete your profile</h1>
            <p className="text-warm-text text-sm">Step {step} of {steps.length}  -  {steps[step-1].label}</p>
          </div>

          <StepBar current={step} steps={steps} />

          <div className="bg-white border border-warm-border rounded-2xl p-8 shadow-sm">
            {step === 1 && <Step1 data={data} onChange={onChange} role={role} />}
            {step === 2 && (isFBR ? <Step2FBR data={data} onChange={onChange} /> : <Step2 data={data} onChange={onChange} />)}
            {step === 3 && <Step3 data={data} onChange={onChange} />}
            {step === 4 && (isFBR ? <Step4FBR data={data} onChange={onChange} /> : <Step4 data={data} onChange={onChange} />)}
            {step === 5 && <Step5 data={data} onChange={onChange} />}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <X size={14} className="flex-shrink-0" /> {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button onClick={() => { setStep(s => s - 1); setError(""); }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-warm-border rounded-lg text-sm font-medium text-warm-text hover:text-ink hover:border-ink transition-all">
                  <ArrowLeft size={15} /> Back
                </button>
              )}
              <button onClick={handleNext}
                className="flex-1 bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                {step === 5 ? "Generate my Trade ID" : "Continue"} <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
