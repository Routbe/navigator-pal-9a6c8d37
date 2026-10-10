import { describe, expect, it } from "vitest";
import { filterIntegrations } from "./integrations-catalog";

const ids = (f: Parameters<typeof filterIntegrations>[0]) => filterIntegrations(f).map((i) => i.id);

describe("integrations grid", () => {
  it("popular shows Spotify, Discord, Steam, Xbox, PlayStation", () => {
    expect(ids("popular")).toEqual(["spotify", "discord", "steam", "xbox", "playstation"]);
  });
  it("music shows Spotify, Apple Music, Last.fm, SoundCloud", () => {
    expect(ids("music")).toEqual(["spotify", "applemusic", "lastfm", "soundcloud"]);
  });
  it("gaming shows Steam, Xbox, PSN, Riot, Epic, Battle.net", () => {
    expect(ids("gaming")).toEqual(["steam", "xbox", "playstation", "riot", "epic", "battlenet"]);
  });
  it("only Spotify can really be connected for now", () => {
    expect(filterIntegrations("all").filter((i) => i.live).map((i) => i.id)).toEqual(["spotify"]);
  });
});
