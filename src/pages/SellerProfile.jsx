import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Shield, Package, Eye, Star,
  CheckCircle, ExternalLink, ChevronRight, Calendar,
  TrendingUp, Award, Search, Filter
} from "lucide-react";
import { LISTINGS, MARKET_PRICES, formatUGX } from "../data/demo";
import { SAMPLE_ACCOUNTS } from "../data/constants";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

const CATEGORY_IMAGES = {
  "Coffee (Arabica)":    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
  "Coffee (Robusta)":    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
  "Vanilla":             "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  "Maize":               "https://images.unsplash.com/photo-1601593968633-f7bb9c1a2e0f?w=400&q=80",
  "Beans (Common)":      "https://images.unsplash.com/photo-1612207925217-dc1024edf7e1?w=400&q=80",
  "Rice (Milled)":       "https://images.unsplash.com/photo-1536304993881-ff86e0c9b785?w=400&q=80",
  "Groundnuts":          "https://images.unsplash.com/photo-1567416661576-659eff6db82f?w=400&q=80",
  "Sweet Potatoes":      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
  "Tomatoes":            "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&q=80",
  "Nile Perch (Fresh)":  "https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=400&q=80",
  "Tilapia (Fresh)":     "https://images.unsplash.com/photo-1504736593637-3ddab0fc47d4?w=400&q=80",
  "Cattle (Beef)":       "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80",
  "Milk (Raw)":          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  "Honey (Raw)":         "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
  "Timber (Hardwood)":   "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80",
  "Cement":              "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  "Steel Roofing Sheets":"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  "Maize Flour":         "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
  "Sunflower Oil":       "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "Hides and Skins":     "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80";

function VerifiedBadge({ type }) {
  const colors = { NIRA: "bg-blue-50 text-blue-700 border-blue-200", URSB: "bg-purple-50 text-purple-700 border-purple-200", URA: "bg-green-50 text-green-700 border-green-200" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${colors[type] || "bg-warm-bg text-warm-text border-warm-border"}`}>
      <Shield size={10} /> {type} verified
    </span>
  );
}

function ListingCard({ listing, onClick }) {
  const marketPrice = MARKET_PRICES.find(p => p.commodity === listing.product);
  const priceDiff = marketPrice ? ((listing.pricePerUnit - marketPrice.sell) / marketPrice.sell * 100) : null;
  const days = Math.ceil((new Date(listing.expires) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <button onClick={onClick}
      className="bg-white border border-warm-border rounded-xl overflow-hidden hover:border-gold hover:shadow-md transition-all text-left group">
      <div className="relative">
        <img src={CATEGORY_IMAGES[listing.product] || DEFAULT_IMAGE} alt={listing.product}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = DEFAULT_IMAGE; }} />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {days <= 3 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Expires soon</span>}
          {priceDiff !== null && priceDiff < -2 && <span className="bg-gold text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">Below market</span>}
        </div>
      </div>
      <div className="p-3">
        <div className="font-semibold text-ink text-sm truncate mb-0.5">{listing.product}</div>
        <div className="text-warm-muted text-xs mb-2">{listing.grade}</div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-bold text-ink text-base">{formatUGX(listing.pricePerUnit)}</span>
          <span className="text-warm-muted text-xs">/{listing.unit}</span>
        </div>
        {priceDiff !== null && (
          <div className={`text-xs font-semibold ${priceDiff < 0 ? "text-green-600" : "text-red-500"}`}>
            {Math.abs(priceDiff).toFixed(1)}% {priceDiff < 0 ? "below" : "above"} market
          </div>
        )}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-warm-border">
          <span className="text-warm-muted text-xs flex items-center gap-1"><Eye size={10} />{listing.views}</span>
          <span className="text-warm-muted text-xs">{listing.quantity.toLocaleString()} {listing.unit} avail.</span>
        </div>
      </div>
    </button>
  );
}

export default function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const listings = LISTINGS.filter(l => l.seller === sellerId);

  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <div className="text-center">
          <Package size={40} className="text-warm-muted mx-auto mb-3" />
          <h2 className="font-bold text-ink text-lg mb-2">Seller not found</h2>
          <button onClick={() => navigate("/marketplace")} className="bg-gold text-ink font-bold px-5 py-2.5 rounded-lg text-sm">Back to Marketplace</button>
        </div>
      </div>
    );
  }

  const sample = listings[0];
  const totalViews = listings.reduce((s, l) => s + l.views, 0);
  const totalStock = listings.reduce((s, l) => s + l.quantity, 0);
  const products = [...new Set(listings.map(l => l.product))];
  const regions = [...new Set(listings.map(l => l.region))];

  // Stats
  const stats = [
    { label: "Active listings", value: listings.length },
    { label: "Total views", value: totalViews.toLocaleString() },
    { label: "Products", value: products.length },
    { label: "Regions", value: regions.join(", ") },
  ];

  const content = (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-warm-muted hover:text-ink text-sm mb-5 transition-colors">
        <ArrowLeft size={15} /> Back
      </button>

      {/* Seller header */}
      <div className="bg-ink rounded-xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold opacity-5 rounded-full" />
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-white opacity-[0.03] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start md:items-center">
          <div className="w-16 h-16 rounded-xl bg-gold flex items-center justify-center text-ink font-bold text-2xl flex-shrink-0">
            {sample.sellerName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-white font-bold text-xl">{sample.sellerName}</h1>
              <VerifiedBadge type={sample.sellerVerified} />
            </div>
            <div className="text-white/40 text-sm font-mono mb-2">{sample.sellerTradeId}</div>
            <div className="flex items-center gap-4 text-white/40 text-xs flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={11} />{sample.district}, {sample.region}</span>
              <span className="flex items-center gap-1"><CheckCircle size={11} className="text-green-400" />Active seller</span>
            </div>
          </div>
          <button onClick={() => navigate(`/verify?q=${sample.sellerTradeId}`)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all border border-white/15">
            <Shield size={13} /> Verify on platform
          </button>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/10">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-gold font-bold text-lg leading-none mb-1">{s.value}</div>
              <div className="text-white/35 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Listings ── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink">All Listings <span className="text-warm-muted font-normal text-sm">({listings.length})</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map(l => (
              <ListingCard key={l.id} listing={l} onClick={() => navigate(`/marketplace/listing/${l.id}`)} />
            ))}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">

          {/* Product categories */}
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <h3 className="font-bold text-ink text-sm mb-3">Products Listed</h3>
            <div className="flex flex-wrap gap-2">
              {products.map(p => (
                <span key={p} className="text-xs bg-warm-bg border border-warm-border text-warm-text px-2.5 py-1 rounded-full">{p}</span>
              ))}
            </div>
          </div>

          {/* Verification details */}
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <h3 className="font-bold text-ink text-sm mb-3">Verification</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-warm-muted">Trade ID</span>
                <span className="text-xs font-mono font-semibold text-ink">{sample.sellerTradeId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-warm-muted">Verified by</span>
                <VerifiedBadge type={sample.sellerVerified} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-warm-muted">Location</span>
                <span className="text-xs font-semibold text-ink">{sample.district}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-warm-muted">Status</span>
                <span className="text-xs font-semibold text-green-600 flex items-center gap-1"><CheckCircle size={11} />Active</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/verify?q=${sample.sellerTradeId}`)}
              className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-dim transition-colors">
              <ExternalLink size={12} /> Verify on public portal
            </button>
          </div>

          {/* Buy CTA */}
          {!user && (
            <div className="bg-ink rounded-xl p-5 text-center">
              <div className="text-white font-semibold text-sm mb-1">Ready to buy?</div>
              <p className="text-white/40 text-xs mb-4 leading-relaxed">Register free to contact this seller and place an order.</p>
              <button onClick={() => navigate("/register")}
                className="w-full bg-gold text-ink font-bold py-2.5 rounded-lg text-sm mb-2">Register free</button>
              <button onClick={() => navigate("/login")}
                className="w-full text-white/60 hover:text-white text-sm transition-colors">Sign in</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (user) return <DashboardLayout>{content}</DashboardLayout>;

  return (
    <div className="min-h-screen bg-warm-bg">
      <PublicNav activeRoute="" />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">{content}</div>
    </div>
  );
}
