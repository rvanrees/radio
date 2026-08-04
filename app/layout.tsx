import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radio van Rees",
  description: "Rechtstreeks vanuit Vriezenveen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
