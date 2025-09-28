"use client";
import { useState } from "react";

function useSpotifySearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (q: string, type: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams({ q, type });
      const res = await fetch(`/api/proxy/spotify/search?${query.toString()}`);
      if (!res.ok) throw new Error("Request failed");

      console.log(type)
      console.log(q)

      const data = await res.json();
      switch (type) {
        case "artist":
          setResults(data.artists?.items ?? []);
          break;
        case "album":
          setResults(data.albums?.items ?? []);
          break;
        case "track":
          setResults(data.tracks?.items ?? []);
          break;
        case "playlist":
          setResults(data.playlists?.items ?? []);
          break;
        default:
          setResults([]);
      }
    } catch (err) {
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}

export { useSpotifySearch };
