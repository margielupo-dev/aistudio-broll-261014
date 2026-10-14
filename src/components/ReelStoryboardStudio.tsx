import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  Send,
  Film,
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
  FileText
} from "lucide-react";
import type { ReelStoryboard, SavedGeneration, BRollClip } from "../types";
import { BrandPill, InstagramIcon, YouTubeIcon, TikTokIcon, GoogleDriveIcon } from "./BrandLogos";
import { saveStoryboardGeneration } from "../utils/storage";

interface ReelStoryboardStudioProps {
  initialGoal?: string;
  initialDetails?: string;
  initialStoryboard?: ReelStoryboard | null;
  onStoryboardSaved?: (newEntry: SavedGeneration, allEntries: SavedGeneration[]) => void;
  onNavigateToVault?: () => void;
  selectedClips?: BRollClip[];
  onRemovePinnedClip?: (clipId: string) => void;
}

const STORYBOARD_PRESETS = [
  {
    label: "Trilogy 55+ Lifestyle",
    duration: "30s",
    platform: "Instagram Reel" as const,
    goal: "A Day in the Life: Trilogy at the Vineyards Active Luxury",
    details: "Showcasing vineyard views, morning pickleball, Club Los Meganos dining, and on-site culinary demonstrations for active 55+ adult retirees.",
  },
  {
    label: "Downtown Brentwood Tour",
    duration: "30s",
    platform: "Instagram Reel" as const,
    goal: "Downtown Brentwood: Walkable Coffee, Dining & Historic Charm",
    details: "Strolling from Chrome Coffee by Delta Theater past brick boutiques, patio dining at Locanda Capri, and concluding at the Gateway Arch.",
  },
  {
    label: "Family Relocation & Schools",
    duration: "45s",
    platform: "Instagram Reel" as const,
    goal: "Moving to Brentwood: Top Schools & Family Lifestyle",
    details: "Touring Heritage High campus, Adams Middle School, Kaiser medical access, and new Shea master-planned homes with custom yards.",
  },
  {
    label: "Waterfront Delta Life",
    duration: "30s",
    platform: "YouTube Shorts" as const,
    goal: "Discovery Bay & Delta Boating Lifestyle",
    details: "Featuring covered boat slips at Discovery Bay Marina, fairway golf course homes, and waterfront dining on the Delta.",
  },
];

