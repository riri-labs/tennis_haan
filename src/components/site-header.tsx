import Link from "next/link";
import { getSiteContent, NAV_ITEMS } from "@/lib/site-config";

export async function SiteHeader() {
  const content = await getSiteContent();

  return (
    <header>
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-6 sm:px-10">
        <Link href="/" className="group">
          <span className="font-display text-lg tracking-tight text-ink">
            {content.name}
          </span>
        </Link>
        <nav className="flex items-center gap-5 whitespace-nowrap text-sm font-bold text-ink/60 sm:gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-court"
            >
              {content.navLabels[item.key]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
