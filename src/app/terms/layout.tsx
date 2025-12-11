// src/app/sounds/layout.tsx (Server Component)
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Blendtune | Terms",
  description: "Music for artists & creators.",
};

// Server-side layout wrapper for the terms page
export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
