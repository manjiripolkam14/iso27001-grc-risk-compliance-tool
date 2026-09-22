import {
  Asset,
  Control,
  ComplianceGap,
  GrcDataset,
  Remediation,
  Risk,
  RiskControlMapping,
} from '../types';

// ---------------------------------------------------------------------------
// FICTIONAL DEMO DATA for "NovaTech Solutions" (a fictional company).
// This dataset exists purely to demonstrate the application's functionality
// for a portfolio project. It is not real security data.
// ---------------------------------------------------------------------------

const assets: Asset[] = [
  { id: 'A-001', name: 'Customer Database', type: 'Database', owner: 'Priya Sharma', businessFunction: 'Customer Operations', criticality: 'Critical', status: 'Active' },
  { id: 'A-002', name: 'NovaPortal Web Application', type: 'Web Application', owner: 'Raj Mehta', businessFunction: 'Sales', criticality: 'High', status: 'Active' },
  { id: 'A-003', name: 'Employee Laptop Fleet', type: 'Endpoint Devices', owner: 'IT Operations', businessFunction: 'Corporate IT', criticality: 'Medium', status: 'Active' },
  { id: 'A-004', name: 'Cloud Storage (S3 Buckets)', type: 'Cloud Storage', owner: 'Ananya Iyer', businessFunction: 'Data Platform', criticality: 'High', status: 'Active' },
  { id: 'A-005', name: 'Payments API Server', type: 'API Server', owner: 'Vikram Nair', businessFunction: 'Finance', criticality: 'Critical', status: 'Active' },
  { id: 'A-006', name: 'Internal HR System', type: 'Business Application', owner: 'Neha Kapoor', businessFunction: 'Human Resources', criticality: 'High', status: 'Active' },
  { id: 'A-007', name: 'Core Network Server', type: 'Network Infrastructure', owner: 'IT Operations', businessFunction: 'Corporate IT', criticality: 'High', status: 'Active' },
  { id: 'A-008', name: 'Backup Server', type: 'Server', owner: 'IT Operations', businessFunction: 'Corporate IT', criticality: 'Critical', status: 'Active' },
  { id: 'A-009', name: 'Email System (Exchange Online)', type: 'Business Application', owner: 'Sanjay Rao', businessFunction: 'Corporate IT', criticality: 'Medium', status: 'Active' },
  { id: 'A-010', name: 'Legacy Reporting Tool', type: 'Business Application', owner: 'Divya Menon', businessFunction: 'Finance', criticality: 'Low', status: 'Under Review' },
];

