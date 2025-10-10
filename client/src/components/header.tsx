"use client";

import { BarChart, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import SearchBar from "./searchBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

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
            <button
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={() => router.push("/home")}
            >
              <BarChart className="text-purple-500 h-6 w-6" />
              <span className="retro text-md font-bold text-foreground">
                digital-loop
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />

            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
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
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-neutral-900 border border-neutral-800 text-sm rounded-xl shadow-lg">
                    {/* Stats section */}
                    <div className="px-2 py-1.5">
                      <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-neutral-500 font-semibold px-2">
                        Stats
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="flex items-center gap-x-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md px-2">
                          <BarChart className="h-4 w-4" />
                          Overview
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </div>

                    <DropdownMenuSeparator className="bg-neutral-800" />

                    {/* Account section */}
                    <div className="px-2 py-1.5">
                      <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-neutral-500 font-semibold px-2">
                        Account
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="flex items-center gap-x-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md px-2">
                          <Settings className="h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={logout}
                          className="flex items-center gap-x-2 text-red-500 hover:bg-red-500/10 rounded-md px-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
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
  );
}
