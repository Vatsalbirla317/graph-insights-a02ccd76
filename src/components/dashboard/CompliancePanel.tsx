import { complianceData } from "@/data/mockData";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ComplianceBar = ({ label, value }: { label: string; value: number }) => {
  const color = value >= 85 ? "bg-severity-low" : value >= 70 ? "bg-severity-medium" : "bg-severity-high";
  const textColor = value >= 85 ? "severity-low" : value >= 70 ? "severity-medium" : "severity-high";

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className={`text-xs font-bold ${textColor}`}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const StatusItem = ({ label, status, detail }: { label: string; status: "pass" | "warn" | "fail"; detail: string }) => (
  <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
    {status === "pass" && <CheckCircle className="h-4 w-4 severity-low flex-shrink-0" />}
    {status === "warn" && <AlertCircle className="h-4 w-4 severity-medium flex-shrink-0" />}
    {status === "fail" && <XCircle className="h-4 w-4 severity-high flex-shrink-0" />}
    <div className="flex-1">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="text-[10px] text-muted-foreground">{detail}</p>
    </div>
  </div>
);

const CompliancePanel = () => {
  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
      <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Compliance Overview</h2>

      <ComplianceBar label="GDPR" value={complianceData.gdpr} />
      <ComplianceBar label="HIPAA" value={complianceData.hipaa} />
      <ComplianceBar label="SOC 2" value={complianceData.soc2} />
      <ComplianceBar label="ISO 27001" value={complianceData.iso27001} />

      <div className="mt-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status Checks</h3>
        <StatusItem label="Data Encryption at Rest" status="pass" detail="All storage buckets encrypted" />
        <StatusItem label="Access Control Review" status="warn" detail="3 users with excessive privileges" />
        <StatusItem label="PII Data Classification" status="fail" detail="1 dataset missing classification" />
        <StatusItem label="Audit Logging" status="pass" detail="Enabled on 92% of services" />
        <StatusItem label="Data Residency" status="pass" detail="All data within EU regions" />
      </div>
    </div>
  );
};

export default CompliancePanel;
