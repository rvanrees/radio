import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Van Rees - Radio",
  description:
    "Luister live naar 100% piratenhits, rechtstreeks vanuit Vriezenveen.",
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