const controls: Control[] = [
  { id: 'C-001', name: 'Access Control Policy', category: 'Access Control', objective: 'Restrict system and data access to authorized users only.', description: 'Documented policy defining role-based access provisioning, review, and revocation procedures.', status: 'Implemented', owner: 'Priya Sharma', evidenceRequired: 'Approved policy document, access review logs' },
  { id: 'C-002', name: 'Multi-Factor Authentication', category: 'Access Control', objective: 'Reduce risk of unauthorized access from compromised credentials.', description: 'MFA required for privileged and remote access accounts.', status: 'Partially Implemented', owner: 'IT Security', evidenceRequired: 'MFA enrollment report' },
  { id: 'C-003', name: 'Asset Inventory Management', category: 'Asset Management', objective: 'Maintain an accurate, up-to-date inventory of information assets.', description: 'Central asset register tracking ownership, criticality, and lifecycle status.', status: 'Implemented', owner: 'IT Operations', evidenceRequired: 'Current asset register export' },
  { id: 'C-004', name: 'Asset Classification & Labeling', category: 'Asset Management', objective: 'Ensure assets are classified according to sensitivity and value.', description: 'Classification scheme applied consistently across on-prem and cloud assets.', status: 'Partially Implemented', owner: 'Ananya Iyer', evidenceRequired: 'Classification tagging report' },
  { id: 'C-005', name: 'Vulnerability Scanning', category: 'Vulnerability Management', objective: 'Identify vulnerabilities before they can be exploited.', description: 'Recurring automated vulnerability scans across internet-facing and internal systems.', status: 'Partially Implemented', owner: 'IT Security', evidenceRequired: 'Latest scan report' },
  { id: 'C-006', name: 'Patch Management', category: 'Vulnerability Management', objective: 'Remediate known vulnerabilities within defined SLAs.', description: 'Process for evaluating, testing, and deploying security patches.', status: 'Not Implemented', owner: 'IT Operations', evidenceRequired: 'Patch compliance dashboard' },
  { id: 'C-007', name: 'Security Awareness Training', category: 'Security Awareness', objective: 'Reduce human-related security incidents through education.', description: 'Annual security awareness training for all employees.', status: 'Implemented', owner: 'Neha Kapoor', evidenceRequired: 'Training completion records' },
  { id: 'C-008', name: 'Phishing Simulation Program', category: 'Security Awareness', objective: 'Measure and improve employee resilience to phishing.', description: 'Simulated phishing campaigns sent periodically with follow-up training.', status: 'Partially Implemented', owner: 'Sanjay Rao', evidenceRequired: 'Simulation results report' },
  { id: 'C-009', name: 'Incident Response Plan', category: 'Incident Management', objective: 'Enable timely, structured response to security incidents.', description: 'Documented IR plan with defined roles, escalation paths, and communication steps.', status: 'Implemented', owner: 'IT Security', evidenceRequired: 'Approved IR plan, tabletop exercise notes' },
  { id: 'C-010', name: 'Incident Detection & Logging', category: 'Logging & Monitoring', objective: 'Detect suspicious activity in a timely manner.', description: 'Security-relevant logs collected from critical systems.', status: 'Partially Implemented', owner: 'IT Operations', evidenceRequired: 'Logging coverage report' },
  { id: 'C-011', name: 'Centralized Log Management (SIEM)', category: 'Logging & Monitoring', objective: 'Correlate log data to identify threats across the environment.', description: 'Centralized SIEM platform aggregating logs from key systems.', status: 'Not Implemented', owner: 'IT Operations', evidenceRequired: 'SIEM deployment plan' },
  { id: 'C-012', name: 'Backup & Recovery Procedures', category: 'Backup', objective: 'Ensure data can be recovered in the event of loss or corruption.', description: 'Scheduled backups of critical systems with defined retention.', status: 'Implemented', owner: 'IT Operations', evidenceRequired: 'Backup job success logs' },
  { id: 'C-013', name: 'Backup Restoration Testing', category: 'Backup', objective: 'Validate that backups can be successfully restored.', description: 'Periodic test restores of backup data to confirm integrity.', status: 'Partially Implemented', owner: 'IT Operations', evidenceRequired: 'Restore test results' },
  { id: 'C-014', name: 'Encryption of Data at Rest', category: 'Cryptography', objective: 'Protect stored data from unauthorized disclosure.', description: 'Encryption applied to sensitive data stores and endpoint disks.', status: 'Partially Implemented', owner: 'IT Security', evidenceRequired: 'Encryption coverage report' },
  { id: 'C-015', name: 'Encryption of Data in Transit (TLS)', category: 'Cryptography', objective: 'Protect data moving across networks from interception.', description: 'TLS enforced for all external and internal service communication.', status: 'Implemented', owner: 'IT Security', evidenceRequired: 'TLS configuration scan' },
  { id: 'C-016', name: 'Supplier Security Assessment', category: 'Supplier Security', objective: 'Ensure third parties meet minimum security requirements.', description: 'Security questionnaire and risk review for new and existing vendors.', status: 'Not Implemented', owner: 'Procurement', evidenceRequired: 'Vendor assessment records' },
  { id: 'C-017', name: 'Business Continuity Plan', category: 'Business Continuity', objective: 'Maintain critical operations during a disruption.', description: 'Documented BCP covering critical business functions and recovery priorities.', status: 'Partially Implemented', owner: 'Vikram Nair', evidenceRequired: 'Approved BCP document' },
  { id: 'C-018', name: 'Disaster Recovery Testing', category: 'Business Continuity', objective: 'Validate the organization can recover IT services after a major outage.', description: 'Periodic DR exercises testing failover and recovery procedures.', status: 'Not Implemented', owner: 'Vikram Nair', evidenceRequired: 'DR test report' },
];

