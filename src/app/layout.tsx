// src/app/layout.tsx
import "./globals.css";
import { StrictMode } from "react";
import ClientProviders from "@providers/ClientProviders";
import MusicPlayer from "@player/components/MusicPlayer";
import { HideMobileChrome, SetViewportHeight } from "@hooks/mobile";

export const metadata = {
  title: 'Blendtune',
  description: 'Music for artists & creators.',
};

// Root layout component wrapping the entire application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientProviders>
          <HideMobileChrome />
          <SetViewportHeight />
          <div className="flex flex-col full-viewport">
            <div className="flex-auto overflow-y-scroll">{children}</div>
            <div className="flex-none md:h-20">
              <MusicPlayer />
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}