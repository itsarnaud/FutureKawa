import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "shadcn/ui · FutureKawa Demo",
  description:
    "Démonstration de shadcn/ui avec Tailwind CSS v4 dans un monorepo NX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
