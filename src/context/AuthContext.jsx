import { createContext, useContext, useState } from "react";
import { SAMPLE_ACCOUNTS } from "../data/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("dtp_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [registeredUsers, setRegisteredUsers] = useState([...SAMPLE_ACCOUNTS]);
  const [regData, setRegData] = useState({
    step: 0, role: "", secondaryRoles: [], username: "", phone: "",
    phone2: "", email: "", password: "", type: "", entityType: "",
    grade: "", sector: "", verifyMethod: "nin", nin: "", tin: "", brn: "",
    verified: false, verifiedName: "", products: [], districts: [],
    // FBR (Foreign Buyer / International Trader) - international identity path
    country: "", natureOfBusiness: [], passport: "", intlReg: "", intlTin: "",
    verifyCountry: "", verifiedLabel: "",
    tradeId: "", phase: 1,
  });

  function login(username, password) {
    const account = registeredUsers.find(
      a => (a.username === username.trim() || a.phone === username.trim()) && a.password === password
    );
    if (account) {
      setUser(account);
      try { localStorage.setItem("dtp_user", JSON.stringify(account)); } catch {}
      return { success: true, account };
    }
    return { success: false, error: "Incorrect username or password. Please try again." };
  }

  function logout() { setUser(null); try { localStorage.removeItem("dtp_user"); } catch {} }

  function updateReg(fields) {
    setRegData(prev => ({ ...prev, ...fields }));
    if (fields.username && fields.password && fields.role) {
      const newAccount = {
        username: fields.username,
        name: fields.username,
        role: fields.role,
        grade: "",
        tradeId: null,
        district: "",
        products: [],
        type: fields.type || "individual",
        verified: null,
        phone: fields.phone || "",
        email: fields.email || "",
        password: fields.password,
        phase: 1,
      };
      setRegisteredUsers(prev => {
        const exists = prev.find(u => u.username === fields.username);
        if (exists) return prev;
        return [...prev, newAccount];
      });
    }
  }

  function completeRegistration(tradeId, extra = {}) {
    // Merge any freshly-collected data (passed from the profile-setup step) over
    // regData so the final account reflects what was just entered, not a stale
    // snapshot from before the last state update.
    const reg = { ...regData, ...extra };
    const isFBR = reg.role === "FBR";
    // FBR actors hold no Ugandan identity - they are verified via an international
    // path. Domestic actors verify against NIRA / URA / URSB.
    const verified = isFBR
      ? "International"
      : reg.verifyMethod === "nin" ? "NIRA" : reg.verifyMethod === "tin" ? "URA" : "URSB";
    const updated = {
      username: reg.username,
      name: reg.verifiedName || reg.username,
      role: reg.role,
      secondaryRoles: reg.secondaryRoles,
      grade: reg.grade,
      tradeId,
      district: reg.districts[0]?.name || "",
      products: reg.products,
      type: reg.type,
      verified,
      // Private detail shown only on the actor's own profile and to admins.
      verifiedLabel: isFBR ? reg.verifiedLabel : `${verified} Verified`,
      country: reg.country || "",
      natureOfBusiness: reg.natureOfBusiness || [],
      phone: reg.phone,
      password: reg.password,
      phase: 2,
      // Foreign actor contact & location details (captured in place of Ugandan regions).
      ...(isFBR ? {
        contactPerson: reg.contactPerson || "",
        contactEmail: reg.contactEmail || "",
        contactPhone: reg.contactPhone || "",
        website: reg.website || "",
        addressLine: reg.addressLine || "",
        city: reg.city || "",
        stateProvince: reg.stateProvince || "",
        postalCode: reg.postalCode || "",
      } : {}),
    };
    setRegisteredUsers(prev => prev.map(u => u.username === updated.username ? updated : u));
    setUser(updated);
    try { localStorage.setItem("dtp_user", JSON.stringify(updated)); } catch {}
    setRegData(prev => ({ ...prev, tradeId, phase: 2 }));
  }

  function isProfileComplete() {
    if (!user) return false;
    if (user.role === "ADMIN" || user.role === "GOU") return true;
    return !!user.tradeId;
  }

  function getTradeIdLabel() {
    if (!user) return "";
    return user.role === "CSM" ? "Consumer ID" : "Trade ID";
  }

  return (
    <AuthContext.Provider value={{
      user, regData, login, logout, updateReg,
      completeRegistration, isProfileComplete, getTradeIdLabel,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
