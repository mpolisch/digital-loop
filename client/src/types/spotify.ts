export interface SpotifyExternalURLs {
    spotify: string;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyFollower {
  href: string | null;
  total: number;
}

export interface SpotifyArtistSimplified {
  external_urls: SpotifyExternalURLs;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

// --- Album ---
export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalURLs;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  type: "album";
  uri: string;
  artists: SpotifyArtistSimplified[];
}

// --- Artist ---
export interface SpotifyArtist {
  external_urls: SpotifyExternalURLs;
  followers: SpotifyFollower;
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number; // 0-100
  type: "artist";
  uri: string;
}

// --- Track ---
export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtistSimplified[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: Record<string, string>; // e.g., { isrc: string }
  external_urls: SpotifyExternalURLs;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
}

export type SpotifySearchType = "artist" | "album" | "track";

export type SpotifySearchResultMap = {
  artist: SpotifyArtist;
  album: SpotifyAlbum;
  track: SpotifyTrack;
};