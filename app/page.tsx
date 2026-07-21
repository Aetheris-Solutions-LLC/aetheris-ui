import Link from "next/link";
import { getRegistryIndex } from "@/lib/registry";
import { ModuleCard } from "@/components/site/module-card";

export default function Home() {
  const items = getRegistryIndex();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(58% 60% at 50% -8%, color-mix(in oklab, var(--aui-accent) 13%, transparent), transparent 68%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{ color: "var(--aui-muted)" }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--aui-accent)" }}
            />
            Aetheris UI · component registry
          </span>

          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.03] tracking-tight md:text-7xl">
            Premium modules for sites that sell.
          </h1>

          <p
            className="mt-6 max-w-xl text-lg leading-relaxed"
            style={{ color: "var(--aui-muted)" }}
          >
            Immersive UI, installable in one command. Motion, scroll, and shader
            modules — built in public by Aetheris and restyled to any brand with
            a single set of tokens.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="#modules"
              className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--aui-fg)", color: "var(--aui-bg)" }}
            >
              Browse modules
            </Link>
            <Link
              href="/lab"
              className="inline-flex h-11 items-center rounded-full border px-6 text-sm font-semibold transition-colors hover:bg-[var(--aui-hover)]"
            >
              Visit the lab
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="modules" className="mx-auto max-w-6xl px-6 pb-28">
        <div className="flex items-end justify-between border-b pb-5">
          <h2 className="text-2xl font-semibold tracking-tight">Modules</h2>
          <span className="text-sm" style={{ color: "var(--aui-muted)" }}>
            {items.length} available
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ModuleCard key={item.name} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyState() {
  return (
    <div
      className="mt-10 rounded-[var(--aui-radius)] border border-dashed p-14 text-center"
      style={{ background: "var(--aui-surface)" }}
    >
      <div
        className="mx-auto grid h-11 w-11 place-items-center rounded-xl"
        style={{ background: "var(--aui-hover)" }}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="var(--aui-accent-strong)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        The catalog is being built
      </h3>
      <p
        className="mx-auto mt-2 max-w-md text-sm leading-relaxed"
        style={{ color: "var(--aui-muted)" }}
      >
        The first modules — a cursor-aware card, a pinned scroll narrative, and a
        shader hero — are landing shortly. Follow the work in the lab.
      </p>
      <Link
        href="/lab"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--aui-accent-strong)" }}
      >
        Visit the lab
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    </div>
  );
}
