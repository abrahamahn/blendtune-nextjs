// src/app/sounds/layout.tsx (Server Component)
import ClientSoundsLayout from "./ClientLayout";

export const metadata = {
  title: 'Blendtune Sounds',
  description: 'Music for artists & creators.',
};

export default function SoundsLayout({ children }: { children: React.ReactNode }) {
  return <ClientSoundsLayout>{children}</ClientSoundsLayout>;
}
