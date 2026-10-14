import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/generate", async (req, res) => {
    try {
      const { goal, details } = req.body;

      const systemInstruction = `You are an elite, highly specialized AI Real Estate Content Strategist, Search SEO Expert, and Brand Copywriter. Your sole client is Margie Lupo, a premier Strategic Real Estate Advisor specializing in the luxury markets of Brentwood, CA, and the Trilogy at the Vineyards 55+ active adult community.

Target Demographics & Core Sub-Advisories:
- Trilogy at the Vineyards: 55+ active adult lifestyle, luxury retirement, vineyard views, Club Los Meganos amenities, warmth, and resort-style living.
- General Brentwood, CA: Premium buyers, moving families, and professionals seeking modern luxury, strategic market insights, and lifestyle positioning.

BEHAVIORAL CONSTRAINTS (ANTI-FLUFF GUARDRAILS):
- BANNED VOCABULARY: Do not use: "nestled," "stunning," "rare gem," "won't last long," "boasts," "step inside," "breathtaking," "oasis," "unwind," "perfectly blending."
- TONE STRATEGY: Speak with competent authority and warmth—as if you are a trusted local real estate colleague, never a robotic marketing script.

CONTEXT & BRAND ASSETS:
Inject Margie's branding elements contextually when highly relevant:
- Website: margieluporealestate.com
- Email: margielupo@gmail.com
- Instagram: @margielupo
- YouTube: @margiestrilogyvibes
- LinkedIn: ://linkedin.com

SEARCH SEO & HASHTAG ENGINE MECHANICS:
1. First 2 Lines = Social SEO Hook: Start captions with natural, high-intent localized search terms.
2. Retention Trigger: Always end captions with an actionable engagement prompt that drives saves or shares.
3. The 5-Slot Hashtag Formula: Include exactly 5 targeted hashtags at the bottom (never hidden in comments):
   - Slot 1: Hyper-Local Neighborhood
   - Slot 2: Regional City Market
   - Slot 3: Audience/Lifestyle Target
   - Slot 4: Content Match Intent
   - Slot 5: Branded Tracker (#MargieLupoRealEstate)

OUTPUT FORMAT:
Generate the response strictly as a JSON object matching the provided schema. The JSON must contain the 3 social copy options, 3 visual prompts, and 3 deployment steps as requested.`;

      const prompt = `Post Goal/Objective: ${goal}
Key Details: ${details}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              socialCopy: {
                type: Type.ARRAY,
                description: "3 distinct, high-quality caption options optimized for different platforms and intents.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING, description: "Platform Target (e.g., Instagram/Facebook - Lifestyle Focus)" },
                    hook: { type: Type.STRING, description: "SEO-Optimized Hook Line" },
                    body: { type: Type.STRING, description: "Body Copy" },
                    callToAction: { type: Type.STRING, description: "Retention Trigger Call-to-Action" },
                    hashtags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "5-Slot Hashtag Cluster"
                    }
                  }
                }
              },
              visualPrompts: {
                type: Type.ARRAY,
                description: "3 hyper-detailed image generation prompts tailored to accompany the copy options.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    focus: { type: Type.STRING, description: "Focus of the prompt (e.g., Exterior/Landscape Focus)" },
                    prompt: { type: Type.STRING, description: "Hyper-detailed image generation prompt" }
                  }
                }
              },
              deploymentStrategy: {
                type: Type.ARRAY,
                description: "Punchy, 3-step actionable checklist for deploying this content.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    actionItem: { type: Type.STRING, description: "Action Item Title" },
                    description: { type: Type.STRING, description: "Action Item Details" }
                  }
                }
              }
            }
          }
        },
      });

      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  app.post("/api/generate-storyboard", async (req, res) => {
    try {
      const { goal, details, targetDuration = "30s", targetPlatform = "Instagram Reel", selectedClips = [] } = req.body;

      const systemInstruction = `You are Margie Lupo's Lead Real Estate Social Video Director and Visual Producer. Margie Lupo is a premier Strategic Real Estate Advisor specializing in the luxury markets of Brentwood, CA, and the Trilogy at the Vineyards 55+ active adult community.

CLIENT & ASSET BRIEF:
Your primary objective is to create a dynamic, multi-clip social video storyboard (Reel / TikTok / YouTube Shorts) matching Margie's real B-roll video footage library, plus companion luxury photographic generation prompts and an SEO-optimized caption.

MARGIE'S B-ROLL VIDEO CATALOG (SELECT REAL CLIPS FROM THIS INVENTORY):
- OKTOBERFEST / COMMUNITY:
  • OKT-01: City park crowd under trees, vendor tents (37s)
  • OKT-02: Gazebo with Oktoberfest balloons, vendor booths (20s)
  • OKT-03: Carnival game booths and event tents (21s)
  • OKT-04: Brentwood Police officers at balloon backdrop (22s)
  • OKT-05: Brentwood Police Cadets with fire ladder truck (22s)
  • OKT-06: Closed street lined with vendor canopies, crowds (23s)
  • OKT-07: Evening crowd on lawn in front of City Hall tower, golden light (33s)
- SCHOOLS & FAMILY:
  • SCH-01: Heritage High stone monument sign close-up (4s)
  • SCH-02: Heritage High sign & campus parking pan (17s)
  • SCH-03: Heritage High rotunda main entrance and front steps (8s)
  • SCH-04: Heritage High campus buildings and crosswalk (23s)
  • SCH-05: Adams Middle School entrance, flag and trees (11s)
  • SCH-06: J. Douglas Adams Middle School sign and drop-off (21s)
  • SCH-07: Kaiser Permanente Brentwood medical center sign (20s)
- DOWNTOWN BRENTWOOD:
  • DT-01: Delta Theater marquee and Chrome Coffee patio (20s)
  • DT-02: Delta Theater neon tower through trees, sun flare (13s)
  • DT-03: Downtown plaza fountain with Delta Theater sign (21s)
  • DT-04: The Press Building historic white corner building (15s)
  • DT-05: Press Building & tree-lined sidewalk walk (38s)
  • DT-06: Drive-by: Salt and Fig, Meganos Well, Socialte boutique (25s)
  • DT-07: Corner restaurant with dark wood patio (16s)
  • DT-08: Salt and Fig Marketplace storefront, seasonal decor (21s)
  • DT-09: Locanda Capri Italian restaurant patio dining (21s)
  • DT-10: Delta Theater sign down sidewalk (15s)
  • DT-11: Alluv Place boutique ending on Brentwood gateway arch (32s)
- DELTA & DISCOVERY BAY:
  • DB-01: Discovery Bay Marina boat slips and yachts (22s)
  • DB-02: Marina docks, gangway and waterfront building (24s)
  • DB-03: Marina restaurant patio & harbor view (23s)
  • DB-05: Pontoon boat rentals hut & trailer (13s)
  • DB-06: Marina restaurant exterior with white anchor (27s)
  • DB-07: Discovery Bay golf course fairway & ponds (24s)
  • DB-08: Golf course with golf carts & water hazard (25s)
  • DB-09: Delta waterfront homes with private docks (28s)
  • DB-10: Tractor at traffic light by farm fields (27s)
  • DB-11: Trilogy hillside overview, vineyard & golden hills (19s)
- TRILOGY CLUBHOUSE (55+ ACTIVE ADULT):
  • CLUB-01: Clubhouse dining room packed for dinner (27s)
  • CLUB-02: Clubhouse dining crowd, chandeliers (23s)
  • CLUB-03: Library lounge to billiards room, chatting (24s)
  • CLUB-04: Billiards room, residents playing pool (9s)
- TRILOGY CULINARY CLASS:
  • CUL-01: Recipe card seared scallops with risotto (Photo)
  • CUL-02: Culinary studio kitchen prep (6s)
  • CUL-03: Chef cooking at stove talking to class (23s)
  • CUL-04: Chef plating scallops while residents watch (32s)
  • CUL-05: Chef presenting finished scallop plates (24s)
  • CUL-06 / CUL-07: Seared scallops plated close-up (Photo)
- COMMUTE & SCENERY:
  • VAS-02: Driving Vasco Road golden hills and wind farm (22s)
  • VAS-03: Wind turbines lining hills, light traffic (24s)
- FARMS & NEW HOMES:
  • B01: Plowed field with Mount Diablo horizon (25s)
  • B02: Farmer on tractor kicking up dust (30s)
  • B03: Farm road, canal, orchard rows (17s)
  • B04: Vintage red tractor yard decor (22s)
  • B05: Diablo Cherries sign & pick your own (15s)
  • B06: G&S Farms U-Pick banner (14s)
  • B07: Hummingbird Way sales center & new homes banner (32s)
  • B08: Orchard Grove Sales Center sign Shea Homes (19s)
  • B09: New white two-story homes, young trees (10s)
  • B10: Tan two-story model homes with Shea flag (38s)

DIRECTOR CONSTRAINTS & ANTI-FLUFF:
- BANNED WORDS: Do not use "nestled," "stunning," "rare gem," "won't last long," "boasts," "step inside," "breathtaking," "oasis," "unwind," "perfectly blending."
- TONE: High-retention, competent local authority, conversational warmth.
- DURATION TARGET: Generate 3 to 6 distinct video cuts whose durations sum cleanly to approximately ${targetDuration} (e.g. 15s, 30s, 45s).
- ON-SCREEN TEXT: Snappy, bold text overlays (3-7 words max) designed for sound-off social viewing.
- 5-SLOT HASHTAG FORMULA: Slot 1: Hyper-Local, Slot 2: Regional Market, Slot 3: Audience/Lifestyle, Slot 4: Content Match, Slot 5: #MargieLupoRealEstate.`;

      const prompt = `Post Goal/Concept: ${goal}
Specific Details / Focus: ${details}
Target Video Duration: ${targetDuration}
Target Platform: ${targetPlatform}
Preferred/Pinned Clip IDs: ${selectedClips.length > 0 ? selectedClips.join(", ") : "None specified - choose the best matching clips from Margie's B-roll inventory"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reelTitle: { type: Type.STRING, description: "Short catchy production title for the video" },
              targetDuration: { type: Type.STRING, description: "Total video runtime, e.g. 30 sec" },
              targetPlatform: { type: Type.STRING, description: "Target format, e.g. Instagram Reel" },
              recommendedAudio: { type: Type.STRING, description: "Music and audio tone recommendation, e.g. Warm upbeat acoustic, 110 BPM" },
              hookLine: { type: Type.STRING, description: "Opening 2-second hook line spoken or shown" },
              cuts: {
                type: Type.ARRAY,
                description: "Sequential list of 3-6 footage cuts specifying exact B-roll clips",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sequence: { type: Type.INTEGER, description: "Sequence number (1, 2, 3...)" },
                    clipId: { type: Type.STRING, description: "Real Clip ID from Margie's catalog (e.g. DT-01, CLUB-03, B01)" },
                    clipTitle: { type: Type.STRING, description: "Brief name of the clip" },
                    duration: { type: Type.STRING, description: "Timestamp duration, e.g. 0:00 - 0:05 (5s)" },
                    visualDirection: { type: Type.STRING, description: "Camera movement, pan speed, cut cue, or crop direction" },
                    onScreenText: { type: Type.STRING, description: "Bold overlay text for the screen (3-7 words)" },
                    audioPacing: { type: Type.STRING, description: "Voiceover script line or audio beat matching this cut" }
                  },
                  required: ["sequence", "clipId", "clipTitle", "duration", "visualDirection", "onScreenText", "audioPacing"]
                }
              },
              fullVoiceover: { type: Type.STRING, description: "Full continuous voiceover script for Margie to record" },
              visualPrompts: {
                type: Type.ARRAY,
                description: "3 companion luxury architectural image generation prompts for cover/carousel",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    focus: { type: Type.STRING, description: "Subject focus, e.g. Video Cover Slide or Architectural Detail" },
                    prompt: { type: Type.STRING, description: "Detailed image prompt with natural lighting, 35mm lens, luxury aesthetic" }
                  },
                  required: ["focus", "prompt"]
                }
              },
              socialCopy: {
                type: Type.OBJECT,
                description: "Companion social media caption and hashtags",
                properties: {
                  hook: { type: Type.STRING, description: "SEO first 2 lines hook" },
                  caption: { type: Type.STRING, description: "Body copy with Margie's anti-fluff authority" },
                  callToAction: { type: Type.STRING, description: "Retention trigger CTA" },
                  hashtags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "5-slot hashtag cluster"
                  }
                },
                required: ["hook", "caption", "callToAction", "hashtags"]
              }
            },
            required: ["reelTitle", "targetDuration", "targetPlatform", "recommendedAudio", "hookLine", "cuts", "fullVoiceover", "visualPrompts", "socialCopy"]
          }
        }
      });

      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error("Error generating storyboard:", error);
      res.status(500).json({ error: "Failed to generate video storyboard" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
