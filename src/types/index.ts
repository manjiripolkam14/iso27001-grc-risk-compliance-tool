// Core domain types for the GRC Risk & Compliance Assessment Tool
// All data in this app is fictional demo data for "NovaTech Solutions".

export type Criticality = 'Low' | 'Medium' | 'High' | 'Critical';
export type AssetStatus = 'Active' | 'Retired' | 'Under Review';

export interface Asset {
  id: string; // e.g. A-001
  name: string;
  type: string;
  owner: string;
  businessFunction: string;
  criticality: Criticality;
  status: AssetStatus;
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskTreatment = 'Mitigate' | 'Accept' | 'Transfer' | 'Avoid';
export type RiskStatus = 'Open' | 'In Progress' | 'Accepted' | 'Closed';

export interface Risk {
  id: string; // e.g. R-001
  title: string;
  description: string;
  assetId: string;
  threat: string;
  vulnerability: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  owner: string;
  treatment: RiskTreatment;
  status: RiskStatus;
}

export type ControlStatus = 'Implemented' | 'Partially Implemented' | 'Not Implemented' | 'Not Applicable';

export interface Control {
  id: string; // e.g. C-001
  name: string;
  category: string;
  objective: string;
  description: string;
  status: ControlStatus;
  owner: string;
  evidenceRequired: string;
}

export interface RiskControlMapping {
  id: string; // e.g. M-001
  riskId: string;
  controlId: string;
}

export type GapSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type GapStatus = 'Open' | 'In Progress' | 'Resolved' | 'Accepted';

export interface ComplianceGap {
  id: string; // e.g. G-001
  controlId: string;
  finding: string;
  severity: GapSeverity;
  owner: string;
  recommendation: string;
  dueDate: string; // ISO date string
  status: GapStatus;
}

export type RemediationPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RemediationStatus = 'Open' | 'In Progress' | 'Completed' | 'Overdue';

export interface Remediation {
  id: string; // e.g. RMD-001
  findingId: string; // links to a ComplianceGap id
  riskId: string;
  controlId: string;
  owner: string;
  priority: RemediationPriority;
  dueDate: string; // ISO date string
  status: RemediationStatus;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO datetime
  message: string;
}

export interface GrcDataset {
  assets: Asset[];
  risks: Risk[];
  controls: Control[];
  mappings: RiskControlMapping[];
  gaps: ComplianceGap[];
  remediations: Remediation[];
  activityLog: ActivityLogEntry[];
}
