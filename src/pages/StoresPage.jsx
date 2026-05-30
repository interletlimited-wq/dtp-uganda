import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { ArrowLeft, Plus, MapPin, Clock, Phone, Edit2, Power, Trash2, Store, Check, X } from "lucide-react";
import { getActorStores, STORES } from "../data/demo";
import { REGIONS as GEO_REGIONS, getSubRegionsByRegion, getDistrictsBySubRegion } from "../data/geo";
import { PRODUCTS } from "../data/constants";

const STORE_TYPES = ["Farm Store", "Buying Station", "Depot", "Factory Outlet", "Processing Facility", "Retail Shop", "Other"];

function StoreCard({ store, onEdit, onToggle }) {
  return (
    <div className={`bg-white border rounded-xl p-5 transition-all ${store.status === "active" ? "border-warm-border" : "border-warm-border opacity-60"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Store size={18} className="text-gold" />
          </div>
          <div>
            <div className="font-semibold text-ink">{store.name}</div>
            <div className="text-xs text-warm-muted font-mono">{store.id}</div>
          </div>
        </div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${store.status === "active" ? "bg-green-50 text-green-700" : "bg-warm-bg text-warm-muted"}`}>
          {store.status}
        </div>
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-warm-text">
          <MapPin size={12} className="text-warm-muted flex-shrink-0" />
          {store.address}, {store.district}
        </div>
        <div className="flex items-center gap-2 text-xs text-warm-text">
          <Clock size={12} className="text-warm-muted flex-shrink-0" />
          {store.hours}
        </div>
        <div className="flex items-center gap-2 text-xs text-warm-text">
          <Phone size={12} className="text-warm-muted flex-shrink-0" />
          {store.phone}
        </div>
      </div>
      <div className="flex gap-1 flex-wrap mb-4">
        {(store.products || []).map((p, i) => {
          const label = typeof p === "string" ? p : p.name;
          const sub = typeof p === "object" && p.quantity ? `  -  ${p.quantity} ${p.unit}` : "";
          return (
            <span key={i} className="text-[10px] bg-warm-bg border border-warm-border px-2 py-0.5 rounded-full text-warm-text">
              {label}{sub}
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-warm-border">
        <button onClick={() => onEdit(store)} className="flex items-center gap-1.5 text-xs font-medium text-warm-text hover:text-ink px-2 py-1.5 rounded-lg hover:bg-warm-bg transition-all">
          <Edit2 size={12} /> Edit
        </button>
        <button onClick={() => onToggle(store)} className="flex items-center gap-1.5 text-xs font-medium text-warm-text hover:text-ink px-2 py-1.5 rounded-lg hover:bg-warm-bg transition-all">
          <Power size={12} /> {store.status === "active" ? "Deactivate" : "Activate"}
        </button>
        <div className="ml-auto">
          <span className="text-[10px] bg-warm-bg border border-warm-border px-2 py-1 rounded-full text-warm-muted">{store.type}</span>
        </div>
      </div>
    </div>
  );
}


const HOURS = Array.from({length: 24}, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? "am" : "pm";
  return { value: i, label: `${h}:00 ${ampm}` };
});

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function HoursSelector({ value, onChange }) {
  const [open, setOpen] = useState("07");
  const [close, setClose] = useState("18");
  const [days, setDays] = useState(["Mon","Tue","Wed","Thu","Fri","Sat"]);

  function toggleDay(d) {
    const next = days.includes(d) ? days.filter(x => x !== d) : [...days, d];
    const sorted = DAYS.filter(x => next.includes(x));
    setDays(sorted);
    updateValue(sorted, open, close);
  }

  function updateValue(d, o, c) {
    const dayStr = d.length === 7 ? "Daily" : d.length === 5 && !d.includes("Sat") && !d.includes("Sun") ? "Mon-Fri" : d.join(", ");
    const openLabel = HOURS.find(h => h.value === parseInt(o))?.label || o;
    const closeLabel = HOURS.find(h => h.value === parseInt(c))?.label || c;
    onChange(`${dayStr} ${openLabel} - ${closeLabel}`);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {DAYS.map(d => (
          <button key={d} type="button" onClick={() => toggleDay(d)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${days.includes(d) ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border hover:border-ink"}`}>
            {d}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-[10px] text-warm-muted mb-1">Opens</label>
          <select value={open} onChange={e => { setOpen(e.target.value); updateValue(days, e.target.value, close); }}
            className="w-full px-3 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white">
            {HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
          </select>
        </div>
        <div className="text-warm-muted text-sm mt-4">to</div>
        <div className="flex-1">
          <label className="block text-[10px] text-warm-muted mb-1">Closes</label>
          <select value={close} onChange={e => { setClose(e.target.value); updateValue(days, open, e.target.value); }}
            className="w-full px-3 py-2 border border-warm-border rounded-lg text-sm text-ink bg-white">
            {HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function ProductSearch({ selected, onChange, onAdd, addedProducts = [], capacity = 0, capacityUnit = "kg" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const allProducts = Object.entries(PRODUCTS).flatMap(([cat, items]) =>
    items.map(name => ({ name, cat }))
  );
  const addedNames = addedProducts.map(p => typeof p === "string" ? p : p.name);
  const filtered = allProducts.filter(p =>
    !addedNames.includes(p.name) &&
    (query.length === 0 || p.name.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 10);

  const totalAdded = addedProducts.reduce((s, p) => s + (parseFloat(typeof p === "object" ? p.quantity : 0) || 0), 0);
  const remainingCapacity = capacity ? parseFloat(capacity) - totalAdded : null;
  const wouldExceed = capacity && selected.quantity && (totalAdded + parseFloat(selected.quantity)) > parseFloat(capacity);

  return (
    <div className="space-y-2 mb-3">
      <div className="flex gap-2 items-start">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white placeholder:text-warm-muted"
            placeholder="Search and select product..." />
          {selected.name && (
            <div className="mt-1 flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg">
              <span className="text-xs font-semibold text-ink">{selected.name}</span>
              <button type="button" onClick={() => { onChange({...selected, name: ""}); setQuery(""); }}
                className="text-warm-muted hover:text-red-500 ml-auto text-xs">x</button>
            </div>
          )}
          {open && (
            <div className="absolute top-full left-0 right-0 bg-white border border-warm-border rounded-xl shadow-lg z-30 mt-1 max-h-56 overflow-y-auto">
              {filtered.length > 0 ? filtered.map(p => (
                <button key={p.name} type="button"
                  onClick={() => { onChange({...selected, name: p.name}); setQuery(p.name); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-warm-bg transition-colors text-left border-b border-warm-border last:border-0">
                  <span className="text-sm text-ink">{p.name}</span>
                  <span className="text-xs text-warm-muted bg-warm-bg px-2 py-0.5 rounded">{p.cat}</span>
                </button>
              )) : (
                <div className="px-4 py-3 text-xs text-warm-muted">No products match your search.</div>
              )}
            </div>
          )}
        </div>
        <input type="number" value={selected.quantity}
          onChange={e => onChange({...selected, quantity: e.target.value})}
          className="w-28 px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
          placeholder="Qty" />
        <select value={selected.unit} onChange={e => onChange({...selected, unit: e.target.value})}
          className="w-24 px-2 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
          {["kg","tonne","litre","bunch","bag","crate"].map(u => <option key={u}>{u}</option>)}
        </select>
        <button type="button" onClick={() => { if (!wouldExceed) { onAdd(); setQuery(""); setOpen(false); } }}
          disabled={!selected.name || !selected.quantity || wouldExceed}
          className="px-4 py-2.5 bg-ink hover:bg-ink-mid disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-all flex-shrink-0">
          + Add
        </button>
      </div>
      {wouldExceed && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          Exceeds store capacity. Remaining: {remainingCapacity?.toLocaleString()} {capacityUnit}.
        </p>
      )}
      {capacity > 0 && !wouldExceed && totalAdded > 0 && (
        <p className="text-xs text-warm-muted">
          Used: {totalAdded.toLocaleString()} {capacityUnit} of {parseFloat(capacity).toLocaleString()} {capacityUnit} capacity
        </p>
      )}
      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />}
    </div>
  );
}

function StoreForm({ store, onSave, onCancel, formErrors = {} }) {
  const emptyForm = { name: "", type: "Farm Store", region: "", subRegionId: "", district: "", subCounty: "", parish: "", village: "", address: "", phone: "", altPhone: "", hours: "", status: "active", products: [], capacity: "", capacityUnit: "kg", capacityPeriod: "per season" };
  const [form, setForm] = useState(store ? {...emptyForm, ...store} : emptyForm);
  const [productEntry, setProductEntry] = useState({ name: "", quantity: "", unit: "kg" });
  const subRegions = form.region ? getSubRegionsByRegion(parseInt(form.region)) : [];
  const districts = form.subRegionId ? getDistrictsBySubRegion(parseInt(form.subRegionId)) : [];

  function addProduct() {
    if (!productEntry.name || !productEntry.quantity) return;
    setForm({...form, products: [...(form.products || []), {...productEntry, id: Date.now()}]});
    setProductEntry({ name: "", quantity: "", unit: "kg" });
  }

  function removeProduct(id) {
    setForm({...form, products: form.products.filter(p => p.id !== id)});
  }

  return (
    <div className="bg-white border border-warm-border rounded-xl p-6">
      <h3 className="font-bold text-ink mb-5">{store ? "Edit store" : "Add new store"}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Store name *</label>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
            placeholder="e.g. Nalwanga Farm Store" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Store type *</label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            {STORE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="md:col-span-2 border-t border-warm-border pt-4">
          <p className="text-xs font-bold text-warm-text uppercase tracking-wider mb-3">Location</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Region *</label>
              <select value={form.region}
                onChange={e => setForm({...form, region: e.target.value, subRegionId: "", district: ""})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
                <option value="">Select region</option>
                {GEO_REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Sub-region</label>
              <select value={form.subRegionId}
                onChange={e => setForm({...form, subRegionId: e.target.value, district: ""})}
                disabled={!form.region}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white disabled:opacity-50">
                <option value="">Select sub-region</option>
                {subRegions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">District *</label>
              <select value={form.district}
                onChange={e => setForm({...form, district: e.target.value})}
                disabled={!form.subRegionId}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white disabled:opacity-50">
                <option value="">Select district</option>
                {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Sub-county / Town</label>
              <input value={form.subCounty} onChange={e => setForm({...form, subCounty: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="e.g. Sipi Sub-county" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Parish</label>
              <input value={form.parish} onChange={e => setForm({...form, parish: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="e.g. Kapchorwa Parish" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Village</label>
              <input value={form.village} onChange={e => setForm({...form, village: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="e.g. Kapkwai Village" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Street / Physical address *</label>
              <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="Plot number, street name, landmark" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t border-warm-border pt-4">
          <p className="text-xs font-bold text-warm-text uppercase tracking-wider mb-3">Contact and hours</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Primary phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value.replace(/\D/g,"").slice(0,10)})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="0772..." inputMode="numeric" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Alternative phone</label>
              <input value={form.altPhone} onChange={e => setForm({...form, altPhone: e.target.value.replace(/\D/g,"").slice(0,10)})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
                placeholder="0700..." inputMode="numeric" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Operating hours</label>
              <HoursSelector value={form.hours} onChange={h => setForm({...form, hours: h})} />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t border-warm-border pt-4">
          <p className="text-xs font-bold text-warm-text uppercase tracking-wider mb-3">Capacity</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Storage capacity <span className="text-red-400">*</span></label>
              <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white ${formErrors.capacity ? "border-red-300 bg-red-50/20" : "border-warm-border"}`}
                placeholder="e.g. 5000" />
              {formErrors.capacity && <p className="text-xs text-red-500 mt-1">{formErrors.capacity}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Unit</label>
              <select value={form.capacityUnit} onChange={e => setForm({...form, capacityUnit: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
                {["kg","tonnes","litres","bags","crates","units"].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Period</label>
              <select value={form.capacityPeriod} onChange={e => setForm({...form, capacityPeriod: e.target.value})}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
                {["per day","per week","per month","per season","per year"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t border-warm-border pt-4">
          <p className="text-xs font-bold text-warm-text uppercase tracking-wider mb-1">Products handled at this store <span className="text-red-400">*</span></p>
          {formErrors.products && <p className="text-xs text-red-500 mb-2">{formErrors.products}</p>}
          <ProductSearch
            selected={productEntry}
            onChange={setProductEntry}
            onAdd={addProduct}
            addedProducts={form.products || []}
            capacity={form.capacity}
            capacityUnit={form.capacityUnit}
          />
          {(form.products || []).length > 0 && (
            <div className="space-y-1.5">
              {form.products.map(p => (
                <div key={p.id} className="flex items-center justify-between px-3 py-2 bg-warm-bg border border-warm-border rounded-lg">
                  <span className="text-sm text-ink">{p.name}</span>
                  <span className="text-xs text-warm-muted">{p.quantity} {p.unit}</span>
                  <button onClick={() => removeProduct(p.id)} className="text-warm-muted hover:text-red-500 transition-colors text-xs ml-3">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-5 border-t border-warm-border">
        <button onClick={() => onSave(form)}
          className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
          <Check size={15} /> {store ? "Save changes" : "Add store"}
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
          <X size={15} /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function StoresPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState(getActorStores(user?.username, user?.role));
  const [showForm, setShowForm] = useState(false);
  const [editStore, setEditStore] = useState(null);
  const [saved, setSaved] = useState("");

  const [formErrors, setFormErrors] = useState({});

  function handleSave(form) {
    const errs = {};
    if (!form.name) errs.name = "Store name is required";
    if (!form.region) errs.region = "Region is required";
    if (!form.district) errs.district = "District is required";
    if (!form.address) errs.address = "Address is required";
    if (!form.capacity) errs.capacity = "Storage capacity is required";
    if (!form.products || form.products.length === 0) errs.products = "Add at least one product handled at this store";
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    if (editStore) {
      setStores(stores.map(s => s.id === editStore.id ? {...form, id: editStore.id} : s));
      setSaved("Store updated.");
    } else {
      const newStore = { ...form, id: `UG-DTP-STR-${String(Math.floor(10000 + Math.random() * 89999))}`, owner: user?.username };
      setStores([...stores, newStore]);
      setSaved("Store registered successfully.");
    }
    setShowForm(false);
    setEditStore(null);
    setTimeout(() => setSaved(""), 3000);
  }

  function handleToggle(store) {
    setStores(stores.map(s => s.id === store.id ? {...s, status: s.status === "active" ? "inactive" : "active"} : s));
    setSaved(store.status === "active" ? "Store deactivated." : "Store activated.");
    setTimeout(() => setSaved(""), 3000);
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <h1 className="text-xl font-bold text-ink">My Stores</h1>
          <p className="text-sm text-warm-text">{stores.length} registered store{stores.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditStore(null); }}
          className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-4 py-2.5 rounded-lg text-sm transition-all">
          <Plus size={16} /> Add store
        </button>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Check size={15} className="flex-shrink-0" /> {saved}
        </div>
      )}

      {(showForm || editStore) && (
        <div className="mb-6">
          <StoreForm store={editStore} onSave={handleSave} onCancel={() => { setShowForm(false); setEditStore(null); setFormErrors({}); }} formErrors={formErrors} />
        </div>
      )}

      {stores.length === 0 ? (
        <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
          <div className="w-16 h-16 bg-warm-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store size={28} className="text-warm-muted" />
          </div>
          <h3 className="font-semibold text-ink mb-2">No stores registered</h3>
          <p className="text-sm text-warm-text max-w-sm mx-auto mb-4">Register your store, depot or buying station to affiliate your stock and sales to specific locations.</p>
          <button onClick={() => setShowForm(true)} className="bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 mx-auto">
            <Plus size={15} /> Add your first store
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map(s => (
            <StoreCard key={s.id} store={s}
              onEdit={store => { setEditStore(store); setShowForm(false); }}
              onToggle={handleToggle} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
