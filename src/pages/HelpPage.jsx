import { useState } from "react";
import PublicNav from "../components/PublicNav";
import PublicFooter from "../components/PublicFooter";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  Search, ChevronRight, ChevronDown, MessageSquare,
  BookOpen, Shield, ShoppingBag, TrendingUp, Package,
  Truck, FileText, CreditCard, User, Settings,
  ArrowLeft, Send, CheckCircle, ExternalLink,
  HelpCircle, AlertCircle, Mail, Phone
} from "lucide-react";

const HELP_CATEGORIES = [
  {
    id: "registration",
    icon: Shield,
    title: "Registration and Trade ID",
    color: "bg-blue-50 text-blue-600",
    articles: [
      { title: "How to register on the Digital Trade Platform", time: "3 min" },
      { title: "What is a Digital Trade ID?", time: "2 min" },
      { title: "How to complete your profile after registration", time: "4 min" },
      { title: "How to verify your NIRA, URSB, or URA identity", time: "3 min" },
      { title: "What actor type should I choose?", time: "5 min" },
      { title: "How to add a secondary role to your account", time: "2 min" },
    ]
  },
  {
    id: "marketplace",
    icon: ShoppingBag,
    title: "Marketplace and Listings",
    color: "bg-gold/10 text-gold-dim",
    articles: [
      { title: "How to create a listing on the public or private marketplace", time: "4 min" },
      { title: "What is the difference between public and private listings?", time: "3 min" },
      { title: "How to browse the marketplace as a buyer", time: "2 min" },
      { title: "How to submit a purchase request", time: "3 min" },
      { title: "How to manage your product stock and listings", time: "4 min" },
      { title: "Why is my listing not showing on the marketplace?", time: "2 min" },
    ]
  },
  {
    id: "orders",
    icon: Package,
    title: "Orders and Purchase Flow",
    color: "bg-green-50 text-green-600",
    articles: [
      { title: "How does the 8-step purchase flow work?", time: "6 min" },
      { title: "How to respond to an incoming purchase request", time: "3 min" },
      { title: "How to confirm delivery terms on an order", time: "4 min" },
      { title: "How to confirm payment and mark goods ready for dispatch", time: "3 min" },
      { title: "How to raise a delivery dispute", time: "3 min" },
      { title: "What happens if a buyer does not confirm receipt?", time: "2 min" },
    ]
  },
  {
    id: "prices",
    icon: TrendingUp,
    title: "Market Prices",
    color: "bg-purple-50 text-purple-600",
    articles: [
      { title: "How to read the market prices page", time: "3 min" },
      { title: "Where do the commodity prices come from?", time: "2 min" },
      { title: "How often are prices updated?", time: "1 min" },
      { title: "How to save your favourite commodities", time: "1 min" },
      { title: "What is the buy price vs the sell price?", time: "2 min" },
    ]
  },
  {
    id: "transport",
    icon: Truck,
    title: "Delivery and Transport",
    color: "bg-orange-50 text-orange-600",
    articles: [
      { title: "How to register your vehicles on the platform", time: "3 min" },
      { title: "How to set up your transport service listing", time: "4 min" },
      { title: "How to select a transporter during an order", time: "3 min" },
      { title: "How to accept and manage delivery jobs (transporters)", time: "4 min" },
      { title: "How to request seller self-delivery", time: "2 min" },
      { title: "What delivery modes are available?", time: "2 min" },
    ]
  },
  {
    id: "eudr",
    icon: FileText,
    title: "EUDR and Traceability",
    color: "bg-green-50 text-green-600",
    articles: [
      { title: "What is EUDR and why does it matter for Uganda?", time: "5 min" },
      { title: "How to create a traceable batch for EUDR compliance", time: "5 min" },
      { title: "How to generate an EUDR Due Diligence Statement", time: "4 min" },
      { title: "How to link source farmers to your processing batch", time: "3 min" },
      { title: "What is a traceability score?", time: "2 min" },
    ]
  },
  {
    id: "account",
    icon: User,
    title: "Account Management",
    color: "bg-warm-bg text-warm-text",
    articles: [
      { title: "How to update your profile information", time: "2 min" },
      { title: "How to change your phone number or password", time: "2 min" },
      { title: "How to add or manage your store locations", time: "3 min" },
      { title: "How to view and export your transaction history", time: "2 min" },
      { title: "How to manage your notification preferences", time: "2 min" },
      { title: "How to deactivate or close your account", time: "3 min" },
    ]
  },
  {
    id: "technical",
    icon: Settings,
    title: "Technical Issues",
    color: "bg-red-50 text-red-500",
    articles: [
      { title: "I cannot log in to my account", time: "3 min" },
      { title: "My Trade ID is not showing on my profile", time: "2 min" },
      { title: "I am not receiving SMS or email notifications", time: "3 min" },
      { title: "The marketplace is not loading properly", time: "2 min" },
      { title: "How to report a bug or technical issue", time: "2 min" },
    ]
  },
];

