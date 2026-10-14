import React, { useState, useEffect } from "react";
import {
  Film,
  Sparkles,
  Loader2,
  Copy,
  CheckCircle2,
  Music,
  Clock,
  Camera,
  Layers,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Check,
  Smartphone,
  Eye,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Info,
  Calendar,
  MapPin,
  Play
} from "lucide-react";
import type { ReelStoryboard, SavedGeneration, BRollClip, GeneratedContent, SocialCopy } from "../types";
import { BrandPill, InstagramIcon, YouTubeIcon, TikTokIcon, GoogleDriveIcon } from "./BrandLogos";
import { saveStoryboardGeneration, saveCampaignGeneration } from "../utils/storage";
import { BROLL_CATALOG } from "../data/brollCatalog";

interface UnifiedStudioProps {
  initialGoal?: string;
  initialDetails?: string;
  initialStoryboard?: ReelStoryboard | null;
  initialCampaign?: GeneratedContent | null;
  onStoryboardSaved?: (newEntry: SavedGeneration, allEntries: SavedGeneration[]) => void;
  onCampaignSaved?: (newEntry: SavedGeneration, allEntries: SavedGeneration[]) => void;
  onNavigateToVault?: () => void;
  selectedClips?: BRollClip[];
  onToggleClipSelection?: (clip: BRollClip) => void;
}

const QUICK_PRODUCE_RECIPES = [
  {
    id: "trilogy",
    title: "Trilogy Resort Life",
    tagline: "Club amenities, wine & views",
    duration: "30s" as const,
    platform: "Instagram Reel" as const,
    badge: "55+ Resort",
    pillType: "trilogy" as const,
    goal: "A Day in the Life: Trilogy at the Vineyards Active Luxury",
    details: "Showcasing vineyard views, morning pickleball, Club Los Meganos dining, and on-site culinary demonstrations for active 55+ adult retirees.",
    recommendedClips: ["DB-11", "CLUB-03", "CUL-04", "CLUB-01", "OKT-07"],
  },
  {
    id: "downtown",
    title: "Downtown Brentwood Tour",
    tagline: "Walkable cafes, dining & boutiques",
    duration: "30s" as const,
    platform: "Instagram Reel" as const,
    badge: "Downtown",
    pillType: "brentwood" as const,
    goal: "Downtown Brentwood: Walkable Coffee, Dining & Historic Charm",
    details: "Strolling from Chrome Coffee by Delta Theater past brick boutiques, patio dining at Locanda Capri, and concluding at the Gateway Arch.",
    recommendedClips: ["DT-01", "DT-05", "DT-08", "DT-11"],
  },
  {
    id: "schools",
    title: "Family Relocation & Schools",
    tagline: "Heritage High & new construction",
    duration: "45s" as const,
    platform: "Instagram Reel" as const,
    badge: "Schools & Homes",
    pillType: "brentwood" as const,
    goal: "Moving to Brentwood: Top Schools & Master-Planned Living",
    details: "Touring Heritage High campus, Adams Middle School, Kaiser medical access, and new Shea master-planned homes with custom yards.",
    recommendedClips: ["SCH-01", "SCH-04", "SCH-06", "B07", "B09"],
  },
  {
    id: "delta",
    title: "Discovery Bay Waterfront",
    tagline: "Marina boat slips & golf course",
    duration: "30s" as const,
    platform: "YouTube Shorts" as const,
    badge: "Delta Life",
    pillType: "drive" as const,
    goal: "Discovery Bay & Delta Boating Lifestyle",
    details: "Featuring covered boat slips at Discovery Bay Marina, fairway golf course homes, and waterfront dining on the Delta.",
    recommendedClips: ["DB-01", "DB-03", "DB-07", "DB-09"],
  },
];

