import { getSiteContent } from "@/lib/site-config";

export async function SiteFooter() {
  const content = await getSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col-reverse items-center gap-4 px-6 py-10 text-xs text-ink/40 sm:flex-row sm:justify-between sm:px-10">
        <p>
          © {year} {content.name}. All rights reserved.
        </p>
        <a
          href="https://www.instagram.com/tennis_haan"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-ink/40 transition hover:text-court"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
