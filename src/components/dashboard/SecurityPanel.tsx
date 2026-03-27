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
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Security Intelligence</h2>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Risk breakdown chart */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-24 h-24">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(228, 22%, 8%)", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1.5">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-semibold text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top risks */}
      <div className="space-y-2">
        {securityRisks.map((risk, i) => (
          <div key={risk.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
            <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${risk.severity === "High" ? "severity-high" : risk.severity === "Medium" ? "severity-medium" : "severity-low"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{risk.type}</p>
              <p className="text-[10px] text-muted-foreground truncate">{risk.resourceName}</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityPanel;
