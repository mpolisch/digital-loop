"use client"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useSpotifySearch } from "@/hooks/useSpotifySearch"

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") ?? "";
    const type = searchParams.get("type") ?? "track";

    const { results, search, loading, error } = useSpotifySearch();

    useEffect(() => {
        if (q) search(q, type);
    }, [q, type]);

    return (
    <div className="p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {results.map((item: any) => (
          <li key={item.id}>
            {item.name || item.title} {/* artist/album/track/playlist safe */}
          </li>
        ))}
      </ul>
    </div>
    )
}