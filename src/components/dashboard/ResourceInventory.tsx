import { resources } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Database, Brain, Users, AlertTriangle } from "lucide-react";

const typeIcons = {
  AI_Service: Brain,
  Storage: Database,
  User: Users,
  Risk: AlertTriangle,
};

const typeColors: Record<string, string> = {
  AI_Service: "hsl(217, 91%, 60%)",
  Storage: "hsl(142, 71%, 45%)",
  User: "hsl(38, 92%, 50%)",
  Risk: "hsl(0, 72%, 51%)",
};

const chartData = Object.entries(
  resources.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([type, count]) => ({ type: type.replace("_", " "), count, fill: typeColors[type] }));

const ResourceInventory = () => {
  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "0.35s" }}>
      <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Resource Inventory</h2>

      <div className="h-36 mb-4">
        <ResponsiveContainer>
          <BarChart data={chartData} barSize={32}>
            <XAxis dataKey="type" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "hsl(222, 47%, 9%)", border: "1px solid hsl(215, 25%, 18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 40%, 96%)" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {resources.slice(0, 5).map(r => {
          const Icon = typeIcons[r.type];
          return (
            <div key={r.id} className="flex items-center gap-3 text-xs p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <Icon className="h-3.5 w-3.5" style={{ color: typeColors[r.type] }} />
              <span className="text-foreground flex-1 truncate">{r.name}</span>
              <span className="text-muted-foreground capitalize">{r.type.replace("_", " ")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceInventory;
