import { attackSurfaces, AttackSurface } from "@/data/impactData";
import { Globe, Lock, Server, Shield } from "lucide-react";
import { useState } from "react";

const exposureIcons = { Public: Globe, Private: Lock, Internal: Server };
const statusColors = {
  Critical: { bg: "bg-[hsl(var(--risk-high)/0.12)]", text: "severity-high" },
  Vulnerable: { bg: "bg-[hsl(var(--risk-medium)/0.12)]", text: "severity-medium" },
  Secure: { bg: "bg-[hsl(var(--risk-low)/0.12)]", text: "severity-low" },
};

const AttackSurfaceExplorer = () => {
  const [selected, setSelected] = useState<AttackSurface | null>(null);
  const [filterExposure, setFilterExposure] = useState<string>("All");

  const filtered = filterExposure === "All" ? attackSurfaces : attackSurfaces.filter(a => a.exposure === filterExposure);
  const totalVulns = attackSurfaces.reduce((s, a) => s + a.vulnerabilities, 0);
  const publicCount = attackSurfaces.filter(a => a.exposure === "Public").length;

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Attack Surface Explorer</h2>
        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Summary stats — compact Datadog metric style */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="metric-card">
          <p className="text-lg font-bold font-data severity-high">{totalVulns}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Vulnerabilities</p>
        </div>
        <div className="metric-card">
          <p className="text-lg font-bold font-data severity-medium">{publicCount}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Public</p>
        </div>
        <div className="metric-card">
          <p className="text-lg font-bold font-data text-primary">{attackSurfaces.length}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Services</p>
        </div>
      </div>

      {/* Filters — tab bar style */}
      <div className="flex gap-0.5 mb-3 bg-secondary rounded p-0.5">
        {["All", "Public", "Private", "Internal"].map(f => (
          <button
            key={f}
            onClick={() => setFilterExposure(f)}
            className={`pill-filter flex-1 text-center ${filterExposure === f ? "pill-filter-active" : "pill-filter-inactive"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Service list */}
      <div className="space-y-0 max-h-[300px] overflow-y-auto scrollbar-thin">
        {filtered.map(svc => {
          const ExpIcon = exposureIcons[svc.exposure];
          const sc = statusColors[svc.status];
          return (
            <div
              key={svc.id}
              onClick={() => setSelected(selected?.id === svc.id ? null : svc)}
              className={`table-row !border-border/20 ${selected?.id === svc.id ? "bg-secondary/80" : ""}`}
            >
              <div className={`p-1 rounded ${sc.bg}`}>
                <ExpIcon className={`h-3 w-3 ${sc.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{svc.service}</p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground font-data">{svc.exposure}</span>
                  <span className={`text-[10px] font-data ${svc.sensitivity === "PHI" || svc.sensitivity === "PII" ? "severity-medium" : "text-muted-foreground"}`}>{svc.sensitivity}</span>
                </div>
              </div>
              <span className={`text-[10px] font-data font-medium px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>{svc.status.toUpperCase()}</span>
            </div>
          );
        })}

        {/* Expanded detail for selected */}
        {selected && (
          <div className="px-3 pb-3 pt-2 bg-secondary/50 rounded-b animate-fade-in">
            <div className="grid grid-cols-3 gap-2 text-center mb-2">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase">CVSS</p>
                <p className={`text-sm font-bold font-data ${selected.cvss >= 7 ? "severity-high" : selected.cvss >= 4 ? "severity-medium" : "severity-low"}`}>{selected.cvss || "N/A"}</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase">Ports</p>
                <p className="text-sm font-bold font-data text-foreground">{selected.ports.join(", ")}</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase">Last Scan</p>
                <p className="text-sm font-bold font-data text-foreground">{selected.lastScan}</p>
              </div>
            </div>
            {selected.vulnerabilities > 0 && (
              <button className="w-full btn-action btn-action-primary flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" /> View Remediation
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttackSurfaceExplorer;
