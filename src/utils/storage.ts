import type { GeneratedContent, SavedGeneration, ReelStoryboard } from "../types";

const STORAGE_KEY = "margie_lupo_content_history_v2";

const INITIAL_SEEDED_GENERATIONS: SavedGeneration[] = [
  {
    id: "seed_storyboard_1",
    timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
    formattedDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    goal: "A Day in the Life: Trilogy at the Vineyards 55+ Resort Living",
    details: "High-retention 30-second Instagram Reel stringing together vineyard hillside views, Club Los Meganos active dinner life, and private culinary studio demonstrations.",
    type: "storyboard",
    isFavorite: true,
    category: "trilogy",
    storyboard: {
      reelTitle: "Trilogy Sunset & Club Life in 30 Seconds",
      targetDuration: "30 sec",
      targetPlatform: "Instagram Reel",
      recommendedAudio: "Upbeat acoustic folk-guitar with warm organic groove, 108 BPM",
      hookLine: "What does active 55+ luxury actually look like in Brentwood?",
      cuts: [
        {
          sequence: 1,
          clipId: "DB-11",
          clipTitle: "Trilogy Hillside Vineyard Overview",
          duration: "0:00 - 0:04 (4s)",
          visualDirection: "Slow, sweeping pan across rolling vines and golden Mount Diablo foothills. Crisp morning sunlight.",
          onScreenText: "Wake up to vineyard views",
          audioPacing: "Hook: If you think 55+ living means slowing down, welcome to Trilogy at the Vineyards."
        },
        {
          sequence: 2,
          clipId: "CLUB-03",
          clipTitle: "Library Lounge & Billiards Room",
          duration: "0:04 - 0:09 (5s)",
          visualDirection: "Warm glide from the fireplace lounge into active billiards room with residents chatting over wine.",
          onScreenText: "Club Los Meganos Social Life",
          audioPacing: "Morning pickleball turns into afternoon coffee and spontaneous social gatherings at Club Los Meganos."
        },
        {
          sequence: 3,
          clipId: "CUL-04",
          clipTitle: "Chef Plating Seared Scallops in Culinary Studio",
          duration: "0:09 - 0:17 (8s)",
          visualDirection: "Close-up of guest chef spooning butternut squash risotto and plating fresh scallops while residents watch.",
          onScreenText: "Private Culinary Demonstrations",
          audioPacing: "Tonight's agenda? An interactive guest chef masterclass in our dedicated on-site culinary studio."
        },
        {
          sequence: 4,
          clipId: "CLUB-01",
          clipTitle: "Clubhouse Dining Room Evening Celebration",
          duration: "0:17 - 0:24 (7s)",
          visualDirection: "Wide, lively evening banquet shot under warm chandeliers with friends toasting glasses.",
          onScreenText: "Resort Lifestyle Everyday",
          audioPacing: "Zero yard maintenance. Exceptional single-story design. And a community that actually connects."
        },
        {
          sequence: 5,
          clipId: "OKT-07",
          clipTitle: "Golden Hour Sunset Over Brentwood",
          duration: "0:24 - 0:30 (6s)",
          visualDirection: "Golden hour sunset transition into soft focus; Margie Lupo logo card and callout overlay.",
          onScreenText: "Tour Trilogy with Margie Lupo",
          audioPacing: "Thinking about making your next move effortless? DM 'TRILOGY' for our off-market inventory list."
        }
      ],
      fullVoiceover: "If you think 55+ living means slowing down, welcome to Trilogy at the Vineyards in Brentwood. Here, morning pickleball turns into afternoon coffee and spontaneous social gatherings at Club Los Meganos. Tonight's agenda? An interactive guest chef masterclass right in our private culinary studio. With zero exterior home maintenance and vineyard vistas out your backdoor, this is California active luxury done right. DM 'TRILOGY' or visit margieluporealestate.com to schedule your private tour.",
      visualPrompts: [
        {
          focus: "Instagram Reel Cover Slide",
          prompt: "High-end luxury architectural portrait of an active modern 55+ couple sipping California wine on a stone patio overlooking lush vineyards and Mount Diablo foothills at golden hour, 35mm lens, warm natural lighting, editorial magazine cover quality."
        },
        {
          focus: "Culinary Studio Masterclass Insert",
          prompt: "Artisanal culinary kitchen studio with warm copper cookware, fresh gourmet herbs, seared scallops plated on artisan stoneware, warm overhead pendant lighting, sharp focus."
        },
        {
          focus: "Club Los Meganos Pool & Architecture",
          prompt: "Spanish-contemporary resort clubhouse with palm trees, limestone walkways, shimmering blue lap pool, crisp blue California sky, architectural digest quality."
        }
      ],
      socialCopy: {
        hook: "Vineyard sunsets and morning pickleball matches: here is what active 55+ luxury looks like in Brentwood.",
        caption: "When clients transition to Trilogy at the Vineyards, the question is rarely about square footage—it is about how each morning feels. With panoramic vineyard vistas and immediate access to Club Los Meganos culinary events, wellness facilities, and resort pools, this enclave represents carefree California living.\n\nEverything is tailored for low-maintenance comfort, allowing you more time on the fairways and less time on home upkeep.",
        callToAction: "Thinking about right-sizing in 2026? Save this post and DM @margielupo or visit margieluporealestate.com for an exclusive community guide.",
        hashtags: [
          "#TrilogyAtTheVineyards",
          "#BrentwoodCARealEstate",
          "#55PlusLivingCalifornia",
          "#LuxuryRetirementLiving",
          "#MargieLupoRealEstate"
        ]
      }
    }
  },
  {
    id: "seed_storyboard_2",
    timestamp: Date.now() - 1000 * 60 * 60 * 36, // 36 hours ago
    formattedDate: new Date(Date.now() - 1000 * 60 * 60 * 36).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    goal: "Downtown Brentwood Walking Tour & Local Flavor",
    details: "Showcasing the historic charm, coffee culture at Chrome Coffee, dining at Locanda Capri, and walkable boutique shopping in downtown Brentwood for relocating families.",
    type: "storyboard",
    isFavorite: false,
    category: "brentwood",
    storyboard: {
      reelTitle: "30 Seconds in Downtown Brentwood",
      targetDuration: "30 sec",
      targetPlatform: "Instagram Reel",
      recommendedAudio: "Breezy indie acoustic with light snare, clean and welcoming, 100 BPM",
      hookLine: "Why everyone moving from the Bay Area falls in love with Downtown Brentwood.",
      cuts: [
        {
          sequence: 1,
          clipId: "DT-01",
          clipTitle: "Delta Theater Marquee & Chrome Coffee Patio",
          duration: "0:00 - 0:05 (5s)",
          visualDirection: "Wide establishing shot of the historic Delta Theater neon sign cutting to morning patrons at Chrome Coffee outdoor tables.",
          onScreenText: "Historic Heart of Brentwood",
          audioPacing: "Start your Saturday right here: Chrome Coffee right beside the iconic Delta Theater marquee."
        },
        {
          sequence: 2,
          clipId: "DT-05",
          clipTitle: "Press Building Tree-Lined Sidewalk Walk",
          duration: "0:05 - 0:13 (8s)",
          visualDirection: "Smooth walking shot down tree-lined sidewalk past brick facades, planter boxes, and local boutiques.",
          onScreenText: "Walkable Boutiques & Cafes",
          audioPacing: "Tree-lined sidewalks, historic brick architecture, and independent shops you can actually stroll between."
        },
        {
          sequence: 3,
          clipId: "DT-08",
          clipTitle: "Salt & Fig Marketplace Storefront",
          duration: "0:13 - 0:21 (8s)",
          visualDirection: "Medium shot of Salt & Fig storefront cutting to Locanda Capri patio tables set for lunch.",
          onScreenText: "Locally Sourced Dining",
          audioPacing: "From artisanal cheeses at Salt & Fig to patio dining at Locanda Capri, Brentwood's culinary scene punches way above its weight."
        },
        {
          sequence: 4,
          clipId: "DT-11",
          clipTitle: "Alluv Place Boutique to Gateway Arch",
          duration: "0:21 - 0:30 (9s)",
          visualDirection: "Tracking past boutique corner and pulling back to frame the famous Brentwood Gateway Arch under blue sky.",
          onScreenText: "Welcome to Brentwood",
          audioPacing: "Small-town warmth paired with modern Northern California comfort. Ready to find your neighborhood? Message Margie Lupo today."
        }
      ],
      fullVoiceover: "Why are so many Bay Area families choosing Brentwood? Start your Saturday right here: coffee on the patio next to the iconic Delta Theater marquee. Tree-lined sidewalks, historic brick architecture at the Press Building, and independent boutiques you can actually stroll between. From artisanal goods at Salt & Fig to patio dining at Locanda Capri, our downtown is full of life. Small-town charm, modern California luxury. Send a message to Margie Lupo to discover our best neighborhood pockets.",
      visualPrompts: [
        {
          focus: "Downtown Brentwood Architectural Streetscape",
          prompt: "Charming historic downtown street in Brentwood CA with mature leafy trees, clean sidewalk cafe with patrons enjoying espresso, historic brick building, warm afternoon natural sunlight, 35mm lens documentary architectural style."
        },
        {
          focus: "Artisanal Outdoor Patio Dining",
          prompt: "Inviting Italian restaurant patio in Northern California wine country with bistro string lights, rustic wooden tables, crisp white plates, relaxed wine glasses, golden hour glow."
        },
        {
          focus: "Brentwood Gateway Arch Landmark",
          prompt: "Iconic metal gateway arch welcoming visitors to Brentwood California, bright clear blue sky, lush street trees, clean asphalt roadway, commercial real estate promotional photograph."
        }
      ],
      socialCopy: {
        hook: "Brentwood's downtown charm is one of the East Bay's best-kept secrets for relocating families.",
        caption: "While many know Brentwood for agricultural roots and custom acreage, our downtown district is where community life happens every single weekend.\n\nFrom morning espresso at Chrome Coffee to evening tables at Locanda Capri, the walkability and historic preservation make this one of the most desirable addresses in Contra Costa County.",
        callToAction: "Planning a move to Brentwood? Save this reel and reach out to @margielupo for our neighborhood relocation tour.",
        hashtags: [
          "#DowntownBrentwood",
          "#BrentwoodCARealEstate",
          "#EastBayLiving",
          "#RelocatingToBrentwood",
          "#MargieLupoRealEstate"
        ]
      }
    }
  }
];

