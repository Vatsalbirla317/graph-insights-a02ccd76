import ExecutiveHeader from "@/components/dashboard/ExecutiveHeader";
import GraphVisualization from "@/components/dashboard/GraphVisualization";
import SecurityPanel from "@/components/dashboard/SecurityPanel";
import CompliancePanel from "@/components/dashboard/CompliancePanel";
import ResourceInventory from "@/components/dashboard/ResourceInventory";
import AlertsFeed from "@/components/dashboard/AlertsFeed";
import AttackSurfaceExplorer from "@/components/dashboard/AttackSurfaceExplorer";
import ComplianceWorkflows from "@/components/dashboard/ComplianceWorkflows";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-3 lg:p-6">
      <div className="max-w-[1400px] mx-auto">
        <ExecutiveHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Graph */}
          <div className="lg:col-span-2">
            <GraphVisualization />
          </div>

          {/* Right column - Security */}
          <div>
            <SecurityPanel />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <AttackSurfaceExplorer />
          <ComplianceWorkflows />
          <AlertsFeed />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <CompliancePanel />
          <ResourceInventory />
        </div>
      </div>
    </div>
  );
};

export default Index;
