import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PageTransitionProvider } from "@/components/page-transition";
import "./globals.css";

export const dynamic = "force-static";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
const siteOrigin = new URL(siteUrl.origin);
const absoluteAssetUrl = (path: string) => new URL(assetPath(path), siteOrigin).toString();

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: "Joel Loh — Product Builder",
  description:
    "Independent product designer and builder in Singapore, working across AI, mobile, productivity and infrastructure.",
  icons: {
    icon: assetPath("/favicon.svg"),
    shortcut: assetPath("/favicon.svg"),
  },
  openGraph: {
    title: "Joel Loh — Product Builder",
    description: "Independent product designer and builder in Singapore.",
    type: "website",
    images: [{ url: absoluteAssetUrl("/og.png"), width: 1536, height: 1024, alt: "Joel Loh portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joel Loh — Product Builder",
    description: "Independent product designer and builder in Singapore.",
    images: [absoluteAssetUrl("/og.png")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
