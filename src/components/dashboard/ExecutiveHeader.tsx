import { Shield, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { resourceCounts } from "@/data/mockData";
import { useEffect, useState } from "react";

const StatCard = ({ icon: Icon, label, value, color }: { icon: typeof Shield; label: string; value: string | number; color: string }) => (
  <div className="glass-card stat-glow p-4 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const ExecutiveHeader = () => {
  const [lastScan, setLastScan] = useState("Just now");
  const [dot, setDot] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setDot(d => !d), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Graph Resource Engine</h1>
          </div>
          <p className="text-muted-foreground text-sm">AI Infrastructure Intelligence & Security Platform</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`h-2 w-2 rounded-full bg-node-storage ${dot ? "opacity-100" : "opacity-40"} transition-opacity`} />
          <span>Live Monitoring</span>
          <span className="mx-2">•</span>
          <span>Last scan: {lastScan}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Total Resources" value={resourceCounts.totalResources} color="bg-secondary text-primary" />
        <StatCard icon={AlertTriangle} label="Security Risks" value={resourceCounts.securityRisks} color="bg-[hsl(var(--risk-high)/0.15)] severity-high" />
        <StatCard icon={CheckCircle} label="Compliance Score" value={`${resourceCounts.complianceScore}%`} color="bg-[hsl(var(--compliant)/0.15)] severity-low" />
        <StatCard icon={Shield} label="AI Services" value={resourceCounts.aiServices} color="bg-[hsl(var(--node-ai)/0.15)] text-primary" />
      </div>
    </header>
  );
};

export default ExecutiveHeader;
