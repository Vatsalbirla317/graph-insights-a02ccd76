import { useState, useRef, useEffect, useCallback } from "react";
import { resources, relationships, Resource } from "@/data/mockData";
import { X } from "lucide-react";

interface NodePosition {
  x: number;
  y: number;
  resource: Resource;
}

const NODE_COLORS: Record<Resource["type"], string> = {
  AI_Service: "hsl(217, 91%, 60%)",
  Storage: "hsl(142, 71%, 45%)",
  User: "hsl(38, 92%, 50%)",
  Risk: "hsl(0, 72%, 51%)",
};

const NODE_LABELS: Record<Resource["type"], string> = {
  AI_Service: "AI Service",
  Storage: "Storage",
  User: "User",
  Risk: "Risk",
};

const GraphVisualization = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Resource | null>(null);
  const [nodes, setNodes] = useState<NodePosition[]>([]);
  const [dimensions, setDimensions] = useState({ width: 700, height: 420 });

  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: Math.max(380, rect.height) });
    }
  }, []);

  useEffect(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    const grouped: Record<string, Resource[]> = {};
    resources.forEach(r => {
      if (!grouped[r.type]) grouped[r.type] = [];
      grouped[r.type].push(r);
    });

    const positions: NodePosition[] = [];
    const rings: Record<string, { radius: number; startAngle: number }> = {
      AI_Service: { radius: 90, startAngle: 0 },
      Storage: { radius: 170, startAngle: Math.PI / 6 },
      User: { radius: 160, startAngle: Math.PI },
      Risk: { radius: 130, startAngle: Math.PI * 1.5 },
    };

    Object.entries(grouped).forEach(([type, items]) => {
      const ring = rings[type];
      items.forEach((r, i) => {
        const angle = ring.startAngle + (i * (2 * Math.PI)) / Math.max(items.length * 2.5, 6);
        positions.push({
          x: cx + ring.radius * Math.cos(angle),
          y: cy + ring.radius * Math.sin(angle),
          resource: r,
        });
      });
    });

    setNodes(positions);
  }, [dimensions]);

  const getNodePos = (id: string) => nodes.find(n => n.resource.id === id);

  return (
    <div className="glass-card p-5 relative" style={{ animationDelay: "0.1s" }}>
      <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Resource Graph</h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3">
        {Object.entries(NODE_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: NODE_COLORS[type as Resource["type"]] }} />
            {label}
          </div>
        ))}
      </div>

      <svg ref={svgRef} width="100%" height={dimensions.height} className="overflow-visible">
        {/* Connections */}
        {relationships.map((rel, i) => {
          const from = getNodePos(rel.from);
          const to = getNodePos(rel.to);
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="hsl(215, 25%, 25%)"
              strokeWidth={1.5}
              strokeDasharray={rel.type === "AFFECTS" ? "4 3" : undefined}
              opacity={selectedNode ? (rel.from === selectedNode.id || rel.to === selectedNode.id ? 0.9 : 0.15) : 0.5}
              className="transition-opacity duration-300"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isSelected = selectedNode?.id === node.resource.id;
          const isConnected = selectedNode
            ? relationships.some(r => (r.from === selectedNode.id && r.to === node.resource.id) || (r.to === selectedNode.id && r.from === node.resource.id))
            : false;
          const dimmed = selectedNode && !isSelected && !isConnected;
          const radius = node.resource.type === "Risk" ? 18 : 22;

          return (
            <g
              key={node.resource.id}
              className="cursor-pointer transition-all duration-300"
              opacity={dimmed ? 0.2 : 1}
              onClick={() => setSelectedNode(isSelected ? null : node.resource)}
            >
              {isSelected && (
                <circle cx={node.x} cy={node.y} r={radius + 6} fill="none" stroke={NODE_COLORS[node.resource.type]} strokeWidth={2} opacity={0.4} />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={NODE_COLORS[node.resource.type]}
                opacity={0.9}
                className="transition-all duration-200 hover:opacity-100"
              />
              <text
                x={node.x}
                y={node.y + radius + 14}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {node.resource.name.length > 20 ? node.resource.name.slice(0, 18) + "…" : node.resource.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Detail popup */}
      {selectedNode && (
        <div className="absolute top-14 right-4 w-64 glass-card border border-border p-4 z-10 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{NODE_LABELS[selectedNode.type]}</span>
            <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">{selectedNode.name}</h3>
          {selectedNode.description && <p className="text-xs text-muted-foreground mb-2">{selectedNode.description}</p>}
          {selectedNode.risk && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedNode.risk === "High" ? "bg-severity-high/20 severity-high" : selectedNode.risk === "Medium" ? "bg-severity-medium/20 severity-medium" : "bg-severity-low/20 severity-low"}`}>
              {selectedNode.risk} Risk
            </span>
          )}
          {selectedNode.compliance && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedNode.compliance === "Non-Compliant" ? "bg-severity-high/20 severity-high" : "bg-severity-low/20 severity-low"}`}>
              {selectedNode.compliance}
            </span>
          )}
          <div className="mt-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Connections:</p>
            {relationships
              .filter(r => r.from === selectedNode.id || r.to === selectedNode.id)
              .map((r, i) => {
                const otherId = r.from === selectedNode.id ? r.to : r.from;
                const other = resources.find(res => res.id === otherId);
                return (
                  <div key={i} className="flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NODE_COLORS[other?.type || "AI_Service"] }} />
                    <span>{other?.name}</span>
                    <span className="text-muted-foreground/50 ml-auto">{r.type.replace(/_/g, " ").toLowerCase()}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphVisualization;
