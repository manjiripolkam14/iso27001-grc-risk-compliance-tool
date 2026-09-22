# GRC Methodology — Plain-Language Reference

This document explains the core GRC (Governance, Risk, and Compliance) concepts used in this project, in simple language suitable for discussing in an interview. It also documents every formula the app uses, so nothing is a "black box."

> As with the README, this project uses fictional demo data and simplified, clearly-labeled models. It is not an official ISO/IEC 27001 methodology or certification.

## Core Concepts

**Asset** — Anything of value to the organization that needs protecting: a database, an application, a server, a laptop, even a business process. Assets are the "things" that risks threaten.

**Threat** — A potential cause of an unwanted incident, e.g., an external attacker, a malicious insider, a natural disaster, or simple human error.

**Vulnerability** — A weakness that a threat can exploit, e.g., missing patches, weak passwords, or a lack of monitoring.

**Risk** — The potential for a threat to exploit a vulnerability and cause harm to an asset. In this project, a risk record ties together an asset, a threat, and a vulnerability, then scores how likely and how damaging it would be.

**Likelihood** — How probable it is that the risk will actually occur, rated 1 (rare) to 5 (almost certain).

**Impact** — How much damage the organization would suffer if the risk occurred, rated 1 (minor) to 5 (severe).

**Risk Score** — A single number representing overall risk severity:

```
Risk Score = Likelihood × Impact
```

This gives a score from 1 to 25, which is then bucketed into a Risk Level:

| Score Range | Risk Level |
|---|---|
| 1–4   | Low |
| 5–9   | Medium |
| 10–16 | High |
| 17–25 | Critical |

**Why Likelihood × Impact?** Multiplying (rather than adding) the two factors means a risk needs to score reasonably on *both* dimensions to reach the highest bands — a near-certain but trivial issue, or a catastrophic but near-impossible one, won't automatically become "Critical." It's a simple, widely-used, and easy-to-explain approach for qualitative risk assessment.

**Risk Treatment** — The strategic decision about how to handle a risk:
- **Mitigate** — Reduce the risk (usually by implementing or improving a control).
- **Accept** — Consciously decide to tolerate the risk as-is, typically because it's low severity or the cost of fixing it outweighs the benefit.
- **Transfer** — Shift the risk to a third party, e.g., through insurance or a vendor contract.
- **Avoid** — Eliminate the risk entirely, often by discontinuing the risky activity or asset (e.g., decommissioning legacy software).

**Control** — A safeguard or countermeasure — a policy, process, or technical measure — put in place to reduce a risk. This project uses a curated set of controls *inspired by* ISO/IEC 27001, organized into categories like Access Control, Asset Management, and Incident Management. It is **not** the full official Annex A control set.

**Evidence** — Documentation or proof that a control is actually operating as described (e.g., an access review log, a training completion report, a scan result). GRC teams collect evidence to demonstrate that a control isn't just "on paper."

**Compliance Gap** — A finding that identifies where a control is missing, weak, or not fully implemented relative to what's expected. Gaps drive remediation work.

**Remediation** — The concrete corrective action taken to close a compliance gap or reduce a risk, with an owner, priority, and due date.

**Residual Risk** — The risk that remains *after* a control has been applied. No control eliminates risk entirely, so residual risk represents what's left over.

## Formulas Used in This Project

### 1. Risk Score & Level
```
Risk Score = Likelihood (1–5) × Impact (1–5)
Risk Level: 1–4 Low, 5–9 Medium, 10–16 High, 17–25 Critical
```

### 2. Residual Risk (project-defined, simplified model)
Used on the Risk-Control Mapping page:

```
Residual Risk Score = Original Risk Score − (Original Risk Score × Control Effectiveness)
```

Where "Control Effectiveness" is a simplifying assumption based on implementation status:

| Control Status | Effectiveness (assumed risk reduction) |
|---|---|
| Implemented | 50% |
| Partially Implemented | 25% |
| Not Implemented | 0% |
| Not Applicable | 0% |

The result is rounded up to the nearest whole number, with a minimum floor of 1 (a risk is never reduced to zero — no control provides perfect protection). **This is a project-defined illustration for portfolio purposes, not an official ISO/IEC 27001 methodology.**

### 3. Compliance % (project-level metric)
Shown on the Dashboard:

```
Compliance % = Implemented Applicable Controls ÷ Total Applicable Controls × 100
```

- "Applicable" controls exclude any marked *Not Applicable*.
- *Implemented* controls count as full credit (1.0); *Partially Implemented* controls count as half credit (0.5); *Not Implemented* controls count as zero.

This is explicitly labeled in the app as a **project-level compliance metric**, not an official ISO/IEC 27001 certification score.

### 4. Overdue Detection
A compliance gap or remediation item is flagged **Overdue** if its due date has passed and its status is not already Resolved, Completed, Accepted, or Closed.

## Why This Matters for the Interview

Being able to explain *why* a formula works (not just that it exists) is what distinguishes a candidate who understands GRC fundamentals from one who memorized a dashboard. Every calculation in this app is intentionally simple and fully documented here so it can be defended and explained clearly, rather than treated as a black box.
