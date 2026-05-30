import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  Lock, Search, SlidersHorizontal, ShoppingCart, Heart,
  MapPin, Eye, Shield, X, Check, ChevronLeft, ChevronRight,
  AlertCircle, TrendingUp, Package, ArrowRight, ChevronDown
} from "lucide-react";
import { LISTINGS, MARKET_PRICES, formatUGX } from "../data/demo";
import { PRODUCTS, ACTOR_TYPES } from "../data/constants";
import { REGIONS, SUB_REGIONS } from "../data/geo";

// ── Role → default visible categories ────────────────────────────────────────
const ROLE_CATEGORIES = {
  AGR: ["Food Crops", "Cash Crops", "Horticulture & Fruits"],
  VAP: ["Processed Agricultural Products", "Food Crops", "Cash Crops"],
  MFR: ["Manufactured  -  Food & Beverage", "Manufactured  -  Textiles & Apparel", "Manufactured  -  Construction Materials", "Manufactured  -  Wood & Furniture"],
  AGT: Object.keys(PRODUCTS), // aggregators see all
  EXP: ["Cash Crops", "Food Crops", "Fisheries & Aquaculture", "Livestock & Animal Products"],
  IMP: Object.keys(PRODUCTS),
  BYR: Object.keys(PRODUCTS),
  CSM: ["Food Crops", "Processed Agricultural Products", "Manufactured  -  Food & Beverage"],
  TRP: [], // transporters don't buy
};

