import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../LanguageSwitcher";
import { getActorNotificationsFallbackWithRuntime, markAllRead } from "../../data/demo";
import { GOV_REPORT_INDEX } from "../../data/governance";
import { canUseExpenses } from "../../data/expenses";
import { canUseStock } from "../../data/stock";
import {
  LayoutDashboard, BookOpen, ShoppingBag, TrendingUp,
  Link, User, Settings, LogOut, Menu, X, Shield,
  Bell, ChevronDown, Sprout, Factory, Building2,
  Handshake, Ship, PackageOpen, ShoppingCart, Truck,
  BarChart3, Users, FileText, Store, Package, PenLine, Lock, Inbox, HelpCircle, Lightbulb, Globe, ClipboardList, Receipt, Boxes, Scale, ArrowRight as ArrowRightIcon
} from "lucide-react";

const ROLE_NAV = {
  AGR: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Sales Ledger", path: "/ledger" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: Inbox, label: "Purchase Requests", path: "/requests" },
    { icon: ShoppingCart, label: "My Orders", path: "/orders" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
    { icon: Package, label: "My Products", path: "/products" },
    { icon: PenLine, label: "Record a Sale", path: "/record-sale" },
    { icon: Link, label: "My Listings", path: "/listings" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: HelpCircle, label: "Help and Support", path: "/help" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  VAP: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Processing Ledger", path: "/ledger" },
    { icon: Link, label: "Batch Inventory", path: "/batches" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: Inbox, label: "Purchase Requests", path: "/requests" },
    { icon: ShoppingCart, label: "My Orders", path: "/orders" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
    { icon: Package, label: "My Products", path: "/products" },
    { icon: PenLine, label: "Record a Sale", path: "/record-sale" },
    { icon: Link, label: "My Listings", path: "/listings" },
    { icon: Factory, label: "My Facilities", path: "/facilities" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  MFR: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Sales Ledger", path: "/ledger" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: Inbox, label: "Purchase Requests", path: "/requests" },
    { icon: ShoppingCart, label: "My Orders", path: "/orders" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
    { icon: Package, label: "My Products", path: "/products" },
    { icon: PenLine, label: "Record a Sale", path: "/record-sale" },
    { icon: Link, label: "My Listings", path: "/listings" },
    { icon: Building2, label: "My Facility", path: "/facility" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  AGT: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Sales Ledger", path: "/ledger" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: Inbox, label: "Purchase Requests", path: "/requests" },
    { icon: ShoppingCart, label: "My Orders", path: "/orders" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
    { icon: Package, label: "My Products", path: "/products" },
    { icon: PenLine, label: "Record a Sale", path: "/record-sale" },
    { icon: Link, label: "My Listings", path: "/listings" },
    { icon: Handshake, label: "My Suppliers", path: "/suppliers" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  EXP: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Sales Ledger", path: "/ledger" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: Link, label: "Batch Inventory", path: "/batches" },
    { icon: FileText, label: "EUDR Documents", path: "/eudr" },
    { icon: Ship, label: "Chain of Custody", path: "/chain" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  IMP: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Import Records", path: "/ledger" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: PackageOpen, label: "My Orders", path: "/orders" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  BYR: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Purchase Ledger", path: "/ledger" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: Inbox, label: "Purchase Requests", path: "/requests" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
    { icon: ShoppingCart, label: "My Orders", path: "/orders" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  TRP: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Job Ledger", path: "/ledger" },
    { icon: Truck, label: "My Vehicles", path: "/vehicles" },
    { icon: ShoppingCart, label: "Active Jobs", path: "/jobs" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  CSM: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: ShoppingCart, label: "My Orders", path: "/orders" },
    { icon: Store, label: "My Stores", path: "/stores" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  ADMIN: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "User Management", path: "/users" },
    { icon: Shield, label: "Trade ID Registry", path: "/registry" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "System Settings", path: "/settings" },
  ],
  GOU: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Reports", path: "/government-analytics" },
    { icon: Users, label: "Actor Registry", path: "/registry" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
  ],
  FBR: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: ShoppingCart, label: "My Orders", path: "/orders" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
  WHS: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Sales Ledger", path: "/ledger" },
    { icon: ShoppingBag, label: "Public Marketplace", path: "/marketplace" },
    { icon: Lock, label: "Private Marketplace", path: "/marketplace/private" },
    { icon: Inbox, label: "Purchase Requests", path: "/requests" },
    { icon: ShoppingCart, label: "My Orders", path: "/orders" },
    { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
    { icon: Package, label: "My Products", path: "/products" },
    { icon: PenLine, label: "Record a Sale", path: "/record-sale" },
    { icon: Link, label: "My Listings", path: "/listings" },
    { icon: HelpCircle, label: "Help and Support", path: "/help" },
    { icon: User, label: "My Profile", path: "/profile" },
  ],
};

// Roles that participate in the Supply Requests / Sourcing Board (A16).
const SOURCING_ROLES = ["AGR", "VAP", "MFR", "AGT", "EXP", "IMP", "BYR", "CSM", "FBR", "TRP", "WHS"];

// Builds a trade actor's sidebar with collapsible groups:
//  • "Supply Requests" (Sourcing Board, My Supply Requests, Purchase Requests)
//  • "Sales & Expenses" (the role's ledger, Record a Sale, Expenses)
// De-duplicates by path (fixes the duplicated Help link) and pulls the regrouped
// items out of the flat list so they appear only inside their group.
function buildTradeNav(role) {
  const seen = new Set();
  const flat = (ROLE_NAV[role] || ROLE_NAV.AGR).filter((i) => (seen.has(i.path) ? false : (seen.add(i.path), true)));
  const byPath = (p) => flat.find((i) => i.path === p);
  const isFBR = role === "FBR";

  const ledger = byPath("/ledger");
  const recordSale = byPath("/record-sale");
  const requests = byPath("/requests");

  // Supply Requests group
  const supplyChildren = isFBR
    ? [
        { icon: ClipboardList, label: "Raise a Supply Note", path: "/sourcing-board?new=1" },
        { icon: Inbox, label: "My Supply Notes", path: "/sourcing-board/mine" },
      ]
    : [
        { icon: ClipboardList, label: "Sourcing Board", path: "/sourcing-board" },
        { icon: Inbox, label: "My Supply Requests", path: "/sourcing-board/mine" },
        ...(requests ? [{ icon: requests.icon, label: "Purchase Requests", path: requests.path }] : []),
      ];
  const supplyGroup = SOURCING_ROLES.includes(role)
    ? { group: true, key: "supply", icon: ClipboardList, label: isFBR ? "Supply Notes" : "Supply Requests", children: supplyChildren }
    : null;

  // Sales & Expenses group (or a lone Expenses link when there's no ledger/sale)
  const financeChildren = [
    ...(ledger ? [{ icon: ledger.icon, label: ledger.label, path: ledger.path }] : []),
    ...(recordSale ? [{ icon: recordSale.icon, label: recordSale.label, path: recordSale.path }] : []),
    ...(canUseExpenses(role) ? [{ icon: Receipt, label: "Expenses", path: "/expenses" }] : []),
  ];
  let financeGroup = null;
  let loneFinanceLink = null;
  if (financeChildren.length >= 2) financeGroup = { group: true, key: "finance", icon: BookOpen, label: "Sales & Expenses", children: financeChildren };
  else if (financeChildren.length === 1) loneFinanceLink = financeChildren[0];

  // A20 - Stock & Shop group (stock-holding domestic actors; not FBR/TRP/CSM).
  const stockGroup = canUseStock(role)
    ? {
        group: true, key: "stock", icon: Boxes, label: "Stock Management",
        children: [
          { icon: Package, label: "Inventory", path: "/stock" },
          { icon: Store, label: "Stores & Shops", path: "/stock/stores" },
          { icon: ShoppingCart, label: "Record Sale", path: "/stock/sell" },
          { icon: Scale, label: "Debts & Credits", path: "/stock/debts" },
          { icon: TrendingUp, label: "Revenue & Profit", path: "/stock/finance" },
          { icon: FileText, label: "Reports", path: "/stock/reports" },
        ],
      }
    : null;

  const REGROUPED = new Set(["/ledger", "/record-sale", "/requests"]);
  const rest = flat.filter((i) => !REGROUPED.has(i.path));

  const out = [];
  rest.forEach((it, idx) => {
    out.push(it);
    if (idx === 0) { // insert groups right after Dashboard
      if (supplyGroup) out.push(supplyGroup);
      if (financeGroup) out.push(financeGroup);
      else if (loneFinanceLink) out.push(loneFinanceLink);
      if (stockGroup) out.push(stockGroup);
    }
  });
  return out;
}

const ROLE_ICONS = {
  AGR: Sprout, VAP: Factory, MFR: Building2, AGT: Handshake,
  EXP: Ship, IMP: PackageOpen, BYR: ShoppingCart, TRP: Truck,
  CSM: User, ADMIN: Shield, GOU: BarChart3, FBR: Globe, WHS: Store,
};

const ROLE_COLORS = {
  AGR: "bg-green-500", VAP: "bg-amber-500", MFR: "bg-blue-500",
  AGT: "bg-purple-500", EXP: "bg-red-500", IMP: "bg-orange-500",
  BYR: "bg-teal-500", TRP: "bg-slate-500", CSM: "bg-pink-500",
  ADMIN: "bg-gray-700", GOU: "bg-indigo-600", FBR: "bg-cyan-600", WHS: "bg-lime-600",
};


// ── Contextual help content per page ─────────────────────────
const PAGE_HELP = {
  "/dashboard": {
    title: "Your Dashboard",
    tip: "Your dashboard shows a summary of your recent activity, transactions, and any pending actions that need your attention.",
    articles: [
      "Understanding your dashboard stats",
      "How to view your recent transactions",
      "What are incoming purchase requests?",
    ]
  },
  "/listings": {
    title: "My Listings",
    tip: "Listings are active sale offers on the marketplace. Create a listing from a product in My Products. Private listings are only visible to verified buyers in your value chain.",
    articles: [
      "How to create a listing",
      "What is the difference between public and private listings?",
      "How to manage listing visibility",
      "How stock deduction works on a completed sale",
    ]
  },
  "/products": {
    title: "My Products",
    tip: "Products are your inventory - what you produce or stock. A product must exist before you can create a listing. Stock is deducted automatically when a sale completes.",
    articles: [
      "How to add a product to your catalogue",
      "How to declare new stock",
      "Understanding the stock remaining indicator",
      "How to link a product to a listing",
    ]
  },
  "/marketplace": {
    title: "Public Marketplace",
    tip: "The public marketplace shows all listings with Public or Both visibility. Anyone can browse without logging in. Login is only required when buying.",
    articles: [
      "How to submit a purchase request",
      "How to filter and search listings",
      "What does Below market price mean?",
      "How to save a listing to favourites",
    ]
  },
  "/marketplace/private": {
    title: "Private Marketplace",
    tip: "The private marketplace shows listings from sellers in your value chain. Results are filtered to your registered commodity categories by default. Use the category filter to expand your view.",
    articles: [
      "What is the private marketplace?",
      "How listings are matched to your value chain",
      "How to expand your category preferences",
      "Who can see private listings?",
    ]
  },
  "/requests": {
    title: "Purchase Requests",
    tip: "Purchase requests are pre-order negotiations. Accept, counter-offer, or decline. An order is only created after you accept and the buyer confirms delivery terms.",
    articles: [
      "How to respond to a purchase request",
      "How to send a counter-offer",
      "What happens after you accept a request?",
      "How delivery terms work",
    ]
  },
  "/orders": {
    title: "My Orders",
    tip: "Orders track confirmed transactions through the 8-step purchase flow. Use the Buying / Selling toggle to switch views if you are both a buyer and seller.",
    articles: [
      "How the 8-step purchase flow works",
      "How to confirm payment receipt",
      "How to confirm goods received",
      "How to raise a delivery dispute",
    ]
  },
  "/ledger": {
    title: "Sales Ledger",
    tip: "Your ledger is an immutable record of every transaction. It builds the verified trade history that financial institutions use to assess your creditworthiness.",
    articles: [
      "How to record a direct sale",
      "How to export your transaction history",
      "What is the ledger used for?",
    ]
  },
  "/batches": {
    title: "Batch Inventory",
    tip: "Batches link your input purchases to your output products. A complete batch with all source actors registered is EUDR eligible and can generate a Due Diligence Statement.",
    articles: [
      "How to create a processing batch",
      "What is EUDR eligibility?",
      "How to generate an EUDR document",
      "What is a traceability score?",
    ]
  },
  "/eudr": {
    title: "EUDR Documents",
    tip: "EUDR Due Diligence Statements are generated from your batch chain of custody. All source farmers must be registered DTP actors for a batch to be fully EUDR eligible.",
    articles: [
      "What is the EU Deforestation Regulation?",
      "How to generate a Due Diligence Statement",
      "How to link source farmers to a batch",
      "How to submit to the EU portal",
    ]
  },
  "/market-prices": {
    title: "Market Prices",
    tip: "Prices are updated from UCDA, MAAIF, UCE, UFPEA and other verified sources. Use the 7-day or monthly chart to identify price trends before listing or buying.",
    articles: [
      "Where do market prices come from?",
      "How to read the price trend chart",
      "How to save favourite commodities",
      "What is buy price vs sell price?",
    ]
  },
  "/stores": {
    title: "My Stores",
    tip: "Stores are your physical locations - farms, depots, warehouses, or buying stations. Listing a store makes it easier for buyers to know where to collect goods.",
    articles: [
      "How to add a store or depot",
      "How stores appear on your listings",
      "How to link a product to a store",
    ]
  },
  "/vehicles": {
    title: "My Vehicles",
    tip: "Register your vehicles to appear as an available transporter when buyers are confirming delivery terms. Include the districts you serve and goods types you carry.",
    articles: [
      "How to register a vehicle",
      "How delivery jobs are assigned",
      "How to update vehicle availability",
    ]
  },
  "/profile": {
    title: "My Profile",
    tip: "Keep your profile complete and up to date. A verified, complete profile builds buyer confidence and improves your visibility on the marketplace.",
    articles: [
      "How to update your profile",
      "How to add a secondary role",
      "How to manage notification preferences",
    ]
  },
  "/verify": {
    title: "Verify a Trade Actor",
    tip: "Before trading with a new actor, verify their Trade ID here. A verified actor has passed identity checks and their profile is backed by NIRA, URSB, or URA.",
    articles: [
      "How Trade ID verification works",
      "What the verification badges mean",
      "What to do if an actor is unverified",
    ]
  },
};

function ContextualHelpPanel({ onClose, pathname, navigate }) {
  const pageHelp = PAGE_HELP[pathname] || {
    title: "Help and Support",
    tip: "Find answers to common questions in our Help and Support centre.",
    articles: [
      "Getting started on the platform",
      "How to use the marketplace",
      "How orders and payments work",
    ]
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* Panel */}
      <div className="fixed bottom-16 right-4 z-50 w-72 bg-white border border-warm-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-ink">
          <div className="flex items-center gap-2">
            <HelpCircle size={14} className="text-gold" />
            <span className="text-white font-bold text-sm">{pageHelp.title}</span>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>
        {/* Tip */}
        <div className="px-4 py-3 bg-gold/8 border-b border-warm-border flex gap-2.5">
          <Lightbulb size={14} className="text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warm-text leading-relaxed">{pageHelp.tip}</p>
        </div>
        {/* Articles */}
        <div className="px-4 py-3">
          <div className="text-[10px] font-bold text-warm-muted uppercase tracking-wider mb-2">Related articles</div>
          <div className="space-y-1">
            {pageHelp.articles.map((a, i) => (
              <button key={i} onClick={() => { navigate("/help"); onClose(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-warm-bg transition-colors text-left group">
                <BookOpen size={11} className="text-warm-muted flex-shrink-0 group-hover:text-gold transition-colors" />
                <span className="text-xs text-warm-text group-hover:text-ink transition-colors leading-snug">{a}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 py-3 border-t border-warm-border">
          <button onClick={() => { navigate("/help"); onClose(); }}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-gold hover:text-gold-dim transition-colors">
            Browse all help articles <ArrowRightIcon size={11} />
          </button>
        </div>
      </div>
    </>
  );
}


function NotificationPanel({ user, onClose }) {
  const navigate = useNavigate();
  const notifs = getActorNotificationsFallbackWithRuntime(user?.username, user?.role);
  const unread = notifs.filter(n => !n.read).length;
  const TYPE_ICONS = {
    payment: "💰", order: "📦", broadcast: "📢", offer: "🤝",
    price: "📈", batch: "⚙️", transport: "🚛", eudr: "📄",
    shipment: "🚢", rating: "⭐", registration: "👤", alert: "⚠️",
  };
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-warm-border rounded-2xl shadow-2xl z-50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-warm-border">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink text-sm">Notifications</span>
            {unread > 0 && <span className="text-[10px] font-bold bg-gold text-ink px-1.5 py-0.5 rounded-full">{unread} new</span>}
          </div>
          {unread > 0 && (
            <button onClick={() => markAllRead(user?.username)} className="text-xs text-warm-muted hover:text-ink transition-colors">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-warm-border">
          {notifs.length === 0 ? (
            <div className="py-8 text-center text-sm text-warm-muted">No notifications yet</div>
          ) : notifs.slice(0, 15).map((n, i) => (
            <div key={n.id || i}
              className={"flex items-start gap-3 px-4 py-3 hover:bg-warm-bg transition-colors cursor-pointer " + (!n.read ? "bg-gold/5" : "")}
              onClick={() => {
                if (n.listingId) { navigate("/marketplace/listing/" + n.listingId); onClose(); }
                else if (n.type === "order") { navigate("/orders"); onClose(); }
                else if (n.type === "broadcast") { navigate("/marketplace"); onClose(); }
              }}>
              <span className="text-base flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type] || "🔔"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ink leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-warm-muted mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-warm-border text-center">
          <button onClick={() => { navigate("/ledger"); onClose(); }}
            className="text-xs text-gold font-semibold hover:text-gold-dim transition-colors">
            View transaction history
          </button>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const role = user?.role || "AGR";
  let navItems;
  if (role === "ADMIN") {
    navItems = ROLE_NAV.ADMIN;
  } else if (role === "GOU") {
    // GOU analysts get one nav entry per report in their institution's set (A22).
    const base = (user?.institution && GOV_REPORT_INDEX[user.institution])
      ? [
          { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
          { icon: FileText, label: "Reports", path: "/government-analytics" },
          ...GOV_REPORT_INDEX[user.institution].map((r) => ({ icon: FileText, label: r.navLabel, path: `/government-analytics/${r.id}`, sub: true })),
          { icon: Users, label: "Actor Registry", path: "/registry" },
          { icon: TrendingUp, label: "Market Prices", path: "/market-prices" },
        ]
      : [...ROLE_NAV.GOU];
    // Government markets management (markets / stalls / renters).
    base.push({
      group: true, key: "markets", icon: Store, label: "Markets",
      children: [
        { icon: Store, label: "Markets", path: "/markets" },
        { icon: Boxes, label: "Stalls", path: "/markets/stalls" },
        { icon: Users, label: "Stall Owners & Renters", path: "/markets/renters" },
      ],
    });
    navItems = base;
  } else {
    navItems = buildTradeNav(role);
  }

  const pathOf = (p) => (p || "").split("?")[0];
  const isActive = (p) => location.pathname === pathOf(p);
  // Collapsible group state. A group defaults to open when one of its children
  // is the current route; explicit toggles override that default.
  const [openGroups, setOpenGroups] = useState({});
  const groupOpen = (g) => (openGroups[g.key] !== undefined ? openGroups[g.key] : g.children.some((c) => isActive(c.path)));
  const toggleGroup = (g) => { const cur = groupOpen(g); setOpenGroups((s) => ({ ...s, [g.key]: !cur })); };

  const RoleIcon = ROLE_ICONS[role] || User;
  const roleColor = ROLE_COLORS[role] || "bg-gray-500";

  function handleLogout() { logout(); navigate("/"); }

  return (
    <div className="min-h-screen bg-warm-bg flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-ink flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}>
        <div className="h-14 flex items-center px-4 border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center font-bold text-ink text-[10px] flex-shrink-0">DTP</div>
          <div className="ml-3">
            <div className="text-white font-semibold text-sm leading-tight">Digital Trade Platform</div>
            <div className="text-white/30 text-[10px]">Empowering Digital Economy</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-white/40 hover:text-white"><X size={18} /></button>
        </div>

        <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${roleColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <RoleIcon size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-white font-medium text-sm truncate">{user?.name}</div>
              <div className="text-white/40 text-[10px] truncate font-mono">{user?.tradeId}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            if (item.section) {
              return <div key={`sec-${item.label}`} className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/30">{item.label}</div>;
            }
            if (item.group) {
              const open = groupOpen(item);
              const anyActive = item.children.some((c) => isActive(c.path));
              return (
                <div key={`grp-${item.key}`}>
                  <button onClick={() => toggleGroup(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${anyActive ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                    <item.icon size={16} className="flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="mt-0.5 space-y-0.5">
                      {item.children.map((c) => {
                        const active = isActive(c.path);
                        return (
                          <button key={c.path} onClick={() => { navigate(c.path); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 pl-9 pr-3 py-2 rounded-lg text-[13px] font-medium transition-all ${active ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                            <c.icon size={14} className="flex-shrink-0" />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 rounded-lg font-medium transition-all ${
                  item.sub ? "pl-9 pr-3 py-2 text-[13px]" : "px-3 py-2.5 text-sm"
                } ${active ? "bg-white/10 text-white" : `${item.sub ? "text-white/40" : "text-white/50"} hover:text-white hover:bg-white/5`}`}>
                <item.icon size={item.sub ? 14 : 16} className="flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-0.5 flex-shrink-0">
          <button onClick={() => navigate("/profile")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <Settings size={16} /> Settings
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-warm-border flex items-center px-4 md:px-6 flex-shrink-0 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-3 text-warm-muted hover:text-ink transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher dark={true} />
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative text-warm-muted hover:text-ink transition-colors p-1.5 rounded-lg hover:bg-warm-bg">
                <Bell size={18} />
                {getActorNotificationsFallbackWithRuntime(user?.username, user?.role).filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
                )}
              </button>
              {notifOpen && <NotificationPanel user={user} onClose={() => setNotifOpen(false)} />}
            </div>
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer hover:bg-warm-bg px-2 py-1.5 rounded-lg transition-all">
                <div className={`w-7 h-7 ${roleColor} rounded-lg flex items-center justify-center`}>
                  <RoleIcon size={13} className="text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-ink">{user?.name}</div>
                  <div className="text-[10px] text-warm-muted">{role}</div>
                </div>
                <ChevronDown size={14} className={`text-warm-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-warm-border rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-warm-border">
                      <div className="text-sm font-semibold text-ink">{user?.name}</div>
                      <div className="text-xs text-warm-muted font-mono mt-0.5">{user?.tradeId}</div>
                      <div className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <Shield size={9} /> {user?.verified} Verified
                      </div>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { navigate("/dashboard"); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-warm-text hover:bg-warm-bg hover:text-ink transition-all">
                        <LayoutDashboard size={15} /> Dashboard
                      </button>
                      <button onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-warm-text hover:bg-warm-bg hover:text-ink transition-all">
                        <User size={15} /> My Profile
                      </button>
                      <button onClick={() => { navigate("/settings"); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-warm-text hover:bg-warm-bg hover:text-ink transition-all">
                        <Settings size={15} /> Settings
                      </button>
                    </div>
                    <div className="border-t border-warm-border py-1">
                      <button onClick={() => { handleLogout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all">
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      {/* Contextual help button */}
      <button
        onClick={() => setHelpOpen(!helpOpen)}
        className={`fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${helpOpen ? "bg-gold text-ink" : "bg-ink border border-white/20 text-gold hover:bg-ink-mid"}`}
        title="Help for this page"
      >
        <HelpCircle size={17} />
      </button>
      {helpOpen && <ContextualHelpPanel onClose={() => setHelpOpen(false)} pathname={location.pathname} navigate={navigate} />}
      </div>
    </div>
  );
}
