import { attackSurfaces, AttackSurface } from "@/data/impactData";
import { Globe, Lock, Server, Shield, AlertTriangle, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";

const exposureIcons = { Public: Globe, Private: Lock, Internal: Server };
const statusColors = {
  Critical: { bg: "bg-[hsl(var(--risk-high)/0.15)]", text: "severity-high" },
  Vulnerable: { bg: "bg-[hsl(var(--risk-medium)/0.15)]", text: "severity-medium" },
  Secure: { bg: "bg-[hsl(var(--risk-low)/0.15)]", text: "severity-low" },
};

const AttackSurfaceExplorer = () => {
  const [selected, setSelected] = useState<AttackSurface | null>(null);
  const [filterExposure, setFilterExposure] = useState<string>("All");

  const filtered = filterExposure === "All" ? attackSurfaces : attackSurfaces.filter(a => a.exposure === filterExposure);
  const totalVulns = attackSurfaces.reduce((s, a) => s + a.vulnerabilities, 0);
  const publicCount = attackSurfaces.filter(a => a.exposure === "Public").length;

  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Attack Surface Explorer</h2>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold severity-high">{totalVulns}</p>
          <p className="text-[10px] text-muted-foreground">Vulnerabilities</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold severity-medium">{publicCount}</p>
          <p className="text-[10px] text-muted-foreground">Public Endpoints</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-primary">{attackSurfaces.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Services</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-3">
        {["All", "Public", "Private", "Internal"].map(f => (
          <button
            key={f}
            onClick={() => setFilterExposure(f)}
            className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${filterExposure === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Service list */}
      <div className="space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-thin">
        {filtered.map(svc => {
          const ExpIcon = exposureIcons[svc.exposure];
          const sc = statusColors[svc.status];
          return (
            <div
              key={svc.id}
              onClick={() => setSelected(selected?.id === svc.id ? null : svc)}
              className={`p-2.5 rounded-lg cursor-pointer transition-colors ${selected?.id === svc.id ? "bg-secondary" : "hover:bg-secondary/50"}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded ${sc.bg}`}>
                  <ExpIcon className={`h-3.5 w-3.5 ${sc.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{svc.service}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{svc.exposure}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className={`text-[10px] ${svc.sensitivity === "PHI" || svc.sensitivity === "PII" ? "severity-medium" : "text-muted-foreground"}`}>{svc.sensitivity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{svc.status}</span>
                </div>
              </div>

              {selected?.id === svc.id && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-2 animate-fade-in">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground">CVSS Score</p>
                      <p className={`text-sm font-bold ${svc.cvss >= 7 ? "severity-high" : svc.cvss >= 4 ? "severity-medium" : "severity-low"}`}>{svc.cvss || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Open Ports</p>
                      <p className="text-sm font-bold text-foreground">{svc.ports.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Last Scan</p>
                      <p className="text-sm font-bold text-foreground">{svc.lastScan}</p>
                    </div>
                  </div>
                  {svc.vulnerabilities > 0 && (
                    <button className="w-full text-[10px] px-3 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center gap-1">
                      <Shield className="h-3 w-3" /> View Remediation Steps
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttackSurfaceExplorer;
