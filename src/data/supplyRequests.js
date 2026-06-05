// ─────────────────────────────────────────────────────────────────────────
// A16 - Supply Requests & Sourcing Board · data seam (async, demo-backed).
//
// Demand-led counterpart to the marketplace: buyers post what they want to
// source, registered suppliers respond with offers, the buyer accepts/counters,
// and an accepted offer converts to an order in the existing purchase flow.
//
// The UI consumes ONLY this module, so a real API can replace the bodies later.
// Mutations persist to module-level runtime stores for the session (lost on
// reload), mirroring the notifications pattern in demo.js.
// ─────────────────────────────────────────────────────────────────────────
import { SAMPLE_ACCOUNTS } from "./constants";
import { REGIONS, SUB_REGIONS, DISTRICTS } from "./geo";
import { pushNotification, getSellerRatingCount, getTrustTick } from "./demo";

// ── form option lists (spec 16.2) ─────────────────────────────────────────
export const RECURRENCE_OPTIONS = ["one-off", "weekly", "monthly", "per season"];
export const PAYMENT_METHODS = ["Bank transfer", "Letter of credit", "Mobile money", "Digital trade wallet", "Cash on delivery"];
export const TRANSPORT_TERMS = ["Collection by buyer", "Delivery to buyer's site", "Delivery to port of exit", "Full freight to destination"];
export const CUSTOMS_OPTIONS = ["Not applicable (domestic)", "Buyer handles export & import", "Seller handles export, buyer handles import", "Shared / as agreed"];
export const CERTIFICATION_OPTIONS = ["UNBS certified", "Organic", "EUDR-compliant origin", "Fairtrade", "GlobalG.A.P."];

// Posting a supply request is OPEN to any registered actor (left open for now).
export const RESPONDER_ROLES = ["AGR", "VAP", "MFR", "AGT", "EXP"];
export const canPost = () => true;
export const canRespond = (role) => RESPONDER_ROLES.includes(role);

export const STATUS_LABELS = {
  live: "Live", offers: "Offers received", partially_filled: "Partially filled",
  filled: "Filled", closed: "Closed", expired: "Expired",
};

const actorOf = (u) => SAMPLE_ACCOUNTS.find((a) => a.username === u) || {};

export function regionForDistrict(name) {
  const d = DISTRICTS.find((x) => x.name === name);
  if (!d) return "";
  const sr = SUB_REGIONS.find((s) => s.id === d.subRegionId);
  const r = sr && REGIONS.find((rr) => rr.id === sr.regionId);
  return r ? r.name : "";
}

// Snapshot the public-facing buyer fields onto a request.
function withBuyer(req) {
  const a = actorOf(req.buyer);
  return {
    buyerName: a.name || req.buyer,
    buyerTradeId: a.tradeId || "",
    buyerRole: a.role || "",
    buyerVerified: a.verified || "",
    isForeign: a.role === "FBR",
    consumerOrigin: a.role === "CSM",
    ...req,
  };
}

function offer(o) {
  const a = actorOf(o.seller);
  return { status: "submitted", counters: [], certifications: [], sellerName: a.name || o.seller, sellerTradeId: a.tradeId || "", ...o };
}

// ── seed data ──────────────────────────────────────────────────────────────
let _seq = 60;
let _offerSeq = 30;
const nextReqId = () => `SRQ-2026-${String(++_seq).padStart(4, "0")}`;
const nextOfferId = () => `OFR-2026-${String(++_offerSeq).padStart(4, "0")}`;