const risks: Risk[] = [
  { id: 'R-001', title: 'Unauthorized access to customer database', description: 'An external attacker could gain unauthorized access to the customer database due to inconsistent MFA enforcement on privileged accounts.', assetId: 'A-001', threat: 'External attacker', vulnerability: 'Weak/inconsistent MFA on privileged accounts', likelihood: 4, impact: 5, owner: 'Priya Sharma', treatment: 'Mitigate', status: 'In Progress' },
  { id: 'R-002', title: 'SQL injection on customer-facing web application', description: 'Unvalidated input fields in NovaPortal could allow an attacker to execute malicious SQL queries.', assetId: 'A-002', threat: 'External attacker', vulnerability: 'Unvalidated input fields', likelihood: 3, impact: 5, owner: 'Raj Mehta', treatment: 'Mitigate', status: 'Open' },
  { id: 'R-003', title: 'Data exposure from lost or stolen laptop', description: 'A lost or stolen employee laptop with incomplete disk encryption could expose sensitive company data.', assetId: 'A-003', threat: 'Theft or loss of device', vulnerability: 'Incomplete disk encryption rollout', likelihood: 3, impact: 3, owner: 'IT Operations', treatment: 'Mitigate', status: 'Open' },
  { id: 'R-004', title: 'Misconfigured cloud storage exposing data', description: 'A misconfigured S3 bucket permission could expose stored files to unauthorized parties.', assetId: 'A-004', threat: 'Accidental misconfiguration', vulnerability: 'Lack of automated configuration checks', likelihood: 3, impact: 4, owner: 'Ananya Iyer', treatment: 'Mitigate', status: 'In Progress' },
  { id: 'R-005', title: 'Payments API compromise via unpatched vulnerability', description: 'A known vulnerability left unpatched on the payments API server could be exploited by an attacker.', assetId: 'A-005', threat: 'External attacker exploiting known CVE', vulnerability: 'Delayed patch management process', likelihood: 4, impact: 5, owner: 'Vikram Nair', treatment: 'Mitigate', status: 'Open' },
  { id: 'R-006', title: 'Insider misuse of HR system data', description: 'A malicious or careless insider with excessive privileges could misuse sensitive HR data.', assetId: 'A-006', threat: 'Malicious or negligent insider', vulnerability: 'Excessive access privileges', likelihood: 2, impact: 4, owner: 'Neha Kapoor', treatment: 'Mitigate', status: 'Open' },
  { id: 'R-007', title: 'Core network outage from hardware failure', description: 'A single point of failure in the core network switch could cause an extended outage.', assetId: 'A-007', threat: 'Hardware failure', vulnerability: 'No redundant network switch', likelihood: 2, impact: 4, owner: 'IT Operations', treatment: 'Accept', status: 'Accepted' },
  { id: 'R-008', title: 'Ransomware attack encrypting backup data', description: 'A ransomware attack could encrypt backup data that is not isolated or immutable.', assetId: 'A-008', threat: 'Ransomware', vulnerability: 'Backups not isolated or immutable', likelihood: 3, impact: 5, owner: 'IT Operations', treatment: 'Mitigate', status: 'Open' },
  { id: 'R-009', title: 'Email account compromise via phishing', description: 'A successful phishing attempt could compromise an employee email account due to low security awareness.', assetId: 'A-009', threat: 'Phishing', vulnerability: 'Low user awareness, inconsistent simulations', likelihood: 4, impact: 3, owner: 'Sanjay Rao', treatment: 'Mitigate', status: 'In Progress' },
  { id: 'R-010', title: 'Data breach via unsupported legacy reporting tool', description: 'The legacy reporting tool no longer receives security patches, increasing breach risk.', assetId: 'A-010', threat: 'External attacker', vulnerability: 'End-of-life software with no available patches', likelihood: 3, impact: 3, owner: 'Divya Menon', treatment: 'Avoid', status: 'In Progress' },
  { id: 'R-011', title: 'Data loss due to failed backup restoration', description: 'Untested restore procedures could mean backups fail to restore correctly during an actual incident.', assetId: 'A-008', threat: 'Backup process failure', vulnerability: 'Untested restore procedures', likelihood: 2, impact: 5, owner: 'IT Operations', treatment: 'Mitigate', status: 'Open' },
  { id: 'R-012', title: 'Unauthorized third-party access to stored data', description: 'A supplier with cloud storage access but no security assessment could introduce risk.', assetId: 'A-004', threat: 'Third-party vendor', vulnerability: 'No formal supplier security assessment', likelihood: 3, impact: 4, owner: 'Ananya Iyer', treatment: 'Transfer', status: 'In Progress' },
  { id: 'R-013', title: 'Denial of service against web application', description: 'Lack of rate limiting could allow a denial-of-service attack against NovaPortal.', assetId: 'A-002', threat: 'DDoS attacker', vulnerability: 'No rate limiting or web application firewall', likelihood: 3, impact: 4, owner: 'Raj Mehta', treatment: 'Mitigate', status: 'Open' },
  { id: 'R-014', title: 'Account compromise via weak password policy', description: 'A weak password policy on the HR system increases the risk of credential stuffing attacks.', assetId: 'A-006', threat: 'External attacker (credential stuffing)', vulnerability: 'Weak password policy', likelihood: 4, impact: 3, owner: 'Neha Kapoor', treatment: 'Mitigate', status: 'In Progress' },
  { id: 'R-015', title: 'Extended business disruption from major outage', description: 'An untested disaster recovery plan could extend downtime after a major outage affecting the payments platform.', assetId: 'A-005', threat: 'Major outage or natural disaster', vulnerability: 'No recently tested disaster recovery plan', likelihood: 2, impact: 5, owner: 'Vikram Nair', treatment: 'Mitigate', status: 'Open' },
];

