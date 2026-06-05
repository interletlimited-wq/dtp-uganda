import DashboardLayout from "../components/layout/DashboardLayout";
import { Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon({ title = "This module", description }) {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-warm-bg border border-warm-border rounded-2xl flex items-center justify-center mb-5">
          <Clock size={28} className="text-warm-muted" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">{title}</h2>
        <p className="text-warm-text text-sm text-center max-w-md mb-4">
          {description || "This module is being built and will be available shortly. All core functionality is on track for the next release."}
        </p>
        <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark bg-gold-light border border-gold-border px-3 py-1 rounded-full mb-6">
          Module under development
        </span>
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-medium text-gold hover:underline">
          <ArrowLeft size={14} /> Back to dashboard
        </button>
      </div>
    </DashboardLayout>
  );
}
