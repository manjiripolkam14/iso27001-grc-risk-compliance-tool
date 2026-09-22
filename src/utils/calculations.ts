import { Control, ControlStatus, Risk, RiskLevel } from '../types';

/**
 * Risk Score = Likelihood x Impact (each rated 1-5)
 * This is a simplified, project-level scoring model inspired by common
 * qualitative risk assessment practice. It is NOT an official ISO/IEC
 * 27001 methodology.
 */
export function calcRiskScore(likelihood: number, impact: number): number {
  return likelihood * impact;
}

/**
 * Risk Level bands (out of a 1-25 score range):
 *   1-4   -> Low
 *   5-9   -> Medium
 *   10-16 -> High
 *   17-25 -> Critical
 */
export function calcRiskLevel(score: number): RiskLevel {
  if (score >= 17) return 'Critical';
  if (score >= 10) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

export const riskLevelOrder: Record<RiskLevel, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * Control effectiveness multiplier used only for this project's simplified
 * residual-risk illustration. This is NOT an official ISO methodology -
 * it is a simple, clearly-documented model for demo purposes.
 *
 *   Implemented            -> 50% reduction in risk score
 *   Partially Implemented  -> 25% reduction in risk score
 *   Not Implemented        -> 0% reduction
 *   Not Applicable         -> 0% reduction
 */
export function controlEffectiveness(status: ControlStatus): number {
  switch (status) {
    case 'Implemented':
      return 0.5;
    case 'Partially Implemented':
      return 0.25;
    default:
      return 0;
  }
}

/**
 * Residual Risk Score = Original Risk Score - (Original Risk Score x Control Effectiveness)
 * When a risk maps to multiple controls, we use the single strongest
 * (highest-effectiveness) control mapped to that risk, rounded up to the
 * nearest whole number, with a floor of 1.
 */
export function calcResidualRiskScore(originalScore: number, bestEffectiveness: number): number {
  const reduced = originalScore - originalScore * bestEffectiveness;
  return Math.max(1, Math.ceil(reduced));
}

export function bestEffectivenessForControls(controls: Control[]): number {
  if (controls.length === 0) return 0;
  return Math.max(...controls.map((c) => controlEffectiveness(c.status)));
}

/**
 * Project-level Compliance % (not an official ISO certification score):
 *   Compliance % = Implemented Applicable Controls / Total Applicable Controls x 100
 * "Applicable" excludes controls marked Not Applicable.
 * "Implemented Applicable" counts Implemented controls fully, and gives
 * Partially Implemented controls half credit, for a more informative metric.
 */
export function calcCompliancePercent(controls: Control[]): number {
  const applicable = controls.filter((c) => c.status !== 'Not Applicable');
  if (applicable.length === 0) return 0;
  const credit = applicable.reduce((sum, c) => {
    if (c.status === 'Implemented') return sum + 1;
    if (c.status === 'Partially Implemented') return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((credit / applicable.length) * 100);
}

export function isOverdue(dueDate: string, status: string): boolean {
  if (status === 'Resolved' || status === 'Completed' || status === 'Accepted' || status === 'Closed') {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  return due.getTime() < today.getTime();
}

export function riskWithScore(risk: Risk): Risk & { score: number; level: RiskLevel } {
  const score = calcRiskScore(risk.likelihood, risk.impact);
  return { ...risk, score, level: calcRiskLevel(score) };
}
