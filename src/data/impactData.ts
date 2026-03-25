export interface ImpactAnalysis {
  resourceId: string;
  businessImpact: {
    revenueRisk: string;
    usersAffected: number;
    complianceRisk: string;
    criticality: "HIGH" | "MEDIUM" | "LOW";
    downtimeCost: string;
  };
  dependencies: {
    upstream: string[];
    downstream: string[];
    singlePointsOfFailure: string[];
  };
  whatIf: {
    scenario: string;
    impact: string;
    probability: string;
    mitigationTime: string;
  }[];
  recommendations: {
    action: string;
    priority: "Critical" | "High" | "Medium";
    effort: string;
    impact: string;
  }[];
}

export const impactAnalyses: Record<string, ImpactAnalysis> = {
  "vertex-ai-1": {
    resourceId: "vertex-ai-1",
    businessImpact: {
      revenueRisk: "$50,000/hr",
      usersAffected: 2847,
      complianceRisk: "HIPAA Violation",
      criticality: "HIGH",
      downtimeCost: "$1.2M/day",
    },
    dependencies: {
      upstream: ["Training Data Bucket", "Customer PII Dataset"],
      downstream: ["Customer API", "Analytics Dashboard", "Reporting Service"],
      singlePointsOfFailure: ["Customer PII Dataset"],
    },
    whatIf: [
      { scenario: "Service goes down", impact: "2,847 users lose access to predictions; revenue loss ~$50K/hr", probability: "12%", mitigationTime: "4 hrs" },
      { scenario: "Data breach on PII dataset", impact: "HIPAA violation; potential $1.5M fine; mandatory disclosure", probability: "8%", mitigationTime: "72 hrs" },
      { scenario: "Model drift detected", impact: "Prediction accuracy drops 30%; customer churn increases", probability: "25%", mitigationTime: "2 hrs" },
    ],
    recommendations: [
      { action: "Implement redundant deployment across regions", priority: "Critical", effort: "2 weeks", impact: "Eliminates single point of failure" },
      { action: "Encrypt PII dataset at rest", priority: "Critical", effort: "3 days", impact: "Resolves HIPAA compliance gap" },
      { action: "Add model monitoring & auto-rollback", priority: "High", effort: "1 week", impact: "Reduces drift risk by 80%" },
      { action: "Restrict external contractor access", priority: "High", effort: "1 day", impact: "Reduces attack surface by 40%" },
    ],
  },
  "vertex-ai-2": {
    resourceId: "vertex-ai-2",
    businessImpact: {
      revenueRisk: "$120,000/hr",
      usersAffected: 15200,
      complianceRisk: "PCI-DSS Non-Compliance",
      criticality: "HIGH",
      downtimeCost: "$2.9M/day",
    },
    dependencies: {
      upstream: ["Training Data Bucket"],
      downstream: ["Payment Gateway", "Transaction Monitor", "Fraud Alerts"],
      singlePointsOfFailure: ["Training Data Bucket"],
    },
    whatIf: [
      { scenario: "CVE exploited in dependencies", impact: "Full system compromise; all transactions at risk", probability: "15%", mitigationTime: "8 hrs" },
      { scenario: "Service degradation", impact: "Fraud detection latency increases; false negatives rise 5x", probability: "20%", mitigationTime: "2 hrs" },
    ],
    recommendations: [
      { action: "Patch known CVEs immediately", priority: "Critical", effort: "2 days", impact: "Eliminates 3 known vulnerabilities" },
      { action: "Add circuit breaker pattern", priority: "High", effort: "1 week", impact: "Prevents cascading failures" },
    ],
  },
  "storage-3": {
    resourceId: "storage-3",
    businessImpact: {
      revenueRisk: "$25,000/hr",
      usersAffected: 4500,
      complianceRisk: "GDPR & HIPAA Violation",
      criticality: "HIGH",
      downtimeCost: "$600K/day",
    },
    dependencies: {
      upstream: ["Data Ingestion Pipeline"],
      downstream: ["Customer Prediction Model", "Analytics Engine"],
      singlePointsOfFailure: [],
    },
    whatIf: [
      { scenario: "Data exposed publicly", impact: "Mandatory breach disclosure; $2M+ fine; brand damage", probability: "18%", mitigationTime: "48 hrs" },
      { scenario: "Encryption enforced", impact: "15min downtime; full compliance restored", probability: "95%", mitigationTime: "15 min" },
    ],
    recommendations: [
      { action: "Enable encryption at rest immediately", priority: "Critical", effort: "2 hours", impact: "Resolves compliance violation" },
      { action: "Implement access logging", priority: "High", effort: "1 day", impact: "Full audit trail for PII access" },
    ],
  },
};

