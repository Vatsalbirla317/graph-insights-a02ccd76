import { alerts } from "@/data/mockData";
import { Bell, Filter } from "lucide-react";
import { useState } from "react";

type SeverityFilter = "All" | "High" | "Medium" | "Low";

const AlertsFeed = () => {
  const [filter, setFilter] = useState<SeverityFilter>("All");

  const filtered = filter === "All" ? alerts : alerts.filter(a => a.severity === filter);

  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Live Alerts</h2>
          <span className="h-2 w-2 rounded-full bg-severity-high animate-pulse-glow" />
        </div>
        <div className="flex gap-1">
          {(["All", "High", "Medium", "Low"] as SeverityFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
        {filtered.map((alert, i) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${alert.severity === "High" ? "bg-severity-high" : alert.severity === "Medium" ? "bg-severity-medium" : "bg-severity-low"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground leading-relaxed">{alert.message}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{alert.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsFeed;