let _requests = [
  withBuyer({
    id: "SRQ-2026-0051",
    buyer: "neumann_gruppe",
    commodity: "Coffee (Arabica)",
    quantity: 40000, unit: "kg", recurrence: "monthly",
    grade: "Screen 15+", certifications: ["EUDR-compliant origin"], packaging: "GrainPro bags",
    targetPrice: 9200, budget: null,
    deliveryDistrict: "Mombasa (Port of Exit)", deliveryWindow: "Within 30 days", deliveryMode: "Delivery to port of exit",
    region: "Eastern", sourcingPreference: ["Eastern"],
    validUntil: "2026-07-20", visibility: "public",
    description: "Sourcing screen-washed Arabica with EUDR-compliant origin for monthly export shipments to Hamburg. Full traceability to farm level required.",
    paymentMethods: ["Letter of credit", "Bank transfer"], transportTerms: "Delivery to port of exit", customs: "Buyer handles export & import",
    status: "offers", createdAt: "2026-06-01",
    offers: [
      offer({ id: "OFR-2026-0021", seller: "kahawa_exports", product: "Coffee (Arabica) - Parchment", quantity: 40000, pricePerUnit: 9100, availableFrom: "2026-06-10", deliveryTerms: "Delivery to port of exit (Mombasa)", certifications: ["EUDR-compliant origin"], message: "Can supply the full monthly volume with EUDR documentation." }),
      offer({ id: "OFR-2026-0022", seller: "kapchorwa_traders", product: "Coffee (Arabica)", quantity: 25000, pricePerUnit: 9000, availableFrom: "2026-06-08", deliveryTerms: "Collection by buyer", message: "Partial fill of 25 tonnes available from Mount Elgon farmers." }),
    ],
  }),
  withBuyer({
    id: "SRQ-2026-0048",
    buyer: "volcafe_uganda",
    commodity: "Coffee (Robusta)",
    quantity: 10000, unit: "kg", recurrence: "one-off",
    grade: "Screen 18", certifications: [], packaging: "Jute bags",
    targetPrice: null, budget: 75000000,
    deliveryDistrict: "Kampala", deliveryWindow: "Within 2 weeks", deliveryMode: "Delivery to buyer's site",
    region: "Central", sourcingPreference: [],
    validUntil: "2026-06-30", visibility: "public",
    description: "One-off purchase of clean Robusta for an export contract. Open to offers; quote your best price per kg.",
    paymentMethods: ["Bank transfer", "Digital trade wallet"], transportTerms: "Delivery to buyer's site", customs: "Not applicable (domestic)",
    status: "offers", createdAt: "2026-05-28",
    offers: [
      offer({ id: "OFR-2026-0019", seller: "kapchorwa_traders", product: "Coffee (Robusta)", quantity: 10000, pricePerUnit: 7300, availableFrom: "2026-06-05", deliveryTerms: "Delivery to buyer's site", message: "Full volume available." }),
    ],
  }),
  withBuyer({
    id: "SRQ-2026-0045",
    buyer: "kampala_mills",
    commodity: "Maize",
    quantity: 50000, unit: "kg", recurrence: "monthly",
    grade: "Grade 1, dried", certifications: ["UNBS certified"], packaging: "50kg bags",
    targetPrice: 1050, budget: null,
    deliveryDistrict: "Kampala", deliveryWindow: "Rolling monthly", deliveryMode: "Full freight to destination",
    region: "Central", sourcingPreference: ["Northern", "Eastern"],
    validUntil: "2026-08-15", visibility: "public",
    description: "Monthly maize requirement for flour milling. Moisture content below 13.5%. Consistent monthly supply preferred over one-off lots.",
    paymentMethods: ["Digital trade wallet", "Bank transfer"], transportTerms: "Full freight to destination", customs: "Not applicable (domestic)",
    status: "live", createdAt: "2026-05-30",
    offers: [],
  }),
  withBuyer({
    id: "SRQ-2026-0043",
    buyer: "nile_traders",
    commodity: "Beans (Common)",
    quantity: 20000, unit: "kg", recurrence: "weekly",
    grade: "Grade 1", certifications: [], packaging: "100kg bags",
    targetPrice: 2900, budget: null,
    deliveryDistrict: "Kampala", deliveryWindow: "Weekly deliveries", deliveryMode: "Collection by buyer",
    region: "Central", sourcingPreference: ["Northern"],
    validUntil: "2026-07-05", visibility: "public",
    description: "Weekly aggregation of common beans for re-export. Sourcing from northern Uganda preferred. Clean, sorted and bagged.",
    paymentMethods: ["Mobile money", "Bank transfer"], transportTerms: "Collection by buyer", customs: "Not applicable (domestic)",
    status: "live", createdAt: "2026-06-02",
    offers: [],
  }),
  withBuyer({
    id: "SRQ-2026-0040",
    buyer: "john_musoke",
    commodity: "Maize Flour",
    quantity: 100, unit: "kg", recurrence: "one-off",
    grade: "Fine", certifications: [], packaging: "Retail bags",
    targetPrice: 1900, budget: null,
    deliveryDistrict: "Kampala", deliveryWindow: "This week", deliveryMode: "Delivery to buyer's site",
    region: "Central", sourcingPreference: [],
    validUntil: "2026-06-20", visibility: "public",
    description: "Household requirement: 100kg of fine maize flour delivered in Kampala. Looking for a verified miller or retailer nearby.",
    paymentMethods: ["Mobile money"], transportTerms: "Delivery to buyer's site", customs: "Not applicable (domestic)",
    status: "live", createdAt: "2026-06-03",
    offers: [],
  }),
];