export function UnifiedStudio({
  initialGoal = "",
  initialDetails = "",
  initialStoryboard = null,
  initialCampaign = null,
  onStoryboardSaved,
  onCampaignSaved,
  onNavigateToVault,
  selectedClips = [],
  onToggleClipSelection,
}: UnifiedStudioProps) {
  // Mode: "video" (Reel/Shorts storyboard) vs "static" (Photo carousel & captions)
  const [productionMode, setProductionMode] = useState<"video" | "static">("video");

  // Form State
  const [goal, setGoal] = useState(initialGoal || QUICK_PRODUCE_RECIPES[0].goal);
  const [details, setDetails] = useState(initialDetails || QUICK_PRODUCE_RECIPES[0].details);
  const [targetDuration, setTargetDuration] = useState<"15s" | "30s" | "45s" | "60s">("30s");
  const [targetPlatform, setTargetPlatform] = useState<"Instagram Reel" | "TikTok" | "YouTube Shorts">("Instagram Reel");

  // Customization drawer toggle (Simplified UX: hidden by default so Margie can 1-click produce)
  const [showCustomize, setShowCustomize] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(true);

  // Loading & Content
  const [loading, setLoading] = useState(false);
  const [storyboard, setStoryboard] = useState<ReelStoryboard | null>(initialStoryboard);
  const [staticCampaign, setStaticCampaign] = useState<GeneratedContent | null>(initialCampaign);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Active Output Tab
  const [activeVideoTab, setActiveVideoTab] = useState<"timeline" | "voiceover" | "visuals" | "caption">("timeline");

  // Inline Clip Drawer (Simplification #3: No tab switching to view clip details)
  const [drawerClip, setDrawerClip] = useState<BRollClip | null>(null);

  useEffect(() => {
    if (initialGoal) setGoal(initialGoal);
    if (initialDetails) setDetails(initialDetails);
    if (initialStoryboard) {
      setStoryboard(initialStoryboard);
      setProductionMode("video");
    }
    if (initialCampaign) {
      setStaticCampaign(initialCampaign);
      setProductionMode("static");
    }
  }, [initialGoal, initialDetails, initialStoryboard, initialCampaign]);

  const handleQuickProduce = async (recipe: (typeof QUICK_PRODUCE_RECIPES)[0]) => {
    setGoal(recipe.goal);
    setDetails(recipe.details);
    setTargetDuration(recipe.duration);
    setTargetPlatform(recipe.platform);
    setProductionMode("video");

    setLoading(true);
    setError("");
    setStoryboard(null);
    setSavedNotification(null);

    try {
      const res = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: recipe.goal,
          details: recipe.details,
          targetDuration: recipe.duration,
          targetPlatform: recipe.platform,
          selectedClips: recipe.recommendedClips,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate video storyboard");
      const data: ReelStoryboard = await res.json();
      setStoryboard(data);

      const { newEntry, allEntries } = saveStoryboardGeneration(recipe.goal, recipe.details, data);
      if (onStoryboardSaved) onStoryboardSaved(newEntry, allEntries);
      setSavedNotification(`Saved "${recipe.title}" to your library!`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !details) return;

    setLoading(true);
    setError("");
    setSavedNotification(null);

    if (productionMode === "video") {
      setStoryboard(null);
      try {
        const res = await fetch("/api/generate-storyboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal,
            details,
            targetDuration,
            targetPlatform,
            selectedClips: selectedClips.map((c) => c.id),
          }),
        });

        if (!res.ok) throw new Error("Failed to generate video storyboard");
        const data: ReelStoryboard = await res.json();
        setStoryboard(data);

        const { newEntry, allEntries } = saveStoryboardGeneration(goal, details, data);
        if (onStoryboardSaved) onStoryboardSaved(newEntry, allEntries);
        setSavedNotification("Saved Reel storyboard to library!");
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    } else {
      // Static campaign mode
      setStaticCampaign(null);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, details }),
        });

        if (!res.ok) throw new Error("Failed to generate static post copy");
        const data: GeneratedContent = await res.json();
        setStaticCampaign(data);

        const { newEntry, allEntries } = saveCampaignGeneration(goal, details, data);
        if (onCampaignSaved) onCampaignSaved(newEntry, allEntries);
        setSavedNotification("Saved caption campaign to library!");
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const openClipDrawerById = (clipId: string) => {
    const found = BROLL_CATALOG.find((c) => c.id.toUpperCase() === clipId.toUpperCase().trim());
    if (found) {
      setDrawerClip(found);
    } else {
      // Create minimal preview
      setDrawerClip({
        id: clipId,
        folder: "Brentwood Footage",
        description: `B-roll clip ${clipId}`,
        length: "15-20 sec",
        editorNote: "High-resolution real estate footage",
        videoLink: `https://drive.google.com/drive/search?q=${encodeURIComponent(clipId)}`,
        bestUse: "Social video cut",
        inDrive: true,
      });
    }
  };

  const formatEditorHandover = () => {
    if (!storyboard) return "";
    let out = `MARGIE LUPO REAL ESTATE - VIDEO EDITING STORYBOARD\n`;
    out += `Title: ${storyboard.reelTitle}\n`;
    out += `Platform: ${storyboard.targetPlatform} (9:16 Vertical)\n`;
    out += `Target Duration: ${storyboard.targetDuration}\n`;
    out += `Recommended Audio: ${storyboard.recommendedAudio}\n`;
    out += `Hook Line: "${storyboard.hookLine}"\n`;
    out += `===================================================\n\n`;

    out += `[SEQUENTIAL TIMELINE & CUTS]:\n\n`;
    storyboard.cuts.forEach((cut) => {
      out += `CUT #${cut.sequence} | ${cut.duration} | CLIP: ${cut.clipId} (${cut.clipTitle})\n`;
      out += `• Visual Direction: ${cut.visualDirection}\n`;
      out += `• On-Screen Text: "${cut.onScreenText}"\n`;
      out += `• Audio / VO: ${cut.audioPacing}\n`;
      out += `• Drive Link: https://drive.google.com/drive/search?q=${cut.clipId}\n\n`;
    });

    out += `[COMPLETE VOICEOVER SCRIPT]:\n`;
    out += `${storyboard.fullVoiceover}\n\n`;

    out += `[CAPTION & 5-SLOT HASHTAGS]:\n`;
    out += `${storyboard.socialCopy.hook}\n\n`;
    out += `${storyboard.socialCopy.caption}\n\n`;
    out += `CTA: ${storyboard.socialCopy.callToAction}\n\n`;
    out += `${storyboard.socialCopy.hashtags.join(" ")}\n`;

    return out;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 3-Step Clear User Flow Banner (Dismissible) */}
      {showHowItWorks && (
        <div className="bg-gradient-to-r from-amber-900 to-neutral-900 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <button
            onClick={() => setShowHowItWorks(false)}
            className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1"
            title="Dismiss guide"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-amber-300">
              How It Works: 3-Step Production Flow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
              <span className="font-bold text-amber-300 block mb-1">1. Pick a Quick Recipe</span>
              <p className="text-neutral-200">
                Click any 1-click card below (Trilogy, Downtown, Schools) or type your custom listing topic.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
              <span className="font-bold text-amber-300 block mb-1">2. AI Directs the Cuts</span>
              <p className="text-neutral-200">
                AI sequences your real B-roll with exact timestamps, bold sound-off text, and spoken voiceover.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
              <span className="font-bold text-amber-300 block mb-1">3. Hand Off or Post</span>
              <p className="text-neutral-200">
                1-click copy for your video editor with Google Drive links, plus companion luxury image prompts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Simplification #2: 4 Visual 1-Click "Quick Produce" Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
              1-Click Quick Produce
            </h3>
            <p className="text-xs text-neutral-500">
              Tap any card to instantly sequence your B-roll into a ready-to-cut Reel.
            </p>
          </div>

          {/* Simplification #1: Mode Toggle in one unified studio */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            <button
              onClick={() => setProductionMode("video")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                productionMode === "video"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Film className="w-3.5 h-3.5 text-amber-700" />
              <span>Video Reel</span>
            </button>
            <button
              onClick={() => setProductionMode("static")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                productionMode === "static"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-neutral-600" />
              <span>Static Post</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_PRODUCE_RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleQuickProduce(recipe)}
              className="group bg-white rounded-2xl border border-neutral-200 hover:border-amber-400 p-4 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <BrandPill type={recipe.pillType} label={recipe.badge} />
                  <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                    {recipe.duration}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 group-hover:text-amber-900 transition-colors">
                  {recipe.title}
                </h4>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {recipe.tagline}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400 font-mono">
                  {recipe.recommendedClips.length} clips
                </span>
                <span className="text-amber-700 font-semibold group-hover:underline flex items-center gap-0.5">
                  Produce Reel <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible "Customize Brief & Pinned Clips" Section (Keeps UI Simple by Default) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-2xs">
        <button
          type="button"
          onClick={() => setShowCustomize(!showCustomize)}
          className="w-full flex items-center justify-between text-left select-none"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-semibold text-neutral-900">
              Customize Brief & Settings
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              (Optional: adjust topic, duration, or pin specific footage)
            </span>
          </div>
          <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
            {showCustomize ? "Collapse" : "Expand"}
            {showCustomize ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {showCustomize && (
          <form onSubmit={handleCustomGenerate} className="mt-4 pt-4 border-t border-neutral-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Topic / Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Just Closed Rioja Floorplan with Vineyard Views..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-neutral-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Specific Details & Highlights
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Highlight culinary studio, quiet vineyard patio, low maintenance..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-neutral-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {productionMode === "video" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Target Runtime
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(["15s", "30s", "45s", "60s"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setTargetDuration(d)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                          targetDuration === d
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Target Platform
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTargetPlatform("Instagram Reel")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                        targetPlatform === "Instagram Reel"
                          ? "bg-pink-50 text-pink-900 border-pink-300 font-bold"
                          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span>Reel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetPlatform("TikTok")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                        targetPlatform === "TikTok"
                          ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <TikTokIcon className="w-3.5 h-3.5" />
                      <span>TikTok</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetPlatform("YouTube Shorts")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                        targetPlatform === "YouTube Shorts"
                          ? "bg-red-50 text-red-900 border-red-300 font-bold"
                          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <YouTubeIcon className="w-3.5 h-3.5" />
                      <span>Shorts</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pinned B-Roll Footage summary */}
            {selectedClips.length > 0 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-900">
                  {selectedClips.length} footage clips pinned from your vault ({selectedClips.map((c) => c.id).join(", ")})
                </span>
                {onNavigateToVault && (
                  <button
                    type="button"
                    onClick={onNavigateToVault}
                    className="text-amber-800 underline font-medium hover:text-amber-950"
                  >
                    Manage Footage →
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                disabled={loading || !goal || !details}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Generating Production...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Generate Custom Production</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Notification Toast */}
      {savedNotification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            {savedNotification}
          </span>
          <span className="text-[11px] text-emerald-700">Ready in your Saved Library</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Loading Placeholder */}
      {loading && (
        <div className="min-h-[380px] flex flex-col items-center justify-center rounded-2xl bg-white border border-neutral-200 shadow-xs p-8 text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
          <h4 className="text-base font-semibold text-neutral-900">
            {productionMode === "video"
              ? "Sequencing Multi-Clip Video Storyboard..."
              : "Drafting Strategic Anti-Fluff Copy & Prompts..."}
          </h4>
          <p className="text-xs text-neutral-500 max-w-sm">
            Matching real Brentwood & Trilogy clips, pacing voiceover to seconds, and adhering to strict anti-fluff luxury standards.
          </p>
        </div>
      )}

      {/* Production Output: Video Reel Mode */}
      {productionMode === "video" && storyboard && !loading && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Production Overview Bar */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <BrandPill
                    type={
                      storyboard.targetPlatform === "TikTok"
                        ? "tiktok"
                        : storyboard.targetPlatform === "YouTube Shorts"
                        ? "youtube"
                        : "reel"
                    }
                    label={storyboard.targetPlatform}
                  />
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    {storyboard.targetDuration}
                  </span>
                  <span className="text-xs text-neutral-400">
                    • {storyboard.cuts.length} Sequenced Cuts
                  </span>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                  {storyboard.reelTitle}
                </h2>
              </div>

              {/* 1-Click Copy Handover Button */}
              <button
                onClick={() => copyToClipboard(formatEditorHandover(), "editor_handover")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors shadow-2xs"
                title="Copy complete storyboard with timecodes, clip IDs, and Drive links for video editor"
              >
                {copiedKey === "editor_handover" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied for Video Editor!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy for Video Editor</span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Direction & Hook */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2">
                <Music className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950 block text-[10px] uppercase tracking-wider mb-0.5">
                    Audio & Music Style
                  </span>
                  <span className="text-amber-900">{storyboard.recommendedAudio}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700 block text-[10px] uppercase tracking-wider mb-0.5">
                    2-Second Hook
                  </span>
                  <span className="text-neutral-900 font-medium">"{storyboard.hookLine}"</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section View Tabs */}
          <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-2">
            <button
              onClick={() => setActiveVideoTab("timeline")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeVideoTab === "timeline"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video Cuts ({storyboard.cuts.length})</span>
            </button>

            <button
              onClick={() => setActiveVideoTab("voiceover")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeVideoTab === "voiceover"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Voiceover Script</span>
            </button>

            <button
              onClick={() => setActiveVideoTab("visuals")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeVideoTab === "visuals"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cover & Visual Prompts (3)</span>
            </button>

            <button
              onClick={() => setActiveVideoTab("caption")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeVideoTab === "caption"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Caption & Hashtags</span>
            </button>
          </div>

          {/* Tab 1: Video Timeline Cuts */}
          {activeVideoTab === "timeline" && (
            <div className="space-y-3.5">
              {storyboard.cuts.map((cut, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs hover:border-neutral-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-full bg-neutral-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                        {cut.sequence}
                      </span>
                      {/* Simplification #3: Clickable clip ID opens inline drawer */}
                      <button
                        onClick={() => openClipDrawerById(cut.clipId)}
                        className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors flex items-center gap-1"
                        title="Click to view full clip details in drawer"
                      >
                        <span>{cut.clipId}</span>
                        <Info className="w-3 h-3 text-amber-700" />
                      </button>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        {cut.clipTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        {cut.duration}
                      </span>
                      <a
                        href={`https://drive.google.com/drive/search?q=${encodeURIComponent(cut.clipId)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-50"
                      >
                        <GoogleDriveIcon className="w-3 h-3" />
                        <span>Drive</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
                    {/* On-screen text box */}
                    <div className="md:col-span-5 bg-gradient-to-br from-neutral-950 to-neutral-800 text-white p-3.5 rounded-xl shadow-xs flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        On-Screen Text
                      </span>
                      <p className="text-sm font-extrabold tracking-tight my-2 text-white leading-snug">
                        "{cut.onScreenText}"
                      </p>
                      <span className="text-[10px] text-neutral-400">
                        Designed for sound-off viewing
                      </span>
                    </div>

                    {/* Directions & Audio Pacing */}
                    <div className="md:col-span-7 space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-neutral-700 block mb-0.5">
                          Visual & Camera Direction:
                        </span>
                        <p className="text-neutral-600 leading-relaxed bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                          {cut.visualDirection}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold text-neutral-700 block mb-0.5">
                          Spoken Voiceover Line:
                        </span>
                        <p className="text-neutral-800 font-medium leading-relaxed bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                          {cut.audioPacing}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Full Voiceover Script */}
          {activeVideoTab === "voiceover" && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    Continuous Voiceover Narration Script
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Paced for {storyboard.targetDuration} vertical video with natural pauses.
                  </p>
                </div>

                <button
                  onClick={() => copyToClipboard(storyboard.fullVoiceover, "full_voiceover")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800"
                >
                  {copiedKey === "full_voiceover" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Script!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm sm:text-base text-neutral-800 leading-relaxed whitespace-pre-wrap">
                {storyboard.fullVoiceover}
              </div>
            </div>
          )}

          {/* Tab 3: Companion Luxury Image Prompts */}
          {activeVideoTab === "visuals" && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">
                  Companion Luxury Architectural Prompts (3)
                </h3>
                <p className="text-xs text-neutral-500">
                  Prompts for Reel cover slide, carousel posts, or high-end companion photos.
                </p>
              </div>

              <div className="space-y-3">
                {storyboard.visualPrompts.map((vp, vidx) => (
                  <div
                    key={vidx}
                    className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {vp.focus}
                      </span>
                      <p className="text-xs text-neutral-700 font-mono leading-relaxed mt-1">
                        {vp.prompt}
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(vp.prompt, `vp_${vidx}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 shrink-0 self-start"
                    >
                      {copiedKey === `vp_${vidx}` ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Caption & Hashtags */}
          {activeVideoTab === "caption" && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    SEO Caption & 5-Slot Hashtags
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Optimized for social search retention and Margie's anti-fluff authority.
                  </p>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      `${storyboard.socialCopy.hook}\n\n${storyboard.socialCopy.caption}\n\n${storyboard.socialCopy.callToAction}\n\n${storyboard.socialCopy.hashtags.join(" ")}`,
                      "caption_text"
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800"
                >
                  {copiedKey === "caption_text" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Caption!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-3 text-xs sm:text-sm text-neutral-800 font-sans leading-relaxed">
                <p className="font-bold text-neutral-900">{storyboard.socialCopy.hook}</p>
                <p className="whitespace-pre-line text-neutral-700">{storyboard.socialCopy.caption}</p>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/70 text-xs text-amber-950 font-medium">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block mb-0.5">
                    Call to Action
                  </span>
                  {storyboard.socialCopy.callToAction}
                </div>

                <div className="pt-2 text-xs font-mono text-amber-800 bg-white p-2.5 rounded-lg border border-neutral-200">
                  {storyboard.socialCopy.hashtags.join(" ")}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Production Output: Static Post Mode */}
      {productionMode === "static" && staticCampaign && !loading && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                Static Social Copy & Visual Prompts
              </h3>
              <p className="text-xs text-neutral-500">
                3 platform-targeted caption variations + luxury architectural prompts.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {staticCampaign.socialCopy.map((copy, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 relative space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                    {copy.platform}
                  </span>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${copy.hook}\n\n${copy.body}\n\n${copy.callToAction}\n\n${copy.hashtags.join(" ")}`,
                        `static_${index}`
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs font-medium bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedKey === `static_${index}` ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="font-bold text-neutral-950 text-sm">{copy.hook}</p>
                <p className="whitespace-pre-line text-neutral-700">{copy.body}</p>

                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100 text-xs font-medium text-amber-950">
                  <span className="text-amber-800 font-bold block uppercase text-[10px] mb-0.5">
                    Retention CTA
                  </span>
                  {copy.callToAction}
                </div>

                <div className="pt-2 text-xs font-mono text-amber-800 bg-white p-2 rounded-lg border border-neutral-200">
                  {copy.hashtags.join(" ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simplification #3: Inline Clip Drawer (No Tab Switching) */}
      {drawerClip && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-neutral-900 text-amber-400">
                  {drawerClip.id}
                </span>
                <BrandPill type="drive" label={drawerClip.inDrive ? "In Drive" : "Pending"} />
              </div>
              <button
                onClick={() => setDrawerClip(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Folder: {drawerClip.folder} • Length: {drawerClip.length}
              </span>
              <h3 className="text-base font-bold text-neutral-900">
                {drawerClip.description}
              </h3>
            </div>

            {drawerClip.editorNote && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 block mb-0.5">Editor Note:</span>
                  <span>{drawerClip.editorNote}</span>
                </div>
              </div>
            )}

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs">
              <span className="font-bold text-amber-950 block mb-0.5">Best Script Use:</span>
              <span className="text-amber-900">{drawerClip.bestUse}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 gap-2">
              {onToggleClipSelection && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleClipSelection(drawerClip);
                    setDrawerClip(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                >
                  {selectedClips.some((c) => c.id === drawerClip.id)
                    ? "Unpin from Storyboard"
                    : "Pin to Storyboard"}
                </button>
              )}

              <a
                href={drawerClip.videoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors ml-auto"
              >
                <GoogleDriveIcon className="w-3.5 h-3.5" />
                <span>Open in Google Drive</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
