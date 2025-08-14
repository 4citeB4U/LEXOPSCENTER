// Strict, safe, images-only Google CSE controller (no UI changes, no CSS edits)
declare global {
  interface Window {
    __LEXINTEL_CSE_READY__?: boolean;
    __gcse?: any;
    google?: any;
  }
}

const CSE_ID = "e4baf2ea06e8f4d39";               // your LexIntel CSE
const CSE_SRC = `https://cse.google.com/cse.js?cx=${CSE_ID}`;
const ELEMENT_GNAME = "lexintel-images";           // matches <div id="lexintel-images">

let loading = false;
let loaded = false;
const queue: string[] = [];

/** Load CSE script once, with explicit parsing for reliable init */
function loadCSE(): Promise<void> {
  if (loaded || window.__LEXINTEL_CSE_READY__) return Promise.resolve();
  if (loading) {
    return new Promise((res) => {
      const iv = setInterval(() => {
        if (loaded || window.__LEXINTEL_CSE_READY__) { clearInterval(iv); res(); }
      }, 50);
    });
  }
  loading = true;

  // Ask CSE not to auto-parse; we'll trigger readiness explicitly
  window.__gcse = { parsetags: "explicit", callback: () => {
    // When google is ready, mark ready after the element exists
    const check = () => {
      try {
        const el = window.google?.search?.cse?.element?.getElement(ELEMENT_GNAME);
        if (el) {
          window.__LEXINTEL_CSE_READY__ = true;
          loaded = true;
          // Flush any queued searches
          while (queue.length) el.execute(queue.shift());
          return;
        }
      } catch {}
      // If not yet parsed, try to parse now
      try { window.google?.search?.cse?.element?.init(); } catch {}
      setTimeout(check, 50);
    };
    check();
  }};

  // Inject script once
  const existing = document.querySelector(`script[src^="https://cse.google.com/cse.js"]`);
  if (!existing) {
    const s = document.createElement("script");
    s.async = true;
    s.src = CSE_SRC;
    s.onload = () => { /* __gcse.callback handles readiness */ };
    s.onerror = () => console.warn("[LexIntel] Failed to load Google CSE.");
    document.head.appendChild(s);
  } else {
    // If the script is already present, call callback path
    setTimeout(() => window.__gcse?.callback?.(), 0);
  }

  return new Promise((res) => {
    const iv = setInterval(() => {
      if (loaded || window.__LEXINTEL_CSE_READY__) { clearInterval(iv); res(); }
    }, 50);
  });
}

/** Public: run an images-only query; safe to call before CSE is ready */
export async function runImageOnly(query: string) {
  // Ensure the element exists in DOM before loading (so CSE wires the named block)
  if (!document.getElementById(ELEMENT_GNAME)) {
    console.warn(`[LexIntel] Missing #${ELEMENT_GNAME} container.`);
    return;
  }
  await loadCSE();

  try {
    const el = window.google?.search?.cse?.element?.getElement(ELEMENT_GNAME);
    if (el) {
      el.execute(query ?? "");
    } else {
      // Very first calls may race; queue it
      queue.push(query ?? "");
    }
  } catch (e) {
    console.warn("[LexIntel] CSE execute failed:", e);
    queue.push(query ?? "");
  }
}

/** Optional: initialize early (e.g., on page load) */
export function primeLexIntelImages() {
  // Kicks off loader so first search is instant
  loadCSE().catch(() => {});
}
