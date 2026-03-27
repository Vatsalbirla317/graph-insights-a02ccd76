import { Resource, resources, relationships } from "@/data/mockData";
import { impactAnalyses, defaultImpact } from "@/data/impactData";
import { X, TrendingDown, Users, AlertTriangle, Shield, Zap, ArrowDown, Target } from "lucide-react";
import { useState } from "react";

interface Props {
  resource: Resource;
  onClose: () => void;
}

const NODE_COLORS: Record<Resource["type"], string> = {
  AI_Service: "hsl(var(--node-ai))",
  Storage: "hsl(var(--node-storage))",
  User: "hsl(var(--node-user))",
  Risk: "hsl(var(--node-risk))",
};

const ImpactAnalysisModal = ({ resource, onClose }: Props) => {
  const analysis = impactAnalyses[resource.id] || { ...defaultImpact, resourceId: resource.id };
  const [activeTab, setActiveTab] = useState<"impact" | "whatif" | "actions">("impact");

  const tabs = [
    { key: "impact" as const, label: "Business Impact" },
    { key: "whatif" as const, label: "What-If" },
    { key: "actions" as const, label: "Recommendations" },
  ];

  const critColor = analysis.businessImpact.criticality === "HIGH"
    ? "severity-high" : analysis.businessImpact.criticality === "MEDIUM"
    ? "severity-medium" : "severity-low";

  const critBg = analysis.businessImpact.criticality === "HIGH"
    ? "bg-[hsl(var(--risk-high)/0.12)]" : analysis.businessImpact.criticality === "MEDIUM"
    ? "bg-[hsl(var(--risk-medium)/0.12)]" : "bg-[hsl(var(--risk-low)/0.12)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto glass-card border border-border p-5 animate-fade-in scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-data mb-1">Impact Analysis</p>
            <h2 className="text-lg font-bold text-foreground">{resource.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[10px] font-data font-semibold px-2 py-0.5 rounded ${critBg} ${critColor}`}>
                {analysis.businessImpact.criticality} CRITICALITY
              </span>
              <span className="text-[11px] text-muted-foreground">{resource.description}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
          {[
            { icon: TrendingDown, label: "Revenue Risk", value: analysis.businessImpact.revenueRisk, color: "severity-high" },
            { icon: Users, label: "Users Affected", value: analysis.businessImpact.usersAffected.toLocaleString(), color: "text-primary" },
            { icon: Shield, label: "Compliance Risk", value: analysis.businessImpact.complianceRisk, color: "severity-medium" },
            { icon: Zap, label: "Downtime Cost", value: analysis.businessImpact.downtimeCost, color: "severity-high" },
          ].map((m, i) => (
            <div key={i} className="metric-card !text-left !p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className={`h-3 w-3 ${m.color}`} />
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</span>
              </div>
              <p className={`text-sm font-bold font-data ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Dependency Chain */}
        <div className="mb-5 bg-secondary/30 rounded p-4">
          <h3 className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-3">Dependency Chain</h3>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex flex-col gap-1.5 items-end">
              {analysis.dependencies.upstream.map((d, i) => (
                <div key={i} className="text-[10px] font-data px-2.5 py-1 rounded bg-[hsl(var(--node-storage)/0.15)] text-foreground flex items-center gap-1.5">
                  <ArrowDown className="h-3 w-3 text-muted-foreground" />
                  {d}
                </div>
              ))}
            </div>
            <div className="mx-3 px-4 py-2.5 rounded bg-primary/15 border border-primary/25 text-sm font-semibold font-data text-primary text-center">
              {resource.name}
            </div>
            <div className="flex flex-col gap-1.5">
              {analysis.dependencies.downstream.map((d, i) => (
                <div key={i} className="text-[10px] font-data px-2.5 py-1 rounded bg-[hsl(var(--node-ai)/0.15)] text-foreground flex items-center gap-1.5">
                  {d}
                  <ArrowDown className="h-3 w-3 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
          {analysis.dependencies.singlePointsOfFailure.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-[11px]">
              <AlertTriangle className="h-3.5 w-3.5 severity-high" />
              <span className="severity-high font-medium font-data">SPOF:</span>
              <span className="text-foreground">{analysis.dependencies.singlePointsOfFailure.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Tabs — Datadog segmented control */}
        <div className="flex gap-0.5 mb-4 bg-secondary rounded p-0.5 w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`pill-filter ${activeTab === t.key ? "pill-filter-active" : "pill-filter-inactive"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "whatif" && (
          <div className="space-y-2">
            {analysis.whatIf.map((s, i) => (
              <div key={i} className="bg-secondary/50 rounded p-3">
                <div className="flex items-start justify-between mb-1.5">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    {s.scenario}
                  </h4>
                  <div className="flex gap-1.5">
                    <span className="text-[9px] font-data px-1.5 py-0.5 rounded bg-[hsl(var(--risk-medium)/0.12)] severity-medium uppercase">
                      {s.probability}
                    </span>
                    <span className="text-[9px] font-data px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {s.mitigationTime}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">{s.impact}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "actions" && (
          <div className="space-y-1">
            {analysis.recommendations.map((r, i) => (
              <div key={i} className="table-row group !rounded">
                <div className={`h-7 w-7 rounded flex items-center justify-center flex-shrink-0 ${
                  r.priority === "Critical" ? "bg-[hsl(var(--risk-high)/0.12)]" : r.priority === "High" ? "bg-[hsl(var(--risk-medium)/0.12)]" : "bg-secondary"
                }`}>
                  <span className={`text-[10px] font-bold font-data ${
                    r.priority === "Critical" ? "severity-high" : r.priority === "High" ? "severity-medium" : "text-muted-foreground"
                  }`}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{r.action}</p>
                  <p className="text-[10px] text-muted-foreground font-data">{r.impact} · {r.effort}</p>
                </div>
                <button className="btn-action btn-action-primary opacity-0 group-hover:opacity-100">
                  Execute
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "impact" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded p-4">
              <h4 className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-3">Technical Impact</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Service Availability", value: 85, risk: "medium" },
                  { label: "Data Integrity", value: 60, risk: "high" },
                  { label: "Performance", value: 92, risk: "low" },
                  { label: "Recovery Time", value: 45, risk: "high" },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className={`font-semibold font-data ${m.risk === "high" ? "severity-high" : m.risk === "medium" ? "severity-medium" : "severity-low"}`}>{m.value}%</span>
                    </div>
                    <div className="h-1 rounded-sm bg-secondary">
                      <div className={`h-full rounded-sm transition-all duration-1000 ${m.risk === "high" ? "bg-severity-high" : m.risk === "medium" ? "bg-severity-medium" : "bg-severity-low"}`}
                        style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-secondary/50 rounded p-4">
              <h4 className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-3">Risk Matrix</h4>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div />
                <div className="text-[8px] font-data text-muted-foreground py-1 uppercase">Medium</div>
                <div className="text-[8px] font-data text-muted-foreground py-1 uppercase">High</div>
                <div className="text-[8px] font-data text-muted-foreground py-1 text-right pr-2 uppercase">High</div>
                <div className="bg-[hsl(var(--risk-medium)/0.15)] rounded p-2 text-[10px] severity-medium font-data">Monitor</div>
                <div className="bg-[hsl(var(--risk-high)/0.2)] rounded p-2 text-[10px] severity-high font-bold font-data">⚠ Critical</div>
                <div className="text-[8px] font-data text-muted-foreground py-1 text-right pr-2 uppercase">Low</div>
                <div className="bg-[hsl(var(--risk-low)/0.15)] rounded p-2 text-[10px] severity-low font-data">Accept</div>
                <div className="bg-[hsl(var(--risk-medium)/0.15)] rounded p-2 text-[10px] severity-medium font-data">Monitor</div>
              </div>
              <p className="text-[9px] text-muted-foreground mt-3 text-center font-data">BUSINESS IMPACT ↔ TECHNICAL SEVERITY</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactAnalysisModal;
