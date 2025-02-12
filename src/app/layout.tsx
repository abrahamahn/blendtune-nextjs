import "./globals.css";
import { ClientEnvironmentProvider } from "@/client/environment/ClientEnvironment";
import MusicPlayer from "@/client/ui/global/music-player";
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
      <ClientEnvironmentProvider>
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
      </ClientEnvironmentProvider>
    </StrictMode>
  );
}
