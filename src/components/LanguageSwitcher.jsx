import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLang } from "../context/LanguageContext";

export default function LanguageSwitcher({ dark = true }) {
  const { lang, switchLang, languages } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={"flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-xs font-bold " +
          (dark
            ? "bg-white/8 text-white/60 hover:text-white border-white/15 hover:border-white/30"
            : "bg-warm-bg text-warm-text border-warm-border hover:border-ink"
          )
        }
        title="Switch language"
      >
        <Globe size={13} />
        <span className="hidden sm:block">{lang.code}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-warm-border rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-warm-border">
              <div className="text-[10px] font-bold text-warm-muted uppercase tracking-wider">Select language</div>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => { switchLang(l.code); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-warm-bg transition-colors text-left"
                >
                  <div>
                    <span className={lang.code === l.code ? "font-bold text-ink" : "text-warm-text"}>{l.native}</span>
                    {l.native !== l.label && <span className="text-warm-muted text-xs ml-1.5">({l.label})</span>}
                  </div>
                  {lang.code === l.code && <Check size={13} className="text-gold flex-shrink-0" />}
                </button>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-warm-border bg-warm-bg">
              <p className="text-[10px] text-warm-muted">Full translations available in Phase 2</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
