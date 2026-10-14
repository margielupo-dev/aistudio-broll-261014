import React from "react";

export function GoogleDriveIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  );
}

export function GoogleSheetsIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
      <path fill="#0F9D58" d="M136 0H56a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h80a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16z"/>
      <path fill="#0B8043" d="M152 48h-40a8 8 0 0 1-8-8V0l48 48z"/>
      <path fill="#FFF" d="M60 76h72v12H60zm0 24h72v12H60zm0 24h72v12H60z"/>
      <path fill="#87CEAB" d="M60 76h24v12H60zm0 24h24v12H60zm0 24h24v12H60z"/>
    </svg>
  );
}

export function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
          <stop stopColor="#fdf497" offset="0%" />
          <stop stopColor="#fdf497" offset="5%" />
          <stop stopColor="#fd5949" offset="45%" />
          <stop stopColor="#d6249f" offset="60%" />
          <stop stopColor="#285AEB" offset="90%" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igGrad)" />
      <circle cx="12" cy="12" r="4.5" stroke="#FFF" strokeWidth="1.8" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="#FFF" />
    </svg>
  );
}

export function YouTubeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        fill="#FF0000"
      />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFF" />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        d="M5.5 9h3v10h-3V9zm1.5-4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM11 9h2.8v1.4h.04c.4-.75 1.38-1.55 2.82-1.55 3.02 0 3.58 1.99 3.58 4.58V19h-3v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.84 1.25-1.84 2.54V19h-3V9z"
        fill="#FFF"
      />
    </svg>
  );
}

export function TikTokIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.32 0 .63.05.92.14V9.43a6.34 6.34 0 0 0-.92-.07 6.335 6.335 0 0 0-6.33 6.33 6.335 6.335 0 0 0 6.33 6.33 6.335 6.335 0 0 0 6.33-6.33V8.895a8.21 8.21 0 0 0 4.765 1.517V6.967a4.8 4.8 0 0 1-1-.281z" />
    </svg>
  );
}

export interface BrandPillProps {
  type: "drive" | "sheets" | "instagram" | "youtube" | "linkedin" | "tiktok" | "reel" | "brentwood" | "trilogy" | "video";
  label: string; // Strictly 1-2 words
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BrandPill({ type, label, active, onClick, className = "" }: BrandPillProps) {
  // Ensure maximum 2 words to respect cognitive load requirement
  const sanitizedLabel = label.split(" ").slice(0, 2).join(" ");

  const getStyles = () => {
    switch (type) {
      case "drive":
        return "bg-blue-50/80 text-blue-900 border-blue-200 hover:bg-blue-100";
      case "sheets":
        return "bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100";
      case "instagram":
      case "reel":
        return "bg-pink-50/80 text-pink-900 border-pink-200 hover:bg-pink-100";
      case "youtube":
        return "bg-red-50/80 text-red-900 border-red-200 hover:bg-red-100";
      case "linkedin":
        return "bg-sky-50/80 text-sky-900 border-sky-200 hover:bg-sky-100";
      case "trilogy":
        return "bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100";
      case "brentwood":
        return "bg-stone-100 text-stone-900 border-stone-300 hover:bg-stone-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200";
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "drive":
        return <GoogleDriveIcon className="w-3.5 h-3.5 flex-shrink-0" />;
      case "sheets":
        return <GoogleSheetsIcon className="w-3.5 h-3.5 flex-shrink-0" />;
      case "instagram":
      case "reel":
        return <InstagramIcon className="w-3.5 h-3.5 flex-shrink-0" />;
      case "youtube":
        return <YouTubeIcon className="w-3.5 h-3.5 flex-shrink-0" />;
      case "linkedin":
        return <LinkedInIcon className="w-3.5 h-3.5 flex-shrink-0" />;
      case "tiktok":
        return <TikTokIcon className="w-3.5 h-3.5 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const Component = onClick ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${getStyles()} ${
        active ? "ring-2 ring-neutral-900 font-semibold" : ""
      } ${className}`}
    >
      {renderIcon()}
      <span>{sanitizedLabel}</span>
    </Component>
  );
}
