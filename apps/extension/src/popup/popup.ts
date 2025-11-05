/**
 * Popup UI script
 * 
 * This handles the extension popup that appears when you click the extension icon.
 * Shows scan results, threat statistics, and allows toggling protection on/off.
 */

import { ScanResult, Rule, DetectionMatch } from "../utils/types.js";
import { getDetectionStats } from "../utils/scanner.js";
import { RESCAN_DELAY_MS } from "../utils/constants.js";

// Get references to DOM elements in popup.html
const enabledToggle = document.getElementById("enabledToggle") as HTMLInputElement;
const statusDiv = document.getElementById("status") as HTMLElement;
const totalThreats = document.getElementById("totalThreats") as HTMLElement;
const highThreats = document.getElementById("highThreats") as HTMLElement;
const mediumThreats = document.getElementById("mediumThreats") as HTMLElement;
const lowThreats = document.getElementById("lowThreats") as HTMLElement;
const detectionsList = document.getElementById("detectionsList") as HTMLElement;
const rulesCount = document.getElementById("rulesCount") as HTMLElement;
const rescanBtn = document.getElementById("rescanBtn") as HTMLButtonElement;
const viewRulesBtn = document.getElementById("viewRulesBtn") as HTMLButtonElement;
const rulesModal = document.getElementById("rulesModal") as HTMLElement;
const closeModal = document.getElementById("closeModal") as HTMLElement;
const rulesListModal = document.getElementById("rulesListModal") as HTMLElement;
const aboutLink = document.getElementById("aboutLink") as HTMLElement;

/**
 * Initialize popup when it opens
 * Loads current status and displays the last scan result
 */
async function initialize() {
  try {
    // Get status from background
    const status = await sendMessage({ type: "GET_STATUS" });
    
    if (status) {
      enabledToggle.checked = status.enabled;
      
      if (status.rulesCount) {
        rulesCount.textContent = `${status.rulesCount} rules active`;
      }
      
      if (status.lastScan) {
        displayScanResult(status.lastScan);
      } else {
        showEmptyState();
      }
    }
  } catch (error) {
    console.error("[Prompt Firewall] Error initializing popup:", error);
  }
}

/**
 * Display scan result in the popup UI
 * Updates the risk indicator, stats, and list of detections
 */
function displayScanResult(result: ScanResult) {
  // Update the colored status indicator at the top
  const statusIndicator = statusDiv.querySelector(".status-indicator");
  if (statusIndicator) {
    statusIndicator.className = `status-indicator ${result.riskLevel}`;
    
    const statusText = statusIndicator.querySelector(".status-text");
    if (statusText) {
      statusText.textContent = getRiskLevelText(result.riskLevel);
    }
  }
  
  // Update stats
  const stats = getDetectionStats(result);
  totalThreats.textContent = String(stats.total);
  highThreats.textContent = String(stats.high);
  mediumThreats.textContent = String(stats.medium);
  lowThreats.textContent = String(stats.low);
  
  // Update detections list
  if (result.matches.length === 0) {
    showEmptyState();
  } else {
    displayDetections(result);
  }
}

/**
 * Get risk level display text
 */
function getRiskLevelText(level: string): string {
  switch (level) {
    case "safe": return "No threats detected";
    case "low": return "Low risk detected";
    case "medium": return "Medium risk detected";
    case "high": return "High risk detected";
    default: return "Unknown";
  }
}

/**
 * Display list of detected threats
 * Shows each rule type only once to avoid cluttering the UI
 */
function displayDetections(result: ScanResult) {
  detectionsList.innerHTML = "";
  
  // Deduplicate by rule ID - show each rule type only once
  // even if it matched multiple times on the page
  const uniqueRules = new Map<string, DetectionMatch>();
  result.matches.forEach((match) => {
    if (!uniqueRules.has(match.rule.id)) {
      uniqueRules.set(match.rule.id, match);
    }
  });
  
  uniqueRules.forEach((match) => {
    const item = document.createElement("div");
    item.className = "detection-item";
    
    item.innerHTML = `
      <div class="detection-header">
        <div class="detection-name">${escapeHtml(match.rule.name)}</div>
        <span class="severity-badge ${match.rule.severity}">${match.rule.severity}</span>
      </div>
      <div class="detection-desc">${escapeHtml(match.rule.description)}</div>
      <div class="detection-match">${escapeHtml(match.context)}</div>
    `;
    
    detectionsList.appendChild(item);
  });
}

