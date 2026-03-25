import { complianceWorkflows, ComplianceWorkflow } from "@/data/impactData";
import { CheckCircle, XCircle, Loader2, Clock, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const statusConfig = {
  Completed: { icon: CheckCircle, color: "severity-low", bg: "bg-[hsl(var(--risk-low)/0.15)]" },
  Running: { icon: Loader2, color: "text-primary", bg: "bg-primary/10" },
  Failed: { icon: XCircle, color: "severity-high", bg: "bg-[hsl(var(--risk-high)/0.15)]" },
  Pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-secondary" },
};

const ComplianceWorkflows = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Compliance Automation</h2>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {(["Completed", "Running", "Failed", "Pending"] as const).map(status => {
          const count = complianceWorkflows.filter(w => w.status === status).length;
          const cfg = statusConfig[status];
          return (
            <div key={status} className={`${cfg.bg} rounded-lg p-2 text-center`}>
              <p className={`text-lg font-bold ${cfg.color}`}>{count}</p>
              <p className="text-[9px] text-muted-foreground">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Workflow list */}
      <div className="space-y-1.5 max-h-[340px] overflow-y-auto scrollbar-thin">
        {complianceWorkflows.map(wf => {
          const cfg = statusConfig[wf.status];
          const StatusIcon = cfg.icon;
          const isExpanded = expandedId === wf.id;

          return (
            <div key={wf.id} className="rounded-lg bg-secondary/30 overflow-hidden">
              <div
                onClick={() => setExpandedId(isExpanded ? null : wf.id)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <StatusIcon className={`h-4 w-4 flex-shrink-0 ${cfg.color} ${wf.status === "Running" ? "animate-spin" : ""}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{wf.framework}</span>
                    <p className="text-xs font-medium text-foreground truncate">{wf.workflow}</p>
                  </div>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${wf.status === "Failed" ? "bg-severity-high" : wf.status === "Running" ? "bg-primary" : "bg-severity-low"}`}
                        style={{ width: `${wf.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8">{wf.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {wf.findings > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--risk-medium)/0.15)] severity-medium">
                      {wf.findings} findings
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 animate-fade-in">
                  <div className="border-t border-border/50 pt-2.5 space-y-1.5">
                    {wf.details.map((d, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{d}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <button className="text-[10px] px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        Generate Evidence Report
                      </button>
                      {wf.status === "Failed" && (
                        <button className="text-[10px] px-2.5 py-1 rounded bg-[hsl(var(--risk-high)/0.1)] severity-high hover:bg-[hsl(var(--risk-high)/0.2)] transition-colors">
                          Re-run Workflow
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplianceWorkflows;