// Default fallback for resources without specific analysis
export const defaultImpact: ImpactAnalysis = {
  resourceId: "default",
  businessImpact: {
    revenueRisk: "$5,000/hr",
    usersAffected: 150,
    complianceRisk: "Low Risk",
    criticality: "LOW",
    downtimeCost: "$120K/day",
  },
  dependencies: {
    upstream: ["Shared Infrastructure"],
    downstream: ["Monitoring Dashboard"],
    singlePointsOfFailure: [],
  },
  whatIf: [
    { scenario: "Service unavailable", impact: "Minor operational disruption", probability: "5%", mitigationTime: "1 hr" },
  ],
  recommendations: [
    { action: "Review access controls", priority: "Medium", effort: "1 day", impact: "Improved security posture" },
  ],
};

export interface AttackSurface {
  id: string;
  service: string;
  exposure: "Public" | "Private" | "Internal";
  sensitivity: "PHI" | "PII" | "Non-sensitive";
  vulnerabilities: number;
  cvss: number;
  ports: string[];
  lastScan: string;
  status: "Critical" | "Vulnerable" | "Secure";
}

export const attackSurfaces: AttackSurface[] = [
  { id: "as-1", service: "Customer Prediction API", exposure: "Public", sensitivity: "PII", vulnerabilities: 3, cvss: 9.1, ports: ["443", "8080"], lastScan: "2 min ago", status: "Critical" },
  { id: "as-2", service: "Fraud Detection Endpoint", exposure: "Public", sensitivity: "PII", vulnerabilities: 2, cvss: 7.5, ports: ["443"], lastScan: "5 min ago", status: "Vulnerable" },
  { id: "as-3", service: "Model Training Pipeline", exposure: "Internal", sensitivity: "PHI", vulnerabilities: 1, cvss: 5.2, ports: ["9090"], lastScan: "10 min ago", status: "Vulnerable" },
  { id: "as-4", service: "Analytics Dashboard", exposure: "Private", sensitivity: "Non-sensitive", vulnerabilities: 0, cvss: 0, ports: ["443"], lastScan: "1 min ago", status: "Secure" },
  { id: "as-5", service: "Data Ingestion API", exposure: "Internal", sensitivity: "PHI", vulnerabilities: 1, cvss: 6.8, ports: ["8443", "5432"], lastScan: "8 min ago", status: "Vulnerable" },
  { id: "as-6", service: "Model Registry", exposure: "Private", sensitivity: "Non-sensitive", vulnerabilities: 0, cvss: 0, ports: ["443"], lastScan: "3 min ago", status: "Secure" },
];

export interface ComplianceWorkflow {
  id: string;
  framework: string;
  workflow: string;
  status: "Running" | "Completed" | "Failed" | "Pending";
  progress: number;
  findings: number;
  lastRun: string;
  details: string[];
}

export const complianceWorkflows: ComplianceWorkflow[] = [
  { id: "cw-1", framework: "GDPR", workflow: "Right to be Forgotten Scan", status: "Completed", progress: 100, findings: 3, lastRun: "5 min ago", details: ["Found 3 user data instances across 2 storage buckets", "Customer PII Dataset contains unprocessed deletion requests", "Training Data Bucket has stale user embeddings"] },
  { id: "cw-2", framework: "HIPAA", workflow: "PHI Flow Validation", status: "Running", progress: 67, findings: 2, lastRun: "Running now", details: ["PHI detected in unencrypted storage path", "Access controls validated on 4/6 services", "Audit logging gap detected on Document Classifier"] },
  { id: "cw-3", framework: "SOC 2", workflow: "Access Control Audit", status: "Completed", progress: 100, findings: 1, lastRun: "15 min ago", details: ["External contractor has excessive privileges", "All internal users have appropriate access levels", "MFA enabled on 95% of accounts"] },
  { id: "cw-4", framework: "GDPR", workflow: "Data Residency Validation", status: "Completed", progress: 100, findings: 0, lastRun: "30 min ago", details: ["All data confirmed within EU regions", "No cross-border data transfers detected", "Storage replication verified compliant"] },
  { id: "cw-5", framework: "HIPAA", workflow: "Encryption Compliance Check", status: "Failed", progress: 85, findings: 1, lastRun: "12 min ago", details: ["Customer PII Dataset missing encryption at rest", "All other storage assets properly encrypted", "Key rotation policy verified"] },
];
