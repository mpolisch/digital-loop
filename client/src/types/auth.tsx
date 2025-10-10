export interface User {
  id: number;
  spotify_id: string;
  username: string;
  email: string;
  country: string;
  profile_img?: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}