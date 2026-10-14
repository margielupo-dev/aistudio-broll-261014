import React, { useState, useEffect } from "react";
import {
  Loader2,
  Sparkles,
  Send,
  Copy,
  CheckCircle2,
  MapPin,
  BookmarkCheck,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Share2,
  Check
} from "lucide-react";
import type { GeneratedContent, SocialCopy, SavedGeneration } from "../types";
import { saveGeneration } from "../utils/storage";

interface ContentGeneratorProps {
  initialGoal?: string;
  initialDetails?: string;
  initialContent?: GeneratedContent | null;
  onGenerationSaved?: (newEntry: SavedGeneration, allEntries: SavedGeneration[]) => void;
  onNavigateToLibrary?: () => void;
  recentSaved?: SavedGeneration[];
}

const CAMPAIGN_PRESETS = [
  {
    label: "Trilogy: Vineyard View Home",
    goal: "Showcasing Vineyard View Living at Trilogy at the Vineyards",
    details: "Single-story Rioja floor plan overlooking Mount Diablo foothills and vineyards. Emphasize active 55+ social life at Club Los Meganos, private pickleball courts, and low-maintenance luxury.",
  },
  {
    label: "Trilogy: Resort Amenities",
    goal: "Spotlight on Club Los Meganos & 55+ Resort Lifestyle",
    details: "Highlight the culinary classes, state-of-the-art fitness center, indoor lap pool, tennis and pickleball leagues, and social calendar for active retirees in Brentwood.",
  },
  {
    label: "Brentwood: Luxury Relocation",
    goal: "Relocating to Brentwood: Custom Luxury & Generous Lots",
    details: "Targeting Silicon Valley & Tri-Valley buyers seeking custom single-family homes with private swimming pools, outdoor kitchens, top-rated schools, and expansive acreage.",
  },
  {
    label: "Market Advisory: Pricing Insights",
    goal: "Brentwood & Trilogy Market Update: Strategic Advisory",
    details: "Focusing on current buyer demand, why correctly priced turnkey luxury homes move quickly, and why precision marketing is crucial in East Contra Costa County.",
  },
];