// ── Category images ───────────────────────────────────────────────────────────
const CATEGORY_IMAGES = {
  "Coffee (Arabica)":    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
  "Coffee (Robusta)":    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
  "Vanilla":             "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  "Maize":               "https://images.unsplash.com/photo-1601593968633-f7bb9c1a2e0f?w=400&q=80",
  "Maize Flour":         "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
  "Beans (Common)":      "https://images.unsplash.com/photo-1612207925217-dc1024edf7e1?w=400&q=80",
  "Groundnuts":          "https://images.unsplash.com/photo-1567416661576-659eff6db82f?w=400&q=80",
  "Honey (Raw)":         "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
  "Nile Perch (Fresh)":  "https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=400&q=80",
  "Tilapia (Fresh)":     "https://images.unsplash.com/photo-1504736593637-3ddab0fc47d4?w=400&q=80",
  "Cattle (Beef)":       "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80",
  "Simsim / Sesame":     "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  "Cocoa":               "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
  "Gold":                "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80",
  "Sunflower Oil":       "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "Timber (Hardwood)":   "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80";

// ── Find which category a product belongs to ─────────────────────────────────
function getProductCategory(productName) {
  for (const [cat, items] of Object.entries(PRODUCTS)) {
    if (items.includes(productName)) return cat;
  }
  return null;
}

// ── Listing Card ─────────────────────────────────────────────────────────────
function PrivateListingCard({ listing, user, onBuy, wishlist, onToggleWishlist }) {
  const navigate = useNavigate();
  const marketPrice = MARKET_PRICES.find(p => p.commodity === listing.product);
  const priceDiff = marketPrice ? ((listing.pricePerUnit - marketPrice.sell) / marketPrice.sell * 100) : null;
  const days = Math.ceil((new Date(listing.expires) - new Date()) / (1000 * 60 * 60 * 24));
  const isWished = wishlist?.includes(listing.id);

  return (
    <div className="bg-white border border-warm-border rounded-xl overflow-hidden hover:border-gold hover:shadow-md transition-all group">
      <div className="relative cursor-pointer" onClick={() => navigate(`/marketplace/listing/${listing.id}`)}>
        <img src={CATEGORY_IMAGES[listing.product] || DEFAULT_IMAGE} alt={listing.product}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = DEFAULT_IMAGE; }} />
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          <span className="bg-ink/80 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock size={8} /> Private
          </span>
          {priceDiff !== null && priceDiff < -2 && (
            <span className="bg-gold text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">Deal</span>
          )}
        </div>
        <button onClick={e => { e.stopPropagation(); onToggleWishlist(listing.id); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isWished ? "bg-red-500 text-white" : "bg-white/90 text-warm-muted hover:text-red-500"}`}>
          <Heart size={13} fill={isWished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-3">
        <button onClick={() => navigate(`/marketplace/listing/${listing.id}`)}
          className="font-semibold text-ink text-sm truncate hover:text-gold transition-colors text-left w-full block mb-0.5">
          {listing.product}
        </button>
        <div className="text-warm-muted text-xs mb-2">{listing.grade}</div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-bold text-ink text-base">{formatUGX(listing.pricePerUnit)}</span>
          <span className="text-warm-muted text-xs">/{listing.unit}</span>
        </div>
        {priceDiff !== null && (
          <div className={`text-xs font-semibold mb-2 ${priceDiff < 0 ? "text-green-600" : "text-red-500"}`}>
            {Math.abs(priceDiff).toFixed(1)}% {priceDiff < 0 ? "below" : "above"} market
          </div>
        )}
        <div className="flex items-center gap-1 text-warm-muted text-xs mb-3">
          <MapPin size={10} />{listing.district}
          <span className="mx-1">·</span>
          <Eye size={10} />{listing.views}
          <span className="mx-1">·</span>
          {listing.quantity.toLocaleString()} {listing.unit}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onBuy(listing)}
            className="flex-1 bg-ink hover:bg-ink-mid text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1">
            <ShoppingCart size={12} /> Buy
          </button>
          <button
            className="px-3 py-2 border border-warm-border hover:border-ink text-ink rounded-lg text-xs transition-all">
            + Cart
          </button>
        </div>
        <button onClick={() => navigate(`/seller/${listing.seller}`)}
          className="w-full mt-2 text-xs text-warm-muted hover:text-ink transition-colors flex items-center gap-1">
          <Shield size={10} className="text-gold" /> {listing.sellerName}
        </button>
      </div>
    </div>
  );
}

// ── Filter Panel ──────────────────────────────────────────────────────────────
function FilterPanel({ filters, setFilters, userCategories, listings }) {
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedRegion, setExpandedRegion] = useState(null);

  function reset() {
    setFilters({ category: "", subCategory: "", region: "", subRegion: "", sortBy: "newest" });
  }

  const activeCount = [!!filters.category, !!filters.subCategory, !!filters.region].filter(Boolean).length;

  return (
    <div className="bg-white border border-warm-border rounded-xl overflow-hidden sticky top-28">
      <div className="flex items-center justify-between px-4 py-3 border-b border-warm-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-ink" />
          <span className="font-bold text-ink text-sm">Filters</span>
          {activeCount > 0 && <span className="text-[10px] font-bold bg-gold text-ink px-1.5 py-0.5 rounded-full">{activeCount}</span>}
        </div>
        {activeCount > 0 && <button onClick={reset} className="text-xs text-warm-muted hover:text-red-500 transition-colors">Reset</button>}
      </div>
      <div className="p-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">

        {/* Sort */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Sort by</label>
          <select value={filters.sortBy} onChange={e => setFilters({...filters, sortBy: e.target.value})}
            className="w-full px-3 py-2 border border-warm-border rounded-lg text-xs text-ink bg-white outline-none">
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low to high</option>
            <option value="price_desc">Price: High to low</option>
            <option value="below_market">Best deals first</option>
          </select>
        </div>

        {/* Your value chain categories */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Your value chain</label>
          <div className="space-y-0.5">
            <button onClick={() => setFilters({...filters, category: "", subCategory: ""})}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${!filters.category ? "bg-warm-bg text-ink font-semibold" : "text-warm-text hover:bg-warm-bg"}`}>
              All categories {!filters.category && <Check size={10} className="text-gold" />}
            </button>
            {userCategories.map(cat => {
              const products = PRODUCTS[cat] || [];
              return (
                <div key={cat}>
                  <button
                    onClick={() => { setFilters({...filters, category: filters.category === cat ? "" : cat, subCategory: ""}); setExpandedCat(expandedCat === cat ? null : cat); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${filters.category === cat ? "bg-warm-bg text-ink font-semibold" : "text-warm-text hover:bg-warm-bg"}`}>
                    <span className="truncate pr-1">{cat}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {filters.category === cat && <Check size={10} className="text-gold" />}
                      <ChevronDown size={10} className={`text-warm-muted transition-transform ${expandedCat === cat ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {expandedCat === cat && (
                    <div className="ml-3 mt-0.5 border-l-2 border-warm-border pl-2 max-h-36 overflow-y-auto">
                      {products.map(p => (
                        <button key={p}
                          onClick={() => setFilters({...filters, category: cat, subCategory: filters.subCategory === p ? "" : p})}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${filters.subCategory === p ? "text-ink font-semibold" : "text-warm-muted hover:text-ink"}`}>
                          <span className="truncate">{p}</span>
                          {filters.subCategory === p && <Check size={9} className="text-gold flex-shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Region</label>
          <div className="space-y-0.5">
            <button onClick={() => setFilters({...filters, region: "", subRegion: ""})}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${!filters.region ? "bg-warm-bg text-ink font-semibold" : "text-warm-text hover:bg-warm-bg"}`}>
              All regions {!filters.region && <Check size={10} className="text-gold" />}
            </button>
            {REGIONS.map(r => (
              <div key={r.id}>
                <button
                  onClick={() => { setFilters({...filters, region: filters.region === r.name ? "" : r.name, subRegion: ""}); setExpandedRegion(expandedRegion === r.id ? null : r.id); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${filters.region === r.name ? "bg-warm-bg text-ink font-semibold" : "text-warm-text hover:bg-warm-bg"}`}>
                  <span>{r.name}</span>
                  <ChevronDown size={10} className={`text-warm-muted transition-transform ${expandedRegion === r.id ? "rotate-180" : ""}`} />
                </button>
                {expandedRegion === r.id && (
                  <div className="ml-3 mt-0.5 border-l-2 border-warm-border pl-2">
                    {SUB_REGIONS.filter(sr => sr.regionId === r.id).map(sr => (
                      <button key={sr.id}
                        onClick={() => setFilters({...filters, region: r.name, subRegion: filters.subRegion === sr.name ? "" : sr.name})}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${filters.subRegion === sr.name ? "text-ink font-semibold" : "text-warm-muted hover:text-ink"}`}>
                        {sr.name}
                        {filters.subRegion === sr.name && <Check size={9} className="text-gold" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PrivateMarketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [filters, setFilters] = useState({ category: "", subCategory: "", region: "", subRegion: "", sortBy: "newest" });
  const [filterOpen, setFilterOpen] = useState(false);

  // Redirect GOU and ADMIN
  const role = user?.role;
  const blockedRoles = ["GOU", "ADMIN"];
  if (!user || blockedRoles.includes(role)) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-warm-bg rounded-xl flex items-center justify-center mb-4">
            <Lock size={24} className="text-warm-muted" />
          </div>
          <h2 className="font-bold text-ink text-lg mb-2">Private Marketplace not available</h2>
          <p className="text-warm-muted text-sm mb-5 max-w-xs">The private marketplace is available to trade actors only. Oversight and administrative roles access the public marketplace.</p>
          <button onClick={() => navigate("/marketplace")} className="bg-gold text-ink font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2">
            Go to Public Marketplace <ArrowRight size={14} />
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Get user's default categories based on role
  const userCategories = ROLE_CATEGORIES[role] || Object.keys(PRODUCTS);

  // Get eligible listings: private + both, filter out own listings
  const marketPriceMap = Object.fromEntries(MARKET_PRICES.map(p => [p.commodity, p.sell]));

  const [allPrivateListings, setAllPrivateListings] = useState(
    LISTINGS.filter(l =>
      l.status === "active" &&
      (l.visibility === "private" || l.visibility === "both") &&
      l.seller !== user?.username
    )
  );
  const eligibleListings = allPrivateListings;

  // Apply filters
  const displayListings = eligibleListings
    .filter(l => {
      if (activeSearch) {
        const q = activeSearch.toLowerCase();
        return l.product.toLowerCase().includes(q) || l.sellerName.toLowerCase().includes(q) || l.district.toLowerCase().includes(q);
      }
      return true;
    })
    .filter(l => {
      // Category match: either user's categories or expanded filter
      if (filters.subCategory) return l.product === filters.subCategory;
      if (filters.category) return getProductCategory(l.product) === filters.category;
      // Default: only show listings in user's value chain categories
      const listingCat = getProductCategory(l.product);
      return userCategories.includes(listingCat);
    })
    .filter(l => !filters.region || l.region === filters.region)
    .sort((a, b) => {
      if (filters.sortBy === "price_asc") return a.pricePerUnit - b.pricePerUnit;
      if (filters.sortBy === "price_desc") return b.pricePerUnit - a.pricePerUnit;
      if (filters.sortBy === "below_market") {
        const da = marketPriceMap[a.product] ? a.pricePerUnit - marketPriceMap[a.product] : 0;
        const db = marketPriceMap[b.product] ? b.pricePerUnit - marketPriceMap[b.product] : 0;
        return da - db;
      }
      return new Date(b.listed) - new Date(a.listed);
    });

  const activeFilterCount = [!!filters.category, !!filters.subCategory, !!filters.region].filter(Boolean).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-ink rounded-xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock size={15} className="text-gold" />
            <h1 className="font-bold text-white text-lg">Private Marketplace</h1>
            <span className="text-[10px] font-bold bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-full">Verified actors only</span>
          </div>
          <p className="text-white/40 text-sm">Showing listings matched to your value chain  -  {userCategories.length} categories</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && setActiveSearch(search)}
              placeholder="Search products, sellers..."
              className="bg-white/8 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-white placeholder-white/30 text-sm outline-none focus:border-gold w-56"
            />
            {search && <button onClick={() => { setSearch(""); setActiveSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"><X size={12} /></button>}
          </div>
          <button onClick={() => setActiveSearch(search)} className="bg-gold hover:bg-gold-mid text-ink font-bold px-4 py-2 rounded-lg text-sm transition-all">Search</button>
          <button onClick={() => navigate("/marketplace")} className="border border-white/20 hover:border-white/40 text-white/60 hover:text-white text-sm px-4 py-2 rounded-lg transition-all">Public Market</button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <FilterPanel filters={filters} setFilters={setFilters} userCategories={userCategories} listings={eligibleListings} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 border border-warm-border bg-white px-4 py-2 rounded-lg text-sm font-semibold text-ink">
              <SlidersHorizontal size={13} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <p className="text-sm text-warm-muted">{displayListings.length} listings</p>
          </div>
          {filterOpen && (
            <div className="lg:hidden mb-4">
              <FilterPanel filters={filters} setFilters={setFilters} userCategories={userCategories} listings={eligibleListings} />
            </div>
          )}

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {activeSearch && <span className="font-semibold text-ink text-sm">Results for "{activeSearch}"</span>}
              <span className="text-sm text-warm-muted">{displayListings.length} listing{displayListings.length !== 1 ? "s" : ""}</span>
              {!filters.category && !activeSearch && (
                <span className="text-xs bg-warm-bg border border-warm-border text-warm-muted px-2 py-0.5 rounded-full">Matched to your value chain</span>
              )}
            </div>
            {(activeSearch || activeFilterCount > 0) && (
              <button onClick={() => { setSearch(""); setActiveSearch(""); setFilters({ category: "", subCategory: "", region: "", subRegion: "", sortBy: "newest" }); }}
                className="text-xs text-warm-muted hover:text-red-500 flex items-center gap-1 transition-colors">
                <X size={11} /> Clear all
              </button>
            )}
          </div>

          {/* Listings grid */}
          {displayListings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {displayListings.map(l => (
                <PrivateListingCard
                  key={l.id}
                  listing={l}
                  user={user}
                  onBuy={() => navigate(`/marketplace/listing/${l.id}`)}
                  wishlist={wishlist}
                  onToggleWishlist={id => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
              <Package size={28} className="text-warm-muted mx-auto mb-3" />
              <p className="font-semibold text-ink mb-1">No private listings match your value chain</p>
              <p className="text-sm text-warm-muted mb-4">Try adjusting your filters or expanding your category preferences</p>
              <button onClick={() => setFilters({ category: "", subCategory: "", region: "", subRegion: "", sortBy: "newest" })}
                className="text-gold text-sm font-semibold">Reset filters</button>
            </div>
          )}

          {/* Expand preferences note */}
          <div className="mt-8 p-4 bg-warm-bg border border-warm-border rounded-xl flex items-start gap-3">
            <AlertCircle size={16} className="text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink mb-1">Not seeing what you need?</p>
              <p className="text-xs text-warm-muted leading-relaxed">Your private marketplace is filtered to your registered value chain categories ({userCategories.slice(0, 2).join(", ")}{userCategories.length > 2 ? ` and ${userCategories.length - 2} more` : ""}). Use the category filter above to browse outside your default categories.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
