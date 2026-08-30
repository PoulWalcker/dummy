import type { Metadata } from "next";
import "./globals.css";

const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProductionHost ? `https://${vercelProductionHost}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SHADY JOBS DOT COM",
    template: "%s | SHADY JOBS DOT COM",
  },
  description: "Serious jobs. Questionable branding. Surprisingly useful filters.",
  openGraph: {
    title: "SHADY JOBS DOT COM",
    description: "Serious jobs. Questionable branding. Surprisingly useful filters.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SHADY JOBS DOT COM job board" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHADY JOBS DOT COM",
    description: "Serious jobs. Questionable branding. Surprisingly useful filters.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
