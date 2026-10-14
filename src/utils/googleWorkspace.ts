import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import type { BRollClip } from "../types";

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Workspace Drive & Sheets scopes
provider.addScope("https://www.googleapis.com/auth/drive.readonly");
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://www.googleapis.com/auth/spreadsheets");
provider.addScope("https://www.googleapis.com/auth/spreadsheets.readonly");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Cached token lost on page refresh; can prompt login
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get Google OAuth access token from authentication");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Google Drive API helper: Fetch files from Drive
export async function fetchDriveVideos(token: string) {
  try {
    const query = encodeURIComponent("mimeType contains 'video/' and trashed = false");
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,size,createdTime)&pageSize=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to fetch Drive files");
    }
    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error("Error fetching Google Drive videos:", error);
    throw error;
  }
}

// Google Sheets API helper: Read rows from a spreadsheet
export async function fetchSpreadsheetRows(token: string, spreadsheetId: string, range = "A1:Z100") {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to fetch spreadsheet rows");
    }
    const data = await res.json();
    return data.values || [];
  } catch (error) {
    console.error("Error fetching Google Sheet values:", error);
    throw error;
  }
}

// Google Sheets API helper: Export catalog to a new Google Sheet
export async function exportBRollToNewSheet(token: string, clips: BRollClip[]): Promise<string> {
  try {
    // 1. Create spreadsheet
    const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          title: `Margie Lupo B-Roll Catalog - ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
        },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(err.error?.message || "Failed to create Google Sheet");
    }

    const sheetData = await createRes.json();
    const spreadsheetId = sheetData.spreadsheetId;
    const spreadsheetUrl = sheetData.spreadsheetUrl;

    // 2. Populate rows
    const headerRow = ["Clip ID", "Folder / Category", "Description", "Length", "Editor Note", "Drive Link", "Best Use in Script", "Drive Status"];
    const rows = clips.map((c) => [
      c.id,
      c.folder,
      c.description,
      c.length,
      c.editorNote,
      c.videoLink,
      c.bestUse,
      c.inDrive ? "In Drive" : "Pending Upload",
    ]);

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:H${rows.length + 1}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range: `Sheet1!A1:H${rows.length + 1}`,
          values: [headerRow, ...rows],
        }),
      }
    );

    return spreadsheetUrl;
  } catch (error) {
    console.error("Error exporting to Google Sheets:", error);
    throw error;
  }
}
