# Margie Lupo Social Video & B-Roll Production Studio

A dedicated visual-first social production workspace connecting Google Drive and Google Sheets to transform Margie's preloaded B-roll catalog into multi-clip Reel storyboards, precise timing cuts, audio direction, and luxury companion visual prompts.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed based on your requirements and clarifying choices:
> - **Preloaded & Organized B-Roll Library**: The 8 categories of real Brentwood and Trilogy B-roll footage (Oktoberfest, Schools, Downtown, Delta/Discovery Bay, Club House, Culinary Studio, Vasco Road, Farms & New Homes) are organized with instant search, duration counters, editor notes, and direct Google Drive file triggers.
> - **Multi-Clip Reel Storyboard Generator**: Shifting from pure text captions to a visual/video director model. Gemini generates multi-clip reel sequences specifying which exact B-roll clips to stitch together (Clip ID, start/cut timestamps, on-screen text overlays, and voiceover/audio pacing).
> - **Live Google Drive & Google Sheets Integration**: Supports direct Google Sign-In with OAuth for Drive & Sheets to browse your Drive footage folders and sync with live Google Sheets spreadsheets.
> - **Cognitive Load & Brand Badge Discipline**: Zero-pill clutter for static text; clean 1–2 word pills with official brand SVG logos (Instagram, Facebook, YouTube, LinkedIn, Google Drive, Google Sheets) and brand colors, ensuring effortless scanning.

---

## 1. Overview & Core Concept

- **What It Does**: Shifts the application from a text-heavy caption engine into a **Social Video & B-Roll Production Studio** designed for Margie Lupo. It houses Margie's entire curated B-roll catalog (categorized, tagged, and indexed with clip durations and usage notes), connects directly to Google Drive and Google Sheets via OAuth, and features a Reel Storyboard Engine that generates visual timelines, clip sequencing, audio prompts, and companion photography generation prompts.
- **Target Audience / Persona**: Margie Lupo, Strategic Real Estate Advisor, marketing luxury listings, neighborhood lifestyle, and 55+ active adult retirement in Brentwood, CA and Trilogy at the Vineyards.
- **Key Value**: Eliminates video editor friction and creative block. Instead of wondering what footage to post, Margie inputs a goal (e.g. "Weekend Farmer's Market & Historic Downtown Living") and instantly receives an exact video timeline matching her real B-roll clips, complete with audio timing, caption hooks, and companion AI image prompts.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **B-Roll Catalog Explorer**:
   - Margie browses her 8 footage categories (Oktoberfest, Schools, Downtown, Discovery Bay, Trilogy Clubhouse, Culinary Class, Vasco Road, Farms/New Homes).
   - Filter clips by category, duration, or script recommendation (e.g. "Schools", "Waterfront dining", "U-pick").
   - Click any clip to preview editor notes, copy clip ID, open linked Google Drive video, or add to the active storyboard queue.
2. **Google Drive & Sheets Sync Bar**:
   - Official "Sign in with Google" action at the top bar.
   - Connected status shows active Google Drive folder picker and Google Sheet synchronization state (with manual "Sync Sheet" and "Add Clip" modal).
3. **Reel Storyboard & Visual Generator**:
   - Margie selects a campaign topic or preset (e.g., "Trilogy Resort Lifestyle Reel" or "Brentwood Relocation Guide").
   - Selects target format: 9:16 Instagram Reel / TikTok (15s, 30s, or 45s), or YouTube Short.
   - Hits "Generate Video Storyboard".
   - The engine returns:
     - **Visual Timeline**: 3 to 5 sequenced B-roll cards with Clip ID (`CLUB-01`, `DT-03`, `B01`), cut duration (e.g., `0:00 - 0:04`), on-screen text overlay, and transition direction.
     - **Audio & Voiceover Script**: Paced narration matching the exact visual cuts.
     - **Companion Photography Prompts**: Architectural prompts tailored for companion carousel slides or cover art.
     - **SEO Social Copy & 5-Slot Hashtags**: Retaining Margie's signature anti-fluff luxury copy and 5-slot hashtag engine.
4. **Export & Copy Studio**:
   - 1-click "Copy Storyboard for Video Editor".
   - 1-click "Open All Clips in Drive".
   - Save to Local Storage library with category badges.

### Visual Identity & Theme

- **Aesthetic Direction**: Minimal luxury California editorial. Warm paper and crisp white surfaces with deep espresso (`#1A1715`) typography and vineyard amber (`#B45309`) accents.
- **Brand Logos & Official Palette**:
  - Official Google Drive (tri-color green/yellow/blue), Google Sheets (emerald green `#0F9D58`), Instagram (gradient / magenta `#E1306C`), YouTube (crimson `#FF0000`), and LinkedIn (blue `#0A66C2`).
  - Strict 1–2 word pill labels (`Drive`, `Sheets`, `Reel`, `Trilogy`, `Brentwood`, `45 sec`).
