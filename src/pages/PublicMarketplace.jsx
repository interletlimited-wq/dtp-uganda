import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Shield, MapPin, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Eye, ShoppingCart, ArrowRight, Filter, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { LISTINGS, MARKET_PRICES } from "../data/demo";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../context/AuthContext";

const REGIONS = ["All regions", "Central", "Eastern", "Western", "Northern"];
const CATEGORIES = ["All categories", "Cash Crops", "Food Crops", "Livestock", "Fish", "Processed", "Manufacturing", "Other"];
const PAGE_SIZE = 12;

const PRODUCT_CATEGORIES = {
  "Coffee (Arabica)": "Cash Crops", "Coffee (Robusta)": "Cash Crops",
  "Vanilla": "Cash Crops", "Cocoa": "Cash Crops", "Tea": "Cash Crops",
  "Cotton (Lint)": "Cash Crops", "Simsim / Sesame": "Cash Crops",
  "Maize": "Food Crops", "Beans (Common)": "Food Crops", "Groundnuts": "Food Crops",
  "Rice (Milled)": "Food Crops", "Sweet Potatoes": "Food Crops",
  "Sorghum": "Food Crops", "Millet (Finger)": "Food Crops",
  "Cattle (Beef)": "Livestock", "Milk (Raw)": "Livestock", "Hides and Skins": "Livestock",
  "Nile Perch (Fresh)": "Fish", "Tilapia (Fresh)": "Fish", "Fish (Dried)": "Fish",
  "Sugar (Refined)": "Processed", "Salt (Iodised)": "Processed",
  "Maize Flour": "Processed", "Wheat Flour": "Processed",
  "Sunflower Oil": "Processed", "Animal Feed (Poultry)": "Processed",
  "Honey (Raw)": "Processed", "Soap (Bar)": "Processed",
  "Steel Roofing Sheets": "Manufacturing", "Cement": "Manufacturing",
  "Timber (Hardwood)": "Manufacturing", "Textiles (Fabric)": "Manufacturing",
  "Plastic Pipes (PVC)": "Manufacturing", "Packaging Materials": "Manufacturing",
  "Leather (Finished)": "Manufacturing",
};

