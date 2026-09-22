# NovaTech GRC Risk & Compliance Assessment Tool

An ISO/IEC 27001-inspired risk and compliance assessment dashboard built as an educational portfolio project for entry-level GRC / Compliance / Cybersecurity Analyst roles.

> **Disclaimer:** This is an educational portfolio project using fictional demo data for a fictional organization ("NovaTech Solutions"). It does not represent a formal ISO/IEC 27001 audit, certification assessment, or professional compliance engagement.

---

## 1. Project Overview

This is a single-page web application that simulates the core workflow of a Governance, Risk, and Compliance (GRC) analyst: maintaining an asset inventory, identifying and scoring risks, mapping risks to security controls, tracking compliance gaps, and following remediation actions through to closure — all summarized on a live dashboard.

It was built to demonstrate practical, job-relevant GRC skills in a way that's easy to explain in an interview, without the overhead of a backend, database, or authentication system.

## 2. Problem Statement

Organizations need a simple, structured way to answer:
- What assets do we have, and how critical are they?
- What risks threaten those assets, and how severe are they?
- What controls exist to reduce those risks, and are they implemented?
- Where are we falling short of good security practice (compliance gaps)?
- Who is fixing what, and by when (remediation tracking)?

This tool demonstrates a lightweight way to answer all five questions in one connected system.

## 3. Features

- **Dashboard** — KPI cards (total assets, total risks, critical/high risks, open gaps, control implementation, compliance %) plus charts for risk severity distribution, control implementation status, and compliance status, with a recent activity feed.
- **Asset Register** — Add, edit, delete, search, and filter fictional information assets.
- **Risk Register** — Full CRUD risk register with automatically calculated Risk Score (Likelihood × Impact) and Risk Level.
- **Risk Matrix** — Interactive 5×5 likelihood/impact heat map; click any risk chip to view full details.
- **Control Library** — 18 ISO/IEC 27001-*inspired* sample controls (not the full official control set) across 10 common categories, with implementation status tracking.
- **Risk-Control Mapping** — Link risks to the controls that mitigate them and see a calculated residual risk score.
- **Compliance Gaps** — Track findings against controls, with automatic overdue detection.
- **Remediation Tracker** — Track remediation actions tied to findings, risks, and controls, with overdue highlighting.
- **LocalStorage persistence** — All changes persist across page refreshes in the browser. A "Reset Demo Data" button restores the original fictional dataset at any time.

## 4. Technology Stack

- React 18 + TypeScript
- Vite (dev server & build tool)
- Tailwind CSS (styling)
- Recharts (dashboard charts)
- React Router (client-side routing)
- Browser LocalStorage (persistence — no backend or database)

## 5. GRC Workflow (how the pages connect)

```
Asset  ──▶  Risk  ──▶  Risk-Control Mapping  ──▶  Compliance Gap  ──▶  Remediation
 (A-xxx)    (R-xxx)         (links R + C)             (G-xxx)          (RMD-xxx)
```

Example chain in the demo data:
`R-001 (Unauthorized access to customer database)` → asset `A-001 (Customer Database)` → mapped to control `C-002 (Multi-Factor Authentication)` → gap `G-004 (MFA not enforced org-wide)` → remediation `RMD-001 (enforce MFA org-wide)`.

## 6. Installation

Requirements: Node.js 18+ and npm.

```bash
npm install
```

## 7. Running the App

```bash
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## 8. Risk Scoring

- **Risk Score = Likelihood × Impact**, each rated 1–5, giving a score from 1–25.
- **Risk Level bands:** 1–4 Low · 5–9 Medium · 10–16 High · 17–25 Critical.
- Score and level are calculated automatically in the UI whenever likelihood or impact change — they are never entered manually.

## 9. Compliance Calculation

**Compliance % = Implemented Applicable Controls ÷ Total Applicable Controls × 100**, where:
- "Applicable" excludes controls marked *Not Applicable*.
- *Implemented* controls count fully; *Partially Implemented* controls count as half credit (this half-credit rule is a project-specific refinement documented here for transparency).

This is explicitly labeled in the UI as a **project-level compliance metric** — it is not an official ISO/IEC 27001 certification score.

A simplified, clearly documented **residual risk formula** is also used on the Risk-Control Mapping page — see `GRC-METHODOLOGY.md` for the full explanation. It is a project-defined model, not an official ISO methodology.

## 10. Project Limitations

- All data is fictional and stored only in the browser's LocalStorage (per-browser, per-device — it does not sync or back up anywhere).
- There is no authentication, multi-user support, or audit trail beyond the in-app "Recent Activity" feed.
- The Control Library is a curated sample of ISO/IEC 27001-*inspired* controls, not the complete official Annex A control set.
- The residual risk and compliance % formulas are simplified, project-defined models built for demonstration and transparency, not official ISO/IEC 27001 methodologies.
- There is no PDF/report export, and no backend, so data does not persist across different browsers or devices.

## 11. Future Enhancements

- Export dashboard/reports to PDF or CSV.
- Multi-user support with a real backend and authentication.
- Historical trend tracking (e.g., compliance % over time).
- Configurable/weighted risk scoring models.
- Evidence file uploads against controls and gaps.

## 12. Disclaimer

This is an educational portfolio project using fictional demo data. It does not represent a formal ISO/IEC 27001 audit, certification assessment, or professional compliance engagement.


