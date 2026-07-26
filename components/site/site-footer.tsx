import Link from "next/link";

const GITHUB_URL = "https://github.com/Aetheris-Solutions-LLC/aetheris-ui";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="h-[22px] w-[22px] shrink-0"
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
            }}
          />
          <span className="text-sm" style={{ color: "var(--aui-muted)" }}>
            Built in public by{" "}
            <span className="font-medium" style={{ color: "var(--aui-fg)" }}>
              Aetheris
            </span>{" "}
            · MIT licensed
          </span>
        </div>

        <nav
          className="flex items-center gap-6 text-sm"
          style={{ color: "var(--aui-muted)" }}
        >
          <Link
            href="/#modules"
            className="transition-colors hover:text-[color:var(--aui-fg)]"
          >
            Modules
          </Link>
          <Link
            href="/lab"
            className="transition-colors hover:text-[color:var(--aui-fg)]"
          >
            Lab
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[color:var(--aui-fg)]"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
