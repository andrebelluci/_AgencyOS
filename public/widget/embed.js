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
  var autoOffset = script.getAttribute("data-auto-offset") !== "false";
  var manualOffsetBottom = parseInt(
    script.getAttribute("data-offset-bottom") || "",
    10,
  );
  var embedThemeOverride = (script.getAttribute("data-theme") || "").trim().toLowerCase();
  var primaryColor = "#2563eb";
  var brandingPrimaryColor = null;
  var assistantLabel = "Assistente virtual";
  var widgetTheme = "light";
  var prefersDark = false;
  var themeMediaQuery = null;

  var LAUNCHER_SIZE = 56;
  var MIN_BOTTOM = 20;
  var SIDE_PROBE = 140;
  var BOTTOM_BAND = 220;
  var STACK_GAP = 16;
  var FAB_MAX_HEIGHT = 80;
  var FAB_MAX_WIDTH = 280;
  var maxAutoOffset = parseInt(
    script.getAttribute("data-max-offset") || "140",
    10,
  );
  if (isNaN(maxAutoOffset) || maxAutoOffset < MIN_BOTTOM) {
    maxAutoOffset = 140;
  }
  var OFFSET_HYSTERESIS = 10;
  var offsetResizeTimer = null;
  var frozenLauncherBottom = null;
  var lastAppliedBottom = null;
  var offsetObserver = null;
  var onVisualViewportChange = null;
  var bodyPaddingRightBackup = "";
  var scrollLockY = 0;
  var offsetIgnoreSelectors = (
    script.getAttribute("data-offset-ignore") || ""
  )
    .split(",")
    .map(function (part) {
      return part.trim();
    })
    .filter(Boolean);

  var isOpen = false;
  var root = null;
  var launcher = null;
  var panel = null;
  var backdrop = null;
  var headerEl = null;
  var closeBtn = null;
  var iframe = null;
  var styleEl = null;
  var bodyOverflowBackup = "";
  var htmlOverflowBackup = "";
  var mobileMediaQuery = null;

  var chatUrl =
    baseUrl + "/chat?key=" + encodeURIComponent(publicKey);

  function normalizeTheme(value) {
    if (value === "dark" || value === "auto" || value === "light") {
      return value;
    }
    return "light";
  }

  function resolveTheme() {
    if (
      embedThemeOverride === "light" ||
      embedThemeOverride === "dark" ||
      embedThemeOverride === "auto"
    ) {
      return embedThemeOverride;
    }
    return normalizeTheme(widgetTheme);
  }

  function isDarkTheme() {
    var theme = resolveTheme();
    if (theme === "dark") {
      return true;
    }
    if (theme === "light") {
      return false;
    }
    return prefersDark;
  }

  function buildChatUrl() {
    var url = chatUrl;
    if (
      embedThemeOverride === "light" ||
      embedThemeOverride === "dark" ||
      embedThemeOverride === "auto"
    ) {
      url += "&theme=" + encodeURIComponent(embedThemeOverride);
    }
    return url;
  }

  function applyPanelTheme() {
    if (!panel) {
      return;
    }

    var dark = isDarkTheme();
    panel.setAttribute("data-aos-theme", dark ? "dark" : "light");
    if (backdrop) {
      backdrop.setAttribute("data-aos-theme", dark ? "dark" : "light");
    }
    applyHeaderTheme();
  }

  function darkenHex(hex, amount) {
    var h = String(hex || "").replace("#", "").trim();
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    if (h.length !== 6 || !/^[0-9a-fA-F]+$/.test(h)) {
      return hex;
    }
    var factor = 1 - amount;
    var r = Math.round(parseInt(h.slice(0, 2), 16) * factor);
    var g = Math.round(parseInt(h.slice(2, 4), 16) * factor);
    var b = Math.round(parseInt(h.slice(4, 6), 16) * factor);
    return (
      "#" +
      [r, g, b]
        .map(function (channel) {
          var part = Math.max(0, Math.min(255, channel)).toString(16);
          return part.length === 1 ? "0" + part : part;
        })
        .join("")
    );
  }

  function applyHeaderTheme() {
    if (!headerEl || !closeBtn) {
      return;
    }

    var dark = isDarkTheme();

    if (brandingPrimaryColor) {
      headerEl.style.backgroundColor = darkenHex(brandingPrimaryColor, 0.1);
      headerEl.style.color = "#ffffff";
      closeBtn.style.color = "#ffffff";
      return;
    }

    if (dark) {
      headerEl.style.backgroundColor = "#000000";
      headerEl.style.color = "#f8fafc";
      closeBtn.style.color = "#f8fafc";
      return;
    }

    headerEl.style.backgroundColor = "#ffffff";
    headerEl.style.color = "#0f172a";
    closeBtn.style.color = "#64748b";
  }

  function isMobileViewport() {
    if (mobileMediaQuery) {
      return mobileMediaQuery.matches;
    }
    return window.innerWidth <= 480;
  }

  function lockBodyScroll() {
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    var scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    bodyOverflowBackup = document.body.style.overflow;
    bodyPaddingRightBackup = document.body.style.paddingRight;
    htmlOverflowBackup = document.documentElement.style.overflow;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + "px";
    }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    document.body.style.overflow = bodyOverflowBackup;
    document.body.style.paddingRight = bodyPaddingRightBackup;
    document.documentElement.style.overflow = htmlOverflowBackup;
  }

  function clearPanelInlinePosition() {
    if (!panel) {
      return;
    }
    panel.style.top = "";
    panel.style.right = "";
    panel.style.bottom = "";
    panel.style.left = "";
  }

  function bindThemeMediaQuery() {
    if (!window.matchMedia) {
      return;
    }

    themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDark = themeMediaQuery.matches;

    var onThemeChange = function () {
      prefersDark = themeMediaQuery.matches;
      applyPanelTheme();
    };

    if (themeMediaQuery.addEventListener) {
      themeMediaQuery.addEventListener("change", onThemeChange);
    } else if (themeMediaQuery.addListener) {
      themeMediaQuery.addListener(onThemeChange);
    }
  }

  var css =
    ".aos-embed-root{position:fixed;inset:0;z-index:" +
    zIndex +
    ";font-family:system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;isolation:isolate;pointer-events:none}" +
    ".aos-embed-launcher{position:fixed;width:56px;height:56px;margin:0;padding:0;border:none;border-radius:9999px;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,0,0,.2);transition:transform .2s ease,box-shadow .2s ease;color:#fff;pointer-events:auto;-webkit-tap-highlight-color:transparent}" +
    ".aos-embed-launcher:hover{transform:scale(1.05);box-shadow:0 8px 28px rgba(0,0,0,.25)}" +
    ".aos-embed-launcher:focus-visible{outline:3px solid rgba(37,99,235,.45);outline-offset:2px}" +
    ".aos-embed-launcher svg{width:26px;height:26px;fill:currentColor}" +
    ".aos-embed-bottom-right{right:max(20px,env(safe-area-inset-right,0px))}" +
    ".aos-embed-bottom-left{left:max(20px,env(safe-area-inset-left,0px))}" +
    ".aos-embed-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s ease;z-index:0}" +
    ".aos-embed-backdrop.aos-open{opacity:1;pointer-events:auto}" +
    ".aos-embed-panel{position:fixed;display:flex;flex-direction:column;overflow:hidden;background:#fff;border-radius:16px;box-shadow:0 24px 48px rgba(0,0,0,.22);opacity:0;transform:translateY(12px) scale(.98);pointer-events:auto;transition:opacity .2s ease,transform .2s ease,background-color .2s ease;z-index:1}" +
    ".aos-embed-panel[data-aos-theme=\"dark\"]{background:#0f172a;box-shadow:0 24px 48px rgba(0,0,0,.5)}" +
    ".aos-embed-panel.aos-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}" +
    ".aos-embed-panel-bottom-right{bottom:88px;right:20px;width:min(400px,calc(100vw - 24px));max-width:calc(100vw - 24px);height:min(640px,calc(100dvh - 112px));max-height:calc(100dvh - 112px)}" +
    ".aos-embed-panel-bottom-left{bottom:88px;left:20px;width:min(400px,calc(100vw - 24px));max-width:calc(100vw - 24px);height:min(640px,calc(100dvh - 112px));max-height:calc(100dvh - 112px)}" +
    ".aos-embed-panel-mobile{inset:0!important;width:100%!important;max-width:100%!important;height:100%!important;max-height:100dvh!important;border-radius:0!important;margin:0!important}" +
    ".aos-embed-header{flex-shrink:0;display:flex;align-items:center;justify-content:flex-end;min-height:48px;padding:0 4px 0 12px;position:relative;z-index:3;background:#fff;cursor:default;border-bottom:1px solid rgba(0,0,0,.06)}" +
    ".aos-embed-panel[data-aos-theme=\"dark\"] .aos-embed-header{background:#000;border-bottom-color:rgba(255,255,255,.08)}" +
    ".aos-embed-body{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;overflow:hidden;z-index:1}" +
    ".aos-embed-close{margin:0;border:none;background:transparent;cursor:pointer;width:44px;height:44px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;pointer-events:auto}" +
    ".aos-embed-close:hover{background:rgba(0,0,0,.06)}" +
    ".aos-embed-panel[data-aos-theme=\"dark\"] .aos-embed-close:hover{background:rgba(255,255,255,.1)}" +
    ".aos-embed-close:focus-visible{outline:2px solid rgba(37,99,235,.45);outline-offset:1px}" +
    ".aos-embed-frame{flex:1;border:none;width:100%;height:100%;min-height:0;display:block;pointer-events:auto}" +
    "@media (max-width:480px){.aos-embed-backdrop.aos-open{background:rgba(0,0,0,.55)}}";

  function injectStyles() {
    if (styleEl) {
      return;
    }
    styleEl = document.createElement("style");
    styleEl.setAttribute("data-aos-embed", "true");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  function isEmbedNode(el) {
    if (!el || !el.closest) {
      return false;
    }
    return Boolean(
      el.closest("[data-aos-embed-root]") ||
        el.classList.contains("aos-embed-launcher") ||
        el.classList.contains("aos-embed-panel") ||
        el.classList.contains("aos-embed-backdrop"),
    );
  }

  function isVisibleFixedElement(el) {
    var rect = el.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) {
      return false;
    }

    var style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }
    if (parseFloat(style.opacity || "1") === 0) {
      return false;
    }
    if (style.pointerEvents === "none") {
      return false;
    }

    return style.position === "fixed" || style.position === "sticky";
  }

  function matchesOffsetIgnoreSelector(el) {
    if (!el || !el.matches) {
      return false;
    }
    var i;
    for (i = 0; i < offsetIgnoreSelectors.length; i += 1) {
      try {
        if (el.matches(offsetIgnoreSelectors[i])) {
          return true;
        }
      } catch (_error) {
        /* invalid selector on script tag */
      }
    }
    return false;
  }

  function isIgnorableOffsetElement(el) {
    if (!el) {
      return false;
    }
    if (el.getAttribute("data-aos-offset-ignore") === "true") {
      return true;
    }
    if (matchesOffsetIgnoreSelector(el)) {
      return true;
    }

    var id = (el.id || "").toLowerCase();
    var className = (el.className || "").toString().toLowerCase();
    var aria = (el.getAttribute("aria-label") || "").toLowerCase();
    var role = (el.getAttribute("role") || "").toLowerCase();

    if (
      id.indexOf("cookie") !== -1 ||
      id.indexOf("consent") !== -1 ||
      id.indexOf("gdpr") !== -1 ||
      className.indexOf("cookie") !== -1 ||
      className.indexOf("consent") !== -1 ||
      className.indexOf("gdpr") !== -1 ||
      className.indexOf("onetrust") !== -1 ||
      className.indexOf("termly") !== -1 ||
      aria.indexOf("cookie") !== -1 ||
      aria.indexOf("consent") !== -1
    ) {
      return true;
    }
    if (
      id === "back-to-top" ||
      aria.indexOf("voltar ao topo") !== -1 ||
      aria.indexOf("back to top") !== -1
    ) {
      return true;
    }
    if (
      className.indexOf("blessing-screen") !== -1 ||
      className.indexOf("site-florals") !== -1 ||
      className.indexOf("intro-screen") !== -1
    ) {
      return true;
    }
    if (role === "dialog" || role === "alertdialog") {
      return true;
    }

    return false;
  }

  function isFullscreenOverlay(rect, viewportW, viewportH) {
    return (
      rect.width >= viewportW * 0.85 && rect.height >= viewportH * 0.85
    );
  }

  function isPeerFab(rect) {
    if (rect.height > FAB_MAX_HEIGHT || rect.height < 20) {
      return false;
    }
    if (rect.width > FAB_MAX_WIDTH) {
      return false;
    }
    return true;
  }

  function forEachOffsetCandidate(callback) {
    if (!document.body) {
      return;
    }

    var stack = [document.body];
    while (stack.length > 0) {
      var node = stack.pop();
      if (!node || node.nodeType !== 1) {
        continue;
      }

      callback(node);

      if (node.shadowRoot) {
        var shadowChild = node.shadowRoot.firstElementChild;
        while (shadowChild) {
          stack.push(shadowChild);
          shadowChild = shadowChild.nextElementSibling;
        }
      }

      var child = node.firstElementChild;
      while (child) {
        stack.push(child);
        child = child.nextElementSibling;
      }
    }
  }

  function formatLauncherBottom(px) {
    return "calc(" + px + "px + env(safe-area-inset-bottom, 0px))";
  }

  function dispatchOffsetChange(bottom) {
    publishLauncherOffset(bottom);
    try {
      window.dispatchEvent(
        new CustomEvent("agencyos:launcher-offset", {
          detail: {
            bottom: bottom,
            size: LAUNCHER_SIZE,
          },
        }),
      );
    } catch (_error) {
      /* CustomEvent unavailable */
    }
  }

  function detectBottomOffset() {
    if (isOpen && frozenLauncherBottom !== null) {
      return frozenLauncherBottom;
    }
    if (!isNaN(manualOffsetBottom) && manualOffsetBottom >= 0) {
      return manualOffsetBottom;
    }
    if (!autoOffset) {
      return MIN_BOTTOM;
    }

    var sideRight = position !== "bottom-left";
    var viewportW = window.innerWidth;
    var viewportH = window.innerHeight;
    var neededBottom = MIN_BOTTOM;

    forEachOffsetCandidate(function (el) {
      if (isEmbedNode(el)) {
        return;
      }
      if (isIgnorableOffsetElement(el)) {
        return;
      }
      if (!isVisibleFixedElement(el)) {
        return;
      }

      var rect = el.getBoundingClientRect();
      if (isFullscreenOverlay(rect, viewportW, viewportH)) {
        return;
      }
      if (!isPeerFab(rect)) {
        return;
      }
      if (rect.bottom < viewportH - BOTTOM_BAND) {
        return;
      }

      if (sideRight) {
        if (rect.right < viewportW - SIDE_PROBE) {
          return;
        }
      } else if (rect.left > SIDE_PROBE) {
        return;
      }

      var stackBottom = viewportH - rect.top + STACK_GAP;
      if (stackBottom > neededBottom) {
        neededBottom = stackBottom;
      }
    });

    return Math.min(neededBottom, maxAutoOffset);
  }

  function publishLauncherOffset(bottom) {
    if (!document.documentElement) {
      return;
    }
    document.documentElement.style.setProperty(
      "--aos-embed-launcher-bottom",
      bottom + "px",
    );
    document.documentElement.style.setProperty(
      "--aos-embed-launcher-size",
      LAUNCHER_SIZE + "px",
    );
    document.documentElement.style.setProperty(
      "--aos-embed-launcher-stack",
      "calc(" +
        bottom +
        "px + " +
        LAUNCHER_SIZE +
        "px + env(safe-area-inset-bottom, 0px))",
    );
  }

  function applyPanelLayout() {
    if (!launcher || !panel) {
      return;
    }

    var bottom = detectBottomOffset();
    if (
      autoOffset &&
      isNaN(manualOffsetBottom) &&
      lastAppliedBottom !== null &&
      Math.abs(bottom - lastAppliedBottom) < OFFSET_HYSTERESIS
    ) {
      bottom = lastAppliedBottom;
    }
    if (bottom !== lastAppliedBottom) {
      lastAppliedBottom = bottom;
      dispatchOffsetChange(bottom);
    }

    launcher.style.bottom = formatLauncherBottom(bottom);

    if (isMobileViewport()) {
      panel.classList.add("aos-embed-panel-mobile");
      clearPanelInlinePosition();
      return;
    }

    panel.classList.remove("aos-embed-panel-mobile");
    clearPanelInlinePosition();

    var panelBottom = bottom + LAUNCHER_SIZE + 12;
    var viewportH = window.innerHeight;
    var panelHeight = panel.offsetHeight || Math.min(640, viewportH - 112);
    var maxPanelBottom = Math.max(12, viewportH - panelHeight - 12);

    panel.style.bottom = Math.min(panelBottom, maxPanelBottom) + "px";

    var viewportW = window.innerWidth;
    var panelWidth = Math.min(400, viewportW - 24);
    var sideInset = 12;

    if (position === "bottom-left") {
      panel.style.left = sideInset + "px";
      panel.style.right = "auto";
    } else {
      panel.style.right = sideInset + "px";
      panel.style.left = "auto";
    }

    panel.style.width = panelWidth + "px";
    panel.style.maxWidth = "calc(100vw - 24px)";
    panel.style.maxHeight = "calc(100dvh - " + (panelBottom + 16) + "px)";
  }

  function scheduleOffsetUpdate() {
    if (isOpen) {
      return;
    }
    if (offsetResizeTimer) {
      window.clearTimeout(offsetResizeTimer);
    }
    offsetResizeTimer = window.setTimeout(function () {
      applyPanelLayout();
    }, 120);
  }

  function bindOffsetObservers() {
    if (!autoOffset || (!isNaN(manualOffsetBottom) && manualOffsetBottom >= 0)) {
      return;
    }

    if (typeof MutationObserver !== "undefined" && document.body && !offsetObserver) {
      offsetObserver = new MutationObserver(scheduleOffsetUpdate);
      offsetObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style", "hidden", "aria-hidden"],
      });
    }

    if (window.visualViewport && !onVisualViewportChange) {
      onVisualViewportChange = scheduleOffsetUpdate;
      window.visualViewport.addEventListener("resize", onVisualViewportChange);
      window.visualViewport.addEventListener("scroll", onVisualViewportChange);
    }

    window.addEventListener("orientationchange", scheduleOffsetUpdate);
    window.addEventListener("agencyos:recalculate-offset", scheduleOffsetUpdate);
  }

  function unbindOffsetObservers() {
    if (offsetObserver) {
      offsetObserver.disconnect();
      offsetObserver = null;
    }
    if (window.visualViewport && onVisualViewportChange) {
      window.visualViewport.removeEventListener("resize", onVisualViewportChange);
      window.visualViewport.removeEventListener("scroll", onVisualViewportChange);
      onVisualViewportChange = null;
    }
    window.removeEventListener("orientationchange", scheduleOffsetUpdate);
    window.removeEventListener("agencyos:recalculate-offset", scheduleOffsetUpdate);
  }

  function bindMobileMediaQuery() {
    if (!window.matchMedia) {
      return;
    }
    mobileMediaQuery = window.matchMedia("(max-width: 480px)");
    var onMobileChange = function () {
      if (isOpen) {
        return;
      }
      applyPanelLayout();
    };
    if (mobileMediaQuery.addEventListener) {
      mobileMediaQuery.addEventListener("change", onMobileChange);
    } else if (mobileMediaQuery.addListener) {
      mobileMediaQuery.addListener(onMobileChange);
    }
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

    headerEl = document.createElement("div");
    headerEl.className = "aos-embed-header";

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "aos-embed-close";
    closeBtn.setAttribute("aria-label", "Fechar chat");
    closeBtn.innerHTML = closeIconSvg();
    closeBtn.addEventListener("click", close);

    headerEl.appendChild(closeBtn);

    var bodyEl = document.createElement("div");
    bodyEl.className = "aos-embed-body";

    iframe = document.createElement("iframe");
    iframe.className = "aos-embed-frame";
    iframe.title = "Agency OS Chat";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("allow", "clipboard-write");

    bodyEl.appendChild(iframe);
    panel.appendChild(headerEl);
    panel.appendChild(bodyEl);

    root.appendChild(backdrop);
    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    document.addEventListener("keydown", onKeyDown);
    bindThemeMediaQuery();
    bindMobileMediaQuery();
    applyPanelTheme();
    applyPanelLayout();
    window.addEventListener("resize", scheduleOffsetUpdate);
    bindOffsetObservers();
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
    brandingPrimaryColor = color;
    launcher.style.backgroundColor = color;
    launcher.style.setProperty("--aos-primary", color);
    applyHeaderTheme();
  }

  function open() {
    ensureDom();
    if (isOpen) {
      return;
    }

    if (!iframe.src) {
      iframe.src = buildChatUrl();
    }

    frozenLauncherBottom = detectBottomOffset();
    applyPanelTheme();
    applyPanelLayout();
    isOpen = true;
    backdrop.classList.add("aos-open");
    panel.classList.add("aos-open");
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Fechar chat");
    lockBodyScroll();
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
    unlockBodyScroll();
    frozenLauncherBottom = null;
    scheduleOffsetUpdate();
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
    window.removeEventListener("resize", scheduleOffsetUpdate);
    unbindOffsetObservers();
    if (offsetResizeTimer) {
      window.clearTimeout(offsetResizeTimer);
      offsetResizeTimer = null;
    }
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
    headerEl = null;
    closeBtn = null;
    iframe = null;
    styleEl = null;
    isOpen = false;
    frozenLauncherBottom = null;
    unlockBodyScroll();
    lastAppliedBottom = null;
    if (document.documentElement) {
      document.documentElement.style.removeProperty("--aos-embed-launcher-bottom");
      document.documentElement.style.removeProperty("--aos-embed-launcher-size");
      document.documentElement.style.removeProperty("--aos-embed-launcher-stack");
    }
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

        if (config.assistant_label) {
          assistantLabel = config.assistant_label;
          if (launcher) {
            launcher.setAttribute(
              "aria-label",
              "Abrir chat com " + assistantLabel,
            );
          }
        }

        if (config.theme) {
          widgetTheme = normalizeTheme(config.theme);
          applyPanelTheme();
        }

        scheduleOffsetUpdate();
        window.setTimeout(scheduleOffsetUpdate, 600);
        window.setTimeout(scheduleOffsetUpdate, 2000);
        window.setTimeout(scheduleOffsetUpdate, 5000);
        window.setTimeout(scheduleOffsetUpdate, 10000);
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
    recalculateOffset: function () {
      if (!isOpen) {
        applyPanelLayout();
      }
    },
    getLauncherBottom: function () {
      if (frozenLauncherBottom !== null) {
        return frozenLauncherBottom;
      }
      if (lastAppliedBottom !== null) {
        return lastAppliedBottom;
      }
      return detectBottomOffset();
    },
    getPublicKey: function () {
      return publicKey;
    },
    getChatUrl: function () {
      return buildChatUrl();
    },
  };
})();
