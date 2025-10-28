/**
 * Rules Engine for Prompt Firewall
 * Provides helper functions to match and validate rules
 */

export interface Rule {
  id: string;
  name: string;
  pattern: string;
  severity: "low" | "medium" | "high";
  description: string;
}

export interface RulesConfig {
  rules: Rule[];
}

export function matchRules(text: string, rules: Rule[]): Rule[] {
  const matched: Rule[] = [];

  for (const rule of rules) {
    const regex = new RegExp(rule.pattern, "gi");
    if (regex.test(text)) {
      matched.push(rule);
    }
  }

  return matched;
}

export function calculateRiskScore(
  matchedRules: Rule[]
): "low" | "medium" | "high" {
  const hasHigh = matchedRules.some((r) => r.severity === "high");
  const hasMedium = matchedRules.some((r) => r.severity === "medium");

  if (hasHigh || matchedRules.length > 2) return "high";
  if (hasMedium || matchedRules.length > 0) return "medium";
  return "low";
}

export function redactText(text: string, matchedRules: Rule[]): string {
  let cleanText = text;

  for (const rule of matchedRules) {
    const regex = new RegExp(rule.pattern, "gi");
    cleanText = cleanText.replace(regex, "[REDACTED]");
  }

  return cleanText;
}
