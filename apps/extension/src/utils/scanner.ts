/**
 * Scanning and detection utilities
 */

import { Rule, DetectionMatch, ScanResult, TextSource } from "./types.js";

/**
 * Match text against rules and return detected patterns
 */
export function matchRules(text: string, rules: Rule[]): DetectionMatch[] {
  const matches: DetectionMatch[] = [];

  for (const rule of rules) {
    try {
      const regex = new RegExp(rule.pattern, "gi");
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const matchedText = match[0];
        const contextStart = Math.max(0, match.index - 50);
        const contextEnd = Math.min(text.length, match.index + matchedText.length + 50);
        const context = text.slice(contextStart, contextEnd);
        
        matches.push({
          rule,
          matchedText,
          context
        });
      }
    } catch (error) {
      console.error(`Error matching rule ${rule.id}:`, error);
    }
  }

  return matches;
}

/**
 * Calculate overall risk level based on matched rules
 */
export function calculateRiskLevel(
  matches: DetectionMatch[]
): "safe" | "low" | "medium" | "high" {
  if (matches.length === 0) return "safe";

  const hasHigh = matches.some((m) => m.rule.severity === "high");
  const hasMedium = matches.some((m) => m.rule.severity === "medium");
  const highCount = matches.filter((m) => m.rule.severity === "high").length;
  const mediumCount = matches.filter((m) => m.rule.severity === "medium").length;

  // Multiple high-severity matches
  if (highCount >= 2) return "high";
  
  // Single high-severity match
  if (hasHigh) return "high";
  
  // Multiple medium-severity matches
  if (mediumCount >= 3) return "high";
  if (mediumCount >= 1) return "medium";
  
  // Only low-severity matches
  return "low";
}

/**
 * Redact matched patterns from text
 */
export function redactText(text: string, matches: DetectionMatch[]): string {
  let redactedText = text;

  for (const match of matches) {
    try {
      const regex = new RegExp(match.rule.pattern, "gi");
      redactedText = redactedText.replace(regex, "[REDACTED: Potential prompt injection]");
    } catch (error) {
      console.error(`Error redacting for rule ${match.rule.id}:`, error);
    }
  }

  return redactedText;
}

/**
 * Create a scan result object
 */
export function createScanResult(
  url: string,
  textSources: TextSource[],
  rules: Rule[]
): ScanResult {
  // Combine all text sources
  const scannedText = textSources.map((s) => s.content).join("\n\n");
  
  // Match against rules
  const matches = matchRules(scannedText, rules);
  
  // Calculate risk level
  const riskLevel = calculateRiskLevel(matches);

  return {
    url,
    timestamp: Date.now(),
    matches,
    riskLevel,
    scannedText,
    textSources
  };
}

/**
 * Get a summary of detection statistics
 */
export function getDetectionStats(result: ScanResult) {
  const highSeverity = result.matches.filter((m) => m.rule.severity === "high").length;
  const mediumSeverity = result.matches.filter((m) => m.rule.severity === "medium").length;
  const lowSeverity = result.matches.filter((m) => m.rule.severity === "low").length;

  return {
    total: result.matches.length,
    high: highSeverity,
    medium: mediumSeverity,
    low: lowSeverity
  };
}


