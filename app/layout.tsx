import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://base-guestbook-five.vercel.app"),
  title: "Base Guestbook",
  description:
    "A simple onchain guestbook built on Base with Next.js, RainbowKit and Wagmi.",
  openGraph: {
    title: "Base Guestbook",
    description:
      "A simple onchain guestbook built on Base with Next.js, RainbowKit and Wagmi.",
    url: "https://base-guestbook-five.vercel.app",
    siteName: "Base Guestbook",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Guestbook",
    description:
      "A simple onchain guestbook built on Base with Next.js, RainbowKit and Wagmi.",
      images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <head>
    <meta
      name="base:app_id"
      content="68efc6d3e4ceccbd41c31cfa"
    />
  </head>
  
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