export function ReelStoryboardStudio({
  initialGoal = "",
  initialDetails = "",
  initialStoryboard = null,
  onStoryboardSaved,
  onNavigateToVault,
  selectedClips = [],
  onRemovePinnedClip,
}: ReelStoryboardStudioProps) {
  const [goal, setGoal] = useState(initialGoal);
  const [details, setDetails] = useState(initialDetails);
  const [targetDuration, setTargetDuration] = useState<"15s" | "30s" | "45s" | "60s">("30s");
  const [targetPlatform, setTargetPlatform] = useState<"Instagram Reel" | "TikTok" | "YouTube Shorts">("Instagram Reel");
  const [loading, setLoading] = useState(false);
  const [storyboard, setStoryboard] = useState<ReelStoryboard | null>(initialStoryboard);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"timeline" | "voiceover" | "visuals" | "caption">("timeline");

  useEffect(() => {
    if (initialGoal) setGoal(initialGoal);
    if (initialDetails) setDetails(initialDetails);
    if (initialStoryboard) setStoryboard(initialStoryboard);
  }, [initialGoal, initialDetails, initialStoryboard]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !details) return;

    setLoading(true);
    setError("");
    setStoryboard(null);
    setSavedNotification(null);

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

      if (!res.ok) {
        throw new Error("Failed to generate video storyboard");
      }

      const data: ReelStoryboard = await res.json();
      setStoryboard(data);

      // Automatically save to local storage
      const { newEntry, allEntries } = saveStoryboardGeneration(goal, details, data);
      if (onStoryboardSaved) {
        onStoryboardSaved(newEntry, allEntries);
      }
      setSavedNotification("Saved to your Post Library!");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const applyPreset = (preset: (typeof STORYBOARD_PRESETS)[0]) => {
    setGoal(preset.goal);
    setDetails(preset.details);
    setTargetDuration(preset.duration as any);
    setTargetPlatform(preset.platform);
  };

  const formatEditorHandover = () => {
    if (!storyboard) return "";
    let out = `MARGIE LUPO REAL ESTATE - VIDEO EDITING STORYBOARD\n`;
    out += `Title: ${storyboard.reelTitle}\n`;
    out += `Target Platform: ${storyboard.targetPlatform} (9:16 Vertical)\n`;
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Studio Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-900 mb-2">
          Margie Lupo <span className="font-semibold text-amber-700">Video & Reel Studio</span>
        </h1>
        <p className="text-neutral-500 text-sm sm:text-base">
          Transform your real Brentwood & Trilogy B-roll footage into ready-to-cut Reel storyboards, on-screen text overlays, and audio cues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Brief & Production Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-xs border border-neutral-200 p-6 sm:p-7 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-700" />
                Video Brief
              </h2>
              {(goal || details || storyboard) && (
                <button
                  type="button"
                  onClick={() => {
                    setGoal("");
                    setDetails("");
                    setStoryboard(null);
                    setSavedNotification(null);
                  }}
                  className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Quick Strategy Presets */}
            <div className="mb-5">
              <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Video Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {STORYBOARD_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="text-left p-2 rounded-xl text-[11px] leading-tight font-medium bg-neutral-50 hover:bg-amber-50 hover:text-amber-950 border border-neutral-200/80 transition-colors truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Video Concept / Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. A Day in Trilogy at the Vineyards..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-neutral-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Specific Details & Highlights
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Highlight culinary class, sunset vineyard views, and Club Los Meganos..."
                  rows={4}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-neutral-50 focus:bg-white resize-none"
                  required
                />
              </div>

              {/* Target Format & Duration Pills */}
              <div className="space-y-2 pt-1">
                <span className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
                  Target Duration
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

              {/* Target Platform Pills with real SVG logos */}
              <div className="space-y-2 pt-1">
                <span className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
                  Social Platform
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

              {/* Pinned B-Roll Clips */}
              {selectedClips.length > 0 && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                    <span>Pinned B-Roll ({selectedClips.length})</span>
                    <span className="text-[10px] text-amber-700 font-normal">Included in storyboard</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedClips.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-amber-300 text-[11px] font-mono text-neutral-800"
                      >
                        {c.id}
                        {onRemovePinnedClip && (
                          <button
                            type="button"
                            onClick={() => onRemovePinnedClip(c.id)}
                            className="text-neutral-400 hover:text-red-600 font-bold ml-0.5"
                          >
                            ✕
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !goal || !details}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Directing Video Cuts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Generate Video Storyboard</span>
                  </>
                )}
              </button>
            </form>

            {savedNotification && (
              <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {savedNotification}
                </span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {error}
              </div>
            )}

            {onNavigateToVault && (
              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Looking for specific footage?</span>
                <button
                  type="button"
                  onClick={onNavigateToVault}
                  className="font-medium text-amber-800 hover:underline flex items-center gap-0.5"
                >
                  Browse Footage Vault <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Video Storyboard Output */}
        <div className="lg:col-span-8 space-y-6">
          {!storyboard && !loading && (
            <div className="min-h-[460px] flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl bg-white p-8 text-center shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                <Film className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-1">Awaiting Video Concept</h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mb-6 leading-relaxed">
                Select a video preset or type your concept on the left. The studio will sequence your real B-roll footage into a dynamic 9:16 vertical Reel timeline with timing cues, on-screen text, voiceover script, and luxury companion visual prompts.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {STORYBOARD_PRESETS.slice(0, 2).map((p, idx) => (
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
            <div className="min-h-[460px] flex flex-col items-center justify-center rounded-2xl bg-white border border-neutral-200 shadow-xs p-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
              <h4 className="text-base font-semibold text-neutral-900">
                Directing Multi-Clip Storyboard...
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm">
                Selecting exact clips from Margie's Brentwood & Trilogy catalog, calculating audio pacing, and designing sound-off text overlays.
              </p>
            </div>
          )}

          {storyboard && (
            <div className="space-y-6">
              {/* Storyboard Header Bar */}
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

                  {/* Production Handover Action */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        copyToClipboard(formatEditorHandover(), "editor_handover")
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                      title="Copy complete storyboard with timecodes, clip IDs, and Drive links for video editor"
                    >
                      {copiedKey === "editor_handover" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied for Editor!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy for Video Editor</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Audio Direction & Hook Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2 text-xs">
                    <Music className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wider mb-0.5">
                        Audio & Music Direction
                      </span>
                      <span className="text-amber-900">{storyboard.recommendedAudio}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-start gap-2 text-xs">
                    <Smartphone className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-neutral-700 block text-[11px] uppercase tracking-wider mb-0.5">
                        Opening 2-Second Hook
                      </span>
                      <span className="text-neutral-900 font-medium">"{storyboard.hookLine}"</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "timeline"
                      ? "bg-neutral-900 text-white font-semibold"
                      : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Video Timeline ({storyboard.cuts.length} Cuts)</span>
                </button>

                <button
                  onClick={() => setActiveTab("voiceover")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "voiceover"
                      ? "bg-neutral-900 text-white font-semibold"
                      : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Voiceover Script</span>
                </button>

                <button
                  onClick={() => setActiveTab("visuals")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "visuals"
                      ? "bg-neutral-900 text-white font-semibold"
                      : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Image Prompts (3)</span>
                </button>

                <button
                  onClick={() => setActiveTab("caption")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "caption"
                      ? "bg-neutral-900 text-white font-semibold"
                      : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Social Caption</span>
                </button>
              </div>

              {/* Tab 1: Video Timeline Cuts */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
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
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                            {cut.clipId}
                          </span>
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

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                        {/* On-screen text box (mocked mobile caption card) */}
                        <div className="md:col-span-5 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-3.5 rounded-xl shadow-xs flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                            On-Screen Text Overlay
                          </span>
                          <p className="text-sm font-extrabold tracking-tight my-2 text-white leading-snug">
                            "{cut.onScreenText}"
                          </p>
                          <span className="text-[10px] text-neutral-400">
                            Optimized for sound-off social viewing
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
                              Audio & Voiceover Timing:
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
              {activeTab === "voiceover" && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">
                        Complete Voiceover Narration
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Paced for {storyboard.targetDuration} vertical video with natural conversational pauses.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(storyboard.fullVoiceover, "full_voiceover")
                      }
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

                  <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm sm:text-base text-neutral-800 leading-relaxed font-sans whitespace-pre-wrap">
                    {storyboard.fullVoiceover}
                  </div>
                </div>
              )}

              {/* Tab 3: Companion Luxury Image Prompts */}
              {activeTab === "visuals" && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">
                      Companion Luxury Image Prompts (3)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      High-end architectural photography prompts for Reel cover slides and companion carousel posts.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {storyboard.visualPrompts.map((vp, vidx) => (
                      <div
                        key={vidx}
                        className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors shrink-0 self-start"
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

              {/* Tab 4: Social Caption & Hashtags */}
              {activeTab === "caption" && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">
                        Companion Social Caption
                      </h3>
                      <p className="text-xs text-neutral-500">
                        First 2 lines SEO hook • Anti-fluff body • 5-slot hashtag cluster
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

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-3 text-sm text-neutral-800 font-sans leading-relaxed">
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
        </div>
      </div>
    </div>
  );
}