const mappings: RiskControlMapping[] = [
  { id: 'M-001', riskId: 'R-001', controlId: 'C-002' },
  { id: 'M-002', riskId: 'R-001', controlId: 'C-001' },
  { id: 'M-003', riskId: 'R-002', controlId: 'C-005' },
  { id: 'M-004', riskId: 'R-003', controlId: 'C-014' },
  { id: 'M-005', riskId: 'R-004', controlId: 'C-004' },
  { id: 'M-006', riskId: 'R-004', controlId: 'C-011' },
  { id: 'M-007', riskId: 'R-005', controlId: 'C-006' },
  { id: 'M-008', riskId: 'R-006', controlId: 'C-001' },
  { id: 'M-009', riskId: 'R-008', controlId: 'C-012' },
  { id: 'M-010', riskId: 'R-008', controlId: 'C-013' },
  { id: 'M-011', riskId: 'R-009', controlId: 'C-008' },
  { id: 'M-012', riskId: 'R-009', controlId: 'C-007' },
  { id: 'M-013', riskId: 'R-011', controlId: 'C-013' },
  { id: 'M-014', riskId: 'R-012', controlId: 'C-016' },
  { id: 'M-015', riskId: 'R-013', controlId: 'C-010' },
  { id: 'M-016', riskId: 'R-015', controlId: 'C-018' },
];

