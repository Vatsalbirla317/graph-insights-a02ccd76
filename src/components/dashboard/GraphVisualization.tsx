import { useState, useRef, useEffect, useCallback } from "react";
import { resources, relationships, Resource } from "@/data/mockData";
import { X, ZoomIn, ZoomOut, RotateCcw, Search } from "lucide-react";
import ImpactAnalysisModal from "./ImpactAnalysisModal";

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
    <div className="glass-card p-5 relative" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resource Graph</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Legend + Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={() => setFilterType("All")}
          className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${filterType === "All" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
        >All</button>
        {Object.entries(NODE_LABELS).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full transition-colors ${filterType === type ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: NODE_COLORS[type as Resource["type"]] }} />
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
                stroke="hsl(215, 25%, 25%)"
                strokeWidth={1.5}
                strokeDasharray={rel.type === "AFFECTS" ? "4 3" : undefined}
                opacity={selectedNode ? (rel.from === selectedNode.id || rel.to === selectedNode.id ? 0.9 : 0.15) : 0.5}
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
        </g>
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
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedNode.risk === "High" ? "bg-[hsl(var(--risk-high)/0.2)] severity-high" : selectedNode.risk === "Medium" ? "bg-[hsl(var(--risk-medium)/0.2)] severity-medium" : "bg-[hsl(var(--risk-low)/0.2)] severity-low"}`}>
              {selectedNode.risk} Risk
            </span>
          )}
          {selectedNode.compliance && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedNode.compliance === "Non-Compliant" ? "bg-[hsl(var(--risk-high)/0.2)] severity-high" : "bg-[hsl(var(--risk-low)/0.2)] severity-low"}`}>
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
          {/* Analyze Impact button */}
          <button
            onClick={(e) => { e.stopPropagation(); setImpactNode(selectedNode); }}
            className="mt-3 w-full text-xs px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Analyze Impact
          </button>
        </div>
      )}

      {/* Impact Analysis Modal */}
      {impactNode && (
        <ImpactAnalysisModal resource={impactNode} onClose={() => setImpactNode(null)} />
      )}
    </div>
  );
};

export default GraphVisualization;
