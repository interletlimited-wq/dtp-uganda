import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  Search, ShoppingCart, User, MapPin, ChevronDown,
  ChevronLeft, ChevronRight, TrendingDown,
  TrendingUp, X, Check, ArrowRight, Eye, Package,
  Truck, AlertCircle, Clock, Star, Heart, Bell,
  Menu, LogOut, LayoutDashboard, SlidersHorizontal
} from "lucide-react";
import { LISTINGS, MARKET_PRICES, formatUGX, getAvailableTransporters, getSellerRatingCount, getTrustTick } from "../data/demo";
import { REGIONS, SUB_REGIONS } from "../data/geo";
import { PRODUCTS } from "../data/constants";
import TrustTick from "../components/TrustTick";

// ── Product Images by category ────────────────────────────────
const CATEGORY_IMAGES = {
  "Coffee (Arabica)":     "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
  "Coffee (Robusta)":     "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&q=80",
  "Vanilla":              "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
  "Cocoa":                "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80",
  "Tea":                  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Maize":                "https://images.unsplash.com/photo-1601593768799-76e09b4de4e2?w=400&q=80",
  "Beans (Common)":       "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
  "Groundnuts":           "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400&q=80",
  "Rice (Milled)":        "https://images.unsplash.com/photo-1536304993881-ff86e0c9b107?w=400&q=80",
  "Sweet Potatoes":       "https://images.unsplash.com/photo-1596097639009-5e7f0cf9cd49?w=400&q=80",
  "Sorghum":              "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&q=80",
  "Honey (Raw)":          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
  "Cattle (Beef)":        "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=400&q=80",
  "Milk (Raw)":           "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
  "Nile Perch (Fresh)":   "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80",
  "Tilapia (Fresh)":      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  "Fish (Dried)":         "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
  "Maize Flour":          "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&q=80",
  "Wheat Flour":          "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&q=80",
  "Sunflower Oil":        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "Sugar (Refined)":      "https://images.unsplash.com/photo-1559181567-c3190ca9be55?w=400&q=80",
  "Salt (Iodised)":       "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80",
  "Animal Feed (Poultry)":"https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=400&q=80",
  "Soap (Bar)":           "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80",
  "Steel Roofing Sheets": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  "Cement":               "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  "Timber (Hardwood)":    "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400&q=80",
  "Textiles (Fabric)":    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "Hides and Skins":      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80",
  "Cotton (Lint)":        "https://images.unsplash.com/photo-1502395809857-fd80069897d0?w=400&q=80",
  "Simsim / Sesame":      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  "Charcoal":             "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  "Packaging Materials":  "https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=400&q=80",
  "Palm Oil (Crude)":     "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80";

const PRODUCT_CATEGORIES = {
  "Coffee (Arabica)": "Coffee & Tea", "Coffee (Robusta)": "Coffee & Tea",
  "Vanilla": "Coffee & Tea", "Cocoa": "Coffee & Tea", "Tea": "Coffee & Tea",
  "Maize": "Food Crops", "Beans (Common)": "Food Crops", "Groundnuts": "Food Crops",
  "Rice (Milled)": "Food Crops", "Sweet Potatoes": "Food Crops",
  "Sorghum": "Food Crops", "Millet (Finger)": "Food Crops",
  "Cassava": "Food Crops", "Tomatoes": "Food Crops", "Onions": "Food Crops",
  "Plantain / Matoke": "Food Crops",
  "Cattle (Beef)": "Livestock & Dairy", "Milk (Raw)": "Livestock & Dairy",
  "Hides and Skins": "Livestock & Dairy", "Leather (Finished)": "Livestock & Dairy",
  "Nile Perch (Fresh)": "Fish & Aquatic", "Tilapia (Fresh)": "Fish & Aquatic",
  "Fish (Dried)": "Fish & Aquatic", "Nile Perch (Fillet)": "Fish & Aquatic",
  "Maize Flour": "Processed Goods", "Wheat Flour": "Processed Goods",
  "Sunflower Oil": "Processed Goods", "Sugar (Refined)": "Processed Goods",
  "Salt (Iodised)": "Processed Goods", "Honey (Raw)": "Processed Goods",
  "Soap (Bar)": "Processed Goods", "Animal Feed (Poultry)": "Processed Goods",
  "Palm Oil (Crude)": "Processed Goods",
  "Steel Roofing Sheets": "Manufacturing", "Cement": "Manufacturing",
  "Timber (Hardwood)": "Manufacturing", "Textiles (Fabric)": "Manufacturing",
  "Plastic Pipes (PVC)": "Manufacturing", "Packaging Materials": "Manufacturing",
  "Cotton (Lint)": "Cash Crops", "Simsim / Sesame": "Cash Crops",
  "Charcoal": "Energy & Fuel", "Medicinal Plants": "Health & Natural",
};

const SECTIONS = ["Coffee & Tea", "Food Crops", "Livestock & Dairy", "Fish & Aquatic", "Processed Goods", "Manufacturing", "Cash Crops"];

// ── Purchase Flow ────────────────────────────────────────────
const STEPS = [
  {id:1,label:"Request"},{id:2,label:"Response"},
  {id:3,label:"Quotation"},{id:4,label:"Payment"},
  {id:5,label:"Confirm"},{id:6,label:"Dispatch"},
  {id:7,label:"Receipt"},{id:8,label:"Complete"},
];

function StepBar({ current }) {
  return (
    <div className="flex items-center mb-6 overflow-x-auto pb-1">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center flex-shrink-0">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${current > s.id ? "bg-green-500 border-green-500 text-white" : current === s.id ? "bg-ink border-ink text-white" : "bg-white border-warm-border text-warm-muted"}`}>
              {current > s.id ? <Check size={12}/> : s.id}
            </div>
            <div className={`text-[9px] mt-1 font-medium whitespace-nowrap ${current === s.id ? "text-ink" : "text-warm-muted"}`}>{s.label}</div>
          </div>
          {i < STEPS.length - 1 && <div className={`w-5 h-0.5 mb-3 mx-0.5 ${current > s.id ? "bg-green-400" : "bg-warm-border"}`}/>}
        </div>
      ))}
    </div>
  );
}

