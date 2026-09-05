import type { Metadata } from "next";
import { Gothic_A1 } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteContent } from "@/lib/site-config";
import "./globals.css";

const gothicA1 = Gothic_A1({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: `${content.name} — ${content.tagline}`,
    description: content.description.replace(/\n/g, " "),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <html
      lang="ko"
      className={gothicA1.variable}
      style={{ "--color-court": content.brandColor } as React.CSSProperties}
    >
      <body className="font-body">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
