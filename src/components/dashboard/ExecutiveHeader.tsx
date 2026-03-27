import { Shield, Activity, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import { resourceCounts } from "@/data/mockData";
import { useEffect, useState } from "react";

const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: typeof Shield; label: string; value: string | number; trend?: string; color: string }) => (
  <div className="glass-card stat-glow p-3 flex items-center gap-3">
    <div className={`p-2 rounded ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-bold text-foreground font-data">{value}</p>
        {trend && <span className="text-[10px] text-[hsl(var(--status-ok))] font-medium">{trend}</span>}
      </div>
    </div>
  </div>
);

const ExecutiveHeader = () => {
  const [dot, setDot] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setDot(d => !d), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="mb-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <BarChart3 className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">Graph Resource Engine</h1>
            <p className="text-muted-foreground text-[11px]">Infrastructure Intelligence · Security · Compliance</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[hsl(var(--status-ok)/0.1)] text-[hsl(var(--status-ok))]">
            <span className={`h-1.5 w-1.5 rounded-full bg-[hsl(var(--status-ok))] ${dot ? "opacity-100" : "opacity-40"} transition-opacity`} />
            <span className="font-medium">All Systems Operational</span>
          </div>
          <span className="text-muted-foreground">Last scan: <span className="text-foreground font-data">2s ago</span></span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Activity} label="Total Resources" value={resourceCounts.totalResources} trend="↑ 2" color="bg-secondary text-primary" />
        <StatCard icon={AlertTriangle} label="Security Risks" value={resourceCounts.securityRisks} color="bg-[hsl(var(--risk-high)/0.12)] severity-high" />
        <StatCard icon={CheckCircle} label="Compliance" value={`${resourceCounts.complianceScore}%`} trend="↑ 3%" color="bg-[hsl(var(--compliant)/0.12)] severity-low" />
        <StatCard icon={Shield} label="AI Services" value={resourceCounts.aiServices} color="bg-primary/10 text-primary" />
      </div>
    </header>
  );
};

export default ExecutiveHeader;