function PurchaseModal({ listing, onClose, onStockDeduct }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [quotationRef, setQuotationRef] = useState("");
  const [counterOffer, setCounterOffer] = useState(null);
  const [deliveryChoice, setDeliveryChoice] = useState("Third-party transporter");
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const marketPrice = MARKET_PRICES.find(p => p.commodity === listing.product);
  const [form, setForm] = useState({ quantity: listing.minOrder || "", offeredPrice: listing.pricePerUnit || "", proposedDate: "", note: "" });
  const total = form.quantity && form.offeredPrice ? parseInt(form.quantity) * parseInt(form.offeredPrice) : 0;
  const transporters = getAvailableTransporters(listing.district, "Kampala");

  async function submitRequest() {
    if (!form.quantity || !form.offeredPrice) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setCounterOffer({ price: Math.round(parseInt(form.offeredPrice) * 1.03), note: "Thank you for your interest. I can offer at a slightly adjusted price given current market rates." });
    setStep(2);
  }

  async function acceptOffer(price) {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    const ref = `QTN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
    setQuotationRef(ref);
    setForm({...form, offeredPrice: price});
    setSubmitting(false);
    setStep(3);
  }

  async function next() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setSubmitting(false);
    setStep(s => s + 1);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-warm-border px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div><div className="text-xs text-warm-muted">Purchase request</div><h2 className="font-bold text-ink">{listing.product}</h2></div>
          <button onClick={onClose} className="text-warm-muted hover:text-ink p-1.5 rounded-lg hover:bg-warm-bg"><X size={18}/></button>
        </div>
        <div className="p-6">
          <StepBar current={step}/>
          <div className="flex items-center gap-3 p-4 bg-warm-bg border border-warm-border rounded-xl mb-5">
            <img src={CATEGORY_IMAGES[listing.product] || DEFAULT_IMAGE} alt={listing.product}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
            <div className="flex-1 min-w-0"><div className="font-semibold text-ink text-sm truncate">{listing.sellerName}</div><div className="font-mono text-xs text-warm-muted">{listing.sellerTradeId}</div></div>
            <div className="text-right"><div className="text-sm font-bold text-ink">UGX {parseInt(listing.pricePerUnit).toLocaleString()}/{listing.unit}</div><div className="text-xs text-warm-muted">{listing.district}</div></div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink">Step 1  -  Submit purchase request</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Quantity ({listing.unit}) *</label>
                  <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                    className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder={`Min ${listing.minOrder}`}/>
                  <p className="text-[11px] text-warm-muted mt-1">{parseInt(listing.quantity).toLocaleString()} {listing.unit} available</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Offered price (UGX/{listing.unit}) *</label>
                  <input type="number" value={form.offeredPrice} onChange={e => setForm({...form, offeredPrice: e.target.value})}
                    className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder={parseInt(listing.pricePerUnit).toLocaleString()}/>
                  {marketPrice && <p className="text-[11px] text-warm-muted mt-1">Market: UGX {marketPrice.sell.toLocaleString()}/{listing.unit}</p>}
                </div>
              </div>
              {total > 0 && <div className="p-4 bg-ink rounded-xl flex items-center justify-between"><span className="text-white/60 text-sm">Estimated total</span><span className="text-gold font-bold text-xl font-mono">{formatUGX(total)}</span></div>}
              <div>
                <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Delivery preference</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Third-party transporter","Seller delivers","Buyer collects","Already delivered"].map(d => (
                    <button key={d} type="button" onClick={() => setDeliveryChoice(d)}
                      className={`p-3 border-2 rounded-xl text-xs font-semibold text-left transition-all ${deliveryChoice === d ? "border-gold bg-gold/5 text-ink" : "border-warm-border text-warm-muted hover:border-gold/50"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Proposed delivery date</label>
                <input type="date" value={form.proposedDate} onChange={e => setForm({...form, proposedDate: e.target.value})}
                  className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Note to seller</label>
                <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                  className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white resize-none h-16" placeholder="Any special requirements..."/>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5"/>
                <p className="text-xs text-amber-700">Your request will be sent to {listing.sellerName}. They can accept, decline, or counter-offer.</p>
              </div>
              <button onClick={submitRequest} disabled={submitting || !form.quantity || !form.offeredPrice}
                className="w-full bg-gold hover:bg-gold-mid disabled:opacity-50 text-ink font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                {submitting ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending...</span> : <><ShoppingCart size={16}/> Send purchase request</>}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink">Step 2  -  Seller response</h3>
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700"><Check size={13}/> Request sent. {listing.sellerName} has responded.</div>
              {counterOffer && (
                <div className="p-4 border-2 border-amber-200 bg-amber-50 rounded-xl">
                  <div className="text-xs font-bold text-amber-700 mb-3">Counter-offer received</div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white rounded-lg p-3"><div className="text-xs text-warm-muted mb-1">Your offer</div><div className="font-bold text-ink">UGX {parseInt(form.offeredPrice).toLocaleString()}/{listing.unit}</div></div>
                    <div className="bg-white rounded-lg p-3 border border-amber-200"><div className="text-xs text-warm-muted mb-1">Seller counter</div><div className="font-bold text-amber-700">UGX {counterOffer.price.toLocaleString()}/{listing.unit}</div></div>
                  </div>
                  <p className="text-xs text-warm-text bg-white rounded-lg p-3 mb-3 border border-warm-border">{counterOffer.note}</p>
                  <div className="flex gap-2">
                    <button onClick={() => acceptOffer(form.offeredPrice)} className="flex-1 border-2 border-warm-border text-warm-text font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5"><X size={13}/> Decline</button>
                    <button onClick={() => acceptOffer(counterOffer.price)} disabled={submitting} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5"><Check size={13}/> Accept UGX {counterOffer.price.toLocaleString()}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink">Step 3  -  Quotation</h3>
              <div className="bg-ink rounded-xl p-5">
                <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Quotation Reference</div>
                <div className="font-mono text-gold font-bold text-lg mb-4">{quotationRef}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[["Seller",listing.sellerName],["Buyer",user?.name],["Product",listing.product],["Quantity",`${parseInt(form.quantity).toLocaleString()} ${listing.unit}`],["Unit price",`UGX ${parseInt(form.offeredPrice).toLocaleString()}`],["Total",formatUGX(parseInt(form.quantity)*parseInt(form.offeredPrice))],["Delivery",deliveryChoice],["Date",form.proposedDate||"TBD"]].map(([l,v]) => (
                    <div key={l}><div className="text-[10px] text-white/30 uppercase tracking-wider">{l}</div><div className="text-white text-xs font-medium mt-0.5 truncate">{v}</div></div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl"><AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5"/><p className="text-xs text-red-600">Once confirmed, terms are locked.</p></div>
              <button onClick={next} disabled={submitting} className="w-full bg-gold hover:bg-gold-mid disabled:opacity-50 text-ink font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                {submitting ? "Confirming..." : <><Check size={16}/> Confirm quotation</>}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink">Step 4  -  Payment</h3>
              <div className="p-4 bg-warm-bg rounded-xl">
                <div className="text-xs font-semibold text-warm-muted uppercase tracking-wider mb-2">Amount due</div>
                <div className="text-3xl font-black text-ink">{formatUGX(parseInt(form.quantity)*parseInt(form.offeredPrice))}</div>
              </div>
              <div className="p-4 bg-white border border-warm-border rounded-xl">
                <div className="text-xs font-semibold text-ink mb-1">Seller payment details</div>
                <div className="text-sm text-warm-text">MTN MoMo  -  0772 *** ***41 · {listing.sellerName}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Payment reference *</label>
                <input className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" placeholder="Enter MoMo reference or bank transfer ref..."/>
              </div>
              <button onClick={next} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2"><Check size={16}/> Confirm payment sent</button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink">Step 5  -  Payment confirmed</h3>
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><Check size={24} className="text-green-600"/></div>
                <div className="font-bold text-green-700 mb-1">Payment received</div>
                <p className="text-sm text-green-600">{listing.sellerName} confirmed receipt.</p>
              </div>
              <button onClick={next} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2"><ArrowRight size={16}/> View dispatch details</button>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink">Step 6  -  Dispatch and transport</h3>
              {deliveryChoice === "Third-party transporter" && transporters.length > 0 && transporters.map(t => (
                <div key={t.tradeId} onClick={() => setSelectedTransporter(selectedTransporter?.tradeId === t.tradeId ? null : t)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedTransporter?.tradeId === t.tradeId ? "border-gold bg-gold/5" : "border-warm-border hover:border-gold/50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div><div className="font-semibold text-ink text-sm">{t.name}</div><div className="text-xs font-mono text-warm-muted">{t.tradeId}</div></div>
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-full border ${t.status === "available" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>{t.status}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[["Distance",`~${t.distanceFromPickup}km`],["ETA",t.etaLabel],["Rating",`${t.rating}/5`]].map(([l,v]) => (
                      <div key={l} className="bg-warm-bg rounded-lg p-2 text-center"><div className="text-[10px] text-warm-muted">{l}</div><div className="text-xs font-bold text-ink">{v}</div></div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={next} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2"><Truck size={16}/> Confirm dispatch</button>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink">Step 7  -  Confirm receipt</h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3"><Truck size={20} className="text-blue-500 flex-shrink-0"/><div><div className="text-sm font-semibold text-blue-700">Order in transit</div><div className="text-xs text-blue-600">Confirm once goods arrive.</div></div></div>
              <button onClick={() => {
                next();
                // Deduct stock on receipt confirmation
                if (onStockDeduct) onStockDeduct(listing.id, listing.productId, parseInt(form.quantity));
              }} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2"><Check size={16}/> Confirm goods received</button>
              <button className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition-all">Raise a dispute</button>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto"><Check size={32} className="text-green-500"/></div>
              <h3 className="font-black text-ink text-2xl">Transaction complete</h3>
              <p className="text-warm-text text-sm">Recorded on both ledgers.</p>
              <div className="bg-warm-bg rounded-xl p-4 text-left">
                {[["Product",listing.product],["Seller",listing.sellerName],["Quantity",`${parseInt(form.quantity).toLocaleString()} ${listing.unit}`],["Total paid",formatUGX(parseInt(form.quantity)*parseInt(form.offeredPrice))]].map(([l,v]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-warm-border last:border-0 text-sm"><span className="text-warm-muted">{l}</span><span className="font-semibold text-ink">{v}</span></div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 bg-ink hover:bg-ink-mid text-white font-bold py-3 rounded-lg text-sm">View in ledger</button>
                <button className="flex-1 border border-gold text-gold hover:bg-gold/10 font-bold py-3 rounded-lg text-sm transition-all">Rate seller</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SignInPrompt({ listing, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3"><ShoppingCart size={24} className="text-gold"/></div>
          <h3 className="font-bold text-ink text-lg mb-1">Sign in to buy</h3>
          <p className="text-warm-text text-sm">To purchase <span className="font-semibold">{listing?.product}</span> you need a free DTP account.</p>
        </div>
        <div className="p-4 bg-warm-bg border border-warm-border rounded-xl mb-5 grid grid-cols-2 gap-3 text-sm">
          {[["Product",listing?.product],["Price",`UGX ${parseInt(listing?.pricePerUnit||0).toLocaleString()}/${listing?.unit}`],["Seller",listing?.sellerName],["Location",listing?.district]].map(([l,v]) => (
            <div key={l}><div className="text-xs text-warm-muted">{l}</div><div className="font-semibold text-ink truncate">{v}</div></div>
          ))}
        </div>
        <div className="flex gap-3 mb-3">
          <button onClick={() => navigate("/register")} className="flex-1 bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-xl text-sm">Register free</button>
          <button onClick={() => navigate("/login")} className="flex-1 border-2 border-ink hover:bg-ink hover:text-white text-ink font-bold py-3 rounded-xl text-sm transition-all">Sign in</button>
        </div>
        <button onClick={onClose} className="w-full text-center text-xs text-warm-muted hover:text-ink py-2 transition-colors">Continue browsing</button>
      </div>
    </div>
  );
}

// ── Cart ──────────────────────────────────────────────────────
function CartPanel({ cart, onRemove, onClose, onCheckout, onUser, onNavigate }) {
  const total = cart.reduce((s, i) => s + parseInt(i.pricePerUnit) * i.cartQty, 0);
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-border">
          <h2 className="font-bold text-ink flex items-center gap-2"><ShoppingCart size={18}/> Cart ({cart.length})</h2>
          <button onClick={onClose} className="text-warm-muted hover:text-ink"><X size={18}/></button>
        </div>
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingCart size={32} className="text-warm-muted mb-3"/>
            <p className="font-semibold text-ink mb-1">Your cart is empty</p>
            <p className="text-sm text-warm-muted">Browse the marketplace and add items</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-warm-bg rounded-xl">
                  <img src={CATEGORY_IMAGES[item.product] || DEFAULT_IMAGE} alt={item.product}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink text-sm truncate">{item.product}</div>
                    <div className="text-xs text-warm-muted">{item.cartQty} {item.unit} · {item.sellerName}</div>
                    <div className="text-xs font-bold text-ink mt-0.5">{formatUGX(parseInt(item.pricePerUnit) * item.cartQty)}</div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-warm-muted hover:text-red-500 transition-colors flex-shrink-0"><X size={14}/></button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-warm-border">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-black text-ink text-lg">{formatUGX(total)}</span>
              </div>
              {onUser ? (
                <button onClick={onCheckout} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                  <ShoppingCart size={16}/> Proceed to checkout
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-warm-muted text-center mb-3">Create a free account to complete your order</p>
                  <button onClick={() => onNavigate("/register")} className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-xl text-sm transition-all">
                    Register free to order
                  </button>
                  <button onClick={() => onNavigate("/login")} className="w-full border-2 border-ink hover:bg-ink hover:text-white text-ink font-bold py-3 rounded-xl text-sm transition-all">
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Listing Card ──────────────────────────────────────────────
function ListingCard({ listing, user, onBuy, onAddToCart, wishlist, onToggleWishlist }) {
  const navigate = useNavigate();
  const marketPrice = MARKET_PRICES.find(p => p.commodity === listing.product);
  const priceDiff = marketPrice ? ((parseInt(listing.pricePerUnit) - marketPrice.sell) / marketPrice.sell * 100).toFixed(1) : null;
  const isOwn = user && listing.seller === user.username;
  const belowMarket = priceDiff && parseFloat(priceDiff) <= 0;
  const isWished = wishlist.includes(listing.id);
  const isNew = new Date(listing.listed) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const isLowStock = parseInt(listing.quantity) < 500;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-warm-border hover:shadow-md hover:border-gold/30 transition-all group">
      <div className="relative cursor-pointer" onClick={() => navigate(`/marketplace/listing/${listing.id}`)}>
        <img src={CATEGORY_IMAGES[listing.product] || DEFAULT_IMAGE} alt={listing.product}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"/>
        <button onClick={() => onToggleWishlist(listing.id)}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          <Heart size={14} className={isWished ? "text-red-500 fill-red-500" : "text-warm-muted"}/>
        </button>
        {isNew && <span className="absolute top-2.5 left-2.5 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>}
        {belowMarket && !isNew && <span className="absolute top-2.5 left-2.5 bg-gold text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">Good deal</span>}
        {isLowStock && <span className="absolute bottom-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Low stock</span>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-ink text-sm leading-tight">{listing.product}</h3>
        </div>
        {listing.grade && <p className="text-xs text-warm-muted mb-2">{listing.grade}</p>}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-lg font-black text-ink">UGX {parseInt(listing.pricePerUnit).toLocaleString()}</span>
          <span className="text-xs text-warm-muted">/{listing.unit}</span>
        </div>
        {priceDiff && (
          <div className={`inline-flex items-center gap-0.5 text-[10px] font-semibold mb-2 ${belowMarket ? "text-green-600" : "text-amber-600"}`}>
            {belowMarket ? <TrendingDown size={9}/> : <TrendingUp size={9}/>}
            {Math.abs(priceDiff)}% {belowMarket ? "below market" : "above market"}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-warm-muted mb-3">
          <MapPin size={9}/> {listing.district}
          <span className="mx-0.5">·</span>
          <Eye size={9}/> {listing.views}
          <span className="mx-0.5">·</span>
          {parseInt(listing.quantity).toLocaleString()} {listing.unit}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-warm-muted mb-3 pb-3 border-b border-warm-border">
          <div className="w-5 h-5 bg-ink rounded-full flex items-center justify-center text-gold text-[9px] font-bold flex-shrink-0">{listing.sellerName.charAt(0)}</div>
          <span className="truncate">{listing.sellerName}</span>
          <TrustTick seller={listing.seller} size={13} className="flex-shrink-0" />
        </div>
        {isOwn ? (
          <div className="w-full bg-warm-bg text-warm-muted font-medium py-2 rounded-lg text-xs text-center">Your listing</div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => onBuy(listing)}
              className="flex-1 bg-gold hover:bg-gold-mid text-ink font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5">
              <ShoppingCart size={12}/> Buy
            </button>
            <button onClick={() => onAddToCart(listing)}
              className="border border-warm-border hover:border-gold text-warm-muted hover:text-gold px-3 py-2 rounded-lg text-xs transition-all">
              + Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hero Banner ───────────────────────────────────────────────
const HERO_SLIDES = [
  { title: "Fresh Coffee from Mount Elgon", sub: "AA Grade Arabica · Verified farms · EUDR compliant", product: "Coffee (Arabica)", cta: "Shop Coffee", color: "from-amber-900/80", search: "Coffee" },
  { title: "Uganda Nile Perch  -  Fresh Daily", sub: "Direct from Lake Victoria landing sites", product: "Nile Perch (Fresh)", cta: "Shop Fish", color: "from-blue-900/80", search: "Perch" },
  { title: "Industrial & Manufacturing Supplies", sub: "Roofing, cement, timber and more  -  trade directly", product: "Steel Roofing Sheets", cta: "Shop Manufacturing", color: "from-slate-900/80", search: "Steel" },
];

function HeroBanner({ onSearch }) {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[slide];
  return (
    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
      <img src={CATEGORY_IMAGES[s.product] || DEFAULT_IMAGE} alt={s.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"/>
      <div className={`absolute inset-0 bg-gradient-to-r ${s.color} to-transparent`}/>
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <p className="text-white/70 text-xs uppercase tracking-widest mb-2 font-medium">Featured</p>
        <h2 className="text-white font-black text-2xl md:text-3xl leading-tight mb-2">{s.title}</h2>
        <p className="text-white/70 text-sm mb-4">{s.sub}</p>
        <button onClick={() => onSearch(s.search)}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold px-5 py-2.5 rounded-xl text-sm transition-all w-fit">
          {s.cta} <ArrowRight size={14}/>
        </button>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)}
            className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}/>
        ))}
      </div>
    </div>
  );
}

// ── Section Row ───────────────────────────────────────────────
function SectionRow({ title, listings, user, onBuy, onAddToCart, wishlist, onToggleWishlist }) {
  const scrollRef = useRef(null);
  const scroll = dir => {
    const cardW = scrollRef.current?.firstChild?.offsetWidth || 260;
    scrollRef.current?.scrollBy({ left: dir * (cardW + 16) * 4, behavior: "smooth" });
  };
  if (!listings.length) return null;
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-ink text-base">{title}</h2>
          <p className="text-xs text-warm-muted mt-0.5">{listings.length} listing{listings.length !== 1 ? "s" : ""}</p>
        </div>
        {listings.length > 4 && (
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)}
              className="w-8 h-8 rounded-full border border-warm-border bg-white flex items-center justify-center text-warm-muted hover:text-ink hover:border-ink transition-all shadow-sm">
              <ChevronLeft size={15}/>
            </button>
            <button onClick={() => scroll(1)}
              className="w-8 h-8 rounded-full border border-warm-border bg-white flex items-center justify-center text-warm-muted hover:text-ink hover:border-ink transition-all shadow-sm">
              <ChevronRight size={15}/>
            </button>
          </div>
        )}
      </div>
      <div ref={scrollRef}
        className="grid grid-flow-col auto-cols-[calc(25%-12px)] gap-4 overflow-x-auto pb-1"
        style={{scrollbarWidth:"none", msOverflowStyle:"none"}}>
        {listings.map(l => (
          <ListingCard key={l.id} listing={l} user={user} onBuy={onBuy} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist}/>
        ))}
      </div>
    </div>
  );
}


// ── Filter Panel ──────────────────────────────────────────────
function FilterPanel({ filters, setFilters, listings }) {
  const [expandedRegion, setExpandedRegion] = useState(null);
  const [expandedCat, setExpandedCat] = useState(null);

  function reset() {
    setFilters({
      region: "", subRegion: "", category: "", subCategory: "",
      verified: "All", priceMax: "", belowMarket: false, inStock: false, sortBy: "newest"
    });
  }

  const activeCount = [
    !!filters.region, !!filters.subRegion, !!filters.category,
    !!filters.subCategory, filters.verified !== "All",
    !!filters.priceMax, filters.belowMarket, filters.inStock,
  ].filter(Boolean).length;

  const subRegionsForRegion = filters.region
    ? SUB_REGIONS.filter(sr => {
        const r = REGIONS.find(r => r.name === filters.region);
        return r && sr.regionId === r.id;
      })
    : [];

  return (
    <div className="bg-white border border-warm-border rounded-xl overflow-hidden sticky top-28">
      <div className="flex items-center justify-between px-4 py-3 border-b border-warm-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-ink"/>
          <span className="font-bold text-ink text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-gold text-ink px-1.5 py-0.5 rounded-full">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={reset} className="text-xs text-warm-muted hover:text-red-500 transition-colors">Reset</button>
        )}
      </div>

      <div className="p-4 space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto">

        {/* Sort */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Sort by</label>
          <select value={filters.sortBy} onChange={e => setFilters({...filters, sortBy: e.target.value})}
            className="w-full px-3 py-2 border border-warm-border rounded-lg text-xs text-ink bg-white outline-none">
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low to high</option>
            <option value="price_desc">Price: High to low</option>
            <option value="views">Most popular</option>
            <option value="below_market">Best deals first</option>
          </select>
        </div>

        {/* Quick */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Quick filters</label>
          <div className="space-y-2">
            {[["Below market price","belowMarket"],["In stock (500+ units)","inStock"]].map(([label,key]) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <div onClick={() => setFilters({...filters, [key]: !filters[key]})}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${filters[key] ? "bg-gold border-gold" : "border-warm-border group-hover:border-gold"}`}>
                  {filters[key] && <Check size={9} className="text-ink"/>}
                </div>
                <span className="text-xs text-warm-text">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Region + Sub-region */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Region</label>
          <div className="space-y-0.5">
            <button onClick={() => setFilters({...filters, region: "", subRegion: ""})}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${!filters.region ? "bg-warm-bg text-ink font-semibold" : "text-warm-text hover:bg-warm-bg"}`}>
              All regions {!filters.region && <Check size={11} className="text-gold"/>}
            </button>
            {REGIONS.map(r => (
              <div key={r.id}>
                <button
                  onClick={() => {
                    const isSelected = filters.region === r.name;
                    setFilters({...filters, region: isSelected ? "" : r.name, subRegion: ""});
                    setExpandedRegion(expandedRegion === r.id ? null : r.id);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${filters.region === r.name ? "bg-warm-bg text-ink font-semibold" : "text-warm-text hover:bg-warm-bg"}`}>
                  <span>{r.name}</span>
                  <div className="flex items-center gap-1">
                    {filters.region === r.name && <Check size={11} className="text-gold"/>}
                    <ChevronDown size={11} className={`text-warm-muted transition-transform ${expandedRegion === r.id ? "rotate-180" : ""}`}/>
                  </div>
                </button>
                {expandedRegion === r.id && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-warm-border pl-2">
                    {SUB_REGIONS.filter(sr => sr.regionId === r.id).map(sr => (
                      <button key={sr.id}
                        onClick={() => setFilters({...filters, region: r.name, subRegion: filters.subRegion === sr.name ? "" : sr.name})}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${filters.subRegion === sr.name ? "text-ink font-semibold" : "text-warm-muted hover:text-ink"}`}>
                        {sr.name}
                        {filters.subRegion === sr.name && <Check size={10} className="text-gold"/>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Categories from constants */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Category</label>
          <div className="space-y-0.5">
            <button onClick={() => setFilters({...filters, category: "", subCategory: ""})}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${!filters.category ? "bg-warm-bg text-ink font-semibold" : "text-warm-text hover:bg-warm-bg"}`}>
              All categories {!filters.category && <Check size={11} className="text-gold"/>}
            </button>
            {Object.entries(PRODUCTS).map(([cat, products]) => (
              <div key={cat}>
                <button
                  onClick={() => {
                    const isSelected = filters.category === cat;
                    setFilters({...filters, category: isSelected ? "" : cat, subCategory: ""});
                    setExpandedCat(expandedCat === cat ? null : cat);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${filters.category === cat ? "bg-warm-bg text-ink font-semibold" : "text-warm-text hover:bg-warm-bg"}`}>
                  <span className="truncate pr-1">{cat}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {filters.category === cat && <Check size={10} className="text-gold"/>}
                    <ChevronDown size={10} className={`text-warm-muted transition-transform ${expandedCat === cat ? "rotate-180" : ""}`}/>
                  </div>
                </button>
                {expandedCat === cat && (
                  <div className="ml-3 mt-0.5 border-l-2 border-warm-border pl-2 max-h-40 overflow-y-auto">
                    {products.map(p => (
                      <button key={p}
                        onClick={() => setFilters({...filters, category: cat, subCategory: filters.subCategory === p ? "" : p})}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${filters.subCategory === p ? "text-ink font-semibold" : "text-warm-muted hover:text-ink"}`}>
                        <span className="truncate">{p}</span>
                        {filters.subCategory === p && <Check size={10} className="text-gold flex-shrink-0 ml-1"/>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust tick */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Trust tick</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[["All","All",null],["green","Green",100],["gray","Gray",0]].map(([v,label,count]) => (
              <button key={v} onClick={() => setFilters({...filters, verified: v})}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${filters.verified === v ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border hover:border-ink"}`}>
                {count !== null && <TrustTick ratingCount={count} size={13} />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Max price */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Max price (UGX/unit)</label>
          <input type="number" value={filters.priceMax}
            onChange={e => setFilters({...filters, priceMax: e.target.value})}
            className="w-full px-3 py-2 border border-warm-border rounded-lg text-xs text-ink bg-white outline-none focus:border-gold"
            placeholder="e.g. 50000"/>
          {filters.priceMax && (
            <p className="text-[10px] text-warm-muted mt-1">Up to UGX {parseInt(filters.priceMax).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Top Nav ───────────────────────────────────────────────────
function TopNav({ user, search, setSearch, onSearch, cartCount, onCartOpen, onAccountOpen, showAccountMenu, setShowAccountMenu }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="bg-ink sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center font-bold text-ink text-[10px]">DTP</div>
          <div className="hidden md:block">
            <div className="text-white font-semibold text-sm leading-tight">Digital Trade Platform</div>
            <div className="text-white/30 text-[9px]">Empowering Digital Economy</div>
          </div>
        </button>

        <div className="flex-1 flex items-center gap-1 max-w-2xl mx-auto">
          <div className="flex-1 flex items-center bg-white rounded-l-xl overflow-hidden">
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch(search)}
              className="flex-1 px-4 py-2.5 text-sm text-ink placeholder:text-warm-muted outline-none"
              placeholder="Search products, sellers, districts..."/>
          </div>
          <button onClick={() => onSearch(search)}
            className="bg-gold hover:bg-gold-mid px-4 py-2.5 rounded-r-xl flex items-center justify-center transition-all">
            <Search size={16} className="text-ink"/>
          </button>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => navigate("/market-prices")} className="hidden md:block text-white/50 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Prices</button>
          <button onClick={() => navigate("/verify")} className="hidden md:block text-white/50 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Verify</button>

          <div className="relative">
            <button onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
              <User size={16} className="text-white/70"/>
              <span className="text-[10px] text-white/50 mt-0.5">{user ? user.name.split(" ")[0] : "Account"}</span>
            </button>
            {showAccountMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-warm-border w-48 z-50 overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-warm-border">
                      <div className="text-xs font-bold text-ink truncate">{user.name}</div>
                      <div className="text-[10px] text-warm-muted font-mono truncate">{user.tradeId}</div>
                    </div>
                    <button onClick={() => { navigate("/dashboard"); setShowAccountMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-warm-text hover:bg-warm-bg transition-colors">
                      <LayoutDashboard size={14}/> Dashboard
                    </button>
                    <button onClick={() => { navigate("/orders"); setShowAccountMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-warm-text hover:bg-warm-bg transition-colors">
                      <Package size={14}/> My Orders
                    </button>
                    <button onClick={() => { navigate("/profile"); setShowAccountMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-warm-text hover:bg-warm-bg transition-colors">
                      <User size={14}/> Profile
                    </button>
                    <div className="border-t border-warm-border">
                      <button onClick={() => { logout(); setShowAccountMenu(false); navigate("/"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={14}/> Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate("/login"); setShowAccountMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-warm-text hover:bg-warm-bg transition-colors font-semibold">
                      Sign in
                    </button>
                    <button onClick={() => { navigate("/register"); setShowAccountMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gold hover:bg-warm-bg transition-colors font-semibold">
                      Register free
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button onClick={onCartOpen} className="flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all relative">
            <ShoppingCart size={16} className="text-white/70"/>
            <span className="text-[10px] text-white/50 mt-0.5">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-1.5 min-w-[16px] h-4 bg-gold text-ink text-[9px] font-black rounded-full flex items-center justify-center px-1">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-1 overflow-x-auto py-1.5" style={{scrollbarWidth:"none"}}>
          {["All","Coffee & Tea","Food Crops","Livestock & Dairy","Fish & Aquatic","Processed Goods","Manufacturing","Cash Crops","Energy & Fuel"].map(cat => (
            <button key={cat} className="text-white/60 hover:text-white text-xs font-medium px-3 py-1 rounded-lg hover:bg-white/10 transition-all whitespace-nowrap flex-shrink-0">
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Simple Footer ──────────────────────────────────────────────
function SimpleFooter() {
  const navigate = useNavigate();
  return (
    <footer className="bg-ink mt-16 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center font-bold text-ink text-[10px]">DTP</div>
            <div>
              <div className="text-white font-semibold text-sm">Digital Trade Platform</div>
              <div className="text-white/30 text-xs">Ministry of ICT and National Guidance  -  Uganda</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[["Market Prices","/market-prices"],["Verify Actor","/verify"],["Register","/register"],["Sign in","/login"]].map(([l,p]) => (
              <button key={l} onClick={() => navigate(p)} className="text-white/40 hover:text-white text-xs transition-colors">{l}</button>
            ))}
          </div>
          <div className="text-white/25 text-xs">2026 DTP Uganda</div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [filters, setFilters] = useState({
    region: "", subRegion: "", category: "", subCategory: "",
    verified: "All", priceMax: "", belowMarket: false,
    inStock: false, sortBy: "newest",
  });

  const [allListings, setAllListings] = useState( LISTINGS.filter(l => {
    if (l.status !== "active") return false;
    if (!user && l.visibility === "private") return false;
    return true;
  }));

  const marketPriceMap = Object.fromEntries(MARKET_PRICES.map(p => [p.commodity, p.sell]));

  const displayListings = allListings
    .filter(l => user ? l.seller !== user.username : true)
    .filter(l => {
      if (activeSearch) {
        const q = activeSearch.toLowerCase();
        return l.product.toLowerCase().includes(q) || l.sellerName.toLowerCase().includes(q) || (l.district||"").toLowerCase().includes(q);
      }
      return true;
    })
    .filter(l => !filters.region || l.region === filters.region)
    .filter(l => !filters.category || PRODUCT_CATEGORIES[l.product] === filters.category || Object.keys(PRODUCTS).some(k => k === filters.category))
    .filter(l => !filters.subCategory || l.product === filters.subCategory || l.product.toLowerCase().includes(filters.subCategory.toLowerCase()))
    .filter(l => filters.verified === "All" || getTrustTick(getSellerRatingCount(l.seller)) === filters.verified)
    .filter(l => !filters.priceMax || parseInt(l.pricePerUnit) <= parseInt(filters.priceMax))
    .filter(l => !filters.belowMarket || (marketPriceMap[l.product] && parseInt(l.pricePerUnit) < marketPriceMap[l.product]))
    .filter(l => !filters.inStock || parseInt(l.quantity) >= 500)
    .sort((a, b) => {
      if (filters.sortBy === "price_asc") return parseInt(a.pricePerUnit) - parseInt(b.pricePerUnit);
      if (filters.sortBy === "price_desc") return parseInt(b.pricePerUnit) - parseInt(a.pricePerUnit);
      if (filters.sortBy === "views") return b.views - a.views;
      if (filters.sortBy === "below_market") {
        const diffA = marketPriceMap[a.product] ? parseInt(a.pricePerUnit) - marketPriceMap[a.product] : 0;
        const diffB = marketPriceMap[b.product] ? parseInt(b.pricePerUnit) - marketPriceMap[b.product] : 0;
        return diffA - diffB;
      }
      return new Date(b.listed) - new Date(a.listed);
    });

  function getSectionListings(section) {
    return displayListings.filter(l => PRODUCT_CATEGORIES[l.product] === section);
  }

  function handleBuy(listing) {
    if (user) {
      setModal(listing);
      setModalType("purchase");
    } else {
      // Not logged in - add to cart and show cart panel
      addToCart(listing);
    }
  }

  function addToCart(listing) {
    // non-logged-in users can add to cart freely
    setCart(c => {
      const exists = c.find(i => i.id === listing.id);
      if (exists) return c.map(i => i.id === listing.id ? {...i, cartQty: i.cartQty + 1} : i);
      return [...c, {...listing, cartQty: 1}];
    });
    setCartOpen(true);
  }

  function removeFromCart(id) {
    setCart(c => c.filter(i => i.id !== id));
  }

  function toggleWishlist(id) {
    setWishlist(w => w.includes(id) ? w.filter(i => i !== id) : [...w, id]);
  }

  function handleCheckout() {
    setCartOpen(false);
    const first = cart[0];
    if (first) { setModal(first); setModalType("purchase"); }
  }

  const activeFilterCount = [
    !!filters.region, !!filters.subRegion,
    !!filters.category, !!filters.subCategory,
    filters.verified !== "All", !!filters.priceMax,
    filters.belowMarket, filters.inStock,
  ].filter(Boolean).length;

  const pageContent = (
    <div onClick={() => setAccountMenuOpen(false)}>
      <HeroBanner onSearch={q => { setActiveSearch(q); setSearch(q); }}/>

      <div className="h-2"/>

      <div className="flex gap-6">
        {/* Left filter sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <FilterPanel filters={filters} setFilters={setFilters} listings={allListings} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 border border-warm-border bg-white px-4 py-2 rounded-lg text-sm font-semibold text-ink">
              <SlidersHorizontal size={14}/> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <p className="text-sm text-warm-muted">{displayListings.length} listings</p>
          </div>

          {filterOpen && (
            <div className="lg:hidden mb-4">
              <FilterPanel filters={filters} setFilters={setFilters} listings={allListings} onClose={() => setFilterOpen(false)}/>
            </div>
          )}

          {activeSearch || activeFilterCount > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {activeSearch && <h2 className="font-bold text-ink">Results for "{activeSearch}"</h2>}
                  <span className="text-sm text-warm-muted">{displayListings.length} listings</span>
                </div>
                <button onClick={() => { setActiveSearch(""); setSearch(""); setFilters({region:"",subRegion:"",category:"",subCategory:"",verified:"All",priceMax:"",belowMarket:false,inStock:false,sortBy:"newest"}); }}
                  className="text-xs text-warm-muted hover:text-red-500 flex items-center gap-1 transition-colors"><X size={12}/> Clear all</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayListings.map(l => (
                  <ListingCard key={l.id} listing={l} user={user} onBuy={handleBuy} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist}/>
                ))}
                {displayListings.length === 0 && (
                  <div className="col-span-3 text-center py-16 bg-white border border-warm-border rounded-xl">
                    <Search size={28} className="text-warm-muted mx-auto mb-3"/>
                    <p className="font-semibold text-ink mb-1">No listings match your filters</p>
                    <p className="text-sm text-warm-muted">Try adjusting or clearing your filters</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            SECTIONS.filter(s => getSectionListings(s).length > 0).map((section, i) => (
              <div key={section}>
                {i > 0 && <div className="border-t border-warm-border mb-10"/>}
                <SectionRow title={section}
                  listings={getSectionListings(section)}
                  user={user} onBuy={handleBuy} onAddToCart={addToCart}
                  wishlist={wishlist} onToggleWishlist={toggleWishlist}/>
              </div>
            ))
          )}
        </div>
      </div>

      {!user && (
        <div className="mt-10 bg-ink rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold opacity-[0.05] rounded-full"/>
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-white/30 mb-2">Digital Trade Platform</div>
              <h3 className="text-2xl font-bold text-white mb-3">Have products to sell?<br/><span className="text-gold">List them here for free.</span></h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">Register, get your verified Trade ID, and start reaching buyers across Uganda and internationally.</p>
              <button onClick={() => navigate("/register")} className="inline-flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-bold px-6 py-3 rounded-xl text-sm transition-all">
                Register free today <ArrowRight size={14}/>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Free Trade ID","Verified identity at no cost"],["Instant listings","Products go live immediately"],["Verified buyers","All buyers are identity-checked"],["Permanent records","Every sale is fully traceable"]].map(([t,d]) => (
                <div key={t} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-gold text-xs font-bold mb-1">{t}</div>
                  <div className="text-white/40 text-xs leading-relaxed">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modal && modalType === "purchase" && <PurchaseModal listing={modal} onClose={() => setModal(null)} onStockDeduct={(listingId, productId, qty) => {
  // Deduct from listings quantity
  setAllListings(prev => prev.map(l =>
    l.id === listingId ? {...l, quantity: Math.max(0, l.quantity - qty)} : l
  ));
}}/>}
      
      {cartOpen && <CartPanel cart={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} onUser={user} onNavigate={navigate}/>}
    </div>
  );

  if (user) {
    return (
      <div className="min-h-screen bg-warm-bg">
        <TopNav user={user} search={search} setSearch={setSearch} onSearch={q => { setActiveSearch(q); setSearch(q); }}
          cartCount={cart.length} onCartOpen={() => setCartOpen(true)}
          onAccountOpen={() => setAccountMenuOpen(!accountMenuOpen)}
          showAccountMenu={accountMenuOpen} setShowAccountMenu={setAccountMenuOpen}/>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">{pageContent}</div>
        <SimpleFooter/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      <TopNav user={null} search={search} setSearch={setSearch} onSearch={q => { setActiveSearch(q); setSearch(q); }}
        cartCount={cart.length} onCartOpen={() => setCartOpen(true)}
        onAccountOpen={() => setAccountMenuOpen(!accountMenuOpen)}
        showAccountMenu={accountMenuOpen} setShowAccountMenu={setAccountMenuOpen}/>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">{pageContent}</div>
      <SimpleFooter/>
    </div>
  );
}
