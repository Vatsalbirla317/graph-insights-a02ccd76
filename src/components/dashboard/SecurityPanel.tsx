import { securityRisks } from "@/data/mockData";
import { Shield, AlertTriangle, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const severityColors = {
  High: "hsl(var(--risk-high))",
  Medium: "hsl(var(--risk-medium))",
  Low: "hsl(var(--risk-low))",
};

const data = [
  { name: "High", value: securityRisks.filter(r => r.severity === "High").length, color: severityColors.High },
  { name: "Medium", value: securityRisks.filter(r => r.severity === "Medium").length, color: severityColors.Medium },
  { name: "Low", value: 2, color: severityColors.Low },
];

const SecurityPanel = () => {
  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Security Intelligence</h2>
        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Risk breakdown chart */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={22} outerRadius={36} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(240, 18%, 7%)", border: "1px solid hsl(var(--border))", borderRadius: "4px", fontSize: "11px", color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1.5">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2 text-[11px]">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-semibold text-foreground font-data">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top risks — Datadog alert style */}
      <div className="space-y-0.5">
        {securityRisks.map((risk) => (
          <div key={risk.id} className="table-row group">
            <span className={`h-2 w-2 rounded-sm flex-shrink-0 ${risk.severity === "High" ? "bg-severity-high" : risk.severity === "Medium" ? "bg-severity-medium" : "bg-severity-low"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{risk.type}</p>
              <p className="text-[10px] text-muted-foreground truncate">{risk.resourceName}</p>
            </div>
            <span className={`text-[10px] font-data font-medium ${risk.severity === "High" ? "severity-high" : risk.severity === "Medium" ? "severity-medium" : "severity-low"}`}>
              {risk.severity.toUpperCase()}
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityPanel;
