import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, MapPin, Eye, Calendar, Package,
  ShoppingCart, MessageSquare, Heart, Share2, ChevronRight,
  CheckCircle, AlertCircle, Truck, User, Star, TrendingUp,
  Clock, Award, ExternalLink
} from "lucide-react";
import { LISTINGS, MARKET_PRICES, formatUGX } from "../data/demo";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import PublicNav from "../components/PublicNav";
import TrustTick from "../components/TrustTick";

const CATEGORY_IMAGES = {
  "Coffee (Arabica)":    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  "Coffee (Robusta)":    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  "Vanilla":             "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
  "Maize":               "https://images.unsplash.com/photo-1601593968633-f7bb9c1a2e0f?w=800&q=80",
  "Beans (Common)":      "https://images.unsplash.com/photo-1612207925217-dc1024edf7e1?w=800&q=80",
  "Rice (Milled)":       "https://images.unsplash.com/photo-1536304993881-ff86e0c9b785?w=800&q=80",
  "Groundnuts":          "https://images.unsplash.com/photo-1567416661576-659eff6db82f?w=800&q=80",
  "Sweet Potatoes":      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
  "Tomatoes":            "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800&q=80",
  "Nile Perch (Fresh)":  "https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=800&q=80",
  "Tilapia (Fresh)":     "https://images.unsplash.com/photo-1504736593637-3ddab0fc47d4?w=800&q=80",
  "Fish (Dried)":        "https://images.unsplash.com/photo-1504736593637-3ddab0fc47d4?w=800&q=80",
  "Cattle (Beef)":       "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
  "Milk (Raw)":          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
  "Honey (Raw)":         "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
  "Timber (Hardwood)":   "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80",
  "Cement":              "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  "Steel Roofing Sheets":"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  "Maize Flour":         "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
  "Sunflower Oil":       "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
  "Palm Oil (Crude)":    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
  "Hides and Skins":     "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80";

function daysLeft(expires) {
  const diff = Math.ceil((new Date(expires) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState("");

  const listing = LISTINGS.find(l => l.id === id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-warm-muted mx-auto mb-3" />
          <h2 className="font-bold text-ink text-lg mb-2">Listing not found</h2>
          <p className="text-warm-muted text-sm mb-4">This listing may have expired or been removed.</p>
          <button onClick={() => navigate("/marketplace")} className="bg-gold text-ink font-bold px-5 py-2.5 rounded-lg text-sm">Back to Marketplace</button>
        </div>
      </div>
    );
  }

  const marketPrice = MARKET_PRICES.find(p => p.commodity === listing.product);
  const priceDiff = marketPrice ? ((listing.pricePerUnit - marketPrice.sell) / marketPrice.sell * 100) : null;
  const otherListings = LISTINGS.filter(l => l.seller === listing.seller && l.id !== listing.id).slice(0, 3);
  const similarListings = LISTINGS.filter(l => l.product === listing.product && l.id !== listing.id).slice(0, 3);
  const days = daysLeft(listing.expires);
  const totalValue = quantity ? parseInt(quantity) * listing.pricePerUnit : null;

  const content = (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate("/marketplace")}
        className="flex items-center gap-2 text-warm-muted hover:text-ink text-sm mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT  -  main content ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Image + badges */}
          <div className="bg-white border border-warm-border rounded-xl overflow-hidden">
            <div className="relative">
              <img
                src={CATEGORY_IMAGES[listing.product] || DEFAULT_IMAGE}
                alt={listing.product}
                className="w-full h-64 object-cover"
                onError={e => { e.target.src = DEFAULT_IMAGE; }}
              />
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                {days <= 3 && days > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Expires soon</span>}
                {days > 3 && <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Active</span>}
                {priceDiff !== null && priceDiff < -2 && <span className="bg-gold text-ink text-xs font-bold px-2.5 py-1 rounded-full">Below market</span>}
              </div>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${wishlist ? "bg-red-500 text-white" : "bg-white/90 text-warm-muted hover:text-red-500"}`}>
                <Heart size={16} fill={wishlist ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h1 className="text-xl font-bold text-ink">{listing.product}</h1>
                  <p className="text-warm-muted text-sm mt-0.5">{listing.grade}</p>
                </div>
                <TrustTick seller={listing.seller} size={20} />
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-ink">{formatUGX(listing.pricePerUnit)}</span>
                <span className="text-warm-muted text-sm">/ {listing.unit}</span>
              </div>

              {priceDiff !== null && (
                <div className={`flex items-center gap-1 text-xs font-semibold mb-4 ${priceDiff < 0 ? "text-green-600" : "text-red-500"}`}>
                  <TrendingUp size={12} />
                  {Math.abs(priceDiff).toFixed(1)}% {priceDiff < 0 ? "below" : "above"} market price
                  {marketPrice && <span className="text-warm-muted font-normal ml-1">(Market: {formatUGX(marketPrice.sell)}/{listing.unit})</span>}
                </div>
              )}

              <p className="text-warm-text text-sm leading-relaxed">{listing.description}</p>
            </div>
          </div>

          {/* Listing details */}
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <h3 className="font-bold text-ink text-sm mb-4">Listing Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ["Available stock", `${listing.quantity.toLocaleString()} ${listing.unit}`],
                ["Minimum order", `${listing.minOrder.toLocaleString()} ${listing.unit}`],
                ["Location", `${listing.district}, ${listing.region}`],
                ["Listed", new Date(listing.listed).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
                ["Expires", new Date(listing.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
                ["Listing ID", listing.id],
              ].map(([l, v]) => (
                <div key={l}>
                  <div className="text-xs text-warm-muted font-medium mb-0.5">{l}</div>
                  <div className="text-sm font-semibold text-ink">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-warm-border">
              <MapPin size={13} className="text-warm-muted" />
              <span className="text-sm text-warm-muted">{listing.district} · {listing.region} Region</span>
              <span className="text-warm-border mx-1">·</span>
              <Eye size={13} className="text-warm-muted" />
              <span className="text-sm text-warm-muted">{listing.views} views</span>
              {days > 0 && <>
                <span className="text-warm-border mx-1">·</span>
                <Clock size={13} className="text-warm-muted" />
                <span className="text-sm text-warm-muted">{days} day{days !== 1 ? "s" : ""} left</span>
              </>}
            </div>
          </div>

          {/* Seller's other listings */}
          {otherListings.length > 0 && (
            <div className="bg-white border border-warm-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ink text-sm">More from {listing.sellerName}</h3>
                <button onClick={() => navigate(`/seller/${listing.seller}`)}
                  className="text-gold text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {otherListings.map(l => (
                  <button key={l.id} onClick={() => navigate(`/marketplace/listing/${l.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-warm-bg transition-colors text-left">
                    <img src={CATEGORY_IMAGES[l.product] || DEFAULT_IMAGE} alt={l.product}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={e => { e.target.src = DEFAULT_IMAGE; }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-ink text-sm truncate">{l.product}</div>
                      <div className="text-warm-muted text-xs">{l.grade}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-ink text-sm">{formatUGX(l.pricePerUnit)}</div>
                      <div className="text-warm-muted text-xs">/{l.unit}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Similar listings */}
          {similarListings.length > 0 && (
            <div className="bg-white border border-warm-border rounded-xl p-5">
              <h3 className="font-bold text-ink text-sm mb-4">Similar listings</h3>
              <div className="space-y-3">
                {similarListings.map(l => (
                  <button key={l.id} onClick={() => navigate(`/marketplace/listing/${l.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-warm-bg transition-colors text-left">
                    <img src={CATEGORY_IMAGES[l.product] || DEFAULT_IMAGE} alt={l.product}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={e => { e.target.src = DEFAULT_IMAGE; }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-ink text-sm truncate">{l.sellerName}</div>
                      <div className="text-warm-muted text-xs">{l.district} · {l.grade}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-ink text-sm">{formatUGX(l.pricePerUnit)}</div>
                      <div className="text-warm-muted text-xs">/{l.unit}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT  -  sidebar ── */}
        <div className="space-y-5">

          {/* Buy / enquire */}
          <div className="bg-white border border-warm-border rounded-xl p-5 sticky top-24">
            <div className="mb-4">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Quantity ({listing.unit})</label>
              <input
                type="number"
                value={quantity}
                min={listing.minOrder}
                max={listing.quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder={`Min. ${listing.minOrder.toLocaleString()}`}
                className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink outline-none focus:border-gold"
              />
              {quantity && parseInt(quantity) < listing.minOrder && (
                <p className="text-red-500 text-xs mt-1">Minimum order is {listing.minOrder.toLocaleString()} {listing.unit}</p>
              )}
              {totalValue && parseInt(quantity) >= listing.minOrder && (
                <div className="mt-2 p-2.5 bg-warm-bg rounded-lg">
                  <div className="text-xs text-warm-muted">Estimated total</div>
                  <div className="font-bold text-ink text-base">{formatUGX(totalValue)}</div>
                </div>
              )}
            </div>

            {user ? (
              <button
                onClick={() => navigate("/marketplace")}
                className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 mb-2">
                <ShoppingCart size={15} /> Buy now
              </button>
            ) : (
              <div className="space-y-2 mb-2">
                <button onClick={() => navigate("/register")}
                  className="w-full bg-gold hover:bg-gold-mid text-ink font-bold py-3 rounded-lg text-sm transition-all">
                  Register free to buy
                </button>
                <button onClick={() => navigate("/login")}
                  className="w-full border-2 border-ink hover:bg-ink hover:text-white text-ink font-bold py-2.5 rounded-lg text-sm transition-all">
                  Sign in
                </button>
              </div>
            )}

            <button className="w-full border border-warm-border hover:border-ink text-ink font-medium py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
              <MessageSquare size={14} /> Enquire
            </button>

            <p className="text-warm-muted text-xs text-center mt-3">Free to register · Verified sellers only</p>
          </div>

          {/* Seller card */}
          <div className="bg-white border border-warm-border rounded-xl p-5">
            <h3 className="font-bold text-ink text-sm mb-4">About the seller</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                {listing.sellerName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-ink text-sm">{listing.sellerName}</span>
                  <TrustTick seller={listing.seller} size={16} />
                </div>
                <div className="text-warm-muted text-xs font-mono mt-0.5">{listing.sellerTradeId}</div>
              </div>
            </div>
            <div className="space-y-2 text-xs text-warm-muted mb-4">
              <div className="flex items-center gap-2"><MapPin size={12} /> {listing.district}, {listing.region} Region</div>
              <div className="flex items-center gap-2"><Package size={12} /> {LISTINGS.filter(l => l.seller === listing.seller).length} active listings</div>
            </div>
            <button
              onClick={() => navigate(`/seller/${listing.seller}`)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gold hover:text-gold-dim transition-colors">
              <ExternalLink size={13} /> View seller profile
            </button>
          </div>

          {/* Market price reference */}
          {marketPrice && (
            <div className="bg-warm-bg border border-warm-border rounded-xl p-4">
              <h3 className="font-bold text-ink text-xs uppercase tracking-wider mb-3">Market Price Reference</h3>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-warm-muted">Buy price</span>
                <span className="text-xs font-semibold text-ink">{formatUGX(marketPrice.buy)}/{listing.unit}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-warm-muted">Sell price</span>
                <span className="text-xs font-semibold text-ink">{formatUGX(marketPrice.sell)}/{listing.unit}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-warm-border">
                <span className="text-xs text-warm-muted">This listing</span>
                <span className={`text-xs font-bold ${priceDiff < 0 ? "text-green-600" : "text-red-500"}`}>
                  {formatUGX(listing.pricePerUnit)}/{listing.unit}
                </span>
              </div>
              <p className="text-warm-muted text-[10px] mt-2 italic">Source: {marketPrice.source} · {marketPrice.updated}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (user) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Simple public topnav */}
      <PublicNav activeRoute="" />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">{content}</div>
    </div>
  );
}