function ListingCard({ listing, onSignInToBuy }) {
  const [expanded, setExpanded] = useState(false);
  const marketPrice = MARKET_PRICES.find(p => p.commodity === listing.product);
  const priceDiff = marketPrice
    ? ((parseInt(listing.pricePerUnit) - marketPrice.sell) / marketPrice.sell * 100).toFixed(1)
    : null;

  return (
    <div className="bg-white border border-warm-border rounded-xl overflow-hidden hover:border-gold/50 hover:shadow-sm transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-ink truncate">{listing.product}</div>
            {listing.grade && <div className="text-xs text-warm-muted">{listing.grade}</div>}
          </div>
          <div className={`text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 flex-shrink-0 ml-2 ${
            listing.sellerVerified === "NIRA" ? "bg-blue-50 text-blue-700 border-blue-200" :
            listing.sellerVerified === "URSB" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
            "bg-green-50 text-green-700 border-green-200"
          }`}>
            <Shield size={9} /> {listing.sellerVerified}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <div className="text-2xl font-bold text-ink">UGX {parseInt(listing.pricePerUnit).toLocaleString()}</div>
          <div className="text-sm text-warm-muted">/{listing.unit}</div>
          {priceDiff && (
            <div className={`flex items-center gap-0.5 text-xs font-semibold ml-auto ${parseFloat(priceDiff) <= 0 ? "text-green-600" : "text-amber-600"}`}>
              {parseFloat(priceDiff) <= 0 ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
              {Math.abs(priceDiff)}% {parseFloat(priceDiff) <= 0 ? "below" : "above"} market
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="bg-warm-bg rounded-lg p-2">
            <div className="text-warm-muted">Available</div>
            <div className="font-semibold text-ink">{parseInt(listing.quantity).toLocaleString()} {listing.unit}</div>
          </div>
          <div className="bg-warm-bg rounded-lg p-2">
            <div className="text-warm-muted">Min order</div>
            <div className="font-semibold text-ink">{listing.minOrder} {listing.unit}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 text-xs text-warm-text">
          <MapPin size={11} className="text-warm-muted flex-shrink-0" />
          {listing.district}{listing.region ? `, ${listing.region}` : ""}
          <span className="ml-auto flex items-center gap-1 text-warm-muted"><Eye size={10} /> {listing.views}</span>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-warm-bg rounded-lg mb-3">
          <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={12} className="text-gold" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-ink truncate">{listing.sellerName}</div>
            <div className="text-[10px] font-mono text-warm-muted truncate">{listing.sellerTradeId}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onSignInToBuy(listing)}
            className="flex-1 bg-gold hover:bg-gold-mid text-ink font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5">
            <ShoppingCart size={14} /> Buy this
          </button>
          <button onClick={() => setExpanded(!expanded)}
            className="border border-warm-border hover:border-ink text-warm-muted hover:text-ink px-3 py-2.5 rounded-lg transition-all">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-warm-border">
            {listing.description && <p className="text-xs text-warm-text leading-relaxed mb-2">{listing.description}</p>}
            <div className="flex items-center justify-between text-xs text-warm-muted">
              <span>Listed: {listing.listed}</span>
              <span>Expires: {listing.expires}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SignInModal({ listing, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShoppingCart size={24} className="text-gold" />
          </div>
          <h3 className="font-bold text-ink text-lg mb-1">Sign in to buy</h3>
          <p className="text-warm-text text-sm">
            To purchase <span className="font-semibold text-ink">{listing?.product}</span> from {listing?.sellerName}, you need a verified DTP account.
          </p>
        </div>
        <div className="p-4 bg-warm-bg border border-warm-border rounded-xl mb-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-xs text-warm-muted">Product</div><div className="font-semibold text-ink">{listing?.product}</div></div>
            <div><div className="text-xs text-warm-muted">Price</div><div className="font-semibold text-ink">UGX {parseInt(listing?.pricePerUnit || 0).toLocaleString()}/{listing?.unit}</div></div>
            <div><div className="text-xs text-warm-muted">Seller</div><div className="font-semibold text-ink">{listing?.sellerName}</div></div>
            <div><div className="text-xs text-warm-muted">Location</div><div className="font-semibold text-ink">{listing?.district}</div></div>
          </div>
        </div>
        <div className="space-y-2 mb-5 text-xs text-warm-text">
          {["Get a verified Trade ID  -  free registration", "Buy directly from verified sellers", "Every transaction is recorded permanently", "Access market prices and sell your own products"].map(b => (
            <div key={b} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </div>
              {b}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/register")}
            className="flex-1 bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-xl text-sm transition-all">
            Register free
          </button>
          <button onClick={() => navigate("/login")}
            className="flex-1 border-2 border-ink hover:bg-ink hover:text-white text-ink font-bold py-3 rounded-xl text-sm transition-all">
            Sign in
          </button>
        </div>
        <button onClick={onClose} className="w-full text-center text-xs text-warm-muted hover:text-ink mt-3 transition-colors">
          Continue browsing
        </button>
      </div>
    </div>
  );
}

export default function PublicMarketplace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All regions");
  const [category, setCategory] = useState("All categories");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [signInModal, setSignInModal] = useState(null);

  const listings = LISTINGS.filter(l => l.status === "active");

  const filtered = listings.filter(l => {
    const matchSearch = !search ||
      l.product.toLowerCase().includes(search.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      (l.district || "").toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === "All regions" || l.region === region;
    const matchCat = category === "All categories" ||
      PRODUCT_CATEGORIES[l.product] === category;
    return matchSearch && matchRegion && matchCat;
  }).sort((a, b) => {
    if (sortBy === "price_asc") return parseInt(a.pricePerUnit) - parseInt(b.pricePerUnit);
    if (sortBy === "price_desc") return parseInt(b.pricePerUnit) - parseInt(a.pricePerUnit);
    if (sortBy === "views") return b.views - a.views;
    return new Date(b.listed) - new Date(a.listed);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleBuy(listing) {
    if (user) {
      navigate("/marketplace");
    } else {
      setSignInModal(listing);
    }
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className="bg-ink h-14 flex items-center px-6 justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center font-bold text-ink text-[10px]">DTP</div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">Digital Trade Platform</div>
            <div className="text-white/35 text-[10px]">Uganda Marketplace</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/market-prices")} className="text-white/50 hover:text-white text-sm transition-colors hidden md:block">Market Prices</button>
          <button onClick={() => navigate("/verify")} className="text-white/50 hover:text-white text-sm transition-colors hidden md:block">Verify Actor</button>
          {user ? (
            <button onClick={() => navigate("/marketplace")} className="bg-gold hover:bg-gold-mid text-ink font-semibold text-sm px-4 py-2 rounded-lg transition-all">Private Marketplace</button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-white/50 hover:text-white text-sm transition-colors">Sign in</button>
              <button onClick={() => navigate("/register")} className="bg-gold hover:bg-gold-mid text-ink font-semibold text-sm px-4 py-2 rounded-lg transition-all">Get started</button>
            </>
          )}
        </div>
      </div>

      <div className="bg-ink pb-8 pt-6 px-6 mb-6">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Uganda Trade Marketplace</h1>
          <p className="text-white/50 text-sm">Browse verified listings from farmers, processors, manufacturers and traders across Uganda</p>
        </div>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 focus:border-gold rounded-xl text-sm text-white placeholder:text-white/30 outline-none transition-colors"
              placeholder="Search product, seller or district..." />
          </div>
          <select value={region} onChange={e => { setRegion(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white outline-none">
            {REGIONS.map(r => <option key={r} value={r} className="text-ink bg-white">{r}</option>)}
          </select>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white outline-none">
            {CATEGORIES.map(c => <option key={c} value={c} className="text-ink bg-white">{c}</option>)}
          </select>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white outline-none">
            <option value="newest" className="text-ink bg-white">Newest</option>
            <option value="price_asc" className="text-ink bg-white">Price: Low to high</option>
            <option value="price_desc" className="text-ink bg-white">Price: High to low</option>
            <option value="views" className="text-ink bg-white">Most viewed</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-warm-text">
            <span className="font-semibold text-ink">{filtered.length}</span> listings available
            {search && <span> matching <span className="font-semibold text-ink">"{search}"</span></span>}
          </p>
          <div className="flex items-center gap-2 text-xs text-warm-muted bg-white border border-warm-border px-3 py-1.5 rounded-full">
            <Shield size={10} className="text-green-500" /> All sellers identity-verified
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
            <Search size={28} className="text-warm-muted mx-auto mb-3" />
            <p className="font-semibold text-ink mb-1">No listings found</p>
            <p className="text-sm text-warm-text">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(l => <ListingCard key={l.id} listing={l} onSignInToBy={handleBuy} onSignInToBy={handleBuy} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 border border-warm-border rounded-lg text-sm font-medium text-warm-text hover:text-ink hover:border-ink disabled:opacity-40 transition-all bg-white">
              <ChevronLeft size={14} /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${page === p ? "bg-ink text-white" : "bg-white border border-warm-border text-warm-text hover:border-ink"}`}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-warm-border rounded-lg text-sm font-medium text-warm-text hover:text-ink hover:border-ink disabled:opacity-40 transition-all bg-white">
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}

        <div className="mt-10 bg-ink rounded-2xl p-8 relative overflow-hidden mb-10">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold opacity-[0.05] rounded-full" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-white/30 mb-2">Digital Trade Platform</div>
              <h3 className="text-2xl font-bold text-white mb-3">Have products to sell?<br /><span className="text-gold">List them here for free.</span></h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">Register on DTP, get your verified Trade ID, and start reaching buyers across Uganda and internationally.</p>
              <button onClick={() => navigate("/register")}
                className="bg-gold hover:bg-gold-mid text-ink font-bold px-6 py-3 rounded-xl text-sm transition-all inline-flex items-center gap-2">
                Register free today <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Free Trade ID", "Verified digital identity at no cost"], ["Instant listing", "Your products go live immediately"], ["Verified buyers", "All buyers are identity-checked"], ["Permanent records", "Every sale is traceable"]].map(([t, d]) => (
                <div key={t} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-gold text-xs font-bold mb-1">{t}</div>
                  <div className="text-white/50 text-xs leading-relaxed">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
      {signInModal && <SignInModal listing={signInModal} onClose={() => setSignInModal(null)} />}
    </div>
  );
}
