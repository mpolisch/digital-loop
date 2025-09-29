"use client";
import { useState } from "react";
import { SpotifySearchType, SpotifySearchResultMap } from "@/types/spotify";

function useSpotifySearch<T extends SpotifySearchType>(defaultType: T) {
  const [results, setResults] = useState<SpotifySearchResultMap[T][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (q: string, type: T = defaultType) => {

    if (!q.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams({ q, type });
      const res = await fetch(`/api/proxy/spotify/search?${query.toString()}`);
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      const key = (type + "s") as keyof typeof data; // pluralize type
      setResults(data[key]?.items ?? []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to fetch search results: ${err.message}`);
      } else {
        setError(`Failed to fetch search results: unknown error`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}

export { useSpotifySearch };