const QUICK_LINKS = [
  { label: "How to register", id: "registration" },
  { label: "Create a listing", id: "marketplace" },
  { label: "How orders work", id: "orders" },
  { label: "EUDR compliance", id: "eudr" },
  { label: "Register a vehicle", id: "transport" },
  { label: "Can't log in?", id: "technical" },
];

function ArticleModal({ article, category, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-border">
          <div className="text-xs text-warm-muted">{category?.title}</div>
          <button onClick={onClose} className="text-warm-muted hover:text-ink p-1 rounded-lg hover:bg-warm-bg transition-colors">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-bold text-ink mb-4">{article?.title}</h2>
          <div className="text-sm text-warm-text leading-relaxed space-y-3">
            <p>This article covers {article?.title?.toLowerCase()}. Full article content will be available in the Help and Support system when the platform launches.</p>
            <p>For immediate assistance, use the contact form below or reach us directly on +256 774 910 575.</p>
            <div className="bg-warm-bg rounded-xl p-4 mt-4">
              <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Quick tip</div>
              <p className="text-xs text-warm-muted">If you need help with a specific order or listing, include your Trade ID and order/listing reference when contacting support. This helps us find your account quickly.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-4 border-t border-warm-border">
          <span className="text-xs text-warm-muted">Was this helpful?</span>
          <button className="text-xs text-green-600 font-semibold px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-50 transition-colors">Yes</button>
          <button className="text-xs text-warm-muted font-semibold px-3 py-1.5 rounded-lg border border-warm-border hover:bg-warm-bg transition-colors">No</button>
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({ category: "", subject: "", description: "", contact: user?.username || "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!form.subject || !form.description) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} className="text-green-500" />
        </div>
        <h3 className="font-bold text-ink text-lg mb-2">Support request submitted</h3>
        <p className="text-sm text-warm-muted mb-2">Reference: <span className="font-mono font-bold text-ink">SUP-{Date.now().toString().slice(-6)}</span></p>
        <p className="text-sm text-warm-muted">We will respond within 2 business days via SMS or the contact you provided.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Category</label>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold">
          <option value="">Select a category</option>
          {HELP_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Subject *</label>
        <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
          placeholder="Brief description of your issue"
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold" />
      </div>
      <div>
        <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Description *</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          rows={4} placeholder="Describe your issue in detail. Include any order references, Trade IDs, or error messages."
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold resize-none" />
      </div>
      <div>
        <label className="block text-xs font-bold text-warm-muted uppercase tracking-wider mb-1.5">Your contact (phone or email)</label>
        <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
          placeholder="+256 700 000 000 or email@example.com"
          className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white outline-none focus:border-gold" />
      </div>
      <button onClick={handleSubmit} disabled={!form.subject || !form.description}
        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-mid disabled:opacity-40 text-ink font-bold py-3 rounded-xl text-sm transition-all">
        <Send size={14} /> Submit support request
      </button>
    </div>
  );
}

export default function HelpPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeArticleCat, setActiveArticleCat] = useState(null);

  const filtered = search
    ? HELP_CATEGORIES.map(c => ({
        ...c,
        articles: c.articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
      })).filter(c => c.articles.length > 0)
    : HELP_CATEGORIES;

  const content = (
    <div className="max-w-4xl mx-auto">
      {!user && (
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm mb-4 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-ink rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle size={26} className="text-gold" />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">Help and Support</h1>
        <p className="text-warm-muted text-sm">Find answers, guides, and support for the Digital Trade Platform</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for help articles..."
          className="w-full pl-12 pr-4 py-3.5 border-2 border-warm-border rounded-xl text-sm text-ink bg-white outline-none focus:border-gold transition-colors text-base"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-muted hover:text-ink">
            ✕
          </button>
        )}
      </div>

      {/* Quick links */}
      {!search && (
        <div className="mb-8">
          <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-3">Quick links</div>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map(l => (
              <button key={l.label} onClick={() => setExpandedCat(expandedCat === l.id ? null : l.id)}
                className="flex items-center gap-1.5 text-sm font-medium text-ink bg-white border border-warm-border hover:border-gold px-3 py-2 rounded-lg transition-all">
                {l.label} <ChevronRight size={12} className="text-warm-muted" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Article categories */}
      <div className="space-y-3 mb-10">
        {filtered.map(cat => {
          const Icon = cat.icon;
          const isExpanded = expandedCat === cat.id || !!search;
          return (
            <div key={cat.id} className="bg-white border border-warm-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCat(isExpanded && !search ? null : cat.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-warm-bg transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-ink text-sm">{cat.title}</div>
                  <div className="text-xs text-warm-muted">{cat.articles.length} articles</div>
                </div>
                {!search && (isExpanded
                  ? <ChevronDown size={16} className="text-warm-muted" />
                  : <ChevronRight size={16} className="text-warm-muted" />)}
              </button>
              {isExpanded && (
                <div className="border-t border-warm-border">
                  {cat.articles.map((article, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveArticle(article); setActiveArticleCat(cat); }}
                      className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-warm-bg border-b border-warm-border last:border-0 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={13} className="text-warm-muted flex-shrink-0" />
                        <span className="text-sm text-ink group-hover:text-gold transition-colors">{article.title}</span>
                      </div>
                      <span className="text-xs text-warm-muted flex-shrink-0 ml-3">{article.time} read</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-warm-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare size={16} className="text-gold" />
            </div>
            <div>
              <div className="font-bold text-ink text-sm">Submit a support request</div>
              <div className="text-xs text-warm-muted">Response within 2 business days</div>
            </div>
          </div>
          <ContactForm />
        </div>

        <div className="space-y-4">
          <div className="bg-ink rounded-xl p-5">
            <div className="text-gold font-bold text-sm mb-3">Contact us directly</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-semibold">+256 774 910 575</div>
                  <div className="text-white/40 text-xs">Mon-Fri, 8am-6pm EAT</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-semibold">+256 703 525 418</div>
                  <div className="text-white/40 text-xs">Alternative line</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-gold flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-semibold">support@interlet.net</div>
                  <div className="text-white/40 text-xs">Email support</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ExternalLink size={14} className="text-gold flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-semibold">www.interlet.net</div>
                  <div className="text-white/40 text-xs">Company website</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-warm-bg border border-warm-border rounded-xl p-5">
            <div className="font-bold text-ink text-sm mb-2">Platform status</div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-green-600 font-semibold">All systems operational</span>
            </div>
            <div className="space-y-1.5 text-xs text-warm-muted">
              <div className="flex justify-between"><span>Platform</span><span className="text-green-600 font-semibold">Online</span></div>
              <div className="flex justify-between"><span>Marketplace</span><span className="text-green-600 font-semibold">Online</span></div>
              <div className="flex justify-between"><span>Market prices</span><span className="text-green-600 font-semibold">Online</span></div>
              <div className="flex justify-between"><span>Uptime (30 days)</span><span className="font-semibold text-ink">99.97%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return user
    ? <DashboardLayout>{content}</DashboardLayout>
    : (
      <div className="min-h-screen bg-warm-bg">
        <PublicNav activeRoute="/help" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">{content}</div>
      </div>
    );
}
