import { createContext, useContext, useState, useEffect } from "react";

export const LANGUAGES = [
  { code: "EN",  label: "English",      native: "English"      },
  { code: "SW",  label: "Kiswahili",    native: "Kiswahili"    },
  { code: "LG",  label: "Luganda",      native: "Luganda"      },
  { code: "LS",  label: "Lusoga",       native: "Lusoga"       },
  { code: "RNK", label: "Runyankole",   native: "Runyankole"   },
  { code: "RKG", label: "Rukiga",       native: "Rukiga"       },
  { code: "RFM", label: "Rufumbira",    native: "Rufumbira"    },
  { code: "RNY", label: "Runyoro",      native: "Runyoro"      },
  { code: "RTO", label: "Rutooro",      native: "Rutooro"      },
  { code: "AC",  label: "Acholi",       native: "Acholi"       },
  { code: "LNG", label: "Langi",        native: "Langi"        },
  { code: "LGB", label: "Lugbara",      native: "Lugbara"      },
  { code: "ARG", label: "Aringa",       native: "Aringa"       },
  { code: "MAD", label: "Madi",         native: "Madi"         },
  { code: "AT",  label: "Ateso",        native: "Ateso"        },
  { code: "KAR", label: "Karimojong",   native: "Ng'akarimojong" },
  { code: "KUM", label: "Kumam",        native: "Kumam"        },
  { code: "SAM", label: "Lusamia",      native: "Lusamia"      },
  { code: "GWE", label: "Lugwere",      native: "Lugwere"      },
  { code: "NYR", label: "Kinyarwanda",  native: "Kinyarwanda"  },
  { code: "ALU", label: "Alur",         native: "Alur"         },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("dtp_lang");
    return LANGUAGES.find(l => l.code === saved) || LANGUAGES[0];
  });

  function switchLang(code) {
    const found = LANGUAGES.find(l => l.code === code);
    if (found) {
      setLang(found);
      localStorage.setItem("dtp_lang", code);
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, switchLang, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
