import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { DM_Mono, DM_Sans, Fira_Code } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const permanentMarker = localFont({
  src: "./fonts/PermanentMarker-Regular.ttf",
  variable: "--font-permanent-marker",
  weight: "400",
  style: "normal",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
});

const description = "The publication behind The Agentic Rewind and The React Native Rewind.";

export const metadata: Metadata = {
  metadataBase: new URL("https://platformrewind.com"),
  title: {
    default: "Platform Rewind",
    template: "%s · Platform Rewind",
  },
  description,
  openGraph: {
    title: "Platform Rewind",
    description,
    url: "https://platformrewind.com",
    siteName: "Platform Rewind",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Rewind",
    description,
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
      className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable} ${dmSans.variable} ${dmMono.variable} ${firaCode.variable}`}
    >
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-draw]{clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <main className="flex flex-grow flex-col">{children}</main>
        <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
      </body>
    </html>
  );
}