- **Typography & Hierarchy**:
  - Display: `Plus Jakarta Sans` with tight tracking for clean authority.
  - Monospace Data: `JetBrains Mono` / `tabular-nums` for clip codes (`SCH-01`, `DT-05`), timestamps (`0:04`), and aspect ratios (`9:16`).
- **Cognitive Load Restraint**:
  - Unboxed metadata with typographic separators (`·`).
  - Max 1 level of card elevation; generous white space between production sections.
  - No decorative status pulses or fake telemetry.

---

## 3. Key Product Decisions & Trade-Offs

- **Preloaded Catalog with Live Sheets/Drive Bridge**:
  - *Approach*: Ship with Margie's complete 40+ item B-roll dataset pre-indexed in memory and local storage, while simultaneously providing real Google OAuth integration to read/write live Google Sheets and view Google Drive files.
  - *Why*: Instant utility without forcing Margie to connect or configure a spreadsheet before getting value, but providing full cloud sync when signed in.
- **Storyboard Sequencer vs. Generic Text Generator**:
  - *Approach*: Structured multi-clip timeline cards that reference specific B-roll clip IDs directly from Margie's library.
  - *Why*: Solves Margie's stated goal: "my main goal isnt to have a caption generator but having images and videos for social. i have b roll videos list and want to be able to load and generate."
- **Strict 1-2 Word Badge Standard**:
  - *Approach*: Platform and category pills are strictly capped at 1–2 words with authentic brand SVG icons.
  - *Why*: Avoids cognitive overload and maintains a focused, professional workspace.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   Margie Lupo Video & B-Roll Studio UI                      │
├───────────────────────────────┬─────────────────────────────────────────────┤
│   Top Bar (Google Sign-In,    │  Tabs: Video Storyboard | B-Roll Catalog    │
│   Drive & Sheets Sync Pill)   │        | Saved Library                      │
└───────────────┬───────────────┴───────────────────────┬─────────────────────┘
                │                                       │
        ┌───────▼────────┐                      ┌───────▼────────┐
        │  Google Auth   │                      │  B-Roll Store  │
        │  (OAuth Token  │                      │  (40+ Preload, │
        │   in Memory)   │                      │   Local Sync)  │
        └───────┬────────┘                      └───────┬────────┘
                │                                       │
        ┌───────▼───────────────────────────────────────▼────────┐
        │       Client Workspace Bridge (Drive / Sheets APIs)    │
        │ - GET /drive/v3/files?q=mimeType contains 'video'      │
        │ - GET /v4/spreadsheets/{id}/values                     │
        └───────────────────────┬────────────────────────────────┘
                                │
                        ┌───────▼────────┐
                        │   Server API   │
                        │ /api/generate- │
                        │   storyboard   │
                        └───────┬────────┘
                                │
                        ┌───────▼────────┐
                        │ Gemini 3.6-    │
                        │ Flash (JSON    │
                        │ Storyboard     │
                        │ Schema)        │
                        └────────────────┘
```

### Data Models & Schemas

```typescript
export interface BRollClip {
  id: string; // e.g. "OKT-01", "SCH-01", "DT-01"
  folder: string; // "Downtown Brentwood", "Trilogy Clubhouse", etc.
  description: string;
  length: string; // "20 sec", "Photo"
  editorNote: string;
  videoLink: string;
  driveFileId?: string;
  bestUse: string; // "Schools", "Waterfront dining", etc.
  inDrive: boolean;
}

export interface StoryboardCut {
  sequence: number;
  clipId: string;
  clipTitle: string;
  duration: string; // "0:00 - 0:04 (4s)"
  visualDirection: string;
  onScreenText: string;
  audioPacing: string;
}

export interface ReelStoryboard {
  reelTitle: string;
  targetDuration: string; // "30 sec"
  aspectRatio: "9:16";
  recommendedAudio: string;
  hookLine: string;
  cuts: StoryboardCut[];
  fullVoiceover: string;
  visualPrompts: Array<{ focus: string; prompt: string }>;
  socialCopy: {
    hook: string;
    caption: string;
    callToAction: string;
    hashtags: string[];
  };
}
```

### Interactive Components & Verification

1. `src/data/brollCatalog.ts`: Complete structured dataset of Margie's B-roll footage.
2. `src/utils/googleWorkspace.ts`: Client-side OAuth token manager and Drive/Sheets API fetcher.
3. `src/components/BRollCatalogView.tsx`: Filterable footage vault with clip previews, Drive links, and search.
4. `src/components/ReelStoryboardStudio.tsx`: Interactive multi-clip storyboard generator with duration calculator, editor export, and companion image prompt generator.
5. `src/components/SavedPostsLibrary.tsx`: Library supporting both Reel Storyboards and social campaigns.
