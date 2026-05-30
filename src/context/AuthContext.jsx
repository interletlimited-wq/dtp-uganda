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

  function completeRegistration(tradeId) {
    const updated = {
      username: regData.username,
      name: regData.verifiedName || regData.username,
      role: regData.role,
      secondaryRoles: regData.secondaryRoles,
      grade: regData.grade,
      tradeId,
      district: regData.districts[0]?.name || "",
      products: regData.products,
      type: regData.type,
      verified: regData.verifyMethod === "nin" ? "NIRA" : regData.verifyMethod === "tin" ? "URA" : "URSB",
      phone: regData.phone,
      password: regData.password,
      phase: 2,
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
