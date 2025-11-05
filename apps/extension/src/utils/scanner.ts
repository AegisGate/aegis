/**
 * Scanning and detection utilities
 * 
 * This module handles pattern matching against detection rules
 * and calculates risk levels based on the severity of matches found.
 */

import { Rule, DetectionMatch, ScanResult, TextSource } from "./types.js";
import { CONTEXT_CHARS, RISK_THRESHOLDS } from "./constants.js";

/**
 * Match text against detection rules and return all matches found
 * Each match includes the matched text and surrounding context for display
 */
export function matchRules(text: string, rules: Rule[]): DetectionMatch[] {
  const matches: DetectionMatch[] = [];

  for (const rule of rules) {
    try {
      const regex = new RegExp(rule.pattern, "gi");
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const matchedText = match[0];
        
        // Extract surrounding text for context (50 chars before and after)
        const contextStart = Math.max(0, match.index - CONTEXT_CHARS);
        const contextEnd = Math.min(text.length, match.index + matchedText.length + CONTEXT_CHARS);
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
 * Calculate overall page risk based on detection severity and count
 * 
 * Risk escalation rules:
 * - Any 1+ high severity = HIGH risk (immediate threat)
 * - 3+ medium severity = HIGH risk (coordinated attack with multiple vectors)
 * - 1-2 medium severity = MEDIUM risk (potential threat)
 * - Only low severity = LOW risk (suspicious but not dangerous)
 * - No matches = SAFE
 */
export function calculateRiskLevel(
  matches: DetectionMatch[]
): "safe" | "low" | "medium" | "high" {
  if (matches.length === 0) return "safe";

  // Count detections by severity level
  const highCount = matches.filter((m) => m.rule.severity === "high").length;
  const mediumCount = matches.filter((m) => m.rule.severity === "medium").length;

  // Any high-severity detection = immediate high risk
  if (highCount >= RISK_THRESHOLDS.HIGH_SEVERITY_FOR_HIGH_RISK) {
    return "high";
  }
  
  // 3+ medium detections suggest coordinated attack = high risk
  if (mediumCount >= RISK_THRESHOLDS.MEDIUM_COUNT_FOR_HIGH_RISK) {
    return "high";
  }
  
  // 1-2 medium detections = medium risk
  if (mediumCount >= RISK_THRESHOLDS.MEDIUM_COUNT_FOR_MEDIUM_RISK) {
    return "medium";
  }
  
  // Everything else is low severity only
  return "low";
}

/**
 * Redact matched patterns from text (replaces with [REDACTED] placeholder)
 * Useful if you want to safely display page content with injections removed
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
 * Create a complete scan result for a page
 * Combines text extraction, pattern matching, and risk calculation
 */
export function createScanResult(
  url: string,
  textSources: TextSource[],
  rules: Rule[]
): ScanResult {
  // Combine all extracted text sources into one string for scanning
  const scannedText = textSources.map((s) => s.content).join("\n\n");
  
  // Run pattern matching against all detection rules
  const matches = matchRules(scannedText, rules);
  
  // Calculate overall page risk based on what was found
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
 * Get breakdown of detections by severity level
 * Used for displaying stats in the popup UI
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


