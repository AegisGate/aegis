/**
 * Content script - Runs on every webpage
 * Scrapes visible and hidden text and sends to background for analysis
 */

import { TextSource, ScanResult } from "../utils/types.js";

// Track if we've already scanned this page
let hasScanned = false;

/**
 * Extract all text content from the page
 */
function extractPageText(): TextSource[] {
  const sources: TextSource[] = [];

  // 1. Visible text from body
  const bodyText = document.body.innerText || "";
  if (bodyText.trim()) {
    sources.push({
      type: "visible",
      content: bodyText,
      element: "body"
    });
  }

  // 2. Hidden elements (display:none, visibility:hidden)
  const hiddenElements = document.querySelectorAll(
    '[style*="display:none"], [style*="display: none"], [style*="visibility:hidden"], [style*="visibility: hidden"], [hidden]'
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

  // 3. HTML comments
  const commentWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT
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

  // 4. Meta tags
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

  // 5. Data attributes that might contain instructions
  const elementsWithData = document.querySelectorAll("[data-instruction], [data-prompt], [data-ai], [data-system]");
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

  // 8. Script tags (content, not execution)
  const scripts = document.querySelectorAll("script");
  scripts.forEach((script, idx) => {
    const text = script.textContent || "";
    if (text.trim() && text.length < 10000) { // Limit size
      sources.push({
        type: "script",
        content: text.substring(0, 5000), // Limit to 5000 chars
        element: `script-${idx}`
      });
    }
  });

  return sources;
}

/**
 * Scan the current page
 */
function scanPage() {
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
 */
function handleScanResult(result: any) {
  console.log("[Prompt Firewall] Scan complete:", result);
  
  // Show warning if threats detected
  if (result.riskLevel === "high" || result.riskLevel === "medium") {
    showWarningBanner(result);
  }
}

/**
 * Show warning banner at top of page
 */
function showWarningBanner(result: any) {
  // Check if banner already exists
  if (document.getElementById("prompt-firewall-banner")) return;

  const banner = document.createElement("div");
  banner.id = "prompt-firewall-banner";
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


