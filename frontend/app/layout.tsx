import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roadmap Vivo — AI Security",
  description: "O roadmap que eu próprio utilizo para me tornar um AI Security Engineer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
