/**
 * Background service worker - Handles rule matching and storage
 */

import { Rule, RulesConfig, ScanResult, StorageData } from "../utils/types.js";
import { createScanResult } from "../utils/scanner.js";

let cachedRules: Rule[] = [];

/**
 * Initialize extension - Load rules
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
 */
async function handleScanPage(data: any) {
  const { url, textSources } = data;
  
  try {
    // Check if extension is enabled
    const { enabled } = await chrome.storage.local.get("enabled");
    if (!enabled) {
      return { result: null, enabled: false };
    }

    // Perform scan
    const result = createScanResult(url, textSources, cachedRules);
    
    // Store result
    await storeScanResult(result);
    
    // Update badge
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
 */
async function storeScanResult(result: ScanResult) {
  try {
    const { scanHistory = [] } = await chrome.storage.local.get("scanHistory");
    
    // Add new result and keep last 100
    const updatedHistory = [result, ...scanHistory].slice(0, 100);
    
    await chrome.storage.local.set({
      lastScan: result,
      scanHistory: updatedHistory
    });
  } catch (error) {
    console.error("[Prompt Firewall] Error storing result:", error);
  }
}

/**
 * Update extension badge
 */
function updateBadge(result: ScanResult) {
  const matchCount = result.matches.length;
  
  if (matchCount === 0) {
    chrome.action.setBadgeText({ text: "" });
  } else {
    chrome.action.setBadgeText({ text: String(matchCount) });
  }
  
  // Set badge color based on risk
  const color = 
    result.riskLevel === "high" ? "#dc2626" :
    result.riskLevel === "medium" ? "#f59e0b" :
    result.riskLevel === "low" ? "#3b82f6" :
    "#10b981";
  
  chrome.action.setBadgeBackgroundColor({ color });
}

/**
 * Get current status
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
 * Toggle enabled state
 */
async function toggleEnabled() {
  try {
    const { enabled } = await chrome.storage.local.get("enabled");
    const newState = !enabled;
    
    await chrome.storage.local.set({ enabled: newState });
    
    // Update badge
    if (!newState) {
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: "#6b7280" });
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
 * Get rules
 */
function getRules() {
  return { rules: cachedRules };
}

// Message handler
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


