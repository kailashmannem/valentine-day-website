import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-calligraphy-custom",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-custom",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "With You & Forever 💕",
  description:
    "A Valentine's Day celebration of love — upload your memories and create a beautiful card together.",
  keywords: ["valentine", "love", "memories", "card"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${greatVibes.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
