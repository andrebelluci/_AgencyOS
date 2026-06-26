/**
 * Agency OS — Widget embed (ISSUE-018)
 *
 * Usage:
 * <script src="https://app.agencyos.com.br/widget/embed.js" data-key="PUBLIC_KEY"></script>
 */
(function () {
  "use strict";

  if (window.AgencyOSWidget) {
    return;
  }

  var script = document.currentScript;
  if (!script || !script.src) {
    console.error("[Agency OS] embed.js must be loaded via <script src=\"...\">");
    return;
  }

  var publicKey = (script.getAttribute("data-key") || "").trim();
  if (!publicKey) {
    console.error("[Agency OS] data-key attribute is required on the embed script tag.");
    return;
  }

  var baseUrl = new URL(script.src).origin;
  var position = (script.getAttribute("data-position") || "bottom-right").trim();
  var zIndex = script.getAttribute("data-z-index") || "2147483646";
  var primaryColor = "#2563eb";

  var isOpen = false;
  var root = null;
  var launcher = null;
  var panel = null;
  var backdrop = null;
  var iframe = null;
  var styleEl = null;

  var chatUrl =
    baseUrl + "/chat?key=" + encodeURIComponent(publicKey);

  var css =
    ".aos-embed-root{position:fixed;z-index:" +
    zIndex +
    ";font-family:system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif}" +
    ".aos-embed-launcher{position:fixed;width:56px;height:56px;border:none;border-radius:9999px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(15,23,42,.18);transition:transform .2s ease,box-shadow .2s ease;color:#fff}" +
    ".aos-embed-launcher:hover{transform:scale(1.05);box-shadow:0 8px 28px rgba(15,23,42,.22)}" +
    ".aos-embed-launcher:focus-visible{outline:3px solid rgba(37,99,235,.45);outline-offset:2px}" +
    ".aos-embed-launcher svg{width:26px;height:26px;fill:currentColor}" +
    ".aos-embed-bottom-right{bottom:20px;right:20px}" +
    ".aos-embed-bottom-left{bottom:20px;left:20px}" +
    ".aos-embed-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.4);opacity:0;pointer-events:none;transition:opacity .2s ease}" +
    ".aos-embed-backdrop.aos-open{opacity:1;pointer-events:auto}" +
    ".aos-embed-panel{position:fixed;display:flex;flex-direction:column;overflow:hidden;background:#fff;border-radius:16px;box-shadow:0 24px 48px rgba(15,23,42,.2);opacity:0;transform:translateY(12px) scale(.98);pointer-events:none;transition:opacity .2s ease,transform .2s ease}" +
    ".aos-embed-panel.aos-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}" +
    ".aos-embed-panel-bottom-right{bottom:88px;right:20px;width:min(400px,calc(100vw - 32px));height:min(640px,calc(100vh - 112px))}" +
    ".aos-embed-panel-bottom-left{bottom:88px;left:20px;width:min(400px,calc(100vw - 32px));height:min(640px,calc(100vh - 112px))}" +
    ".aos-embed-close{align-self:flex-end;margin:8px 8px 0;border:none;background:transparent;color:#64748b;cursor:pointer;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center}" +
    ".aos-embed-close:hover{background:#f1f5f9;color:#0f172a}" +
    ".aos-embed-close:focus-visible{outline:2px solid rgba(37,99,235,.45);outline-offset:1px}" +
    ".aos-embed-frame{flex:1;border:none;width:100%;min-height:0}" +
    "@media (max-width:480px){.aos-embed-panel-bottom-right,.aos-embed-panel-bottom-left{inset:0;width:100%;height:100%;border-radius:0;bottom:0;right:0;left:0}.aos-embed-backdrop.aos-open{background:rgba(15,23,42,.55)}}";

  function injectStyles() {
    if (styleEl) {
      return;
    }
    styleEl = document.createElement("style");
    styleEl.setAttribute("data-aos-embed", "true");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  function positionClass(prefix) {
    return position === "bottom-left"
      ? prefix + "-bottom-left"
      : prefix + "-bottom-right";
  }

  function chatIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>' +
      "</svg>"
    );
  }

  function closeIconSvg() {
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">' +
      '<path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>' +
      "</svg>"
    );
  }

  function ensureDom() {
    if (root) {
      return;
    }

    injectStyles();

    root = document.createElement("div");
    root.className = "aos-embed-root";
    root.setAttribute("data-aos-embed-root", "true");

    backdrop = document.createElement("div");
    backdrop.className = "aos-embed-backdrop";
    backdrop.addEventListener("click", close);

    launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className =
      "aos-embed-launcher " + positionClass("aos-embed");
    launcher.style.backgroundColor = primaryColor;
    launcher.setAttribute("aria-label", "Abrir chat");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "aos-embed-panel");
    launcher.innerHTML = chatIconSvg();
    launcher.addEventListener("click", toggle);

    panel = document.createElement("div");
    panel.id = "aos-embed-panel";
    panel.className = "aos-embed-panel " + positionClass("aos-embed-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat");
    panel.setAttribute("aria-hidden", "true");

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "aos-embed-close";
    closeBtn.setAttribute("aria-label", "Fechar chat");
    closeBtn.innerHTML = closeIconSvg();
    closeBtn.addEventListener("click", close);

    iframe = document.createElement("iframe");
    iframe.className = "aos-embed-frame";
    iframe.title = "Agency OS Chat";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("allow", "clipboard-write");

    panel.appendChild(closeBtn);
    panel.appendChild(iframe);

    root.appendChild(backdrop);
    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    document.addEventListener("keydown", onKeyDown);
  }

  function onKeyDown(event) {
    if (event.key === "Escape" && isOpen) {
      close();
    }
  }

  function applyBranding(color) {
    if (!color || !launcher) {
      return;
    }

    primaryColor = color;
    launcher.style.backgroundColor = color;
    launcher.style.setProperty("--aos-primary", color);
  }

  function open() {
    ensureDom();
    if (isOpen) {
      return;
    }

    if (!iframe.src) {
      iframe.src = chatUrl;
    }

    isOpen = true;
    backdrop.classList.add("aos-open");
    panel.classList.add("aos-open");
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Fechar chat");
  }

  function close() {
    if (!isOpen || !root) {
      return;
    }

    isOpen = false;
    backdrop.classList.remove("aos-open");
    panel.classList.remove("aos-open");
    panel.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Abrir chat");
  }

  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  function destroy() {
    document.removeEventListener("keydown", onKeyDown);
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
    if (styleEl && styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }
    root = null;
    launcher = null;
    panel = null;
    backdrop = null;
    iframe = null;
    styleEl = null;
    isOpen = false;
    delete window.AgencyOSWidget;
  }

  function loadBranding() {
    var configUrl =
      baseUrl +
      "/api/widget/config?key=" +
      encodeURIComponent(publicKey);

    fetch(configUrl, { method: "GET", credentials: "omit" })
      .then(function (response) {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then(function (config) {
        if (!config) {
          return;
        }

        if (config.primary_color) {
          applyBranding(config.primary_color);
        }
      })
      .catch(function () {
        /* branding is optional */
      });
  }

  ensureDom();
  loadBranding();

  window.AgencyOSWidget = {
    open: open,
    close: close,
    toggle: toggle,
    destroy: destroy,
    getPublicKey: function () {
      return publicKey;
    },
    getChatUrl: function () {
      return chatUrl;
    },
  };
})();
