import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { ArrowLeft, Plus, Eye, EyeOff, Edit2, Power, Check, X, Tag, Store } from "lucide-react";
import { getActorListingsFallback, getActorProducts, getActorStores, LISTINGS, pushNotification, BUYER_ROLES, ROLE_DEFAULT_CATEGORIES } from "../data/demo";
import { SAMPLE_ACCOUNTS } from "../data/constants";

export default function Listings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const products = getActorProducts(user?.username, user?.role);
  const stores = getActorStores(user?.username, user?.role);
  const [listings, setListings] = useState(getActorListingsFallback(user?.username, user?.role));
  const [showForm, setShowForm] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const [saved, setSaved] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  const [form, setForm] = useState({
    product: "", grade: "", quantity: "", unit: "kg", pricePerUnit: "",
    minOrder: "", storeId: "", visibility: "private", description: "", expires: "", broadcast: false
  });

  function resetForm() { setForm({ product: "", grade: "", quantity: "", unit: "kg", pricePerUnit: "", minOrder: "", storeId: "", visibility: "private", description: "", expires: "", broadcast: false }); }

  function handleSave() {
    if (!form.product || !form.quantity || !form.pricePerUnit) return;
    const store = stores.find(s => s.id === form.storeId);
    const newListing = {
      ...form,
      id: `LST-${Date.now()}`,
      seller: user?.username,
      sellerName: user?.name,
      sellerTradeId: user?.tradeId,
      sellerVerified: user?.verified,
      district: store?.district || user?.district || "",
      region: "",
      listed: new Date().toISOString().split("T")[0],
      status: "active",
      views: 0,
    };
    if (editListing) {
      setListings(listings.map(l => l.id === editListing.id ? {...newListing, id: editListing.id, views: editListing.views} : l));
      setSaved("Listing updated.");
    } else {
      setListings([newListing, ...listings]);
      setSaved("Listing created and published.");
    }
    setShowForm(false);
    setEditListing(null);
    if (form.broadcast && !editListing) {
      let notified = 0;
      (SAMPLE_ACCOUNTS || []).forEach(account => {
        if (!BUYER_ROLES.includes(account.role)) return;
        if (account.username === user?.username) return;
        const buyerCats = ROLE_DEFAULT_CATEGORIES[account.role] || [];
        const productLower = (newListing.product || "").toLowerCase();
        const match = buyerCats.some(c => productLower.includes(c.toLowerCase().split(" ")[0]));
        if (match || buyerCats.length === 0) {
          pushNotification(account.username, {
            type: "broadcast",
            message: (user?.name || "A seller") + " listed " + parseInt(newListing.quantity).toLocaleString() + " " + newListing.unit + " of " + newListing.product + " at UGX " + parseInt(newListing.pricePerUnit).toLocaleString() + "/" + newListing.unit + ".",
            listingId: newListing.id,
          });
          notified++;
        }
      });
      setBroadcastSent(true);
      setTimeout(() => setBroadcastSent(false), 5000);
      setSaved("Listing published. Broadcast sent to " + notified + " eligible buyer" + (notified !== 1 ? "s" : "") + ".");
    } else {
      setSaved(editListing ? "Listing updated." : "Listing published.");
    }
    resetForm();
    setTimeout(() => setSaved(""), 4000);
  }

  function toggleVisibility(listing) {
    setListings(listings.map(l => l.id === listing.id ? {...l, visibility: l.visibility === "private" ? "public" : l.visibility === "public" ? "both" : "private"} : l));
    setSaved(listing.visibility === "private" ? "Set to public." : listing.visibility === "public" ? "Set to both marketplaces." : "Set to private.");
    setTimeout(() => setSaved(""), 3000);
  }

  function toggleStatus(listing) {
    setListings(listings.map(l => l.id === listing.id ? {...l, status: l.status === "active" ? "inactive" : "active"} : l));
    setSaved(listing.status === "active" ? "Listing deactivated." : "Listing activated.");
    setTimeout(() => setSaved(""), 3000);
  }

  const active = listings.filter(l => l.status === "active").length;
  const publicCount = listings.filter(l => (l.visibility === "public" || l.visibility === "both") && l.status === "active").length;
  const privateCount = listings.filter(l => (l.visibility === "private" || l.visibility === "both") && l.status === "active").length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <h1 className="text-xl font-bold text-ink">My Listings</h1>
          <p className="text-sm text-warm-text">{active} active · {publicCount} public · {privateCount} private</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditListing(null); resetForm(); }}
          className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-4 py-2.5 rounded-lg text-sm transition-all">
          <Plus size={16} /> New listing
        </button>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Check size={15} className="flex-shrink-0" /> {saved}
        </div>
      )}
      {broadcastSent && (
        <div className="mb-4 flex items-center gap-3 bg-gold/10 border border-gold/30 text-ink rounded-xl px-4 py-3 text-sm">
          <span className="text-lg">📢</span>
          <div>
            <div className="font-semibold">Broadcast sent</div>
            <div className="text-xs text-warm-muted">Eligible buyers in your value chain have been notified about this listing.</div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-warm-border rounded-xl p-6 mb-6">
          <h3 className="font-bold text-ink mb-5">{editListing ? "Edit listing" : "Create new listing"}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Product *</label>
              <select value={form.product} onChange={e => {
                  const sel = products.find(p => p.name === e.target.value);
                  setForm({...form,
                    product: e.target.value,
                    productId: sel?.id || "",
                    unit: sel?.unit || "kg",
                    pricePerUnit: sel?.price ? String(sel.price) : "",
                    minOrder: form.minOrder,
                  });
                }}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
                <option value="">Select product</option>
                {products.map(p => <option key={p.id} value={p.name}>{p.name} ({p.category})  -  {p.stockRemaining.toLocaleString()} {p.unit} available</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Grade / specification</label>
              <input value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="e.g. FAQ, Screen 15+" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Quantity available *</label>
              <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="e.g. 2000" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Unit</label>
              <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
                {["kg", "tonne", "litre", "bunch", "crate", "piece"].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Price per unit (UGX) *</label>
              <input type="number" value={form.pricePerUnit} onChange={e => setForm({...form, pricePerUnit: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="e.g. 9000" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Minimum order</label>
              <input type="number" value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="e.g. 200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Store / location</label>
              <select value={form.storeId} onChange={e => setForm({...form, storeId: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
                <option value="">No store selected</option>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name} ({s.district})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Visibility</label>
              <select value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
                <option value="private">Private  -  verified buyers in your value chain only</option>
                <option value="public">Public  -  visible on public marketplace</option>
                <option value="both">Both  -  public and private marketplace</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Listing expires</label>
              <input type="date" value={form.expires} onChange={e => setForm({...form, expires: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white resize-none h-20"
                placeholder="Describe the product, quality, availability and any special conditions..." />
            </div>
            {!editListing && (
              <div className="md:col-span-3">
                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.broadcast ? "border-gold bg-gold/5" : "border-warm-border hover:border-gold/50"}`}
                  onClick={() => setForm({...form, broadcast: !form.broadcast})}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${form.broadcast ? "bg-gold" : "border-2 border-warm-border"}`}>
                    {form.broadcast && <span className="text-ink text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">Notify eligible buyers</div>
                    <div className="text-xs text-warm-muted mt-0.5 leading-relaxed">
                      Send a broadcast notification to verified buyers in your value chain whose registered categories match this listing.
                      {form.visibility === "private" || form.visibility === "both"
                        ? " Private marketplace buyers only."
                        : " Public marketplace buyers."}
                    </div>
                    {form.broadcast && (
                      <div className="mt-2 text-xs text-gold font-semibold flex items-center gap-1">
                        ✓ Broadcast will be sent when you publish
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave}
              className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
              <Check size={15} /> {editListing ? "Save changes" : "Publish listing"}
            </button>
            <button onClick={() => { setShowForm(false); setEditListing(null); }}
              className="flex items-center gap-2 border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
          <Tag size={32} className="text-warm-muted mx-auto mb-3" />
          <h3 className="font-semibold text-ink mb-2">No listings yet</h3>
          <p className="text-sm text-warm-text max-w-sm mx-auto mb-4">Create your first listing to start selling on the marketplace.</p>
          <button onClick={() => setShowForm(true)} className="bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm mx-auto flex items-center gap-2">
            <Plus size={15} /> Create a listing
          </button>
        </div>
      ) : (
        <div className="bg-white border border-warm-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-bg">
                <tr>
                  {["Product", "Store / District", "Quantity", "Price", "Min order", "Visibility", "Status", "Views", "Listed", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-warm-text uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="border-t border-warm-border hover:bg-warm-bg/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink text-sm">{l.product}</div>
                      {l.grade && <div className="text-xs text-warm-muted">{l.grade}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-warm-text">{l.district || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-ink">{parseInt(l.quantity).toLocaleString()} {l.unit}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-ink">UGX {parseInt(l.pricePerUnit).toLocaleString()}/{l.unit}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-warm-text">{l.minOrder ? `${l.minOrder} ${l.unit}` : "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleVisibility(l)}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full border transition-all ${l.visibility === "public" ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" : l.visibility === "both" ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" : "bg-warm-bg text-warm-muted border-warm-border hover:border-ink"}`}>
                        {l.visibility === "public" ? <Eye size={10} /> : l.visibility === "both" ? <Eye size={10} /> : <EyeOff size={10} />}
                        {l.visibility}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex text-[11px] font-bold px-2 py-1 rounded-full ${l.status === "active" ? "bg-green-50 text-green-700" : "bg-warm-bg text-warm-muted"}`}>
                        {l.status}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-warm-text">{l.views || 0}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-warm-muted">{l.listed}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setEditListing(l); setForm({product: l.product, grade: l.grade||"", quantity: l.quantity, unit: l.unit||"kg", pricePerUnit: l.pricePerUnit, minOrder: l.minOrder||"", storeId: l.storeId||"", visibility: l.visibility, description: l.description||"", expires: l.expires||""}); setShowForm(true); }}
                          className="text-warm-muted hover:text-ink p-1 rounded hover:bg-warm-bg transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => toggleStatus(l)}
                          className="text-warm-muted hover:text-ink p-1 rounded hover:bg-warm-bg transition-colors">
                          <Power size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
