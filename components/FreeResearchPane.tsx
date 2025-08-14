import { useEffect, useRef, useState } from "react";
import { runImageOnly, primeLexIntelImages } from "../src/lib/lexintelImages";
import { makeInputDictationEnabled } from "../services/universalDictation";

/** Your Google Programmable Search Engine ID (LexIntel) */
const CX = "e4baf2ea06e8f4d39";

/** DuckDuckGo Instant Answer (free JSON facts) */
async function ddgInstant(q: string) {
  const u = new URL("https://api.duckduckgo.com/");
  u.searchParams.set("q", q);
  u.searchParams.set("format", "json");
  u.searchParams.set("no_html", "1");
  u.searchParams.set("no_redirect", "1");
  u.searchParams.set("t", "lexintel");
  const r = await fetch(u.toString());
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<{
    Heading?: string;
    Abstract?: string;
    AbstractText?: string;
    AbstractURL?: string;
    Infobox?: any;
  }>;
}

declare global {
  interface Window {
    __gcse?: { callback?: () => void };
    google?: any;
  }
}

function useGoogleCSE() {
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (window.google?.search?.cse?.element) { 
      setReady(true); 
      return; 
    }
    if (loaded.current) return;
    loaded.current = true;
    
    // Set up Google CSE callback
    window.__gcse = { 
      callback: () => {
        // Wait a bit for Google to fully initialize
        setTimeout(() => {
          if (window.google?.search?.cse?.element) {
            setReady(true);
            console.log("Google CSE is ready");
          }
        }, 500);
      } 
    };
    
    // Load Google CSE script
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://cse.google.com/cse.js?cx=${CX}`;
    s.onload = () => console.log("Google CSE script loaded");
    s.onerror = () => console.error("Failed to load Google CSE script");
    document.head.appendChild(s);
  }, []);

  function execute(query: string, id = "lexintel-results") {
    console.log("Executing Google search for:", query);
    const el = window.google?.search?.cse?.element?.getElement(id);
    if (!el) {
      console.warn("CSE element not found, trying to initialize...");
      try {
        window.google?.search?.cse?.element?.init();
        setTimeout(() => {
          const el2 = window.google?.search?.cse?.element?.getElement(id);
          if (el2) {
            console.log("Executing search after init");
            el2.execute(query);
          } else {
            console.error("Still cannot find CSE element");
          }
        }, 1000);
        return;
      } catch (e) {
        console.error("Failed to initialize CSE:", e);
        return;
      }
    }
    console.log("Executing search with element:", el);
    el.execute(query);
  }

  function executeImageSearch(query: string) {
    console.log("Executing image search for:", query);
    runImageOnly(q);
  }

  return { ready, execute, executeImageSearch };
}

