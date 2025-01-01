import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "next-themes"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <main className="flex-1 dark">
          {children}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}
