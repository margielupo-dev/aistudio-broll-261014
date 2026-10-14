import React, { useState, useEffect } from "react";
import {
  Film,
  Sparkles,
  BookOpen,
  FolderOpen,
  Building2,
  MapPin,
  Globe,
  Mail,
  Instagram,
  Youtube,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import type { User } from "firebase/auth";
import { UnifiedStudio } from "./components/UnifiedStudio";
import { BRollCatalogView } from "./components/BRollCatalogView";
import { SavedPostsLibrary } from "./components/SavedPostsLibrary";
import { BrandPill, GoogleDriveIcon, GoogleSheetsIcon } from "./components/BrandLogos";
import type { SavedGeneration, BRollClip, ReelStoryboard, GeneratedContent } from "./types";
import { getSavedGenerations } from "./utils/storage";
import { initAuth, googleSignIn, logout } from "./utils/googleWorkspace";

export default function App() {
  // Simplified Navigation: Exactly 3 primary destinations
  const [activeTab, setActiveTab] = useState<"studio" | "vault" | "library">("studio");
  const [savedList, setSavedList] = useState<SavedGeneration[]>([]);

  // Google OAuth Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Selected / Pinned B-Roll clips from the vault
  const [selectedClips, setSelectedClips] = useState<BRollClip[]>([]);

  // Studio pre-fill state when loading past items
  const [studioGoal, setStudioGoal] = useState("");
  const [studioDetails, setStudioDetails] = useState("");
  const [studioStoryboard, setStudioStoryboard] = useState<ReelStoryboard | null>(null);
  const [studioCampaign, setStudioCampaign] = useState<GeneratedContent | null>(null);

  // Initialize auth and load history on mount
  useEffect(() => {
    const list = getSavedGenerations();
    setSavedList(list);

    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setGoogleToken(token);
      },
      () => {
        setCurrentUser(null);
        setGoogleToken(null);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setGoogleToken(res.accessToken);
      }
    } catch (err) {
      console.error("Google sign in failed:", err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setGoogleToken(null);
  };

  const handleToggleClipSelection = (clip: BRollClip) => {
    setSelectedClips((prev) => {
      const exists = prev.some((c) => c.id === clip.id);
      if (exists) {
        return prev.filter((c) => c.id !== clip.id);
      } else {
        return [...prev, clip];
      }
    });
  };

  const handleLoadIntoStudio = (item: SavedGeneration) => {
    setStudioGoal(item.goal);
    setStudioDetails(item.details);
    if (item.storyboard) {
      setStudioStoryboard(item.storyboard);
      setStudioCampaign(null);
    } else if (item.content) {
      setStudioCampaign(item.content);
      setStudioStoryboard(null);
    }
    setActiveTab("studio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar with 3-Zone Architecture */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-950 to-neutral-800 text-amber-400 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                ML
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900 text-base sm:text-lg tracking-tight whitespace-nowrap">
                    Margie Lupo
                  </span>
                  <BrandPill type="trilogy" label="Trilogy 55+" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>Brentwood, CA & Trilogy at the Vineyards</span>
                </div>
              </div>
            </div>

            {/* Zone 2: Clean 3-Tab Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200/80">
              <button
                onClick={() => setActiveTab("studio")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "studio"
                    ? "bg-white text-neutral-900 shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Studio</span>
              </button>

              <button
                onClick={() => setActiveTab("vault")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "vault"
                    ? "bg-white text-neutral-900 shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50"
                }`}
              >
                <FolderOpen className="w-4 h-4 text-blue-700" />
                <span>Footage Vault</span>
                {selectedClips.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                    {selectedClips.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("library")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "library"
                    ? "bg-white text-neutral-900 shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50"
                }`}
              >
                <BookOpen className="w-4 h-4 text-neutral-700" />
                <span>Saved Library</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-200 text-neutral-700 font-bold">
                  {savedList.length}
                </span>
              </button>
            </nav>

            {/* Zone 3: Google Drive & Sheets Integration */}
            <div className="flex items-center gap-2 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-50 px-2.5 py-1 rounded-xl border border-neutral-200">
                    <GoogleDriveIcon className="w-3.5 h-3.5" />
                    <GoogleSheetsIcon className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium text-emerald-800 font-mono truncate max-w-[140px]">
                      {currentUser.email}
                    </span>
                  </div>

                  <button
                    onClick={handleGoogleLogout}
                    className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                    title="Sign out of Google"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={isSigningIn}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 shadow-2xs transition-colors"
                >
                  <div className="flex items-center -space-x-1">
                    <GoogleDriveIcon className="w-3.5 h-3.5" />
                    <GoogleSheetsIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{isSigningIn ? "Connecting..." : "Sign in with Google"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-around py-2 border-t border-neutral-100 text-xs">
            <button
              onClick={() => setActiveTab("studio")}
              className={`py-1 px-3 rounded-lg font-medium ${
                activeTab === "studio" ? "text-amber-800 font-bold" : "text-neutral-600"
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              className={`py-1 px-3 rounded-lg font-medium ${
                activeTab === "vault" ? "text-blue-800 font-bold" : "text-neutral-600"
              }`}
            >
              Footage Vault ({selectedClips.length})
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`py-1 px-3 rounded-lg font-medium ${
                activeTab === "library" ? "text-neutral-900 font-bold" : "text-neutral-600"
              }`}
            >
              Library ({savedList.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "studio" && (
          <UnifiedStudio
            initialGoal={studioGoal}
            initialDetails={studioDetails}
            initialStoryboard={studioStoryboard}
            initialCampaign={studioCampaign}
            selectedClips={selectedClips}
            onToggleClipSelection={handleToggleClipSelection}
            onNavigateToVault={() => setActiveTab("vault")}
            onStoryboardSaved={(_item, all) => setSavedList(all)}
            onCampaignSaved={(_item, all) => setSavedList(all)}
          />
        )}

        {activeTab === "vault" && (
          <BRollCatalogView
            onSelectClipForStoryboard={handleToggleClipSelection}
            selectedClipIds={selectedClips.map((c) => c.id)}
            googleToken={googleToken}
            onPromptGoogleLogin={handleGoogleLogin}
          />
        )}

        {activeTab === "library" && (
          <SavedPostsLibrary
            savedList={savedList}
            onUpdateList={setSavedList}
            onLoadIntoStudio={handleLoadIntoStudio}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>
              Margie Lupo Real Estate Advisor • Luxury Brentwood & Trilogy at the Vineyards 55+
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-neutral-600 font-medium">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              margieluporealestate.com
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              margielupo@gmail.com
            </span>
            <span className="flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5 text-neutral-400" />
              @margielupo
            </span>
            <span className="flex items-center gap-1">
              <Youtube className="w-3.5 h-3.5 text-neutral-400" />
              @margiestrilogyvibes
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