export default function FreeResearchPane() {
  const { ready, execute, executeImageSearch } = useGoogleCSE();
  const [q, setQ] = useState("");
  const [fact, setFact] = useState<{ heading?: string; text?: string; url?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'web' | 'images'>('web');
  const [searchStatus, setSearchStatus] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Prime the image search at component mount
  useEffect(() => {
    primeLexIntelImages();
  }, []);

  // Make search input dictation-enabled
  useEffect(() => {
    if (searchInputRef.current) {
      makeInputDictationEnabled(searchInputRef.current);
    }
  }, []);

  async function run() {
    if (!q.trim()) return;
    setLoading(true);
    setSearchStatus("Starting search...");
    
    try {
      // Step 1: Execute Google search FIRST (who, what, when, where, why, how)
      setSearchStatus("Running Google search...");
      if (ready) {
        if (activeTab === 'images') {
          executeImageSearch(q);
          setSearchStatus("Google image search completed");
        } else {
          execute(q);
          setSearchStatus("Google web search completed");
        }
      } else {
        setSearchStatus("Google CSE not ready, retrying...");
        // Retry after a short delay
        setTimeout(() => {
          if (activeTab === 'images') {
            executeImageSearch(q);
          } else {
            execute(q);
          }
          setSearchStatus("Google search completed (retry)");
        }, 1000);
      }

      // Step 2: Get DuckDuckGo instant answer for deeper insights
      setSearchStatus("Getting DuckDuckGo insights...");
      const j = await ddgInstant(q);
      setFact({
        heading: j.Heading || undefined,
        text: j.AbstractText || j.Abstract || undefined,
        url: j.AbstractURL || undefined,
      });
      
      setSearchStatus("Search completed successfully!");
      
    } catch (error) {
      console.error("Search error:", error);
      setFact(null);
      setSearchStatus("Search completed with some issues");
    } finally {
      setLoading(false);
      // Clear status after 3 seconds
      setTimeout(() => setSearchStatus(""), 3000);
    }
  }

  const handleTabChange = (tab: 'web' | 'images') => {
    setActiveTab(tab);
    if (q.trim() && ready) {
      if (tab === 'images') {
        executeImageSearch(q);
      } else {
        execute(q);
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Left: Google results (free & unlimited) */}
      <div>
        <div className="flex gap-2 mb-4">
          <input
            ref={searchInputRef}
            className="flex-1 rounded-lg border px-3 py-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400 dictation-enabled"
            placeholder="Search the web (Google) - Click to enable dictation"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            data-dictation-enabled="true"
          />
          <button
            onClick={run}
            disabled={!q.trim()}
            className="px-3 py-2 rounded-lg bg-accent-fuchsia hover:bg-accent-fuchsia/80 text-white disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>

        {/* Search Status */}
        {searchStatus && (
          <div className="text-sm text-slate-400 mb-3 italic">
            {searchStatus}
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex gap-1 mb-3">
          <button
            onClick={() => handleTabChange('web')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'web' 
                ? 'bg-accent-fuchsia text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Web Results
          </button>
          <button
            onClick={() => handleTabChange('images')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'images' 
                ? 'bg-accent-fuchsia text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Images
          </button>
        </div>

        {/* Web Results Container */}
        {activeTab === 'web' && (
          <div
            id="lexintel-results"
            className="gcse-searchresults"
            data-defaultToImageSearch="false"
            style={{ marginTop: 12 }}
          />
        )}

        {/* Images-only Container */}
        {activeTab === 'images' && (
          <div
            id="lexintel-images"
            className="gcse-searchresults-only"
            data-enableImageSearch="true"
            data-defaultToImageSearch="true"
            data-disableWebSearch="true"
            data-image_type="photo"
            data-image_size="large"
            style={{ marginTop: 12 }}
          />
        )}
      </div>

      {/* Right: DuckDuckGo Instant Answer */}
      <aside className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="font-semibold text-white mb-3">DuckDuckGo Insights (Who, What, When, Where, Why, How)</div>
        {loading && (
          <div className="text-sm text-slate-400 mt-2">
            {searchStatus || "Searching for deeper insights..."}
          </div>
        )}
        {!loading && fact?.text && (
          <div className="mt-3">
            {fact.heading && (
              <div className="font-medium mb-2 text-white">{fact.heading}</div>
            )}
            <div className="text-sm leading-relaxed text-slate-300">{fact.text}</div>
            {fact.url && (
              <div className="text-xs mt-3 text-slate-400">
                Source:{" "}
                <a 
                  href={fact.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="underline text-accent-fuchsia hover:text-accent-fuchsia/80"
                >
                  {fact.url}
                </a>
              </div>
            )}
          </div>
        )}
        {!loading && !fact?.text && (
          <div className="text-sm text-slate-400 mt-3">
            No additional insights found. Google search results above provide comprehensive information.
          </div>
        )}
      </aside>
    </div>
  );
}

/** Optional: call from elsewhere to drive Google result pane */
export function runGoogleSearch(q: string) {
  const el = window.google?.search?.cse?.element?.getElement("lexintel-results");
  if (el) el.execute(q);
}

/** Optional: call from elsewhere to drive Google image search */
export function runGoogleImageSearch(q: string) {
  runImageOnly(q);
}
