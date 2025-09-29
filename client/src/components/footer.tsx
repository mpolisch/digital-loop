"use client"
import { BarChart, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Footer() {

  const router = useRouter();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="text-purple-500 h-5 w-5" />
              <span className="font-bold text-foreground retro">
                digital-loop
              </span>
            </div>
            <ul className="flex flex-row space-x-3">
              <li>
                <Button
                  variant="link"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/home")}
                >
                  Home
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                >
                  Feedback
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Social media icons */}
        <div className="flex items-center gap-4 mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </Button>
        </div>

        {/* Copyright and legal text */}
        <div className="flex flex-col items-center space-y-2 text-xs text-muted-foreground">
          {/* <p>
            All copyrighted content (i.e. album artwork) on digital-loop are
            owned by their respective owners. Data is provided by Spotify AB.
            digital-loop is in no way affiliated with Spotify AB.
          </p> */}
          <p>© digital-loop 2025</p>
        </div>
      </div>
    </footer>
  );
}
