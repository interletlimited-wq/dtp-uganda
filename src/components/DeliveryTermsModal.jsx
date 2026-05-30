import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Truck, Plane, Ship, Train, MapPin, Calendar,
  Search, Shield, Star, ChevronDown, ChevronRight,
  Check, AlertCircle, Package, ArrowRight, Info
} from "lucide-react";
import { VEHICLES, STORES } from "../data/demo";
import { REGIONS } from "../data/geo";

// ── Delivery modes ────────────────────────────────────────────
const DELIVERY_MODES = [
  { id: "road",       label: "Road",       icon: Truck,  desc: "Truck, lorry, pickup — nationwide" },
  { id: "air",        label: "Air",        icon: Plane,  desc: "Domestic or international cargo flight" },
  { id: "water",      label: "Water",      icon: Ship,   desc: "Lake Victoria ferry, river barge" },
  { id: "rail",       label: "Rail",       icon: Train,  desc: "SGR freight or Uganda Railways" },
  { id: "cold_chain", label: "Cold Chain", icon: Truck,  desc: "Temperature-controlled road transport" },
];

const ARRANGE_OPTIONS = [
  {
    id: "buyer",
    label: "I will arrange",
    desc: "You provide your own vehicle or collect directly from the seller.",
  },
  {
    id: "dtp",
    label: "Select a DTP transporter",
    desc: "Choose from registered, verified transporters on the platform.",
  },
  {
    id: "seller",
    label: "Request seller to self-deliver",
    desc: "Ask the seller to deliver to you. Seller must confirm they can do this.",
  },
];

// Sample transporters filtered from VEHICLES data
function getAvailableTransporters(mode, originDistrict, destDistrict) {
  // Use VEHICLES as demo transporters
  return [
    {
      id: "UG-DTP-TRP-00019",
      name: "Ssekandi Transport Services",
      tradeId: "UG-DTP-TRP-00019",
      verified: "URSB",
      rating: 4.8,
      reviews: 124,
      vehicleType: "Lorry + Truck Fleet",
      capacity: "Up to 12,000 kg",
      districts: ["Kampala", "Mbale", "Gulu", "Jinja", "Mbarara"],
      goodsTypes: ["General", "Dry Goods", "Livestock"],
      rateStructure: "flat",
      flatRate: 450000,
      currency: "UGX",
    },
    {
      id: "UG-DTP-TRP-00031",
      name: "Nile Cargo Solutions Ltd",
      tradeId: "UG-DTP-TRP-00031",
      verified: "URSB",
      rating: 4.5,
      reviews: 89,
      vehicleType: "Heavy Truck Fleet",
      capacity: "Up to 20,000 kg",
      districts: ["Kampala", "Jinja", "Tororo", "Mbale", "Lira"],
      goodsTypes: ["General", "Dry Goods", "Perishables"],
      rateStructure: "per_tonne_km",
      ratePerTonneKm: 850,
      currency: "UGX",
    },
    {
      id: "UG-DTP-TRP-00044",
      name: "Equator Logistics Uganda",
      tradeId: "UG-DTP-TRP-00044",
      verified: "URA",
      rating: 4.2,
      reviews: 56,
      vehicleType: "Pickup + Medium Truck",
      capacity: "Up to 5,000 kg",
      districts: ["Kampala", "Wakiso", "Mukono", "Jinja"],
      goodsTypes: ["General", "Perishables", "Fragile"],
      rateStructure: "negotiable",
      currency: "UGX",
    },
  ];
}

