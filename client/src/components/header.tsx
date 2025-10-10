"use client"

import { BarChart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "./searchBar"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

export function Header() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogin = () => {
    window.location.href = "/api/auth/spotify/login";
  };

  return (
    <header className="border-b border-border/10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => router.push("/home")}>
              <BarChart className="text-purple-500 h-6 w-6" />
              <span className="retro text-md font-bold text-foreground">digital-loop</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <div className="flex items-center gap-2">
                  {user.profile_img ? (
                    <Image
                      src={user.profile_img}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-8 w-8 p-1 rounded-full bg-primary/10 text-primary" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {user.username}
                  </span>
                </div>
                
                {/* Logout Button */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="border-red-500/20 text-red-500 hover:bg-red-500/10 bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Log Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="border-primary/20 text-primary hover:bg-primary/10 bg-transparent"
              >
                Log In with Spotify
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}