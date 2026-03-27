import { complianceWorkflows, ComplianceWorkflow } from "@/data/impactData";
import { CheckCircle, XCircle, Loader2, Clock, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const statusConfig = {
  Completed: { icon: CheckCircle, color: "severity-low", bg: "bg-[hsl(var(--risk-low)/0.12)]" },
  Running: { icon: Loader2, color: "text-primary", bg: "bg-primary/10" },
  Failed: { icon: XCircle, color: "severity-high", bg: "bg-[hsl(var(--risk-high)/0.12)]" },
  Pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-secondary" },
};

const ComplianceWorkflows = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Compliance Automation</h2>
        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Summary — compact metric row */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {(["Completed", "Running", "Failed", "Pending"] as const).map(status => {
          const count = complianceWorkflows.filter(w => w.status === status).length;
          const cfg = statusConfig[status];
          return (
            <div key={status} className={`${cfg.bg} rounded p-2 text-center`}>
              <p className={`text-base font-bold font-data ${cfg.color}`}>{count}</p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Workflow list */}
      <div className="space-y-0 max-h-[340px] overflow-y-auto scrollbar-thin">
        {complianceWorkflows.map(wf => {
          const cfg = statusConfig[wf.status];
          const StatusIcon = cfg.icon;
          const isExpanded = expandedId === wf.id;

          return (
            <div key={wf.id} className="border-b border-border/30 last:border-0">
              <div
                onClick={() => setExpandedId(isExpanded ? null : wf.id)}
                className="flex items-center gap-2.5 px-2 py-2.5 cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <StatusIcon className={`h-3.5 w-3.5 flex-shrink-0 ${cfg.color} ${wf.status === "Running" ? "animate-spin" : ""}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-data uppercase">{wf.framework}</span>
                    <p className="text-xs font-medium text-foreground truncate">{wf.workflow}</p>
                  </div>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 rounded-sm bg-secondary">
                      <div
                        className={`h-full rounded-sm transition-all duration-1000 ${wf.status === "Failed" ? "bg-severity-high" : wf.status === "Running" ? "bg-primary" : "bg-severity-low"}`}
                        style={{ width: `${wf.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-data w-8">{wf.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {wf.findings > 0 && (
                    <span className="text-[10px] font-data px-1.5 py-0.5 rounded bg-[hsl(var(--risk-medium)/0.12)] severity-medium">
                      {wf.findings} findings
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 animate-fade-in">
                  <div className="border-t border-border/30 pt-2.5 space-y-1.5">
                    {wf.details.map((d, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{d}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <button className="btn-action btn-action-primary">
                        Generate Evidence Report
                      </button>
                      {wf.status === "Failed" && (
                        <button className="btn-action btn-action-danger">
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