let _orders = []; // orders created from accepted offers (link to SRQ)

// ── derived helpers ─────────────────────────────────────────────────────────
function daysUntil(dateStr) {
  // Compares against a fixed "today" so demo output is stable.
  const today = new Date("2026-06-04");
  return Math.ceil((new Date(dateStr) - today) / (1000 * 60 * 60 * 24));
}
export function isClosingSoon(req) {
  const d = daysUntil(req.validUntil);
  return d >= 0 && d <= 7;
}
function recomputeStatus(req) {
  const accepted = req.offers.filter((o) => o.status === "accepted");
  const acceptedQty = accepted.reduce((s, o) => s + (o.quantity || 0), 0);
  if (accepted.length && acceptedQty >= req.quantity) req.status = "filled";
  else if (accepted.length) req.status = "partially_filled";
  else if (req.offers.length) req.status = "offers";
  else req.status = "live";
}

function clone(x) { return JSON.parse(JSON.stringify(x)); }
const wait = (v, ms = 250) => new Promise((res) => setTimeout(() => res(v), ms));

// ── reads ────────────────────────────────────────────────────────────────
export async function getSupplyRequests(filters = {}) {
  // The open board shows only published, still-open requests.
  let list = _requests.filter((r) =>
    (filters.visibility ? r.visibility === filters.visibility : true) &&
    r.published !== false &&
    !["closed", "expired"].includes(r.status)
  );
  const f = filters;
  if (f.commodity) list = list.filter((r) => r.commodity === f.commodity);
  if (f.region) list = list.filter((r) => r.region === f.region);
  if (f.district) list = list.filter((r) => r.deliveryDistrict === f.district || (r.sourcingPreference || []).includes(f.district));
  if (f.recurrence && f.recurrence !== "All") {
    list = f.recurrence === "one-off"
      ? list.filter((r) => r.recurrence === "one-off")
      : list.filter((r) => r.recurrence !== "one-off"); // "recurring"
  }
  if (f.buyerType && f.buyerType !== "All") {
    list = f.buyerType === "FBR"
      ? list.filter((r) => r.buyerRole === "FBR")
      : f.buyerType === "CSM"
        ? list.filter((r) => r.consumerOrigin)
        : list.filter((r) => r.buyerRole === f.buyerType);
  }
  if (f.trust && f.trust !== "All") list = list.filter((r) => getTrustTick(getSellerRatingCount(r.buyer)) === f.trust);
  if (f.minQty) list = list.filter((r) => r.quantity >= Number(f.minQty));
  if (f.maxQty) list = list.filter((r) => r.quantity <= Number(f.maxQty));
  if (f.closingSoon) list = list.filter(isClosingSoon);

  const sort = f.sort || "newest";
  list = [...list].sort((a, b) => {
    if (sort === "closing") return new Date(a.validUntil) - new Date(b.validUntil);
    if (sort === "quantity") return b.quantity - a.quantity;
    if (sort === "price") return (b.targetPrice || 0) - (a.targetPrice || 0);
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });
  return wait(clone(list));
}

export async function getSupplyRequest(id) {
  const r = _requests.find((x) => x.id === id);
  return wait(r ? clone(r) : null);
}

export async function getMyRequests(username) {
  return wait(clone(_requests.filter((r) => r.buyer === username)));
}

export async function getMyOffers(username) {
  const rows = [];
  _requests.forEach((r) => r.offers.forEach((o) => {
    if (o.seller === username) rows.push({ ...o, request: { id: r.id, commodity: r.commodity, buyerName: r.buyerName } });
  }));
  return wait(clone(rows));
}

// ── mutations ──────────────────────────────────────────────────────────────
export async function createSupplyRequest(form, user) {
  const id = nextReqId();
  const req = withBuyer({
    ...form,
    id,
    buyer: user.username,
    region: form.region || regionForDistrict(form.deliveryDistrict) || "",
    status: "live",
    createdAt: "2026-06-04",
    offers: [],
  });
  _requests = [req, ..._requests];
  pushNotification(user.username, {
    type: "sourcing",
    message: `Your supply request ${id} is now live. You will be notified as suppliers respond.`,
  });
  return wait(clone(req));
}

