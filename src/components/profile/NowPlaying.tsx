import { useQuery } from "@tanstack/react-query";

type NowPlayingData = { playing: boolean; title?: string; artist?: string; image?: string | null; url?: string | null };

/** Live "Now Playing" card on a public profile; hidden when nothing plays. */
export function NowPlaying({ handle, theme }: { handle: string; theme: { card: string; border: string; text: string; muted: string } }) {
  const q = useQuery({
    queryKey: ["now-playing", handle],
    queryFn: async (): Promise<NowPlayingData> => {
      const r = await fetch(`/api/presence/now-playing?handle=${encodeURIComponent(handle)}`);
      return r.ok ? r.json() : { playing: false };
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
  const d = q.data;
  if (!d?.playing) return null;
  const body = (
    <div className="flex items-center gap-3 rounded-2xl p-2.5 pr-4" style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.text }}>
      {d.image ? <img src={d.image} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <span className="h-12 w-12 rounded-lg" style={{ background: theme.border }} />}
      <span className="min-w-0 text-left">
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider" style={{ color: theme.muted }}>
          <span className="now-playing-bars" aria-hidden><i /><i /><i /></span> Nu aan het luisteren
        </span>
        <span className="block truncate text-sm font-medium">{d.title}</span>
        <span className="block truncate text-xs" style={{ color: theme.muted }}>{d.artist}</span>
      </span>
    </div>
  );
  return (
    <div className="mt-4 w-full max-w-sm">
      {d.url ? <a href={d.url} target="_blank" rel="noopener noreferrer" aria-label={`${d.title} op Spotify`}>{body}</a> : body}
    </div>
  );
}