export function ContentGenerator({
  initialGoal = "",
  initialDetails = "",
  initialContent = null,
  onGenerationSaved,
  onNavigateToLibrary,
  recentSaved = [],
}: ContentGeneratorProps) {
  const [goal, setGoal] = useState(initialGoal);
  const [details, setDetails] = useState(initialDetails);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(initialContent);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const [justSavedNotification, setJustSavedNotification] = useState<string | null>(null);

  // Sync if initial props change
  useEffect(() => {
    if (initialGoal) setGoal(initialGoal);
    if (initialDetails) setDetails(initialDetails);
    if (initialContent) setContent(initialContent);
  }, [initialGoal, initialDetails, initialContent]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !details) return;

    setLoading(true);
    setError("");
    setContent(null);
    setJustSavedNotification(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, details }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate content");
      }

      const data: GeneratedContent = await res.json();
      setContent(data);

      // Automatically save to local storage!
      const { newEntry, allEntries } = saveGeneration(goal, details, data);
      if (onGenerationSaved) {
        onGenerationSaved(newEntry, allEntries);
      }
      setJustSavedNotification(`Saved to your Post Library!`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyCustom = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAction(key);
    setTimeout(() => {
      setCopiedAction((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const formatCopyText = (copy: SocialCopy) => {
    return `${copy.hook}\n\n${copy.body}\n\n${copy.callToAction}\n\n${copy.hashtags.join(" ")}`;
  };

  const formatFullCampaign = () => {
    if (!content) return "";
    let out = `MARGIE LUPO REAL ESTATE - STRATEGIC CAMPAIGN\n`;
    out += `Goal: ${goal}\n`;
    out += `Details: ${details}\n\n`;

    out += `--- 1. SOCIAL MEDIA CAPTIONS ---\n\n`;
    content.socialCopy.forEach((c, idx) => {
      out += `[Option ${idx + 1} - ${c.platform}]\n${c.hook}\n\n${c.body}\n\nCall To Action: ${c.callToAction}\n\nHashtags:\n${c.hashtags.join(" ")}\n\n`;
    });

    out += `--- 2. VISUAL GENERATION PROMPTS ---\n\n`;
    content.visualPrompts.forEach((v, idx) => {
      out += `[${v.focus}]\n${v.prompt}\n\n`;
    });

    out += `--- 3. DEPLOYMENT CHECKLIST ---\n\n`;
    content.deploymentStrategy.forEach((d, idx) => {
      out += `${idx + 1}. ${d.actionItem}: ${d.description}\n`;
    });

    return out;
  };

  const applyPreset = (preset: (typeof CAMPAIGN_PRESETS)[0]) => {
    setGoal(preset.goal);
    setDetails(preset.details);
  };

  const handleReset = () => {
    setGoal("");
    setDetails("");
    setContent(null);
    setError("");
    setJustSavedNotification(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-900 mb-2">
          Margie Lupo <span className="font-semibold text-amber-700">Content Studio</span>
        </h1>
        <p className="text-neutral-500 text-base">
          Strategic AI real estate copywriting, hyper-local SEO hooks, and 5-slot hashtag clusters for Brentwood, CA and Trilogy at the Vineyards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-7 sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Campaign Brief
              </h2>
              {(goal || details || content) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1 transition-colors"
                  title="Clear inputs and start fresh"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Quick Presets */}
            <div className="mb-5">
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Quick Strategy Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {CAMPAIGN_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="text-left p-2 rounded-xl text-[11px] leading-tight font-medium bg-neutral-50 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-neutral-200/70 transition-all text-neutral-700 truncate"
                    title={p.goal}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label htmlFor="goal" className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Post Goal / Objective
                </label>
                <input
                  type="text"
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Just Closed Rioja Model in Trilogy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition-colors bg-neutral-50/50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="details" className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Key Listing / Market Details
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. 2 bed/2 bath with vineyard views, Club Los Meganos amenities, low-maintenance lifestyle..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition-colors bg-neutral-50/50 focus:bg-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !goal || !details}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generate & Save Strategy
                  </>
                )}
              </button>
            </form>

            {/* Notification Badge when Auto-Saved */}
            {justSavedNotification && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
                <span className="flex items-center gap-1.5 font-medium">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  {justSavedNotification}
                </span>
                {onNavigateToLibrary && (
                  <button
                    onClick={onNavigateToLibrary}
                    className="underline text-emerald-900 font-semibold hover:text-emerald-950 flex items-center gap-0.5"
                  >
                    View Library <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {error}
              </div>
            )}

            {/* Quick Recent Generations in sidebar */}
            {recentSaved.length > 0 && (
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    Recent Library Posts
                  </span>
                  {onNavigateToLibrary && (
                    <button
                      onClick={onNavigateToLibrary}
                      className="text-[11px] text-amber-700 hover:underline font-medium"
                    >
                      View All ({recentSaved.length})
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {recentSaved.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 hover:bg-amber-50/60 hover:border-amber-200 transition-colors cursor-pointer group"
                      onClick={() => {
                        setGoal(item.goal);
                        setDetails(item.details);
                        setContent(item.content);
                        setJustSavedNotification("Loaded from your library!");
                      }}
                    >
                      <p className="text-xs font-medium text-neutral-800 truncate group-hover:text-amber-900">
                        {item.goal}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                        <span>{item.formattedDate}</span>
                        <span className="text-amber-700 group-hover:underline">Load Post →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8 space-y-6">
          {!content && !loading && (
            <div className="min-h-[440px] flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl bg-white p-8 text-center shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-1">Awaiting Strategy Brief</h3>
              <p className="text-sm text-neutral-500 max-w-md mb-6">
                Pick a quick preset or type your custom listing goal. Every generation is automatically saved into your local Post Library so you never lose high-performing copy.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {CAMPAIGN_PRESETS.slice(0, 2).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                  >
                    Try "{p.label}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="min-h-[440px] flex flex-col items-center justify-center rounded-2xl bg-white border border-neutral-200 shadow-sm p-8 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-4" />
              <h4 className="text-base font-semibold text-neutral-900 mb-1">
                Applying Anti-Fluff & SEO Guardrails...
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm">
                Targeting Brentwood & Trilogy at the Vineyards demographics, constructing 5-slot hashtag clusters, and tuning social hooks.
              </p>
            </div>
          )}

          {content && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Campaign Action Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span className="text-xs font-semibold text-neutral-700">Active Generated Campaign</span>
                  <span className="text-xs text-neutral-400">• Saved to Library</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => copyCustom("full_active", formatFullCampaign())}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                    title="Copy all 3 captions, visual prompts, and deployment steps"
                  >
                    {copiedAction === "full_active" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Campaign Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Full Package
                      </>
                    )}
                  </button>

                  {onNavigateToLibrary && (
                    <button
                      onClick={onNavigateToLibrary}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      View in Library
                    </button>
                  )}
                </div>
              </div>

              {/* 1. Social Copy Options */}
              <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="border-b border-neutral-100 bg-neutral-50/70 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">
                      1. Social Media Copy Options (3 Variations)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      First 2 lines optimized for search SEO • Anti-fluff language • 5-slot hashtag cluster
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {content.socialCopy.map((copy, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 relative group hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-600/20">
                          {copy.platform}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              copyCustom(
                                `active_hash_${index}`,
                                copy.hashtags.join(" ")
                              )
                            }
                            className="text-xs text-amber-700 hover:text-amber-900 font-medium px-2 py-1 rounded hover:bg-amber-50 transition-colors"
                          >
                            {copiedAction === `active_hash_${index}` ? "Hashtags Copied!" : "Copy Hashtags"}
                          </button>

                          <button
                            onClick={() => copyToClipboard(formatCopyText(copy), index)}
                            className="inline-flex items-center gap-1 text-xs font-medium bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
                            title="Copy full caption to clipboard"
                          >
                            {copiedIndex === index ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy Caption
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm text-neutral-700 leading-relaxed font-sans">
                        <p className="font-bold text-neutral-950 text-base">{copy.hook}</p>
                        <p className="whitespace-pre-line text-neutral-700">{copy.body}</p>
                        
                        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100 text-xs font-medium text-amber-950">
                          <span className="text-amber-800 font-bold block uppercase text-[10px] tracking-wider mb-0.5">
                            Retention CTA
                          </span>
                          {copy.callToAction}
                        </div>

                        <div className="pt-2 text-xs font-mono text-amber-800 bg-white/70 p-2.5 rounded-lg border border-neutral-200/60">
                          {copy.hashtags.join(" ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. Visual Generation Prompts */}
              <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="border-b border-neutral-100 bg-neutral-50/70 px-6 py-4">
                  <h3 className="text-base font-semibold text-neutral-900">
                    2. Visual Generation Prompts
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    High-end architectural photography style • Natural light • Realistic California living
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {content.visualPrompts.map((prompt, index) => {
                    const promptKey = `vp_${index}`;
                    return (
                      <div
                        key={index}
                        className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                            {prompt.focus}
                          </span>
                          <p className="text-xs text-neutral-700 font-mono leading-relaxed mt-1">
                            {prompt.prompt}
                          </p>
                        </div>
                        <button
                          onClick={() => copyCustom(promptKey, prompt.prompt)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors flex-shrink-0 self-start"
                        >
                          {copiedAction === promptKey ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Prompt
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 3. Deployment Checklist */}
              <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="border-b border-neutral-100 bg-neutral-50/70 px-6 py-4">
                  <h3 className="text-base font-semibold text-neutral-900">
                    3. Actionable Deployment Checklist
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {content.deploymentStrategy.map((step, index) => (
                      <li key={index} className="flex gap-3.5 items-start">
                        <div className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-neutral-900 text-white font-semibold text-xs mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900">{step.actionItem}</h4>
                          <p className="text-xs text-neutral-600 mt-0.5">{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
