import Link from "next/link";

const NAV = [
  { label: "Modules", href: "/#modules" },
  { label: "Lab", href: "/lab" },
];

const GITHUB_URL = "https://github.com/Aetheris-Solutions-LLC/aetheris-ui";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{ background: "color-mix(in oklab, var(--aui-bg) 80%, transparent)" }}
    >
      {/* brand hairline along the very top edge of the page */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--aui-accent), transparent)",
          opacity: 0.5,
        }}
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md"
          aria-label="Aetheris UI home"
        >
          {/* The Aetheris mark, masked so it always paints in the live accent
              token rather than carrying its own baked-in fill. */}
          <span
            aria-hidden
            className="h-[26px] w-[26px] shrink-0 transition-transform duration-700 group-hover:rotate-[30deg]"
            style={{
              backgroundColor: "var(--aui-accent)",
              maskImage: "url(/aetheris-mark.svg)",
              WebkitMaskImage: "url(/aetheris-mark.svg)",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              transitionTimingFunction: "var(--aui-ease)",
            }}
          />
          <span className="text-[15px] font-semibold tracking-tight">
            Aetheris <span style={{ color: "var(--aui-muted)" }}>UI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-2 font-medium transition-colors hover:bg-[var(--aui-hover)] hover:text-[color:var(--aui-fg)] sm:px-3"
              style={{ color: "var(--aui-muted)" }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-medium transition-colors hover:bg-[var(--aui-hover)]"
          >
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              width="15"
              height="15"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