const gaps: ComplianceGap[] = [
  { id: 'G-001', controlId: 'C-006', finding: 'Critical system patches are not consistently applied within the defined SLA window.', severity: 'High', owner: 'IT Operations', recommendation: 'Implement an automated patch management schedule with SLA tracking.', dueDate: '2026-08-15', status: 'Open' },
  { id: 'G-002', controlId: 'C-011', finding: 'No centralized log correlation exists, limiting visibility into suspicious activity across systems.', severity: 'High', owner: 'IT Operations', recommendation: 'Deploy a centralized SIEM platform and onboard critical log sources.', dueDate: '2026-10-30', status: 'In Progress' },
  { id: 'G-003', controlId: 'C-016', finding: 'Third-party vendors with access to company data are not formally assessed for security posture.', severity: 'Medium', owner: 'Procurement', recommendation: 'Introduce a standard vendor security questionnaire prior to onboarding.', dueDate: '2026-09-10', status: 'Open' },
  { id: 'G-004', controlId: 'C-002', finding: 'Multi-factor authentication is not enforced for all privileged and remote-access accounts.', severity: 'Critical', owner: 'IT Security', recommendation: 'Enforce MFA organization-wide for privileged and remote access.', dueDate: '2026-09-05', status: 'In Progress' },
  { id: 'G-005', controlId: 'C-013', finding: 'Backup restore procedures are not tested on a regular schedule.', severity: 'Medium', owner: 'IT Operations', recommendation: 'Schedule and document quarterly backup restoration tests.', dueDate: '2026-11-01', status: 'Open' },
  { id: 'G-006', controlId: 'C-018', finding: 'The disaster recovery plan has not been tested in the past 12 months.', severity: 'High', owner: 'Vikram Nair', recommendation: 'Conduct a disaster recovery tabletop exercise and document results.', dueDate: '2026-12-15', status: 'Open' },
  { id: 'G-007', controlId: 'C-008', finding: 'Phishing simulations are run inconsistently across departments.', severity: 'Low', owner: 'Sanjay Rao', recommendation: 'Establish a recurring monthly phishing simulation schedule.', dueDate: '2026-10-01', status: 'Resolved' },
  { id: 'G-008', controlId: 'C-004', finding: 'Cloud storage assets are missing consistent classification labels.', severity: 'Medium', owner: 'Ananya Iyer', recommendation: 'Complete classification tagging for all cloud storage assets.', dueDate: '2026-08-30', status: 'Accepted' },
];

const remediations: Remediation[] = [
  { id: 'RMD-001', findingId: 'G-004', riskId: 'R-001', controlId: 'C-002', owner: 'IT Security', priority: 'Critical', dueDate: '2026-09-05', status: 'In Progress' },
  { id: 'RMD-002', findingId: 'G-001', riskId: 'R-005', controlId: 'C-006', owner: 'IT Operations', priority: 'High', dueDate: '2026-08-15', status: 'Open' },
  { id: 'RMD-003', findingId: 'G-003', riskId: 'R-012', controlId: 'C-016', owner: 'Procurement', priority: 'Medium', dueDate: '2026-09-10', status: 'Open' },
  { id: 'RMD-004', findingId: 'G-002', riskId: 'R-004', controlId: 'C-011', owner: 'IT Operations', priority: 'High', dueDate: '2026-10-30', status: 'In Progress' },
  { id: 'RMD-005', findingId: 'G-005', riskId: 'R-011', controlId: 'C-013', owner: 'IT Operations', priority: 'Medium', dueDate: '2026-11-01', status: 'Open' },
  { id: 'RMD-006', findingId: 'G-006', riskId: 'R-015', controlId: 'C-018', owner: 'Vikram Nair', priority: 'High', dueDate: '2026-12-15', status: 'Open' },
  { id: 'RMD-007', findingId: 'G-007', riskId: 'R-009', controlId: 'C-008', owner: 'Sanjay Rao', priority: 'Low', dueDate: '2026-10-01', status: 'Completed' },
  { id: 'RMD-008', findingId: 'G-008', riskId: 'R-004', controlId: 'C-004', owner: 'Ananya Iyer', priority: 'Medium', dueDate: '2026-08-30', status: 'Completed' },
];

export function seedDataset(): GrcDataset {
  return {
    assets: clone(assets),
    risks: clone(risks),
    controls: clone(controls),
    mappings: clone(mappings),
    gaps: clone(gaps),
    remediations: clone(remediations),
    activityLog: [
      { id: 'ACT-seed-1', timestamp: new Date().toISOString(), message: 'Demo dataset loaded for NovaTech Solutions.' },
      { id: 'ACT-seed-2', timestamp: new Date().toISOString(), message: 'Risk register initialized with 15 fictional risks.' },
      { id: 'ACT-seed-3', timestamp: new Date().toISOString(), message: 'Control library initialized with 18 ISO/IEC 27001-inspired sample controls.' },
    ],
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
