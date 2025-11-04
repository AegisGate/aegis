/**
 * Background service worker - Central hub for the extension
 * 
 * This worker runs continuously in the background and handles:
 * - Loading detection rules from rules/core.json
 * - Processing scan requests from content scripts
 * - Storing scan history in local storage
 * - Updating the extension badge with threat counts
 */

import { Rule, RulesConfig, ScanResult, StorageData } from "../utils/types.js";
import { createScanResult } from "../utils/scanner.js";
import { MAX_HISTORY_SIZE, RISK_COLORS } from "../utils/constants.js";

// Cache rules in memory for fast access
let cachedRules: Rule[] = [];

/**
 * Initialize extension on install/startup
 * Loads detection rules and sets up default storage
 */
async function initialize() {
  console.log("[Prompt Firewall] Initializing background service worker...");
  
  try {
    // Load rules from JSON file
    const response = await fetch(chrome.runtime.getURL("rules/core.json"));
    const rulesConfig: RulesConfig = await response.json();
    cachedRules = rulesConfig.rules;
    
    console.log(`[Prompt Firewall] Loaded ${cachedRules.length} rules`);
    
    // Initialize storage with defaults
    const stored = await chrome.storage.local.get(["enabled", "scanHistory"]);
    if (stored.enabled === undefined) {
      await chrome.storage.local.set({
        enabled: true,
        scanHistory: []
      });
    }
  } catch (error) {
    console.error("[Prompt Firewall] Error initializing:", error);
  }
}

/**
 * Handle scan request from content script
 * This is the main entry point when a page is scanned
 */
async function handleScanPage(data: any) {
  const { url, textSources } = data;
  
  try {
    // Check if user has disabled protection
    const { enabled } = await chrome.storage.local.get("enabled");
    if (!enabled) {
      return { result: null, enabled: false };
    }

    // Run detection rules against extracted text
    const result = createScanResult(url, textSources, cachedRules);
    
    // Save to history for popup display
    await storeScanResult(result);
    
    // Update badge icon with threat count
    updateBadge(result);
    
    console.log(`[Prompt Firewall] Scan complete for ${url}: ${result.riskLevel} risk, ${result.matches.length} matches`);
    
    return { result, enabled: true };
  } catch (error) {
    console.error("[Prompt Firewall] Error scanning:", error);
    return { result: null, error: String(error) };
  }
}

/**
 * Store scan result in history
 * Keeps most recent scans for user reference (limited to prevent storage bloat)
 */
async function storeScanResult(result: ScanResult) {
  try {
    const { scanHistory = [] } = await chrome.storage.local.get("scanHistory");
    
    // Keep last 100 scans to avoid using too much storage
    // Chrome extensions have ~5MB local storage limit
    const updatedHistory = [result, ...scanHistory].slice(0, MAX_HISTORY_SIZE);
    
    await chrome.storage.local.set({
      lastScan: result,
      scanHistory: updatedHistory
    });
  } catch (error) {
    console.error("[Prompt Firewall] Error storing result:", error);
  }
}

/**
 * Update extension badge to show threat count
 * Badge appears as a small number on the extension icon
 */
function updateBadge(result: ScanResult) {
  const matchCount = result.matches.length;
  
  // Show number of detections, or nothing if page is clean
  if (matchCount === 0) {
    chrome.action.setBadgeText({ text: "" });
  } else {
    chrome.action.setBadgeText({ text: String(matchCount) });
  }
  
  // Color code by risk level: red = high, orange = medium, blue = low, green = safe
  const color = RISK_COLORS[result.riskLevel] || RISK_COLORS.safe;
  chrome.action.setBadgeBackgroundColor({ color });
}

/**
 * Get current extension status
 * Returns enabled state, last scan result, and rule count
 */
async function getStatus(tabId?: number) {
  try {
    const { enabled, lastScan } = await chrome.storage.local.get(["enabled", "lastScan"]);
    
    return {
      enabled: enabled !== false,
      lastScan: lastScan || null,
      rulesCount: cachedRules.length
    };
  } catch (error) {
    console.error("[Prompt Firewall] Error getting status:", error);
    return null;
  }
}

/**
 * Toggle protection on/off
 * When disabled, pages are not scanned
 */
async function toggleEnabled() {
  try {
    const { enabled } = await chrome.storage.local.get("enabled");
    const newState = !enabled;
    
    await chrome.storage.local.set({ enabled: newState });
    
    // Show "OFF" badge when disabled
    if (!newState) {
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: RISK_COLORS.disabled });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
    
    return { enabled: newState };
  } catch (error) {
    console.error("[Prompt Firewall] Error toggling:", error);
    return null;
  }
}

/**
 * Get all loaded detection rules
 * Used by popup to display rule information
 */
function getRules() {
  return { rules: cachedRules };
}

// Message handler - routes messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case "SCAN_PAGE":
          const scanResult = await handleScanPage(message.data);
          sendResponse(scanResult);
          break;
        
        case "GET_STATUS":
          const status = await getStatus(sender.tab?.id);
          sendResponse(status);
          break;
        
        case "TOGGLE_ENABLED":
          const toggleResult = await toggleEnabled();
          sendResponse(toggleResult);
          break;
        
        case "GET_RULES":
          sendResponse(getRules());
          break;
        
        default:
          sendResponse({ error: "Unknown message type" });
      }
    } catch (error) {
      console.error("[Prompt Firewall] Error handling message:", error);
      sendResponse({ error: String(error) });
    }
  })();
  
  return true; // Keep channel open for async response
});

// Initialize when extension is installed/updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Prompt Firewall] Extension installed/updated");
  initialize();
});

// Initialize on startup
initialize();


