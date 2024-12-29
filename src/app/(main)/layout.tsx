import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "next-themes"

import { AppSidebar } from "@/components/bus/sidebar"
import { Player } from "@/block/player"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 dark">
          <SidebarTrigger />
          {children}
        </main>
        <Player />
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  )
}
