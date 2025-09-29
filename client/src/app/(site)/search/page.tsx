"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSpotifySearch } from "@/hooks/useSpotifySearch";
import { SpotifySearchType } from "@/types/spotify";
import notFoundImg from "@/public/img_not_found.png" 
import Image from "next/image";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const typeParam = searchParams.get("type") ?? "track";
  const type: SpotifySearchType = ["artist", "album", "track"].includes(
    typeParam
  )
    ? (typeParam as SpotifySearchType)
    : "track";

  const { results, search, loading, error } = useSpotifySearch(type);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (q) {
      search(q, type);
      setHasSearched(true);
    }
  }, [q, type]);

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="p-4">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Search results for: {q}
            </h1>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {!loading && hasSearched && results.length === 0 && (
          <p>No results found</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {results.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              {/* Album Cover */}
              <div className="relative aspect-square mb-3 overflow-hidden bg-secondary/20">
                <Image
                  src={item.type === "album" || item.type === "artist"
                    ? item.images?.[0]?.url ?? notFoundImg
                    : item.type === "track"
                    ? item.album.images?.[0]?.url ?? notFoundImg
                    : notFoundImg
                    }
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">

                  </div>
                </div>
              </div>

              {/* Album Info */}
              <div className="space-y-1">
                <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item.type === "album" && item.release_date && (
                    <span>{new Date(item.release_date).getFullYear()}</span>
                  )}
                  {item.type === "album" && item.release_date && item.artists?.length > 0 && (
                    <span> • </span>
                  )}
                  {(item.type === "album" || item.type === "track") && item.artists?.length > 0 && (
                    <span>{item.artists[0].name}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
