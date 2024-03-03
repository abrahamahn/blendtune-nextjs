import "./globals.css";
import StoreProvider from "@/provider/StoreProvider";
import SessionProvider from "@/provider/SessionProvider";
import TracksProvider from "@/provider/TracksProvider";
import AudioProvider from "@/provider/AudioProvider";
import MusicPlayer from "@/components/layouts/music-player";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StrictMode } from "react";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blendtune",
  description: "Music for Artists and Creators",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StrictMode>
      <StoreProvider>
        <SessionProvider>
          <TracksProvider>
            <AudioProvider>
              <html lang="en">
                <body className={inter.className}>
                  <main>
                    <div className="page-width bg-neutral-200 dark:bg-black md:p-2 p-0">
                      <div className="dark:bg-neutral-950 bg-neutral-200 w-full md:rounded-xl">
                        {children}
                      </div>
                      <MusicPlayer />
                    </div>
                  </main>
                </body>
              </html>
            </AudioProvider>
          </TracksProvider>
        </SessionProvider>
      </StoreProvider>
    </StrictMode>
  );
}
