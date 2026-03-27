import { useState, useRef, useEffect } from "react";
import { resources, relationships, Resource } from "@/data/mockData";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import ImpactAnalysisModal from "./ImpactAnalysisModal";

interface NodePosition {
  x: number;
  y: number;
  resource: Resource;
}

const NODE_COLORS: Record<Resource["type"], string> = {
  AI_Service: "hsl(var(--node-ai))",
  Storage: "hsl(var(--node-storage))",
  User: "hsl(var(--node-user))",
  Risk: "hsl(var(--node-risk))",
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
  const [impactNode, setImpactNode] = useState<Resource | null>(null);
  const [nodes, setNodes] = useState<NodePosition[]>([]);
  const [dimensions, setDimensions] = useState({ width: 700, height: 420 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState<string>("All");

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as SVGElement).tagName === "svg") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };
  const handleMouseUp = () => setIsPanning(false);

  const filteredNodes = filterType === "All" ? nodes : nodes.filter(n => n.resource.type === filterType);
  const filteredIds = new Set(filteredNodes.map(n => n.resource.id));

  return (
    <div className="glass-card p-4 relative" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Service Map</h2>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="btn-icon">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="btn-icon">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="btn-icon">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Legend + Filters — Datadog tab bar */}
      <div className="flex items-center gap-0.5 mb-2 bg-secondary rounded p-0.5 w-fit">
        <button
          onClick={() => setFilterType("All")}
          className={`pill-filter ${filterType === "All" ? "pill-filter-active" : "pill-filter-inactive"}`}
        >All</button>
        {Object.entries(NODE_LABELS).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex items-center gap-1.5 pill-filter ${filterType === type ? "pill-filter-active" : "pill-filter-inactive"}`}
          >
            <span className="h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: NODE_COLORS[type as Resource["type"]] }} />
            {label}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height={dimensions.height}
        className="overflow-visible cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: `${dimensions.width / 2}px ${dimensions.height / 2}px` }}>
          {/* Connections */}
          {relationships.map((rel, i) => {
            const from = getNodePos(rel.from);
            const to = getNodePos(rel.to);
            if (!from || !to) return null;
            const bothVisible = filteredIds.has(rel.from) && filteredIds.has(rel.to);
            if (filterType !== "All" && !bothVisible) return null;
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="hsl(var(--chart-line))"
                strokeWidth={1}
                strokeDasharray={rel.type === "AFFECTS" ? "4 3" : undefined}
                opacity={selectedNode ? (rel.from === selectedNode.id || rel.to === selectedNode.id ? 0.8 : 0.1) : 0.35}
                className="transition-opacity duration-300"
              />
            );
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.resource.id;
            const isConnected = selectedNode
              ? relationships.some(r => (r.from === selectedNode.id && r.to === node.resource.id) || (r.to === selectedNode.id && r.from === node.resource.id))
              : false;
            const dimmed = selectedNode && !isSelected && !isConnected;
            const radius = node.resource.type === "Risk" ? 16 : 20;

            return (
              <g
                key={node.resource.id}
                className="cursor-pointer transition-all duration-300"
                opacity={dimmed ? 0.15 : 1}
                onClick={() => setSelectedNode(isSelected ? null : node.resource)}
              >
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r={radius + 5} fill="none" stroke={NODE_COLORS[node.resource.type]} strokeWidth={1.5} opacity={0.5} strokeDasharray="3 2" />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={NODE_COLORS[node.resource.type]}
                  opacity={0.85}
                  className="transition-all duration-200 hover:opacity-100"
                />
                <text
                  x={node.x}
                  y={node.y + radius + 13}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px" }}
                >
                  {node.resource.name.length > 20 ? node.resource.name.slice(0, 18) + "…" : node.resource.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Detail popup */}
      {selectedNode && (
        <div className="absolute top-12 right-3 w-60 glass-card border border-border p-3 z-10 animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-data uppercase tracking-wider text-muted-foreground">{NODE_LABELS[selectedNode.type]}</span>
            <button onClick={() => setSelectedNode(null)} className="btn-icon"><X className="h-3.5 w-3.5" /></button>
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">{selectedNode.name}</h3>
          {selectedNode.description && <p className="text-[11px] text-muted-foreground mb-2">{selectedNode.description}</p>}
          <div className="flex gap-1.5 mb-2">
            {selectedNode.risk && (
              <span className={`text-[10px] font-data font-medium px-2 py-0.5 rounded ${selectedNode.risk === "High" ? "bg-[hsl(var(--risk-high)/0.15)] severity-high" : selectedNode.risk === "Medium" ? "bg-[hsl(var(--risk-medium)/0.15)] severity-medium" : "bg-[hsl(var(--risk-low)/0.15)] severity-low"}`}>
                {selectedNode.risk.toUpperCase()} RISK
              </span>
            )}
            {selectedNode.compliance && (
              <span className={`text-[10px] font-data font-medium px-2 py-0.5 rounded ${selectedNode.compliance === "Non-Compliant" ? "bg-[hsl(var(--risk-high)/0.15)] severity-high" : "bg-[hsl(var(--risk-low)/0.15)] severity-low"}`}>
                {selectedNode.compliance === "Non-Compliant" ? "NON-COMPLIANT" : "COMPLIANT"}
              </span>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground mb-2">
            <p className="font-medium text-foreground text-[10px] uppercase tracking-wider mb-1">Dependencies</p>
            {relationships
              .filter(r => r.from === selectedNode.id || r.to === selectedNode.id)
              .map((r, i) => {
                const otherId = r.from === selectedNode.id ? r.to : r.from;
                const other = resources.find(res => res.id === otherId);
                return (
                  <div key={i} className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: NODE_COLORS[other?.type || "AI_Service"] }} />
                    <span className="text-foreground">{other?.name}</span>
                    <span className="text-muted-foreground/50 ml-auto font-data text-[9px]">{r.type.replace(/_/g, " ")}</span>
                  </div>
                );
              })}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setImpactNode(selectedNode); }}
            className="w-full btn-action btn-action-solid"
          >
            Analyze Impact
          </button>
        </div>
      )}

      {impactNode && (
        <ImpactAnalysisModal resource={impactNode} onClose={() => setImpactNode(null)} />
      )}
    </div>
  );
};

export default GraphVisualization;
