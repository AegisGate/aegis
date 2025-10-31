/**
 * Core types for Prompt Firewall
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

export interface DetectionMatch {
  rule: Rule;
  matchedText: string;
  context: string; // Surrounding text for context
}

export interface ScanResult {
  url: string;
  timestamp: number;
  matches: DetectionMatch[];
  riskLevel: "safe" | "low" | "medium" | "high";
  scannedText: string;
  textSources: TextSource[];
}

export interface TextSource {
  type: "visible" | "hidden" | "comment" | "meta" | "attribute" | "script";
  content: string;
  element?: string; // CSS selector or description
}

export interface StorageData {
  enabled: boolean;
  lastScan?: ScanResult;
  scanHistory: ScanResult[];
  rules?: RulesConfig;
}

export interface Message {
  type: "SCAN_PAGE" | "SCAN_RESULT" | "GET_STATUS" | "TOGGLE_ENABLED" | "GET_RULES";
  data?: any;
}


