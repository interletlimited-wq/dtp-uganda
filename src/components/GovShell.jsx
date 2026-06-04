import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import DashboardLayout from "./layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";

// Renders government pages inside the dashboard shell for logged-in analysts,
// or the public shell (PublicNav + PublicFooter) for everyone else.
export default function GovShell({ children }) {
  const { user } = useAuth();
  const inner = <div className="max-w-6xl mx-auto w-full px-4 md:px-6 py-6">{children}</div>;

  if (user) return <DashboardLayout>{inner}</DashboardLayout>;

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <PublicNav activeRoute="/government-analytics" />
      <main className="flex-1">{inner}</main>
      <PublicFooter />
    </div>
  );
}
