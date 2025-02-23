// src/app/sounds/layout.tsx

import ClientLayout from "./ClientLayout";

/**
 * Metadata for the Sounds page.
 * - Title and description used for SEO and social sharing.
 */
export const metadata = {
  title: "Blendtune | Sounds",
  description: "Music for artists & creators.",
};

/**
 * SoundsLayout Component:
 * - Wraps the sounds page with the ClientLayout.
 * - Ensures consistency across pages by using the shared layout.
 */
export default function SoundsLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
