/**
 * Content script - Runs on every webpage
 * 
 * This script extracts all text from the page (visible, hidden, comments, etc.)
 * and sends it to the background worker for prompt injection detection.
 * Runs automatically when the page loads.
 */

import { TextSource, ScanResult } from "../utils/types.js";
import { MAX_SCRIPT_SIZE, MAX_SCRIPT_CONTENT } from "../utils/constants.js";

// Track if we've already scanned this page to avoid duplicate scans
let hasScanned = false;

/**
 * Extract text from all page sources where injection attacks might hide
 * This includes visible content, hidden elements, comments, and metadata
 */
function extractPageText(): TextSource[] {
  const sources: TextSource[] = [];

  // 1. Visible text - the most common place for injection attempts
  const bodyText = document.body.innerText || "";
  if (bodyText.trim()) {
    sources.push({
      type: "visible",
      content: bodyText,
      element: "body"
    });
  }

  // 2. Hidden elements - attackers often hide malicious instructions here
  // Check both with and without spaces since CSS formatting varies across sites
  const hiddenElements = document.querySelectorAll(
    '[style*="display:none"], [style*="display: none"], ' +
    '[style*="visibility:hidden"], [style*="visibility: hidden"], ' +
    '[hidden]'
  );
  hiddenElements.forEach((el, idx) => {
    const text = el.textContent || "";
    if (text.trim()) {
      sources.push({
        type: "hidden",
        content: text,
        element: `hidden-element-${idx}`
      });
    }
  });

  // 3. HTML comments - another common hiding place for injections
  // Use TreeWalker API to efficiently find all comment nodes in the DOM
  const commentWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT  // Only return comment nodes
  );
  let commentNode;
  let commentIdx = 0;
  while ((commentNode = commentWalker.nextNode())) {
    const text = commentNode.textContent || "";
    if (text.trim()) {
      sources.push({
        type: "comment",
        content: text,
        element: `comment-${commentIdx++}`
      });
    }
  }

  // 4. Meta tags - can contain instructions meant for AI agents
  const metaTags = document.querySelectorAll("meta");
  metaTags.forEach((meta, idx) => {
    const name = meta.getAttribute("name") || meta.getAttribute("property") || "";
    const content = meta.getAttribute("content") || "";
    if (content.trim()) {
      sources.push({
        type: "meta",
        content: `${name}: ${content}`,
        element: `meta[name="${name}"]`
      });
    }
  });

  // 5. Suspicious data attributes that might contain AI instructions
  // Attackers may use attributes like data-instruction, data-prompt to inject commands
  const elementsWithData = document.querySelectorAll(
    "[data-instruction], [data-prompt], [data-ai], [data-system]"
  );
  elementsWithData.forEach((el, idx) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith("data-")) {
        sources.push({
          type: "attribute",
          content: `${attr.name}: ${attr.value}`,
          element: `element-${idx}[${attr.name}]`
        });
      }
    });
  });

  // 6. Alt text from images
  const images = document.querySelectorAll("img[alt]");
  images.forEach((img, idx) => {
    const alt = img.getAttribute("alt") || "";
    if (alt.trim()) {
      sources.push({
        type: "attribute",
        content: `alt: ${alt}`,
        element: `img-${idx}`
      });
    }
  });

  // 7. ARIA labels
  const ariaElements = document.querySelectorAll("[aria-label], [aria-description]");
  ariaElements.forEach((el, idx) => {
    const label = el.getAttribute("aria-label") || el.getAttribute("aria-description") || "";
    if (label.trim()) {
      sources.push({
        type: "attribute",
        content: `aria: ${label}`,
        element: `aria-${idx}`
      });
    }
  });

  // 8. Script tags - read content only, don't execute
  // Some sites embed instructions in script tags for AI agents to find
  const scripts = document.querySelectorAll("script");
  scripts.forEach((script, idx) => {
    const text = script.textContent || "";
    // Skip large scripts to avoid performance issues on JS-heavy pages
    if (text.trim() && text.length < MAX_SCRIPT_SIZE) {
      sources.push({
        type: "script",
        // Truncate long scripts - most injection attempts are short snippets
        content: text.substring(0, MAX_SCRIPT_CONTENT),
        element: `script-${idx}`
      });
    }
  });

  return sources;
}

/**
 * Scan the current page for prompt injections
 * Extracts text and sends to background worker for pattern matching
 */
function scanPage() {
  // Only scan once per page load (unless manually rescanned)
  if (hasScanned) return;
  hasScanned = true;

  try {
    console.log("[Prompt Firewall] Scanning page...");
    
    const textSources = extractPageText();
    
    // Send to background script for analysis
    chrome.runtime.sendMessage({
      type: "SCAN_PAGE",
      data: {
        url: window.location.href,
        textSources
      }
    }, (response) => {
      if (response?.result) {
        handleScanResult(response.result);
      }
    });
  } catch (error) {
    console.error("[Prompt Firewall] Error scanning page:", error);
  }
}

/**
 * Handle scan results from background script
 * Shows visual warning banner if threats are detected
 */
function handleScanResult(result: any) {
  console.log("[Prompt Firewall] Scan complete:", result);
  
  // Only show banner for medium/high risk pages to avoid alert fatigue
  if (result.riskLevel === "high" || result.riskLevel === "medium") {
    showWarningBanner(result);
  }
}

/**
 * Show warning banner at top of page for medium/high risk detections
 * Provides immediate visual feedback to users browsing potentially dangerous pages
 */
function showWarningBanner(result: any) {
  // Don't create duplicate banners
  if (document.getElementById("prompt-firewall-banner")) return;

  const banner = document.createElement("div");
  banner.id = "prompt-firewall-banner";
  // Use high z-index to appear above all page content
  // Red for high risk, orange for medium risk
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: ${result.riskLevel === "high" ? "#dc2626" : "#f59e0b"};
    color: white;
    padding: 12px 20px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 2147483647;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const message = document.createElement("div");
  message.textContent = `⚠️ Prompt Firewall: ${result.matches.length} potential prompt injection${result.matches.length !== 1 ? "s" : ""} detected on this page`;
  
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.style.cssText = `
    background: transparent;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0 8px;
  `;
  closeBtn.onclick = () => banner.remove();

  banner.appendChild(message);
  banner.appendChild(closeBtn);
  document.body.appendChild(banner);
}

// Run scan when page is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scanPage);
} else {
  scanPage();
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "RESCAN") {
    hasScanned = false;
    scanPage();
    sendResponse({ success: true });
  }
  return true;
});


