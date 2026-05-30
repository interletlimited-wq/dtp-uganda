import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ArrowLeft, Plus, Edit2, Power, Truck, Check, X,
  MapPin, Package, AlertCircle
} from "lucide-react";
import { VEHICLES } from "../data/demo";

const VEHICLE_TYPES = ["Lorry", "Truck", "Pickup", "Van", "Motorcycle", "Tractor", "Refrigerated Truck", "Tanker", "Other"];
const GOODS_TYPES = ["General", "Dry Goods", "Perishables", "Livestock", "Liquids", "Construction Materials", "Fragile Goods"];
const OWNERSHIP = ["Owned", "Leased", "Hired"];

function VehicleCard({ vehicle, onEdit, onToggle }) {
  const statusColor = {
    available: "bg-green-50 text-green-700 border-green-200",
    in_transit: "bg-blue-50 text-blue-700 border-blue-200",
    maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    inactive: "bg-warm-bg text-warm-muted border-warm-border",
  };
  return (
    <div className={`bg-white border border-warm-border rounded-xl p-5 ${vehicle.status === "inactive" ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Truck size={18} className="text-slate-600" />
          </div>
          <div>
            <div className="font-bold text-ink">{vehicle.regNumber}</div>
            <div className="text-xs text-warm-muted">{vehicle.make} - {vehicle.type}</div>
          </div>
        </div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusColor[vehicle.status] || statusColor.inactive}`}>
          {vehicle.status.replace("_", " ")}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          ["Capacity", `${vehicle.capacity.toLocaleString()} ${vehicle.unit}`],
          ["Ownership", vehicle.ownership],
          ["Year", vehicle.year || "-"],
          ["Insurance", vehicle.insurance || "Not specified"],
        ].map(([l, v]) => (
          <div key={l} className="bg-warm-bg rounded-lg p-2">
            <div className="text-[10px] text-warm-muted uppercase tracking-wider">{l}</div>
            <div className="text-xs font-semibold text-ink mt-0.5">{v}</div>
          </div>
        ))}
      </div>
      <div className="mb-3">
        <div className="text-[10px] text-warm-muted uppercase tracking-wider mb-1.5">Goods handled</div>
        <div className="flex flex-wrap gap-1">
          {vehicle.goodsTypes.map(g => (
            <span key={g} className="text-[10px] bg-warm-bg border border-warm-border px-2 py-0.5 rounded-full text-warm-text">{g}</span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-[10px] text-warm-muted uppercase tracking-wider mb-1.5">Areas served</div>
        <div className="flex flex-wrap gap-1">
          {vehicle.areas.map(a => (
            <span key={a} className="text-[10px] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full text-blue-700 flex items-center gap-1">
              <MapPin size={8} /> {a}
            </span>
          ))}
        </div>
      </div>
      {vehicle.currentJob && (
        <div className="mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <Package size={13} className="text-blue-600 flex-shrink-0" />
          <div className="text-xs text-blue-700">Active job: <span className="font-semibold">{vehicle.currentJob}</span></div>
        </div>
      )}
      <div className="flex items-center gap-2 pt-3 border-t border-warm-border">
        <button onClick={() => onEdit(vehicle)}
          className="flex items-center gap-1.5 text-xs font-medium text-warm-text hover:text-ink px-2 py-1.5 rounded-lg hover:bg-warm-bg transition-all">
          <Edit2 size={12} /> Edit
        </button>
        <button onClick={() => onToggle(vehicle)}
          className="flex items-center gap-1.5 text-xs font-medium text-warm-text hover:text-ink px-2 py-1.5 rounded-lg hover:bg-warm-bg transition-all">
          <Power size={12} /> {vehicle.status === "inactive" ? "Activate" : "Deactivate"}
        </button>
      </div>
    </div>
  );
}

function VehicleForm({ vehicle, onSave, onCancel }) {
  const empty = {
    regNumber: "", type: "Lorry", make: "", capacity: "", unit: "kg",
    ownership: "Owned", year: "", insurance: "", insuranceExpiry: "",
    goodsTypes: [], areas: [], rate: "", rateUnit: "per km",
    availability: "available", notes: ""
  };
  const [form, setForm] = useState(vehicle ? {...empty, ...vehicle} : empty);
  const [areaInput, setAreaInput] = useState("");
  const [errors, setErrors] = useState({});

  function toggleGoods(g) {
    setForm({...form, goodsTypes: form.goodsTypes.includes(g)
      ? form.goodsTypes.filter(x => x !== g)
      : [...form.goodsTypes, g]});
  }

  function addArea() {
    if (!areaInput.trim()) return;
    if (!form.areas.includes(areaInput.trim())) {
      setForm({...form, areas: [...form.areas, areaInput.trim()]});
    }
    setAreaInput("");
  }

  function validate() {
    const e = {};
    if (!form.regNumber) e.regNumber = "Registration number is required";
    if (!form.make) e.make = "Make and model is required";
    if (!form.capacity) e.capacity = "Capacity is required";
    if (form.goodsTypes.length === 0) e.goodsTypes = "Select at least one goods type";
    if (form.areas.length === 0) e.areas = "Add at least one area served";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="bg-white border border-warm-border rounded-xl p-6 mb-6">
      <h3 className="font-bold text-ink mb-5">{vehicle ? "Edit vehicle" : "Add new vehicle"}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Registration number <span className="text-red-400">*</span></label>
          <input value={form.regNumber} onChange={e => setForm({...form, regNumber: e.target.value.toUpperCase()})}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white font-mono ${errors.regNumber ? "border-red-300" : "border-warm-border"}`}
            placeholder="UAY 456K" />
          {errors.regNumber && <p className="text-xs text-red-500 mt-1">{errors.regNumber}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Vehicle type <span className="text-red-400">*</span></label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Make and model <span className="text-red-400">*</span></label>
          <input value={form.make} onChange={e => setForm({...form, make: e.target.value})}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm text-ink bg-white ${errors.make ? "border-red-300" : "border-warm-border"}`}
            placeholder="e.g. Isuzu NQR" />
          {errors.make && <p className="text-xs text-red-500 mt-1">{errors.make}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Capacity <span className="text-red-400">*</span></label>
          <div className="flex gap-2">
            <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})}
              className={`flex-1 px-3 py-2.5 border rounded-lg text-sm text-ink bg-white ${errors.capacity ? "border-red-300" : "border-warm-border"}`}
              placeholder="e.g. 7000" />
            <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
              className="w-24 px-2 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
              {["kg","tonnes","litres","units"].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Ownership</label>
          <select value={form.ownership} onChange={e => setForm({...form, ownership: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            {OWNERSHIP.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Year of manufacture</label>
          <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
            placeholder="e.g. 2019" min="1990" max="2026" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Insurance provider</label>
          <input value={form.insurance} onChange={e => setForm({...form, insurance: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
            placeholder="e.g. UAP Insurance" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Insurance expiry</label>
          <input type="date" value={form.insuranceExpiry} onChange={e => setForm({...form, insuranceExpiry: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Rate</label>
          <div className="flex gap-2">
            <input type="number" value={form.rate} onChange={e => setForm({...form, rate: e.target.value})}
              className="flex-1 px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
              placeholder="e.g. 1800" />
            <select value={form.rateUnit} onChange={e => setForm({...form, rateUnit: e.target.value})}
              className="w-28 px-2 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
              {["per km","per trip","per day","per tonne"].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="md:col-span-3 border-t border-warm-border pt-4">
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-2">Goods types handled <span className="text-red-400">*</span></label>
          <div className="flex flex-wrap gap-2">
            {GOODS_TYPES.map(g => (
              <button key={g} type="button" onClick={() => toggleGoods(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.goodsTypes.includes(g) ? "bg-ink text-white border-ink" : "bg-white text-warm-text border-warm-border hover:border-ink"}`}>
                {g}
              </button>
            ))}
          </div>
          {errors.goodsTypes && <p className="text-xs text-red-500 mt-1">{errors.goodsTypes}</p>}
        </div>
        <div className="md:col-span-3 border-t border-warm-border pt-4">
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-2">Areas served <span className="text-red-400">*</span></label>
          <div className="flex gap-2 mb-2">
            <input value={areaInput} onChange={e => setAreaInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addArea(); }}}
              className="flex-1 px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
              placeholder="Type a district or town and press Enter or Add" />
            <button type="button" onClick={addArea}
              className="px-4 py-2.5 bg-ink hover:bg-ink-mid text-white rounded-lg text-sm font-semibold transition-all">
              Add
            </button>
          </div>
          {errors.areas && <p className="text-xs text-red-500 mb-2">{errors.areas}</p>}
          <div className="flex flex-wrap gap-1.5">
            {form.areas.map(a => (
              <span key={a} className="inline-flex items-center gap-1.5 text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full">
                <MapPin size={10} /> {a}
                <button type="button" onClick={() => setForm({...form, areas: form.areas.filter(x => x !== a)})}
                  className="hover:text-red-500 transition-colors ml-0.5">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Notes</label>
          <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white resize-none h-16 placeholder:text-warm-muted"
            placeholder="Any additional details about this vehicle..." />
        </div>
      </div>
      <div className="flex gap-3 mt-5 pt-5 border-t border-warm-border">
        <button onClick={() => { if (validate()) onSave(form); }}
          className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
          <Check size={15} /> {vehicle ? "Save changes" : "Add vehicle"}
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
          <X size={15} /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function Vehicles() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState(
    VEHICLES.filter(v => v.owner === user?.username).length > 0
      ? VEHICLES.filter(v => v.owner === user?.username)
      : VEHICLES.filter(v => v.owner === "ssekandi_transport")
  );
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [saved, setSaved] = useState("");

  function handleSave(form) {
    if (editVehicle) {
      setVehicles(vehicles.map(v => v.id === editVehicle.id ? {...form, id: editVehicle.id, owner: user?.username} : v));
      setSaved("Vehicle updated.");
    } else {
      setVehicles([...vehicles, {...form, id: `VEH-${Date.now()}`, owner: user?.username, currentJob: null, status: "available"}]);
      setSaved("Vehicle added to your fleet.");
    }
    setShowForm(false);
    setEditVehicle(null);
    setTimeout(() => setSaved(""), 3000);
  }

  function handleToggle(vehicle) {
    setVehicles(vehicles.map(v => v.id === vehicle.id
      ? {...v, status: v.status === "inactive" ? "available" : "inactive"} : v));
    setSaved(vehicle.status === "inactive" ? "Vehicle activated." : "Vehicle deactivated.");
    setTimeout(() => setSaved(""), 3000);
  }

  const active = vehicles.filter(v => v.status !== "inactive").length;
  const inTransit = vehicles.filter(v => v.status === "in_transit").length;
  const totalCapacity = vehicles.filter(v => v.status !== "inactive")
    .reduce((s, v) => s + (parseInt(v.capacity) || 0), 0);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <h1 className="text-xl font-bold text-ink">My Vehicles</h1>
          <p className="text-sm text-warm-text">{vehicles.length} registered - {active} active - {inTransit} in transit</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditVehicle(null); }}
          className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-4 py-2.5 rounded-lg text-sm transition-all">
          <Plus size={16} /> Add vehicle
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          ["Total fleet", vehicles.length, "Registered vehicles"],
          ["Active", active, "Available or in transit"],
          ["In transit", inTransit, "On active jobs"],
          ["Total capacity", `${totalCapacity.toLocaleString()} kg`, "Active fleet"],
        ].map(([label, value, sub]) => (
          <div key={label} className="bg-white border border-warm-border rounded-xl p-5">
            <div className="text-2xl font-bold text-ink">{value}</div>
            <div className="text-xs font-semibold text-warm-text mt-1">{label}</div>
            <div className="text-xs text-warm-muted mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Check size={15} className="flex-shrink-0" /> {saved}
        </div>
      )}

      {(showForm || editVehicle) && (
        <VehicleForm vehicle={editVehicle} onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditVehicle(null); }} />
      )}

      {vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
          <Truck size={32} className="text-warm-muted mx-auto mb-3" />
          <h3 className="font-semibold text-ink mb-2">No vehicles registered</h3>
          <p className="text-sm text-warm-text max-w-sm mx-auto mb-4">Register your vehicles to start receiving transport jobs on the platform.</p>
          <button onClick={() => setShowForm(true)}
            className="bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 mx-auto">
            <Plus size={15} /> Add your first vehicle
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v}
              onEdit={veh => { setEditVehicle(veh); setShowForm(false); }}
              onToggle={handleToggle} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
