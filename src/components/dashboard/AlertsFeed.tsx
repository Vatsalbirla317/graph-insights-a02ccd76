import { alerts } from "@/data/mockData";
import { Bell } from "lucide-react";
import { useState } from "react";

type SeverityFilter = "All" | "High" | "Medium" | "Low";

const AlertsFeed = () => {
  const [filter, setFilter] = useState<SeverityFilter>("All");
  const filtered = filter === "All" ? alerts : alerts.filter(a => a.severity === filter);

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Live Alerts</h2>
          <span className="h-1.5 w-1.5 rounded-full bg-severity-high animate-pulse-glow" />
        </div>
        <div className="flex gap-0.5 bg-secondary rounded p-0.5">
          {(["All", "High", "Medium", "Low"] as SeverityFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pill-filter ${filter === f ? "pill-filter-active" : "pill-filter-inactive"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-0 max-h-[320px] overflow-y-auto scrollbar-thin">
        {filtered.map((alert, i) => (
          <div
            key={alert.id}
            className="table-row"
          >
            <span className={`h-2 w-2 rounded-sm flex-shrink-0 ${alert.severity === "High" ? "bg-severity-high" : alert.severity === "Medium" ? "bg-severity-medium" : "bg-severity-low"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground leading-relaxed">{alert.message}</p>
              <p className="text-[10px] text-muted-foreground font-data mt-0.5">{alert.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsFeed;
