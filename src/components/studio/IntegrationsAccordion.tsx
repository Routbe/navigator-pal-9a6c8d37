import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Gamepad2, Loader2 } from "lucide-react";
import * as icons from "simple-icons";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  INTEGRATION_FILTERS,
  filterIntegrations,
  type Integration,
  type IntegrationFilter,
} from "@/lib/integrations-catalog";
import { disconnectSpotifyPresence, getMyPresence, setSpotifyPresenceVisible } from "@/lib/presence.functions";

function BrandIcon({ item }: { item: Integration }) {
  const si = item.icon ? (icons as unknown as Record<string, { path: string; hex: string }>)[item.icon] : null;
  if (!si) return <Gamepad2 className="h-6 w-6" aria-hidden />;
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden style={{ fill: `#${si.hex}` }}>
      <path d={si.path} />
    </svg>
  );
}

const SPOTIFY_MESSAGES: Record<string, [ok: boolean, text: string]> = {
  connected: [true, "Spotify gekoppeld"],
  cancelled: [false, "Koppelen geannuleerd"],
  not_configured: [false, "Spotify is nog niet ingesteld op ROUT"],
  invalid_state: [false, "Koppellink verlopen — probeer opnieuw"],
  failed: [false, "Spotify koppelen mislukt"],
};

/** 🔌 Verbindingen & Integraties — App Store-achtig raster voor Live Presence. */
export function IntegrationsAccordion() {
  const [filter, setFilter] = useState<IntegrationFilter>("popular");
  const qc = useQueryClient();
  const fetchPresence = useServerFn(getMyPresence);
  const setVisible = useServerFn(setSpotifyPresenceVisible);
  const disconnect = useServerFn(disconnectSpotifyPresence);
  const presence = useQuery({ queryKey: ["my-presence"], queryFn: () => fetchPresence(), retry: false });
  const spotify = presence.data?.connections.find((c) => c.provider === "spotify");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const flag = url.searchParams.get("spotify");
    if (!flag) return;
    const m = SPOTIFY_MESSAGES[flag];
    if (m) (m[0] ? toast.success : toast.error)(m[1]);
    url.searchParams.delete("spotify");
    window.history.replaceState(null, "", url.toString());
  }, []);

  const onConnect = (item: Integration) => {
    if (!item.live) {
      toast(`${item.label} komt eraan`, { description: "Deze koppeling is in ontwikkeling. Spotify werkt al." });
      return;
    }
    if (presence.data && !presence.data.spotifyReady) {
      toast.error("Spotify is nog niet ingesteld op ROUT");
      return;
    }
    window.location.href = "/api/spotify/start";
  };

  const toggle = async (show: boolean) => {
    setBusy(true);
    try {
      await setVisible({ data: { show } });
      await qc.invalidateQueries({ queryKey: ["my-presence"] });
      toast.success(show ? "Live Presence staat aan" : "Live Presence staat uit");
    } catch {
      toast.error("Opslaan mislukt");
    } finally {
      setBusy(false);
    }
  };

  const unlink = async () => {
    setBusy(true);
    try {
      await disconnect();
      await qc.invalidateQueries({ queryKey: ["my-presence"] });
      toast.success("Spotify ontkoppeld");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AccordionItem value="integrations" className="rounded-2xl border border-border bg-card px-4 sm:px-5">
      <AccordionTrigger className="hover:no-underline">
        <span className="flex flex-1 items-center justify-between gap-3 pr-2">
          <span className="text-base font-medium">🔌 Verbindingen &amp; Integraties</span>
          {spotify && (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">1 gekoppeld</span>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-5">
        <p className="text-sm text-muted-foreground">
          Koppel je diensten en toon live wat je luistert of speelt op je profiel.
        </p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Categorie">
          {INTEGRATION_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-8 shrink-0 rounded-full border px-3 text-xs font-medium transition-colors",
                filter === f.id ? "border-primary/50 bg-primary/10" : "border-border hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filterIntegrations(filter).map((item) => {
            const connected = item.id === "spotify" && Boolean(spotify);
            return (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border p-3 transition-all",
                  connected ? "border-primary/50 bg-primary/5" : "border-border",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                    <BrandIcon item={item} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{item.label}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {connected ? spotify?.accountName ?? "Gekoppeld" : item.live ? "Beschikbaar" : "Binnenkort"}
                    </span>
                  </span>
                </div>
                {connected ? (
                  <div className="space-y-2">
                    <label className="flex items-center justify-between gap-2 text-[11px]">
                      <span>Toon Live Presence op profiel</span>
                      <Switch
                        aria-label="Toon Live Presence op profiel"
                        checked={spotify!.showOnProfile}
                        disabled={busy}
                        onCheckedChange={(v) => void toggle(v)}
                      />
                    </label>
                    <button type="button" onClick={() => void unlink()} disabled={busy} className="text-[11px] text-muted-foreground underline">
                      Ontkoppelen
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onConnect(item)}
                    className={cn(
                      "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-opacity",
                      item.live ? "bg-foreground text-background hover:opacity-90" : "border border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {presence.isLoading && item.live ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> : null}
                    Koppel
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
