// src/app/welcome/layout.tsx
import ClientLayout from "./ClientLayout";

/**
 * Metadata for the Welcome page.
 */
export const metadata = {
  title: "Blendtune | Welcome",
  description: "Music for artists & creators.",
};

/**
 * Layout wrapper for the Welcome page.
 * - Wraps the Welcome page in `ClientLayout` to ensure a consistent UI.
 */
export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
