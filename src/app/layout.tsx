// src\app\layout.tsx
import "./globals.css";
import { StrictMode } from "react";
import ClientProviders from "@providers//ClientProviders";
import MusicPlayer from "@player/components/MusicPlayer";
import { HideMobileChrome, SetViewportHeight } from "@hooks/mobile";

export const metadata = {
  title: 'Blendtune',
  description: 'Music for artists & creators.',
};

// Root layout component wrapping the entire application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <ClientProviders>
        <html lang="en">
          <head>
            {/* Enables iOS standalone mode for web app */}
            <meta name="apple-mobile-web-app-capable" content="yes" />
          </head>
          <body suppressHydrationWarning={true}>
            {/* Hooks for better mobile experience */}
            <HideMobileChrome />
            <SetViewportHeight />
            <div className="flex flex-col full-viewport">
              {/* Main content area, which fills space above music player */}
              <div className="flex-auto overflow-y-scroll">{children}</div>
              {/* Fixed music player at the bottom */}
              <div className="flex-none md:h-20">
                <MusicPlayer />
              </div>
            </div>
          </body>
        </html>
      </ClientProviders>
    </StrictMode>
  );
}