// ===========================================
// EchoDesk Embeddable Chatbot Widget
// ===========================================
// This is a SELF-CONTAINED script that works on ANY website.
// No dependencies, no framework, pure vanilla JavaScript.
//
// HOW IT WORKS:
// 1. Business owner adds <script src="https://echodesk.vercel.app/chatbot.js" data-org-id="xxx"></script>
// 2. This script executes and:
//    a. Reads data-org-id from the script tag
//    b. Fetches widget config (color, welcome message) from /api/widget
//    c. Injects scoped CSS styles into <head>
//    d. Creates a floating chat bubble + chat window in the DOM
//    e. Handles open/close, message sending, AI response display
// 3. Messages are sent via fetch() POST to /api/chat
// 4. Session ID is stored in localStorage for conversation continuity
//
// All CSS classes are prefixed with "echodesk-" to avoid conflicts
// with the host website's styles.
// ===========================================

(function () {
  "use strict";

  // ---- Read configuration from script tag ----
  var currentScript =
    document.currentScript ||
    document.querySelector('script[data-org-id]');

  if (!currentScript) {
    console.error("EchoDesk: Could not find script tag with data-org-id");
    return;
  }

  var ORG_ID = currentScript.getAttribute("data-org-id");
  if (!ORG_ID) {
    console.error("EchoDesk: data-org-id attribute is required");
    return;
  }

  // Determine the API base URL from the script's src
  var scriptSrc = currentScript.getAttribute("src") || "";
  var API_BASE = scriptSrc.replace(/\/chatbot\.js.*$/, "");
  if (!API_BASE) {
    API_BASE = window.location.origin;
  }

  // ---- State ----
  var isOpen = false;
  var messages = [];
  var sessionId = localStorage.getItem("echodesk_session_" + ORG_ID) || "";
  var widgetColor = "#6366f1";
  var businessName = "Support";
  var welcomeMessage = "Hi there! 👋 How can I help you today?";
  var isLoading = false;

  // ---- Inject CSS ----
  function injectStyles() {
    var style = document.createElement("style");
    style.id = "echodesk-styles";
    style.textContent = `
      .echodesk-widget * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
      }

      .echodesk-bubble {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${widgetColor};
        border: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.25);
        z-index: 2147483646;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        animation: echodesk-pulse 2.5s ease-in-out infinite;
      }

      .echodesk-bubble:hover {
        transform: scale(1.08) translateY(-2px);
        box-shadow: 0 12px 36px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.3);
      }

      .echodesk-bubble svg {
        width: 24px;
        height: 24px;
        fill: white;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .echodesk-bubble.echodesk-open svg {
        transform: rotate(90deg);
      }

      @keyframes echodesk-pulse {
        0%, 100% { box-shadow: 0 10px 30px rgba(0,0,0,0.18), 0 0 0 0 ${widgetColor}40; }
        50% { box-shadow: 0 10px 30px rgba(0,0,0,0.18), 0 0 0 14px ${widgetColor}00; }
      }

      .echodesk-window {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 370px;
        height: 530px;
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.04);
        z-index: 2147483646;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .echodesk-window.echodesk-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .echodesk-header {
        padding: 16px 20px;
        background: ${widgetColor};
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        position: relative;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }

      .echodesk-header-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: inset 0 1px 2px rgba(255,255,255,0.2);
      }

      .echodesk-header-avatar svg {
        width: 18px;
        height: 18px;
        fill: white;
      }

      .echodesk-header-info h3 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 2px;
        color: white;
        letter-spacing: -0.01em;
      }

      .echodesk-header-info p {
        font-size: 11px;
        opacity: 0.85;
        color: white;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .echodesk-header-info p::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 8px #10b981;
      }

      .echodesk-close {
        margin-left: auto;
        background: rgba(255,255,255,0.12);
        border: none;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .echodesk-close:hover {
        background: rgba(255,255,255,0.22);
        transform: scale(1.05);
      }

      .echodesk-close svg {
        width: 14px;
        height: 14px;
        stroke: white;
        fill: none;
        stroke-width: 2.5;
      }

      .echodesk-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #f8fafc;
      }

      .echodesk-messages::-webkit-scrollbar {
        width: 5px;
      }

      .echodesk-messages::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }

      .echodesk-msg {
        max-width: 80%;
        padding: 10px 14px;
        font-size: 13.5px;
        line-height: 1.45;
        word-wrap: break-word;
        animation: echodesk-msgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes echodesk-msgIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .echodesk-msg-user {
        align-self: flex-end;
        background: ${widgetColor};
        color: white;
        border-radius: 16px 16px 4px 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      }

      .echodesk-msg-assistant {
        align-self: flex-start;
        background: white;
        color: #1e293b;
        border: 1px solid rgba(0,0,0,0.05);
        border-radius: 16px 16px 16px 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      }

      .echodesk-typing {
        align-self: flex-start;
        background: white;
        border: 1px solid rgba(0,0,0,0.05);
        border-radius: 16px 16px 16px 4px;
        padding: 12px 16px;
        display: flex;
        gap: 4px;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      }

      .echodesk-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #94a3b8;
        animation: echodesk-bounce 1.2s ease-in-out infinite;
      }

      .echodesk-dot:nth-child(2) { animation-delay: 0.2s; }
      .echodesk-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes echodesk-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }

      .echodesk-input-area {
        padding: 14px 16px;
        border-top: 1px solid #f1f5f9;
        display: flex;
        gap: 8px;
        align-items: center;
        background: white;
        flex-shrink: 0;
      }

      .echodesk-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 13px;
        outline: none;
        background: #f8fafc;
        color: #1e293b;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      .echodesk-input:focus {
        border-color: ${widgetColor};
        background: white;
        box-shadow: 0 0 0 3px ${widgetColor}20;
      }

      .echodesk-input::placeholder {
        color: #94a3b8;
      }

      .echodesk-send {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: ${widgetColor};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .echodesk-send:hover {
        transform: scale(1.04);
        filter: brightness(1.05);
      }

      .echodesk-send:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none;
      }

      .echodesk-send svg {
        width: 16px;
        height: 16px;
        fill: white;
      }

      .echodesk-powered {
        text-align: center;
        padding: 8px;
        font-size: 10px;
        color: #94a3b8;
        background: white;
        border-top: 1px solid #f1f5f9;
      }

      .echodesk-powered a {
        color: #64748b;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.15s ease;
      }

      .echodesk-powered a:hover {
        color: ${widgetColor};
      }

      @media (max-width: 480px) {
        .echodesk-window {
          width: calc(100vw - 16px);
          height: calc(100vh - 80px);
          bottom: 72px;
          right: 8px;
          border-radius: 14px;
        }

        .echodesk-bubble {
          bottom: 16px;
          right: 16px;
          width: 56px;
          height: 56px;
        }
      }

      @media (max-height: 660px) {
        .echodesk-window {
          height: calc(100vh - 120px);
          bottom: 80px;
        }
      }

      /* Dark mode styles */
      .echodesk-dark .echodesk-window {
        background: #0c0c14;
        box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06);
      }
      .echodesk-dark .echodesk-messages {
        background: #08080d;
      }
      .echodesk-dark .echodesk-msg-assistant {
        background: #131320;
        color: #f8fafc;
        border-color: rgba(255,255,255,0.04);
      }
      .echodesk-dark .echodesk-typing {
        background: #131320;
        border-color: rgba(255,255,255,0.04);
      }
      .echodesk-dark .echodesk-input-area {
        background: #0c0c14;
        border-top-color: rgba(255,255,255,0.06);
      }
      .echodesk-dark .echodesk-input {
        background: #08080d;
        color: #f8fafc;
        border-color: rgba(255,255,255,0.08);
      }
      .echodesk-dark .echodesk-input:focus {
        background: #0d0d18;
      }
      .echodesk-dark .echodesk-input::placeholder {
        color: #5f6368;
      }
      .echodesk-dark .echodesk-powered {
        background: #0c0c14;
        border-top-color: rgba(255,255,255,0.06);
        color: #5f6368;
      }
      .echodesk-dark .echodesk-powered a {
        color: #94a3b8;
      }
    `;
    document.head.appendChild(style);
  }

  // ---- Create DOM Elements ----
  function createWidget() {
    // Container
    var container = document.createElement("div");
    container.className = "echodesk-widget";
    container.id = "echodesk-widget";

    // Chat bubble button
    var bubble = document.createElement("button");
    bubble.className = "echodesk-bubble";
    bubble.id = "echodesk-bubble";
    bubble.setAttribute("aria-label", "Open chat");
    bubble.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    // Chat window
    var chatWindow = document.createElement("div");
    chatWindow.className = "echodesk-window";
    chatWindow.id = "echodesk-window";

    chatWindow.innerHTML = [
      // Header
      '<div class="echodesk-header">',
      '  <div class="echodesk-header-avatar">',
      '    <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      "  </div>",
      '  <div class="echodesk-header-info">',
      "    <h3>" + escapeHtml(businessName) + "</h3>",
      "    <p>Powered by AI • Typically replies instantly</p>",
      "  </div>",
      '  <button class="echodesk-close" id="echodesk-close" aria-label="Close chat">',
      '    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      "  </button>",
      "</div>",
      // Messages
      '<div class="echodesk-messages" id="echodesk-messages"></div>',
      // Input
      '<div class="echodesk-input-area">',
      '  <input class="echodesk-input" id="echodesk-input" type="text" placeholder="Type your message..." autocomplete="off" />',
      '  <button class="echodesk-send" id="echodesk-send" aria-label="Send message">',
      '    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
      "  </button>",
      "</div>",
      // Powered by
      '<div class="echodesk-powered">Powered by <a href="' +
        API_BASE +
        '" target="_blank" rel="noopener">EchoDesk</a></div>',
    ].join("\n");

    container.appendChild(chatWindow);
    container.appendChild(bubble);
    document.body.appendChild(container);

    // ---- Event Listeners ----
    bubble.addEventListener("click", toggleChat);

    document.getElementById("echodesk-close").addEventListener("click", function () {
      closeChat();
    });

    document.getElementById("echodesk-send").addEventListener("click", function () {
      sendMessage();
    });

    document.getElementById("echodesk-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Show welcome message
    if (welcomeMessage) {
      addMessage("assistant", welcomeMessage);
    }

    // Theme Polling
    function checkTheme() {
      var isDark = false;
      try {
        if (window.parent && window.parent.document && window.parent.document.documentElement) {
          isDark = window.parent.document.documentElement.classList.contains("dark");
        }
      } catch (_) {}
      
      if (!isDark) {
        isDark = document.documentElement.classList.contains("dark") || 
                 localStorage.getItem("theme") === "dark";
      }

      var widgetContainer = document.getElementById("echodesk-widget");
      if (widgetContainer) {
        if (isDark) {
          widgetContainer.classList.add("echodesk-dark");
        } else {
          widgetContainer.classList.remove("echodesk-dark");
        }
      }
    }
    
    checkTheme();
    setInterval(checkTheme, 500);
  }

  // ---- Toggle / Open / Close ----
  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    isOpen = true;
    var chatWindow = document.getElementById("echodesk-window");
    var bubble = document.getElementById("echodesk-bubble");
    chatWindow.classList.add("echodesk-visible");
    bubble.classList.add("echodesk-open");
    bubble.innerHTML =
      '<svg viewBox="0 0 24 24" fill="white"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';

    // Focus input
    setTimeout(function () {
      var input = document.getElementById("echodesk-input");
      if (input) input.focus();
    }, 300);
  }

  function closeChat() {
    isOpen = false;
    var chatWindow = document.getElementById("echodesk-window");
    var bubble = document.getElementById("echodesk-bubble");
    chatWindow.classList.remove("echodesk-visible");
    bubble.classList.remove("echodesk-open");
    bubble.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  }

  // ---- Message Display ----
  function addMessage(role, content) {
    messages.push({ role: role, content: content });

    var messagesContainer = document.getElementById("echodesk-messages");
    var msgEl = document.createElement("div");
    msgEl.className = "echodesk-msg echodesk-msg-" + role;
    msgEl.textContent = content;
    messagesContainer.appendChild(msgEl);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTyping() {
    var messagesContainer = document.getElementById("echodesk-messages");
    var typingEl = document.createElement("div");
    typingEl.className = "echodesk-typing";
    typingEl.id = "echodesk-typing";
    typingEl.innerHTML =
      '<div class="echodesk-dot"></div><div class="echodesk-dot"></div><div class="echodesk-dot"></div>';
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTyping() {
    var typingEl = document.getElementById("echodesk-typing");
    if (typingEl) typingEl.remove();
  }

  // ---- Send Message ----
  function sendMessage() {
    var input = document.getElementById("echodesk-input");
    var message = input.value.trim();

    if (!message || isLoading) return;

    // Clear input
    input.value = "";

    // Display user message
    addMessage("user", message);

    // Show typing indicator
    isLoading = true;
    showTyping();

    // Disable send button
    document.getElementById("echodesk-send").disabled = true;

    // Send to API
    fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: ORG_ID,
        message: message,
        sessionId: sessionId || undefined,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        hideTyping();
        isLoading = false;
        document.getElementById("echodesk-send").disabled = false;

        if (data.error) {
          addMessage(
            "assistant",
            "Sorry, I encountered an error. Please try again later."
          );
          return;
        }

        // Save session ID for conversation continuity
        if (data.sessionId) {
          sessionId = data.sessionId;
          localStorage.setItem("echodesk_session_" + ORG_ID, sessionId);
        }

        // Display AI response
        addMessage("assistant", data.response);
      })
      .catch(function () {
        hideTyping();
        isLoading = false;
        document.getElementById("echodesk-send").disabled = false;
        addMessage(
          "assistant",
          "Sorry, I'm having trouble connecting. Please try again."
        );
      });
  }

  // ---- Utility ----
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // ---- Fetch Widget Config & Initialize ----
  function init() {
    fetch(API_BASE + "/api/widget?orgId=" + encodeURIComponent(ORG_ID))
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.businessName) businessName = data.businessName;
        if (data.widgetColor) widgetColor = data.widgetColor;
        if (data.welcomeMessage) welcomeMessage = data.welcomeMessage;
      })
      .catch(function () {
        // Use defaults if config fetch fails
      })
      .finally(function () {
        injectStyles();
        createWidget();
      });
  }

  // ---- Start ----
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
