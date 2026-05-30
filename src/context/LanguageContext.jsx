import { createContext, useContext, useState, useEffect } from "react";

export const LANGUAGES = [
  { code: "EN",  label: "English",     native: "English"     },
  { code: "LG",  label: "Luganda",     native: "Luganda"     },
  { code: "SW",  label: "Kiswahili",   native: "Kiswahili"   },
  { code: "RN",  label: "Runyankole",  native: "Runyankole"  },
  { code: "AC",  label: "Acholi",      native: "Acholi"      },
  { code: "LNK", label: "Langi",       native: "Langi"       },
  { code: "ATS", label: "Ateso",       native: "Ateso"       },
  { code: "NYR", label: "Kinyarwanda", native: "Kinyarwanda" },
  { code: "KK",  label: "Kakwa",       native: "Kakwa"       },
  { code: "FR",  label: "Français",    native: "Français"    },
  { code: "AR",  label: "Arabic",      native: "العربية"     },
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
