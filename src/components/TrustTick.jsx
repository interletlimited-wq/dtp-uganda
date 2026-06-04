import { BadgeCheck } from "lucide-react";
import { getTrustTick, getSellerRatingCount } from "../data/demo";

/**
 * Public trust tick (A8 / A10) — the ONLY verification signal shown to the
 * public. Identity verification (NIRA / URA / URSB / International) is private
 * and must never appear on public profiles or listings.
 *
 * Rendered as a Facebook/Twitter-style verified badge: a solid gray or green
 * seal with a white check, sized to sit inline next to the actor's name.
 *
 * Pass either `seller` (an actor key, count derived) or an explicit
 * `ratingCount`. Set `withLabel` to show the accompanying text label.
 */
export default function TrustTick({
  seller,
  ratingCount,
  size = 18,
  withLabel = false,
  className = "",
}) {
  const count = ratingCount != null ? ratingCount : getSellerRatingCount(seller);
  const level = getTrustTick(count);
  const isGreen = level === "green";

  const color = isGreen ? "text-green-500" : "text-gray-400";
  const tip = isGreen
    ? "Green trust tick — rated 4★ or above by 100+ verified trading partners"
    : "Gray trust tick — trust rating earned from verified transactions";
  const labelText = isGreen ? "Trusted seller" : "Trust rating";

  return (
    <span title={tip} className={`inline-flex items-center gap-1.5 align-middle ${className}`}>
      <BadgeCheck
        size={size}
        className={`${color} flex-shrink-0`}
        fill="currentColor"
        stroke="#ffffff"
        strokeWidth={2.25}
        aria-label={tip}
      />
      {withLabel && (
        <span className={`text-xs font-semibold ${isGreen ? "text-green-600" : "text-warm-text"}`}>
          {labelText}
        </span>
      )}
    </span>
  );
}
