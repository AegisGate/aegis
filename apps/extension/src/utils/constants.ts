/**
 * Shared constants used across the extension
 * Centralizing these makes the code easier to maintain and understand
 */

// Text extraction limits
export const MAX_SCRIPT_SIZE = 10000; // Skip scripts larger than 10KB to avoid performance issues
export const MAX_SCRIPT_CONTENT = 5000; // Truncate to 5KB - most injection attempts are short

// Context display
export const CONTEXT_CHARS = 50; // Characters of surrounding text to show in detections

// Storage limits
export const MAX_HISTORY_SIZE = 100; // Keep last 100 scans (Chrome has ~5MB storage limit)

// UI timing
export const RESCAN_DELAY_MS = 1000; // Wait time after rescan before refreshing UI

// Risk level colors (used in badge and UI)
export const RISK_COLORS = {
  high: "#dc2626",    // Red - immediate threat
  medium: "#f59e0b",  // Orange - potential threat
  low: "#3b82f6",     // Blue - low concern
  safe: "#10b981",    // Green - all clear
  disabled: "#6b7280" // Gray - protection disabled
} as const;

// Risk calculation thresholds
export const RISK_THRESHOLDS = {
  HIGH_SEVERITY_FOR_HIGH_RISK: 1,    // Any high-severity detection = high risk
  MEDIUM_COUNT_FOR_HIGH_RISK: 3,     // 3+ medium detections = coordinated attack
  MEDIUM_COUNT_FOR_MEDIUM_RISK: 1    // 1+ medium detection = medium risk
} as const;