/**
 * Show empty state
 */
function showEmptyState() {
  detectionsList.innerHTML = `
    <div class="empty-state">
      No threats detected on this page ✓
    </div>
  `;
}

/**
 * Display all detection rules in the modal view
 * Shown when user clicks "View Rules" button
 */
async function displayRules() {
  try {
    const response = await sendMessage({ type: "GET_RULES" });
    
    if (response && response.rules) {
      const rules: Rule[] = response.rules;
      
      rulesListModal.innerHTML = "";
      
      rules.forEach((rule) => {
        const item = document.createElement("div");
        item.className = "rule-item";
        
        item.innerHTML = `
          <div class="rule-header">
            <div class="rule-name">${escapeHtml(rule.name)}</div>
            <span class="severity-badge ${rule.severity}">${rule.severity}</span>
          </div>
          <div class="rule-desc">${escapeHtml(rule.description)}</div>
        `;
        
        rulesListModal.appendChild(item);
      });
    }
  } catch (error) {
    console.error("[Prompt Firewall] Error loading rules:", error);
    rulesListModal.innerHTML = '<div class="empty-state">Error loading rules</div>';
  }
}

/**
 * Send message to background worker and wait for response
 * Wraps Chrome messaging API in a Promise for cleaner async/await code
 */
function sendMessage(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Send message to content script in the active tab
 * Used for triggering rescans
 */
async function sendMessageToTab(message: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      } else {
        reject(new Error("No active tab"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Escape HTML to prevent XSS when displaying user content
 * Uses browser's built-in text escaping
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Event Listeners

// Toggle enabled state
enabledToggle.addEventListener("change", async () => {
  try {
    const response = await sendMessage({ type: "TOGGLE_ENABLED" });
    
    if (response && typeof response.enabled !== "undefined") {
      enabledToggle.checked = response.enabled;
      
      // Update status
      const statusIndicator = statusDiv.querySelector(".status-indicator");
      if (statusIndicator && !response.enabled) {
        statusIndicator.className = "status-indicator disabled";
        const statusText = statusIndicator.querySelector(".status-text");
        if (statusText) {
          statusText.textContent = "Protection disabled";
        }
      }
    }
  } catch (error) {
    console.error("[Prompt Firewall] Error toggling:", error);
  }
});

// Rescan current page
rescanBtn.addEventListener("click", async () => {
  try {
    rescanBtn.disabled = true;
    rescanBtn.textContent = "⏳ Scanning...";
    
    // Tell content script to scan again
    await sendMessageToTab({ type: "RESCAN" });
    
    // Give content script time to complete scan and send results to background
    setTimeout(async () => {
      const status = await sendMessage({ type: "GET_STATUS" });
      if (status?.lastScan) {
        displayScanResult(status.lastScan);
      }
      
      rescanBtn.disabled = false;
      rescanBtn.innerHTML = '<span>🔄</span> Rescan Page';
    }, RESCAN_DELAY_MS);
  } catch (error) {
    console.error("[Prompt Firewall] Error rescanning:", error);
    rescanBtn.disabled = false;
    rescanBtn.innerHTML = '<span>🔄</span> Rescan Page';
  }
});

// View rules
viewRulesBtn.addEventListener("click", () => {
  displayRules();
  rulesModal.style.display = "flex";
});

// Close modal
closeModal.addEventListener("click", () => {
  rulesModal.style.display = "none";
});

// Click outside modal to close
rulesModal.addEventListener("click", (e) => {
  if (e.target === rulesModal) {
    rulesModal.style.display = "none";
  }
});

// About link
aboutLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: "https://github.com/AegisGate/aegis" });
});

// Initialize
initialize();


