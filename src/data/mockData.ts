export interface Resource {
  id: string;
  type: "AI_Service" | "Storage" | "User" | "Risk";
  name: string;
  risk?: "High" | "Medium" | "Low";
  compliance?: string;
  description?: string;
}

export interface Relationship {
  from: string;
  to: string;
  type: string;
}

export interface SecurityRisk {
  id: string;
  resource: string;
  resourceName: string;
  type: string;
  severity: "High" | "Medium" | "Low";
  description: string;
}

export interface Alert {
  id: string;
  severity: "High" | "Medium" | "Low";
  message: string;
  resource: string;
  timestamp: string;
}

export const resources: Resource[] = [
  { id: "vertex-ai-1", type: "AI_Service", name: "Customer Prediction Model", risk: "High", description: "ML model for customer churn prediction using Vertex AI" },
  { id: "vertex-ai-2", type: "AI_Service", name: "Fraud Detection Engine", risk: "Medium", description: "Real-time fraud detection pipeline" },
  { id: "bigquery-ml-1", type: "AI_Service", name: "Revenue Forecasting", risk: "Low", description: "BigQuery ML revenue forecast model" },
  { id: "automl-1", type: "AI_Service", name: "Document Classifier", risk: "Medium", description: "AutoML document classification service" },
  { id: "storage-1", type: "Storage", name: "Training Data Bucket", compliance: "GDPR Compliant" },
  { id: "storage-2", type: "Storage", name: "Model Artifacts Store", compliance: "HIPAA Compliant" },
  { id: "storage-3", type: "Storage", name: "Customer PII Dataset", compliance: "Non-Compliant" },
  { id: "user-1", type: "User", name: "ML Engineering Team" },
  { id: "user-2", type: "User", name: "Data Science Group" },
  { id: "user-3", type: "User", name: "External Contractor" },
  { id: "risk-1", type: "Risk", name: "Public Access Exposure" },
  { id: "risk-2", type: "Risk", name: "Unencrypted Data Flow" },
];

export const relationships: Relationship[] = [
  { from: "vertex-ai-1", to: "storage-1", type: "USES_DATA_FROM" },
  { from: "vertex-ai-1", to: "storage-3", type: "USES_DATA_FROM" },
  { from: "vertex-ai-2", to: "storage-1", type: "USES_DATA_FROM" },
  { from: "bigquery-ml-1", to: "storage-2", type: "WRITES_TO" },
  { from: "automl-1", to: "storage-2", type: "WRITES_TO" },
  { from: "user-1", to: "vertex-ai-1", type: "HAS_ACCESS" },
  { from: "user-2", to: "bigquery-ml-1", type: "HAS_ACCESS" },
  { from: "user-3", to: "vertex-ai-1", type: "HAS_ACCESS" },
  { from: "user-3", to: "storage-3", type: "HAS_ACCESS" },
  { from: "risk-1", to: "vertex-ai-1", type: "AFFECTS" },
  { from: "risk-2", to: "storage-3", type: "AFFECTS" },
];

export const securityRisks: SecurityRisk[] = [
  { id: "sr-1", resource: "vertex-ai-1", resourceName: "Customer Prediction Model", type: "Public Access", severity: "High", description: "Model endpoint exposed to public internet without authentication" },
  { id: "sr-2", resource: "storage-3", resourceName: "Customer PII Dataset", type: "Unencrypted Data", severity: "High", description: "Sensitive PII data stored without encryption at rest" },
  { id: "sr-3", resource: "user-3", resourceName: "External Contractor", type: "Over-Privileged Access", severity: "High", description: "External contractor has admin access to production resources" },
  { id: "sr-4", resource: "vertex-ai-2", resourceName: "Fraud Detection Engine", type: "Outdated Dependencies", severity: "Medium", description: "ML framework has known CVEs that need patching" },
  { id: "sr-5", resource: "automl-1", resourceName: "Document Classifier", type: "Missing Audit Logs", severity: "Medium", description: "No audit trail for model inference requests" },
];

export const alerts: Alert[] = [
  { id: "a-1", severity: "High", message: "Unauthorized access attempt detected on Customer Prediction Model", resource: "vertex-ai-1", timestamp: "2 min ago" },
  { id: "a-2", severity: "High", message: "PII data detected in unencrypted storage bucket", resource: "storage-3", timestamp: "8 min ago" },
  { id: "a-3", severity: "Medium", message: "External contractor accessed production ML pipeline", resource: "vertex-ai-1", timestamp: "15 min ago" },
  { id: "a-4", severity: "Low", message: "Model retraining completed successfully", resource: "bigquery-ml-1", timestamp: "23 min ago" },
  { id: "a-5", severity: "Medium", message: "Compliance scan detected GDPR gap in data pipeline", resource: "storage-1", timestamp: "34 min ago" },
  { id: "a-6", severity: "Low", message: "New user access granted to ML Engineering Team", resource: "user-1", timestamp: "45 min ago" },
  { id: "a-7", severity: "High", message: "Critical vulnerability found in Fraud Detection dependencies", resource: "vertex-ai-2", timestamp: "1 hr ago" },
  { id: "a-8", severity: "Low", message: "Automated backup completed for Model Artifacts Store", resource: "storage-2", timestamp: "1.5 hr ago" },
];

export const complianceData = {
  gdpr: 78,
  hipaa: 85,
  soc2: 92,
  iso27001: 71,
};

export const resourceCounts = {
  aiServices: 4,
  storageAssets: 3,
  users: 3,
  totalResources: 12,
  securityRisks: 5,
  complianceScore: 82,
};
