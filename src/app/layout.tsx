// app/layout.tsx (or your RootLayout)
import "./globals.css";
import { ClientEnvironmentProvider } from "@/client/environment/ClientEnvironment";
import MusicPlayer from "@/client/ui/layout/MusicPlayer";
import { StrictMode } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <ClientEnvironmentProvider>
        <html lang="en">
          <body>
            {/* 
              A 2-row flex layout:
                1) The "main content" region (flex-auto) 
                2) The "music player" region (flex-none, fixed height) 
            */}
            <div className="flex flex-col h-screen">
              {/* MAIN CONTENT (fills space above music player) */}
              <div className="flex-auto overflow-hidden">
                {children}
              </div>

              {/* MUSIC PLAYER (fixed height, e.g. h-16) */}
              <div className="flex-none h-20">
                <MusicPlayer />
              </div>
            </div>
          </body>
        </html>
      </ClientEnvironmentProvider>
    </StrictMode>
  );
}
