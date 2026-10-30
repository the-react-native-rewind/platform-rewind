import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Mono, DM_Sans, Permanent_Marker } from "next/font/google";
import "./globals.css";

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://platformrewind.com"),
  title: {
    default: "Platform Rewind",
    template: "%s · Platform Rewind",
  },
  description: "The publication behind The Agentic Rewind and The React Native Rewind.",
  openGraph: {
    title: "Platform Rewind",
    description: "The publication behind The Agentic Rewind and The React Native Rewind.",
    url: "https://platformrewind.com",
    siteName: "Platform Rewind",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fef4e8" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${permanentMarker.variable} ${dmMono.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