function determineCategory(goal: string, details: string): "trilogy" | "brentwood" | "general" {
  const text = `${goal} ${details}`.toLowerCase();
  if (text.includes("trilogy") || text.includes("vineyard") || text.includes("55+") || text.includes("meganos") || text.includes("rioja")) {
    return "trilogy";
  }
  if (text.includes("brentwood") || text.includes("contra costa") || text.includes("tri-valley") || text.includes("downtown")) {
    return "brentwood";
  }
  return "general";
}

export function getSavedGenerations(): SavedGeneration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Also check legacy key
      const legacy = localStorage.getItem("margie_lupo_content_history_v1");
      if (legacy) {
        try {
          const parsedLegacy = JSON.parse(legacy);
          const combined = [...INITIAL_SEEDED_GENERATIONS, ...parsedLegacy.map((p: any) => ({ ...p, type: p.type || "campaign" }))];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
          return combined;
        } catch {}
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_GENERATIONS));
      return INITIAL_SEEDED_GENERATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SEEDED_GENERATIONS;
  } catch (error) {
    console.error("Failed to load saved generations:", error);
    return INITIAL_SEEDED_GENERATIONS;
  }
}

export function saveStoryboardGeneration(
  goal: string,
  details: string,
  storyboard: ReelStoryboard
): { newEntry: SavedGeneration; allEntries: SavedGeneration[] } {
  const current = getSavedGenerations();
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const newEntry: SavedGeneration = {
    id: `sb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    formattedDate,
    goal,
    details,
    type: "storyboard",
    storyboard,
    isFavorite: false,
    category: determineCategory(goal, details),
  };

  const updated = [newEntry, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save storyboard to localStorage:", err);
  }

  return { newEntry, allEntries: updated };
}

export function saveCampaignGeneration(
  goal: string,
  details: string,
  content: GeneratedContent
): { newEntry: SavedGeneration; allEntries: SavedGeneration[] } {
  const current = getSavedGenerations();
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const newEntry: SavedGeneration = {
    id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    formattedDate,
    goal,
    details,
    type: "campaign",
    content,
    isFavorite: false,
    category: determineCategory(goal, details),
  };

  const updated = [newEntry, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save campaign to localStorage:", err);
  }

  return { newEntry, allEntries: updated };
}

export const saveGeneration = saveCampaignGeneration;

export function deleteGeneration(id: string): SavedGeneration[] {
  const current = getSavedGenerations();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to update localStorage after delete:", err);
  }
  return updated;
}

export function toggleFavoriteGeneration(id: string): SavedGeneration[] {
  const current = getSavedGenerations();
  const updated = current.map((item) => {
    if (item.id === id) {
      return { ...item, isFavorite: !item.isFavorite };
    }
    return item;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to update favorite in localStorage:", err);
  }
  return updated;
}

export function clearAllGenerations(): SavedGeneration[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error("Failed to clear localStorage:", err);
  }
  return [];
}
