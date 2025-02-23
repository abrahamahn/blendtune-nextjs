// src/app/privacy-policy/layout.tsx

import ClientLayout from "./ClientLayout";

/**
 * Metadata for the Privacy Policy page.
 * - Title and description for SEO and social sharing.
 */
export const metadata = {
  title: "Blendtune | Privacy Policy",
  description: "Music for artists & creators.",
};

/**
 * PrivacyPolicyLayout Component:
 * - Wraps the privacy policy content within the ClientLayout.
 */
export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