export async function postOffer(reqId, form, user) {
  const req = _requests.find((r) => r.id === reqId);
  if (!req) return wait(null);
  const id = nextOfferId();
  const o = offer({ ...form, id, seller: user.username, sellerName: user.name, sellerTradeId: user.tradeId, status: "submitted" });
  req.offers.push(o);
  recomputeStatus(req);
  pushNotification(req.buyer, {
    type: "offer",
    message: `${user.name} (Trade ID ${user.tradeId}) has offered ${form.quantity} ${req.unit} ${req.commodity} at UGX ${Number(form.pricePerUnit).toLocaleString()}/${req.unit} against your request ${reqId}.`,
  });
  return wait(clone(o));
}

export async function counterOffer(reqId, offerId, counter, user) {
  const req = _requests.find((r) => r.id === reqId);
  const o = req && req.offers.find((x) => x.id === offerId);
  if (!o) return wait(null);
  if ((o.counters || []).length >= 3) return wait({ error: "Maximum of 3 counter rounds reached." });
  o.counters = [...(o.counters || []), { by: user.username, ...counter, at: "2026-06-04" }];
  o.status = "countered";
  const notifyTo = user.username === req.buyer ? o.seller : req.buyer;
  pushNotification(notifyTo, { type: "offer", message: `Counter-offer on ${reqId}: UGX ${Number(counter.pricePerUnit).toLocaleString()}/${req.unit} for ${counter.quantity} ${req.unit}.` });
  return wait(clone(o));
}

export async function declineOffer(reqId, offerId) {
  const req = _requests.find((r) => r.id === reqId);
  const o = req && req.offers.find((x) => x.id === offerId);
  if (!o) return wait(null);
  o.status = "declined";
  pushNotification(o.seller, { type: "offer", message: `Your offer ${offerId} on ${reqId} was declined.` });
  return wait(clone(o));
}

// Accepting an offer converts it to an order entering the 8-step purchase flow
// at Step 3 (Quotation confirmed), linked to the parent request (spec 16.5).
export async function acceptOffer(reqId, offerId, user) {
  const req = _requests.find((r) => r.id === reqId);
  const o = req && req.offers.find((x) => x.id === offerId);
  if (!o) return wait(null);
  o.status = "accepted";
  recomputeStatus(req);
  const orderId = `ORD-${reqId.replace("SRQ-", "")}-${o.id.slice(-4)}`;
  const order = {
    id: orderId,
    requestId: reqId,
    buyer: req.buyer, buyerName: req.buyerName,
    seller: o.seller, sellerName: o.sellerName || actorOf(o.seller).name,
    product: o.product, commodity: req.commodity,
    quantity: o.quantity, unit: req.unit, pricePerUnit: o.pricePerUnit,
    total: (o.quantity || 0) * (o.pricePerUnit || 0),
    status: "quotation_confirmed", step: 3, createdAt: "2026-06-04",
  };
  _orders = [order, ..._orders];
  pushNotification(o.seller, { type: "order", message: `Your offer ${offerId} was accepted. Order ${orderId} created and is now at Step 3 (Quotation confirmed).` });
  pushNotification(req.buyer, { type: "order", message: `You accepted offer ${offerId} on ${reqId}. Order ${orderId} created in your purchase flow (Step 3).` });
  return wait({ order: clone(order), request: clone(req) });
}

// Edit a request the buyer owns (only safe fields; offers/buyer untouched).
export async function updateSupplyRequest(id, changes) {
  const req = _requests.find((r) => r.id === id);
  if (!req) return wait(null);
  const editable = [
    "commodity", "quantity", "unit", "recurrence", "grade", "certifications", "packaging",
    "targetPrice", "deliveryDistrict", "deliveryWindow", "deliveryMode", "transportTerms",
    "customs", "paymentMethods", "description", "visibility",
    "deliveryStore", "deliveryAddress", "deliveryCity", "deliveryCountry",
  ];
  editable.forEach((k) => { if (k in changes) req[k] = changes[k]; });
  req.region = regionForDistrict(req.deliveryDistrict) || req.region || "";
  return wait(clone(req));
}

// Deactivate/unpublish (hide from the open board) or reactivate a request.
export async function setRequestActive(id, active) {
  const req = _requests.find((r) => r.id === id);
  if (!req) return wait(null);
  if (active) { req.published = true; recomputeStatus(req); }
  else { req.published = false; req.status = "closed"; }
  return wait(clone(req));
}

export async function getOrdersFromSourcing(username) {
  return wait(clone(_orders.filter((o) => o.buyer === username || o.seller === username)));
}
