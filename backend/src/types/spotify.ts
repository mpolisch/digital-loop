export interface CallbackQuery {
  code?: string;
  state?: string;
}

export interface SearchQuery {
  q: string;
  type?: "track" | "album" | "artist" | "playlist";
}
