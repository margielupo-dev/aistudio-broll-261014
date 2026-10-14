import React, { useState, useMemo } from "react";
import {
  Search,
  Trash2,
  Copy,
  CheckCircle2,
  Star,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  FileText,
  Camera,
  Film,
  Music,
  ListOrdered,
  X,
  Check,
  ExternalLink
} from "lucide-react";
import type { SavedGeneration, SocialCopy } from "../types";
import { deleteGeneration, toggleFavoriteGeneration, clearAllGenerations } from "../utils/storage";
import { BrandPill, GoogleDriveIcon } from "./BrandLogos";

interface SavedPostsLibraryProps {
  savedList: SavedGeneration[];
  onUpdateList: (newList: SavedGeneration[]) => void;
  onLoadIntoStudio: (item: SavedGeneration) => void;
}

export function SavedPostsLibrary({
  savedList,
  onUpdateList,
  onLoadIntoStudio,
}: SavedPostsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "storyboard" | "campaign" | "favorites" | "trilogy" | "brentwood">("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(savedList[0]?.id || null);
  const [activeTabPerCard, setActiveTabPerCard] = useState<Record<string, "timeline" | "voiceover" | "visuals" | "caption">>({});

  const notifyCopied = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavoriteGeneration(id);
    onUpdateList(updated);
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${title}" from your saved library?`)) {
      const updated = deleteGeneration(id);
      onUpdateList(updated);
      if (expandedId === id) {
        setExpandedId(null);
      }
    }
  };

  const handleClearAll = () => {
    if (savedList.length === 0) return;
    if (window.confirm("Are you sure you want to clear your entire saved history? This cannot be undone.")) {
      const updated = clearAllGenerations();
      onUpdateList(updated);
      setExpandedId(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `margie_lupo_content_library_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatFullCampaign = (item: SavedGeneration) => {
    if (item.storyboard) {
      const sb = item.storyboard;
      let out = `MARGIE LUPO REAL ESTATE - VIDEO STORYBOARD\n`;
      out += `Title: ${sb.reelTitle}\n`;
      out += `Platform: ${sb.targetPlatform} | Duration: ${sb.targetDuration}\n`;
      out += `Recommended Audio: ${sb.recommendedAudio}\n`;
      out += `Hook: "${sb.hookLine}"\n`;
      out += `==============================================\n\n`;
      out += `[CUTS & TIMELINE]:\n`;
      sb.cuts.forEach((c) => {
        out += `#${c.sequence} | ${c.duration} | CLIP ${c.clipId}: ${c.clipTitle}\n`;
        out += `  Overlay Text: "${c.onScreenText}"\n`;
        out += `  Direction: ${c.visualDirection}\n`;
        out += `  Audio Pacing: ${c.audioPacing}\n\n`;
      });
      out += `[VOICEOVER]:\n${sb.fullVoiceover}\n\n`;
      out += `[CAPTION]:\n${sb.socialCopy.hook}\n\n${sb.socialCopy.caption}\n\nCTA: ${sb.socialCopy.callToAction}\n${sb.socialCopy.hashtags.join(" ")}\n`;
      return out;
    }

    if (item.content) {
      let out = `MARGIE LUPO REAL ESTATE - SOCIAL STRATEGY\n`;
      out += `Goal: ${item.goal}\n\n`;
      item.content.socialCopy.forEach((c, idx) => {
        out += `Option ${idx + 1} (${c.platform}):\n${c.hook}\n\n${c.body}\n\nCTA: ${c.callToAction}\n${c.hashtags.join(" ")}\n\n`;
      });
      return out;
    }
    return item.goal;
  };

  const filteredList = useMemo(() => {
    return savedList.filter((item) => {
      if (selectedFilter === "favorites" && !item.isFavorite) return false;
      if (selectedFilter === "storyboard" && item.type !== "storyboard") return false;
      if (selectedFilter === "campaign" && item.type === "storyboard") return false;
      if (selectedFilter === "trilogy" && item.category !== "trilogy") return false;
      if (selectedFilter === "brentwood" && item.category !== "brentwood") return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      const inGoal = item.goal.toLowerCase().includes(q);
      const inDetails = item.details.toLowerCase().includes(q);
      const inStoryboard =
        item.storyboard &&
        (item.storyboard.reelTitle.toLowerCase().includes(q) ||
          item.storyboard.hookLine.toLowerCase().includes(q) ||
          item.storyboard.cuts.some(
            (c) =>
              c.clipId.toLowerCase().includes(q) ||
              c.clipTitle.toLowerCase().includes(q) ||
              c.onScreenText.toLowerCase().includes(q)
          ));
      const inContent =
        item.content &&
        item.content.socialCopy.some(
          (c) =>
            c.hook.toLowerCase().includes(q) ||
            c.body.toLowerCase().includes(q) ||
            c.hashtags.some((h) => h.toLowerCase().includes(q))
        );

      return inGoal || inDetails || inStoryboard || inContent;
    });
  }, [savedList, selectedFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-700" />
              Margie's Video & Post Library
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">
              Review and copy past Reel storyboards, voiceover scripts, image prompts, and social campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportJSON}
              disabled={savedList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Library</span>
            </button>
            {savedList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, clip ID (e.g. DB-11), on-screen text, or hashtag..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-neutral-50 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === "all"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              All ({savedList.length})
            </button>
            <button
              onClick={() => setSelectedFilter("storyboard")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedFilter === "storyboard"
                  ? "bg-amber-800 text-white font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Reel Storyboards ({savedList.filter((s) => s.type === "storyboard").length})
            </button>
            <button
              onClick={() => setSelectedFilter("favorites")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedFilter === "favorites"
                  ? "bg-amber-600 text-white font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              Starred ({savedList.filter((s) => s.isFavorite).length})
            </button>
            <button
              onClick={() => setSelectedFilter("trilogy")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === "trilogy"
                  ? "bg-neutral-900 text-white font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Trilogy 55+
            </button>
            <button
              onClick={() => setSelectedFilter("brentwood")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === "brentwood"
                  ? "bg-neutral-900 text-white font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Brentwood
            </button>
          </div>
        </div>
      </div>

      {/* List of Saved Items */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <Filter className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-800 mb-1">No matching saved items</h3>
          <p className="text-xs text-neutral-500 mb-4">
            {searchQuery
              ? `No content found matching "${searchQuery}".`
              : "No saved campaigns or storyboards in this category."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 text-neutral-700"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => {
            const isExpanded = expandedId === item.id;
            const currentTab = activeTabPerCard[item.id] || "timeline";

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs overflow-hidden ${
                  isExpanded
                    ? "border-amber-400 ring-2 ring-amber-500/10"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 cursor-pointer select-none hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {item.type === "storyboard" ? (
                          <BrandPill type="reel" label="Reel Storyboard" />
                        ) : (
                          <BrandPill type="brentwood" label="Caption Campaign" />
                        )}

                        <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.formattedDate}
                        </span>

                        {item.storyboard && (
                          <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                            {item.storyboard.targetDuration} • {item.storyboard.cuts.length} cuts
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-neutral-900 tracking-tight leading-snug">
                        {item.storyboard ? item.storyboard.reelTitle : item.goal}
                      </h3>

                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {item.details}
                      </p>
                    </div>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-1 self-end sm:self-start shrink-0 pt-1">
                      <button
                        onClick={(e) => handleToggleFavorite(item.id, e)}
                        className={`p-2 rounded-xl transition-colors ${
                          item.isFavorite
                            ? "text-amber-500 bg-amber-50"
                            : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                        }`}
                        title="Star"
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? "fill-current" : ""}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          notifyCopied(`full_${item.id}`, formatFullCampaign(item));
                        }}
                        className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                        title="Copy full package"
                      >
                        {copiedKey === `full_${item.id}` ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadIntoStudio(item);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        <span>Load in Studio</span>
                      </button>

                      <button
                        onClick={(e) => handleDelete(item.id, item.goal, e)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!isExpanded && item.storyboard && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      <span className="truncate italic">
                        Opening Hook: "{item.storyboard.hookLine}"
                      </span>
                      <span className="text-amber-700 font-medium pl-2 whitespace-nowrap flex items-center gap-0.5">
                        Expand Storyboard <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Expanded Detailed Content */}
                {isExpanded && item.storyboard && (
                  <div className="border-t border-neutral-100 bg-neutral-50/50 p-5 space-y-4">
                    {/* View Switcher inside card */}
                    <div className="flex border-b border-neutral-200 pb-2.5 gap-2">
                      <button
                        onClick={() =>
                          setActiveTabPerCard((prev) => ({ ...prev, [item.id]: "timeline" }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          currentTab === "timeline"
                            ? "bg-neutral-900 text-white font-semibold"
                            : "bg-white text-neutral-600 border border-neutral-200"
                        }`}
                      >
                        Video Cuts ({item.storyboard.cuts.length})
                      </button>
                      <button
                        onClick={() =>
                          setActiveTabPerCard((prev) => ({ ...prev, [item.id]: "voiceover" }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          currentTab === "voiceover"
                            ? "bg-neutral-900 text-white font-semibold"
                            : "bg-white text-neutral-600 border border-neutral-200"
                        }`}
                      >
                        Voiceover Script
                      </button>
                      <button
                        onClick={() =>
                          setActiveTabPerCard((prev) => ({ ...prev, [item.id]: "visuals" }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          currentTab === "visuals"
                            ? "bg-neutral-900 text-white font-semibold"
                            : "bg-white text-neutral-600 border border-neutral-200"
                        }`}
                      >
                        Image Prompts ({item.storyboard.visualPrompts.length})
                      </button>
                      <button
                        onClick={() =>
                          setActiveTabPerCard((prev) => ({ ...prev, [item.id]: "caption" }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          currentTab === "caption"
                            ? "bg-neutral-900 text-white font-semibold"
                            : "bg-white text-neutral-600 border border-neutral-200"
                        }`}
                      >
                        Caption & Hashtags
                      </button>
                    </div>

                    {/* Timeline Cuts */}
                    {currentTab === "timeline" && (
                      <div className="space-y-3">
                        {item.storyboard.cuts.map((cut, cidx) => (
                          <div
                            key={cidx}
                            className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded font-mono">
                                  {cut.clipId}
                                </span>
                                <span className="font-bold text-neutral-900">{cut.clipTitle}</span>
                                <span className="text-neutral-400 font-mono">({cut.duration})</span>
                              </div>
                              <p className="text-neutral-700 font-medium">
                                Text Overlay: <span className="text-neutral-950 font-bold">"{cut.onScreenText}"</span>
                              </p>
                              <p className="text-neutral-500 text-[11px]">{cut.visualDirection}</p>
                            </div>

                            <a
                              href={`https://drive.google.com/drive/search?q=${encodeURIComponent(cut.clipId)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs shrink-0 self-start"
                            >
                              <GoogleDriveIcon className="w-3 h-3" />
                              <span>Open Drive</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Voiceover */}
                    {currentTab === "voiceover" && (
                      <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-700">Narration Script:</span>
                          <button
                            onClick={() =>
                              notifyCopied(`vo_${item.id}`, item.storyboard!.fullVoiceover)
                            }
                            className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
                          >
                            {copiedKey === `vo_${item.id}` ? "Copied!" : "Copy Voiceover"}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                          {item.storyboard.fullVoiceover}
                        </p>
                      </div>
                    )}

                    {/* Visuals */}
                    {currentTab === "visuals" && (
                      <div className="space-y-2">
                        {item.storyboard.visualPrompts.map((vp, vidx) => (
                          <div
                            key={vidx}
                            className="bg-white rounded-xl border border-neutral-200 p-3 flex items-start justify-between gap-3 text-xs"
                          >
                            <div>
                              <span className="font-semibold text-amber-900 block mb-0.5">
                                {vp.focus}
                              </span>
                              <p className="text-neutral-600 font-mono text-[11px]">{vp.prompt}</p>
                            </div>
                            <button
                              onClick={() => notifyCopied(`vp_${item.id}_${vidx}`, vp.prompt)}
                              className="px-2.5 py-1 rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shrink-0"
                            >
                              {copiedKey === `vp_${item.id}_${vidx}` ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Caption */}
                    {currentTab === "caption" && (
                      <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3 text-xs leading-relaxed">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-700">Social Caption:</span>
                          <button
                            onClick={() =>
                              notifyCopied(
                                `cap_${item.id}`,
                                `${item.storyboard!.socialCopy.hook}\n\n${item.storyboard!.socialCopy.caption}\n\n${item.storyboard!.socialCopy.callToAction}\n\n${item.storyboard!.socialCopy.hashtags.join(" ")}`
                              )
                            }
                            className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
                          >
                            {copiedKey === `cap_${item.id}` ? "Copied!" : "Copy Caption"}
                          </button>
                        </div>
                        <p className="font-bold text-neutral-900">{item.storyboard.socialCopy.hook}</p>
                        <p className="whitespace-pre-line text-neutral-700">{item.storyboard.socialCopy.caption}</p>
                        <p className="text-amber-800 font-mono">{item.storyboard.socialCopy.hashtags.join(" ")}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
