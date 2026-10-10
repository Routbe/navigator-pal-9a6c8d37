/** Live Presence integrations shown in the Studio grid (browser-safe). */
export type IntegrationId =
  | "spotify" | "applemusic" | "lastfm" | "soundcloud"
  | "discord" | "steam" | "xbox" | "playstation" | "riot" | "epic" | "battlenet"
  | "twitch" | "youtube" | "kick"
  | "instagram" | "tiktok" | "x" | "bluesky";

export type IntegrationCategory = "music" | "gaming" | "streaming" | "socials";

export type Integration = {
  id: IntegrationId;
  label: string;
  category: IntegrationCategory;
  /** Key in simple-icons, or null for a generic icon. */
  icon: string | null;
  /** Only working integrations can be connected; others show "coming soon". */
  live: boolean;
};

export const INTEGRATIONS: Integration[] = [
  { id: "spotify", label: "Spotify", category: "music", icon: "siSpotify", live: true },
  { id: "applemusic", label: "Apple Music", category: "music", icon: "siApplemusic", live: false },
  { id: "lastfm", label: "Last.fm", category: "music", icon: "siLastdotfm", live: false },
  { id: "soundcloud", label: "SoundCloud", category: "music", icon: "siSoundcloud", live: false },
  { id: "discord", label: "Discord", category: "socials", icon: "siDiscord", live: false },
  { id: "steam", label: "Steam", category: "gaming", icon: "siSteam", live: false },
  { id: "xbox", label: "Xbox", category: "gaming", icon: null, live: false },
  { id: "playstation", label: "PlayStation Network", category: "gaming", icon: "siPlaystation", live: false },
  { id: "riot", label: "Riot Games", category: "gaming", icon: "siRiotgames", live: false },
  { id: "epic", label: "Epic Games", category: "gaming", icon: "siEpicgames", live: false },
  { id: "battlenet", label: "Battle.net", category: "gaming", icon: "siBattledotnet", live: false },
  { id: "twitch", label: "Twitch", category: "streaming", icon: "siTwitch", live: false },
  { id: "youtube", label: "YouTube", category: "streaming", icon: "siYoutube", live: false },
  { id: "kick", label: "Kick", category: "streaming", icon: "siKick", live: false },
  { id: "instagram", label: "Instagram", category: "socials", icon: "siInstagram", live: false },
  { id: "tiktok", label: "TikTok", category: "socials", icon: "siTiktok", live: false },
  { id: "x", label: "X", category: "socials", icon: "siX", live: false },
  { id: "bluesky", label: "Bluesky", category: "socials", icon: "siBluesky", live: false },
];

export const INTEGRATION_FILTERS = [
  { id: "popular", label: "Populair" },
  { id: "music", label: "Muziek" },
  { id: "gaming", label: "Gaming" },
  { id: "streaming", label: "Streaming" },
  { id: "socials", label: "Socials" },
  { id: "all", label: "Alles" },
] as const;

export type IntegrationFilter = (typeof INTEGRATION_FILTERS)[number]["id"];

const POPULAR: IntegrationId[] = ["spotify", "discord", "steam", "xbox", "playstation"];

export function filterIntegrations(filter: IntegrationFilter): Integration[] {
  if (filter === "all") return INTEGRATIONS;
  if (filter === "popular") return POPULAR.map((id) => INTEGRATIONS.find((i) => i.id === id)!);
  return INTEGRATIONS.filter((i) => i.category === filter);
}
