export interface SearchQuery {
    query: string;
}

export interface SearchResult {
    song_id: number | null;
    song_title: string| null;
    album_id: number;
    album_title: string;
    artist: string;
    type: 'song' | 'album';
}