function TransporterCard({ transporter, selected, onSelect, quantity, unit }) {
  const estimatedCost = transporter.rateStructure === "flat"
    ? transporter.flatRate
    : transporter.rateStructure === "per_tonne_km"
    ? Math.round((quantity / 1000) * 200 * transporter.ratePerTonneKm) // estimate 200km
    : null;

  return (
    <button
      onClick={() => onSelect(transporter)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected ? "border-gold bg-gold/5" : "border-warm-border hover:border-gold/50 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {transporter.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-ink text-sm">{transporter.name}</div>
            <div className="text-xs font-mono text-warm-muted">{transporter.tradeId}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Star size={11} className="text-gold fill-gold" />
          <span className="text-xs font-bold text-ink">{transporter.rating}</span>
          <span className="text-xs text-warm-muted">({transporter.reviews})</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <div className="text-warm-muted">Vehicle type</div>
          <div className="font-medium text-ink">{transporter.vehicleType}</div>
        </div>
        <div>
          <div className="text-warm-muted">Capacity</div>
          <div className="font-medium text-ink">{transporter.capacity}</div>
        </div>
        <div className="col-span-2">
          <div className="text-warm-muted">Districts served</div>
          <div className="font-medium text-ink">{transporter.districts.slice(0, 4).join(", ")}{transporter.districts.length > 4 ? ` +${transporter.districts.length - 4} more` : ""}</div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-warm-border">
        <div>
          {transporter.rateStructure === "flat" && (
            <div>
              <span className="text-xs text-warm-muted">Flat rate: </span>
              <span className="text-sm font-bold text-ink">UGX {transporter.flatRate.toLocaleString()}/trip</span>
            </div>
          )}
          {transporter.rateStructure === "per_tonne_km" && (
            <div>
              <span className="text-xs text-warm-muted">Rate: </span>
              <span className="text-sm font-bold text-ink">UGX {transporter.ratePerTonneKm.toLocaleString()}/tonne-km</span>
              {estimatedCost && <span className="text-xs text-warm-muted ml-1">(~UGX {estimatedCost.toLocaleString()} est.)</span>}
            </div>
          )}
          {transporter.rateStructure === "negotiable" && (
            <span className="text-xs text-amber-600 font-semibold">Negotiable - contact transporter</span>
          )}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? "border-gold bg-gold" : "border-warm-border"}`}>
          {selected && <Check size={11} className="text-ink" />}
        </div>
      </div>
    </button>
  );
}

export default function DeliveryTermsModal({ request, onConfirm, onClose }) {
  const [mode, setMode] = useState("road");
  const [arrangeBy, setArrangeBy] = useState(null);
  const [collectionDistrict, setCollectionDistrict] = useState(request?.district || "");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [deliveryDistrict, setDeliveryDistrict] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [expectedDate, setExpectedDate] = useState("");
  const [buyerVehicleReg, setBuyerVehicleReg] = useState("");
  const [buyerDriverName, setBuyerDriverName] = useState("");
  const [step, setStep] = useState(1); // 1=mode, 2=who, 3=details, 4=confirm

  const transporters = getAvailableTransporters(mode, collectionDistrict, deliveryDistrict);

  const canProceed = () => {
    if (step === 1) return !!mode;
    if (step === 2) return !!arrangeBy;
    if (step === 3) {
      if (!collectionDistrict || !deliveryDistrict || !expectedDate) return false;
      if (arrangeBy === "dtp" && !selectedTransporter) return false;
      if (arrangeBy === "buyer" && !buyerVehicleReg) return false;
      return true;
    }
    return true;
  };

  function handleConfirm() {
    onConfirm({
      deliveryMode: mode,
      arrangedBy: arrangeBy,
      collectionPoint: { district: collectionDistrict, address: collectionAddress },
      deliveryPoint: { district: deliveryDistrict, address: deliveryAddress },
      transporter: selectedTransporter,
      expectedDate,
      buyerVehicle: arrangeBy === "buyer" ? { reg: buyerVehicleReg, driver: buyerDriverName } : null,
    });
  }

  const DISTRICTS = ["Kampala","Wakiso","Mukono","Jinja","Mbale","Kapchorwa","Tororo","Gulu","Lira","Arua","Mbarara","Kabale","Fort Portal","Soroti","Moroto","Masaka","Entebbe","Iganga","Busia","Pallisa","Kumi","Hoima","Masindi","Kasese","Ntungamo"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-border flex-shrink-0">
          <div>
            <h2 className="font-bold text-ink text-lg">Confirm Delivery Terms</h2>
            <p className="text-sm text-warm-muted">{request?.product} · {request?.quantityRequested?.toLocaleString()} {request?.unit} · from {request?.seller}</p>
          </div>
          <button onClick={onClose} className="text-warm-muted hover:text-ink p-1.5 rounded-lg hover:bg-warm-bg transition-colors"><X size={18} /></button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 py-3 bg-warm-bg border-b border-warm-border flex-shrink-0">
          {[["1","Delivery mode"],["2","Transport"],["3","Details"],["4","Confirm"]].map(([n, l], i) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${parseInt(n) < step ? "bg-green-500 text-white" : parseInt(n) === step ? "bg-ink text-white" : "bg-warm-border text-warm-muted"}`}>
                {parseInt(n) < step ? <Check size={11} /> : n}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${parseInt(n) === step ? "text-ink" : "text-warm-muted"}`}>{l}</span>
              {i < 3 && <ChevronRight size={12} className="text-warm-border flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Step 1 — Delivery mode */}
          {step === 1 && (
            <div className="space-y-3">
              <h3 className="font-bold text-ink text-sm mb-4">How should the goods be transported?</h3>
              {DELIVERY_MODES.map(m => {
                const Icon = m.icon;
                return (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${mode === m.id ? "border-gold bg-gold/5" : "border-warm-border hover:border-gold/50"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mode === m.id ? "bg-gold text-ink" : "bg-warm-bg text-warm-muted"}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-ink text-sm">{m.label}</div>
                      <div className="text-xs text-warm-muted">{m.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${mode === m.id ? "border-gold bg-gold" : "border-warm-border"}`}>
                      {mode === m.id && <Check size={11} className="text-ink" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2 — Who arranges */}
          {step === 2 && (
            <div className="space-y-3">
              <h3 className="font-bold text-ink text-sm mb-4">Who arranges the transport?</h3>
              <div className="bg-warm-bg border border-warm-border rounded-xl p-3 flex items-center gap-2 mb-4">
                <Info size={14} className="text-gold flex-shrink-0" />
                <p className="text-xs text-warm-muted">As the buyer, you have full control over how goods are delivered to you.</p>
              </div>
              {ARRANGE_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => setArrangeBy(opt.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${arrangeBy === opt.id ? "border-gold bg-gold/5" : "border-warm-border hover:border-gold/50"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${arrangeBy === opt.id ? "border-gold bg-gold" : "border-warm-border"}`}>
                    {arrangeBy === opt.id && <Check size={11} className="text-ink" />}
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm mb-1">{opt.label}</div>
                    <div className="text-xs text-warm-muted leading-relaxed">{opt.desc}</div>
                    {opt.id === "seller" && (
                      <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle size={11} /> Seller must confirm availability before the order proceeds
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3 — Details */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-bold text-ink text-sm">Collection and delivery details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Collection district *</label>
                  <select value={collectionDistrict} onChange={e => setCollectionDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold">
                    <option value="">Select district</option>
                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Delivery district *</label>
                  <select value={deliveryDistrict} onChange={e => setDeliveryDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold">
                    <option value="">Select district</option>
                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Collection address / landmark</label>
                  <input value={collectionAddress} onChange={e => setCollectionAddress(e.target.value)}
                    placeholder="e.g. Mbale Central Hulling Station" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Delivery address / landmark</label>
                  <input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Kahawa Exports Warehouse, Kampala" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Expected collection / delivery date *</label>
                  <input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold" />
                </div>
              </div>

              {/* Buyer arranges — vehicle details */}
              {arrangeBy === "buyer" && (
                <div className="border border-warm-border rounded-xl p-4 space-y-3">
                  <div className="font-semibold text-ink text-sm mb-2">Your vehicle / carrier details</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Vehicle registration *</label>
                      <input value={buyerVehicleReg} onChange={e => setBuyerVehicleReg(e.target.value)}
                        placeholder="e.g. UAY 456K" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Driver name</label>
                      <input value={buyerDriverName} onChange={e => setBuyerDriverName(e.target.value)}
                        placeholder="Driver / carrier name" className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold" />
                    </div>
                  </div>
                </div>
              )}

              {/* DTP transporter selection */}
              {arrangeBy === "dtp" && (
                <div>
                  <div className="font-semibold text-ink text-sm mb-3">Select a transporter *</div>
                  <div className="space-y-3">
                    {transporters.map(t => (
                      <TransporterCard key={t.id} transporter={t}
                        selected={selectedTransporter?.id === t.id}
                        onSelect={setSelectedTransporter}
                        quantity={request?.quantityRequested}
                        unit={request?.unit}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Seller self-delivers */}
              {arrangeBy === "seller" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-700 text-sm mb-1">Awaiting seller confirmation</div>
                    <p className="text-xs text-amber-600 leading-relaxed">The seller will be notified that you are requesting self-delivery. They must confirm they can deliver before the order proceeds. You will be notified of their response. If they decline, you will need to select another transport arrangement.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4 — Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink text-sm mb-4">Review and confirm delivery terms</h3>
              <div className="bg-warm-bg rounded-xl p-4 space-y-3">
                {[
                  ["Delivery mode", DELIVERY_MODES.find(m => m.id === mode)?.label],
                  ["Arranged by", ARRANGE_OPTIONS.find(o => o.id === arrangeBy)?.label],
                  ["Collection from", `${collectionDistrict}${collectionAddress ? " - " + collectionAddress : ""}`],
                  ["Deliver to", `${deliveryDistrict}${deliveryAddress ? " - " + deliveryAddress : ""}`],
                  ["Expected date", expectedDate],
                  ...(selectedTransporter ? [["Transporter", `${selectedTransporter.name} (${selectedTransporter.tradeId})`]] : []),
                  ...(buyerVehicleReg ? [["Your vehicle", `${buyerVehicleReg}${buyerDriverName ? " - " + buyerDriverName : ""}`]] : []),
                ].map(([l, v]) => v ? (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-warm-muted">{l}</span>
                    <span className="font-semibold text-ink text-right max-w-xs">{v}</span>
                  </div>
                ) : null)}
              </div>
              <div className="bg-ink rounded-xl p-4">
                <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Order summary</div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">{request?.product} · {request?.grade}</span>
                  <span className="text-white font-semibold">{request?.quantityRequested?.toLocaleString()} {request?.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total product value</span>
                  <span className="text-gold font-bold">UGX {request?.totalValue?.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-warm-muted text-center leading-relaxed">
                By confirming, delivery terms are locked. Proceed to payment once the seller is notified.
                {arrangeBy === "dtp" && " The selected transporter will be notified and must accept the job."}
                {arrangeBy === "seller" && " The seller will be asked to confirm self-delivery."}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-warm-border flex-shrink-0">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              className="px-5 py-2.5 border border-warm-border text-ink font-semibold rounded-lg text-sm hover:bg-warm-bg transition-all">
              Back
            </button>
          )}
          <div className="flex-1" />
          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
              className="flex items-center gap-2 bg-gold hover:bg-gold-mid disabled:opacity-40 text-ink font-bold px-6 py-2.5 rounded-lg text-sm transition-all">
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={handleConfirm}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all">
              <Check size={14} /> Confirm delivery terms
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
