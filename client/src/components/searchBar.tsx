"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("track");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams({q: query, type});

    router.push(`/search?${params.toString()}`)
  }
  return (
            <form onSubmit={handleSubmit} className="relative hidden sm:flex items-center">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-24 rounded-r-none border-r-0 bg-secondary/50 border-border/20 focus:z-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="album">Album</SelectItem>
                  <SelectItem value="track">Track</SelectItem>
                  <SelectItem value="playlist">Playlist</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-10 w-48 rounded-l-none bg-secondary/50 border-border/20 focus:z-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
  );
}
