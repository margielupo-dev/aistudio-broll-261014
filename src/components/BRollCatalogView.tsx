import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Copy,
  CheckCircle2,
  ExternalLink,
  Plus,
  FileSpreadsheet,
  Film,
  Clock,
  Sparkles,
  Info,
  Check,
  FolderOpen,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import type { BRollClip } from "../types";
import { BROLL_CATALOG, BROLL_FOLDERS } from "../data/brollCatalog";
import { BrandPill, GoogleDriveIcon, GoogleSheetsIcon } from "./BrandLogos";
import { exportBRollToNewSheet, fetchSpreadsheetRows } from "../utils/googleWorkspace";

interface BRollCatalogViewProps {
  onSelectClipForStoryboard?: (clip: BRollClip) => void;
  selectedClipIds?: string[];
  googleToken: string | null;
  onPromptGoogleLogin: () => void;
}

export function BRollCatalogView({
  onSelectClipForStoryboard,
  selectedClipIds = [],
  googleToken,
  onPromptGoogleLogin,
}: BRollCatalogViewProps) {
  const [clips, setClips] = useState<BRollClip[]>(() => {
    try {
      const custom = localStorage.getItem("margie_broll_custom_catalog");
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return BROLL_CATALOG;
  });

  const [activeFolder, setActiveFolder] = useState<string>("All Footage");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInDriveOnly, setFilterInDriveOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sheets sync state
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSheetUrl, setExportedSheetUrl] = useState<string | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [customSheetId, setCustomSheetId] = useState("");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // New clip modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClipId, setNewClipId] = useState("");
  const [newFolder, setNewFolder] = useState("Downtown");
  const [newDescription, setNewDescription] = useState("");
  const [newLength, setNewLength] = useState("15 sec");
  const [newEditorNote, setNewEditorNote] = useState("");
  const [newBestUse, setNewBestUse] = useState("General");
  const [newInDrive, setNewInDrive] = useState(true);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  const handleExportToSheets = async () => {
    if (!googleToken) {
      onPromptGoogleLogin();
      return;
    }

    setIsExporting(true);
    setSyncStatus(null);
    try {
      const url = await exportBRollToNewSheet(googleToken, clips);
      setExportedSheetUrl(url);
      setSyncStatus("Successfully exported to Google Sheets!");
    } catch (err: any) {
      setSyncStatus(`Export failed: ${err.message || "Please check Drive/Sheets permissions"}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSyncFromCustomSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleToken) {
      onPromptGoogleLogin();
      return;
    }
    if (!customSheetId.trim()) return;

    // Extract ID if full URL pasted
    let cleanId = customSheetId.trim();
    const match = cleanId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) cleanId = match[1];

    setSyncStatus("Fetching rows from Google Sheets...");
    try {
      const rows = await fetchSpreadsheetRows(googleToken, cleanId, "A2:H100");
      if (rows && rows.length > 0) {
        const syncedClips: BRollClip[] = rows.map((r: any[], idx: number) => ({
          id: r[0] || `CLIP-${idx + 1}`,
          folder: r[1] || "Imported",
          description: r[2] || "B-roll clip",
          length: r[3] || "15 sec",
          editorNote: r[4] || "",
          videoLink: r[5] || `https://drive.google.com/drive/search?q=${r[0]}`,
          bestUse: r[6] || "General",
          inDrive: r[7] === "In Drive" || true,
        }));
        setClips(syncedClips);
        localStorage.setItem("margie_broll_custom_catalog", JSON.stringify(syncedClips));
        setSyncStatus(`Successfully imported ${syncedClips.length} clips from Google Sheets!`);
        setShowSyncModal(false);
      } else {
        setSyncStatus("No rows found in spreadsheet range A2:H100");
      }
    } catch (err: any) {
      setSyncStatus(`Sync error: ${err.message}`);
    }
  };

  const handleCreateClip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClipId || !newDescription) return;

    const newClip: BRollClip = {
      id: newClipId.toUpperCase().trim(),
      folder: newFolder,
      description: newDescription,
      length: newLength,
      editorNote: newEditorNote,
      videoLink: `https://drive.google.com/drive/search?q=${encodeURIComponent(newClipId)}`,
      bestUse: newBestUse,
      inDrive: newInDrive,
    };

    const updated = [newClip, ...clips];
    setClips(updated);
    localStorage.setItem("margie_broll_custom_catalog", JSON.stringify(updated));
    setShowAddModal(false);
    // Reset form
    setNewClipId("");
    setNewDescription("");
    setNewEditorNote("");
  };

  const filteredClips = useMemo(() => {
    return clips.filter((clip) => {
      // Folder filter
      if (activeFolder !== "All Footage" && clip.folder !== activeFolder) {
        return false;
      }
      // In Drive filter
      if (filterInDriveOnly && !clip.inDrive) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        clip.id.toLowerCase().includes(q) ||
        clip.description.toLowerCase().includes(q) ||
        clip.folder.toLowerCase().includes(q) ||
        clip.bestUse.toLowerCase().includes(q) ||
        clip.editorNote.toLowerCase().includes(q)
      );
    });
  }, [clips, activeFolder, filterInDriveOnly, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Google Workspace Action Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Film className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">
                Margie's B-Roll Footage Vault
              </h2>
              <BrandPill type="drive" label="Drive Synced" />
            </div>
            <p className="text-neutral-500 text-xs sm:text-sm">
              Organized catalog of 48+ real estate clips across Trilogy at the Vineyards, Downtown Brentwood, Heritage High, and Delta waterfronts.
            </p>
          </div>

          {/* Action buttons: Google Sheets Export & Add Clip */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportToSheets}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-2xs disabled:opacity-50"
              title="Create live Google Sheet of this B-roll library"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <GoogleSheetsIcon className="w-3.5 h-3.5" />
              )}
              <span>Export to Sheets</span>
            </button>

            <button
              onClick={() => setShowSyncModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
              title="Import or refresh footage list from Google Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sync Sheet</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Clip</span>
            </button>
          </div>
        </div>

        {/* Export Success Notification */}
        {exportedSheetUrl && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              Live Google Sheet created! All 48 clips formatted with headers.
            </span>
            <a
              href={exportedSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold underline text-emerald-800 hover:text-emerald-950"
            >
              Open in Google Sheets <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {syncStatus && !exportedSheetUrl && (
          <div className="mb-4 p-3 rounded-xl bg-neutral-100 text-neutral-800 text-xs flex items-center justify-between">
            <span>{syncStatus}</span>
            <button onClick={() => setSyncStatus(null)} className="text-neutral-500 hover:text-neutral-800 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Search & In-Drive Quick Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by clip ID (e.g. DT-01, CLUB-01), keyword, or best use..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-neutral-50 focus:bg-white transition-colors"
            />
          </div>

          <button
            onClick={() => setFilterInDriveOnly(!filterInDriveOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap ${
              filterInDriveOnly
                ? "bg-blue-50 text-blue-900 border-blue-300 font-semibold"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <GoogleDriveIcon className="w-3.5 h-3.5" />
            <span>In Drive ({clips.filter((c) => c.inDrive).length})</span>
          </button>
        </div>

        {/* Folder Navigation Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-4 pt-3 border-t border-neutral-100 pb-1">
          {BROLL_FOLDERS.map((folder) => {
            const count =
              folder === "All Footage"
                ? clips.length
                : clips.filter((c) => c.folder === folder).length;
            const isActive = activeFolder === folder;

            return (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {folder} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of B-Roll Clips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClips.map((clip) => {
          const isSelected = selectedClipIds.includes(clip.id);

          return (
            <div
              key={clip.id}
              className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div>
                {/* Header: Clip ID + 1-2 Word Brand Pills */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-900 text-amber-400 tracking-wider">
                      {clip.id}
                    </span>
                    <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      {clip.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {clip.inDrive ? (
                      <BrandPill type="drive" label="Drive" />
                    ) : (
                      <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 mb-2 leading-snug">
                  {clip.description}
                </h4>

                {/* Editor Note */}
                {clip.editorNote && (
                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-600 mb-3 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{clip.editorNote}</span>
                  </div>
                )}
              </div>

              {/* Bottom Metadata & Production Actions */}
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="text-amber-800 font-medium truncate max-w-[150px]">
                    Best: {clip.bestUse}
                  </span>
                  <span className="text-neutral-400">{clip.folder}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {onSelectClipForStoryboard && (
                    <button
                      onClick={() => onSelectClipForStoryboard(clip)}
                      className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                        isSelected
                          ? "bg-amber-600 text-white"
                          : "bg-neutral-900 hover:bg-neutral-800 text-white"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Pinned</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Use in Reel</span>
                        </>
                      )}
                    </button>
                  )}

                  <a
                    href={clip.videoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-medium border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center justify-center gap-1 text-center"
                  >
                    <GoogleDriveIcon className="w-3 h-3" />
                    <span>Open Drive</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync from Google Sheet Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                <GoogleSheetsIcon className="w-4 h-4" />
                Sync from Google Sheet
              </h3>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Paste your Google Sheet URL or Spreadsheet ID. The spreadsheet should have columns for Clip ID, Folder, Description, Length, and Editor Notes.
            </p>

            <form onSubmit={handleSyncFromCustomSheet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Google Sheet URL or ID
                </label>
                <input
                  type="text"
                  value={customSheetId}
                  onChange={(e) => setCustomSheetId(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              {!googleToken && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  You need to sign in with Google to read from private Google Sheets.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  Fetch Clips
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Clip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-700" />
                Add New B-Roll Footage
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClip} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Clip ID
                  </label>
                  <input
                    type="text"
                    value={newClipId}
                    onChange={(e) => setNewClipId(e.target.value)}
                    placeholder="e.g. DT-12, TRIL-05"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Folder
                  </label>
                  <select
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white"
                  >
                    {BROLL_FOLDERS.filter((f) => f !== "All Footage").map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Footage Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Slow pan of Trilogy resort swimming pool in morning sun..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Clip Length
                  </label>
                  <input
                    type="text"
                    value={newLength}
                    onChange={(e) => setNewLength(e.target.value)}
                    placeholder="e.g. 24 sec"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Best Use in Script
                  </label>
                  <input
                    type="text"
                    value={newBestUse}
                    onChange={(e) => setNewBestUse(e.target.value)}
                    placeholder="e.g. Resort lifestyle"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Editor Note
                </label>
                <input
                  type="text"
                  value={newEditorNote}
                  onChange={(e) => setNewEditorNote(e.target.value)}
                  placeholder="e.g. Smooth gimbal shot. Crisp natural lighting."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inDriveCheck"
                  checked={newInDrive}
                  onChange={(e) => setNewInDrive(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="inDriveCheck" className="text-xs text-neutral-700">
                  Already uploaded to Google Drive
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white"
                >
                  Save Clip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
