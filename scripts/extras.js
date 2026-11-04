const STORAGE_KEY = "a11y-settings";
const CONSENT_KEY = "cookie-consent";
const defaults = { size: 0, contrast: false, links: false, font: false };
let settings = Object.assign({}, defaults);

function load(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

function save(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

function updateConsent(granted) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}

function applySettings() {
  const root = document.documentElement;
  root.style.fontSize = settings.size ? 100 + settings.size * 10 + "%" : "";
  root.classList.toggle("a11y-contrast", settings.contrast);
  root.classList.toggle("a11y-links", settings.links);
  root.classList.toggle("a11y-font", settings.font);
  save(STORAGE_KEY, JSON.stringify(settings));
}

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    #a11y-toggle{position:fixed;left:16px;bottom:16px;z-index:9998;width:52px;height:52px;border-radius:50%;border:0;cursor:pointer;font-size:26px;color:#fff;background:linear-gradient(90deg,#1e90ff,#d400ff);box-shadow:0 4px 14px rgba(0,0,0,.3)}
    #a11y-panel{position:fixed;left:16px;bottom:78px;z-index:9999;display:flex;flex-direction:column;gap:6px;padding:12px;width:220px;background:#2b2b2b;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
    #a11y-panel[hidden]{display:none}
    #a11y-panel button,#cookie-banner button{font:inherit;font-size:14px;cursor:pointer;border:0;border-radius:999px;padding:9px 14px;color:#fff}
    #a11y-panel button{background:#444;text-align:left}
    #cookie-banner{position:fixed;left:80px;right:16px;bottom:16px;max-width:640px;margin-left:auto;z-index:9997;display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:14px 16px;background:#2b2b2b;color:#fff;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
    #cookie-banner p{margin:0;flex:1 1 240px;font-size:14px;line-height:1.5}
    #cookie-banner button{background:linear-gradient(90deg,#1e90ff,#d400ff)}
    #cookie-banner button.secondary{background:#555}
    #a11y-toggle:focus-visible,#a11y-panel button:focus-visible,#cookie-banner button:focus-visible{outline:3px solid #ffb300;outline-offset:2px}
    html.a11y-links a{text-decoration:underline!important;outline:2px solid #ffb300}
    html.a11y-font body *:not([class*="fa-"]){font-family:Arial,Helvetica,sans-serif!important}
    html.a11y-contrast body,html.a11y-contrast body *{background:#000!important;background-image:none!important;color:#fff!important;border-color:#fff!important}
    html.a11y-contrast a,html.a11y-contrast a *{color:#ffeb3b!important}
    html.a11y-contrast button{border:2px solid #fff!important}
  `;
  document.head.appendChild(style);
}

function buildWidget() {
  const toggle = document.createElement("button");
  toggle.id = "a11y-toggle";
  toggle.type = "button";
  toggle.innerHTML = "&#9855;";
  toggle.setAttribute("aria-label", "Accessibility options");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "a11y-panel");

  const panel = document.createElement("div");
  panel.id = "a11y-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Accessibility options");
  panel.innerHTML =
    '<button type="button" data-action="bigger">Increase text</button>' +
    '<button type="button" data-action="smaller">Decrease text</button>' +
    '<button type="button" data-action="contrast">High contrast</button>' +
    '<button type="button" data-action="links">Highlight links</button>' +
    '<button type="button" data-action="font">Readable font</button>' +
    '<button type="button" data-action="reset">Reset</button>';

  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });

  panel.addEventListener("click", (event) => {
    const action = event.target.getAttribute("data-action");
    if (!action) return;
    if (action === "bigger") settings.size = Math.min(settings.size + 1, 5);
    if (action === "smaller") settings.size = Math.max(settings.size - 1, -2);
    if (action === "contrast") settings.contrast = !settings.contrast;
    if (action === "links") settings.links = !settings.links;
    if (action === "font") settings.font = !settings.font;
    if (action === "reset") settings = Object.assign({}, defaults);
    applySettings();
  });

  document.body.appendChild(toggle);
  document.body.appendChild(panel);
}

function buildBanner() {
  if (load(CONSENT_KEY)) return;

  const banner = document.createElement("div");
  banner.id = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Cookie consent");
  banner.innerHTML =
    "<p>This site uses cookies for anonymous analytics, to understand how it is used. You can accept or decline.</p>" +
    '<div><button type="button" data-consent="granted">Accept</button> ' +
    '<button type="button" class="secondary" data-consent="denied">Decline</button></div>';

  banner.addEventListener("click", (event) => {
    const choice = event.target.getAttribute("data-consent");
    if (!choice) return;
    save(CONSENT_KEY, choice);
    updateConsent(choice === "granted");
    banner.remove();
  });

  document.body.appendChild(banner);
}

function init() {
  try {
    settings = Object.assign(settings, JSON.parse(load(STORAGE_KEY) || "{}"));
  } catch (e) {}
  injectStyles();
  applySettings();
  buildWidget();
  buildBanner();
  if (load(CONSENT_KEY) === "granted") updateConsent(true);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
