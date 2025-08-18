import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  let icon = <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 transition-all" />
  if (mounted) {
    if (theme === "dark") {
      icon = <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400 transition-all" />
    } else {
      icon = <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 transition-all" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-background border-border hover:bg-accent hover:text-accent-foreground dark:bg-background dark:border-border dark:hover:bg-accent dark:hover:text-accent-foreground transition-all"
        >
          {icon}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background text-foreground border-border dark:bg-background dark:text-foreground dark:border-border shadow-lg">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus:bg-accent dark:focus:text-accent-foreground"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus:bg-accent dark:focus:text-accent-foreground"
        >
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}