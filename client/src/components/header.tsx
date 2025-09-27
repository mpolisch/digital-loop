import { BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "./searchBar"

export function Header() {
  return (
    <header className="border-b border-border/10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BarChart className="h-6 w-6 text-primary" />
              <span className="retro text-md font-bold text-foreground">digital-loop</span>
            </button>
            {/* <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Plus
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Feedback
              </a>
            </nav> */}
          </div>

          <div className="flex items-center gap-4">
            < SearchBar />
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 bg-transparent">
              Log In
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}