import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { ArrowLeft, Plus, Edit2, Power, Trash2, Check, X, Package, AlertCircle, Store } from "lucide-react";
import { getActorProducts, getActorStores } from "../data/demo";
import { PRODUCTS as PRODUCT_CATS } from "../data/constants";

const UNITS = ["kg", "tonne", "litre", "bunch", "crate", "bag (50kg)", "bag (100kg)", "piece", "dozen"];

function ProductRow({ product, stores, onEdit, onToggle }) {
  const store = stores.find(s => s.id === product.storeId);
  const stockPct = Math.round((product.stockRemaining / product.stockDeclared) * 100);
  const lowStock = stockPct < 20;
  return (
    <tr className="border-t border-warm-border hover:bg-warm-bg/50 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium text-ink text-sm">{product.name}</div>
        <div className="text-xs text-warm-muted">{product.category}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-warm-text">{store?.name || "No store"}</div>
        {store && <div className="text-[10px] text-warm-muted">{store.district}</div>}
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-ink">{product.stockDeclared.toLocaleString()} {product.unit}</div>
      </td>
      <td className="px-4 py-3">
        <div className={`text-sm font-semibold ${lowStock ? "text-red-500" : "text-green-600"}`}>
          {product.stockRemaining.toLocaleString()} {product.unit}
        </div>
        <div className="w-20 h-1.5 bg-warm-bg rounded-full overflow-hidden mt-1">
          <div className={`h-full rounded-full ${lowStock ? "bg-red-400" : "bg-green-500"}`} style={{width:`${stockPct}%`}} />
        </div>
        {lowStock && <div className="flex items-center gap-1 text-[10px] text-red-500 mt-0.5"><AlertCircle size={9} /> Low stock</div>}
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-semibold text-ink">UGX {product.price.toLocaleString()}/{product.unit}</div>
      </td>
      <td className="px-4 py-3">
        <div className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full ${product.visibility === "public" ? "bg-blue-50 text-blue-700" : product.visibility === "both" ? "bg-purple-50 text-purple-700" : "bg-warm-bg text-warm-muted"}`}>
          {product.visibility || "private"}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full ${product.status === "active" ? "bg-green-50 text-green-700" : "bg-warm-bg text-warm-muted"}`}>
          {product.status}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(product)} className="text-warm-muted hover:text-ink transition-colors p-1 rounded hover:bg-warm-bg">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onToggle(product)} className="text-warm-muted hover:text-ink transition-colors p-1 rounded hover:bg-warm-bg">
            <Power size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ProductForm({ product, stores, onSave, onCancel }) {
  const allProducts = Object.entries(PRODUCT_CATS).flatMap(([cat, items]) => items.map(i => ({ cat, name: i })));
  const [form, setForm] = useState(product || {
    name: "", category: "", unit: "kg", stockDeclared: "", price: "", visibility: "public", status: "active", storeId: "", description: "", certifications: []
  });

  return (
    <div className="bg-white border border-warm-border rounded-xl p-6 mb-6">
      <h3 className="font-bold text-ink mb-5">{product ? "Edit product" : "Add new product"}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Product name *</label>
          <select value={form.name} onChange={e => {
            const found = allProducts.find(p => p.name === e.target.value);
            setForm({...form, name: e.target.value, category: found?.cat || form.category});
          }} className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            <option value="">Select product</option>
            {Object.entries(PRODUCT_CATS).map(([cat, items]) => (
              <optgroup key={cat} label={cat}>
                {items.map(i => <option key={i} value={i}>{i}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Unit *</label>
          <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Stock quantity *</label>
          <input type="number" value={form.stockDeclared} onChange={e => setForm({...form, stockDeclared: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
            placeholder="e.g. 1000" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Price per unit (UGX) *</label>
          <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
            placeholder="e.g. 9000" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Store</label>
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
            <option value="public">Public  -  visible on marketplace</option>
            <option value="private">Private  -  visible to verified actors only</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white resize-none h-20"
            placeholder="Describe your product  -  grade, quality, availability..." />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => onSave({...form, stockRemaining: form.stockDeclared})}
          className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
          <Check size={15} /> {product ? "Save changes" : "Add product"}
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
          <X size={15} /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(getActorProducts(user?.username, user?.role));
  const stores = getActorStores(user?.username, user?.role);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saved, setSaved] = useState("");

  function handleSave(form) {
    if (editProduct) {
      setProducts(products.map(p => p.id === editProduct.id ? {...form, id: editProduct.id, owner: user?.username} : p));
      setSaved("Product updated.");
    } else {
      setProducts([...products, {...form, id: `PRD-${Date.now()}`, owner: user?.username}]);
      setSaved("Product added successfully.");
    }
    setShowForm(false);
    setEditProduct(null);
    setTimeout(() => setSaved(""), 3000);
  }

  function handleToggle(product) {
    setProducts(products.map(p => p.id === product.id ? {...p, status: p.status === "active" ? "inactive" : "active"} : p));
    setSaved(product.status === "active" ? "Product deactivated." : "Product reactivated.");
    setTimeout(() => setSaved(""), 3000);
  }

  const activeCount = products.filter(p => p.status === "active").length;
  const totalStock = products.reduce((s, p) => s + (parseInt(p.stockRemaining) || 0), 0);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <h1 className="text-xl font-bold text-ink">My Products</h1>
          <p className="text-sm text-warm-text">{activeCount} active products - {totalStock.toLocaleString()} total units in stock</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/stores")} className="flex items-center gap-2 border border-warm-border text-warm-text hover:text-ink px-4 py-2.5 rounded-lg text-sm transition-all">
            <Store size={15} /> My Stores ({stores.length})
          </button>
          <button onClick={() => { setShowForm(true); setEditProduct(null); }}
            className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-4 py-2.5 rounded-lg text-sm transition-all">
            <Plus size={16} /> Add product
          </button>
        </div>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Check size={15} className="flex-shrink-0" /> {saved}
        </div>
      )}

      {(showForm || editProduct) && (
        <ProductForm product={editProduct} stores={stores} onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditProduct(null); }} />
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
          <Package size={32} className="text-warm-muted mx-auto mb-3" />
          <h3 className="font-semibold text-ink mb-2">No products yet</h3>
          <p className="text-sm text-warm-text max-w-sm mx-auto mb-4">Add your products to start listing them on the marketplace.</p>
          <button onClick={() => setShowForm(true)} className="bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm mx-auto flex items-center gap-2">
            <Plus size={15} /> Add your first product
          </button>
        </div>
      ) : (
        <div className="bg-white border border-warm-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-bg">
                <tr>
                  {["Product", "Store", "Stock declared", "Stock remaining", "Price", "Visibility", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-warm-text uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <ProductRow key={p.id} product={p} stores={stores}
                    onEdit={prod => { setEditProduct(prod); setShowForm(false); }}
                    onToggle={handleToggle} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
