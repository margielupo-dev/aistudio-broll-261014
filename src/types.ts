export interface SocialCopy {
  platform: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
}

export interface VisualPrompt {
  focus: string;
  prompt: string;
}

export interface DeploymentAction {
  actionItem: string;
  description: string;
}

export interface GeneratedContent {
  socialCopy: SocialCopy[];
  visualPrompts: VisualPrompt[];
  deploymentStrategy: DeploymentAction[];
}

export interface BRollClip {
  id: string; // e.g. "OKT-01", "SCH-01", "DT-01"
  folder: string; // e.g. "Downtown Brentwood", "Schools in Brentwood"
  description: string;
  length: string; // "20 sec", "Photo"
  editorNote: string;
  videoLink: string;
  driveFileId?: string;
  bestUse: string; // e.g. "Schools", "Waterfront dining"
  inDrive: boolean;
}

export interface StoryboardCut {
  sequence: number;
  clipId: string;
  clipTitle: string;
  duration: string; // e.g. "0:00 - 0:04 (4s)"
  visualDirection: string;
  onScreenText: string;
  audioPacing: string;
}

export interface ReelStoryboard {
  reelTitle: string;
  targetDuration: string; // "30 sec"
  targetPlatform: "Instagram Reel" | "TikTok" | "YouTube Shorts";
  recommendedAudio: string;
  hookLine: string;
  cuts: StoryboardCut[];
  fullVoiceover: string;
  visualPrompts: VisualPrompt[];
  socialCopy: {
    hook: string;
    caption: string;
    callToAction: string;
    hashtags: string[];
  };
}

export interface SavedGeneration {
  id: string;
  timestamp: number;
  formattedDate: string;
  goal: string;
  details: string;
  type: "storyboard" | "campaign";
  content?: GeneratedContent;
  storyboard?: ReelStoryboard;
  isFavorite?: boolean;
  category?: "trilogy" | "brentwood" | "general";
}
