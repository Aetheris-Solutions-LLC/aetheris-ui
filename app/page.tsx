import Link from "next/link";
import { getRegistryIndex } from "@/lib/registry";
import { ModuleCard } from "@/components/site/module-card";
import { InstallCommand } from "@/components/site/install-command";
import { MagneticElements } from "@/registry/magnetic-elements/magnetic-elements";

export default function Home() {
  const items = getRegistryIndex();
  // The storefront runs on its own modules — the quick-start command installs
  // whichever module leads the registry.
  const lead = items[0];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(48% 52% at 22% -10%, color-mix(in oklab, var(--aui-accent) 14%, transparent), transparent 66%)," +
              "radial-gradient(42% 48% at 86% 4%, color-mix(in oklab, var(--aui-accent-2) 10%, transparent), transparent 62%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-24 pb-20 md:pt-32 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                color: "var(--aui-muted)",
                borderColor: "var(--aui-accent-line)",
                background: "var(--aui-accent-tint)",
              }}
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: "var(--aui-accent)",
                  boxShadow: "0 0 0 3px var(--aui-accent-tint)",
                }}
              />
              Aetheris UI · component registry
            </span>

            <h1 className="aui-display mt-6 text-[3.4rem] leading-[0.95] md:text-[5.5rem]">
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

            {/* This row runs on magnetic-elements — the buttons lean toward the
                cursor, so the storefront demonstrates the catalog it sells. */}
            <MagneticElements className="mt-10" radius={130} strength={10}>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  data-magnetic
                  href="#modules"
                  className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition-shadow duration-500 hover:shadow-[var(--aui-accent-glow)]"
                  style={{
                    background: "var(--aui-accent)",
                    transitionTimingFunction: "var(--aui-ease)",
                  }}
                >
                  Browse modules
                </Link>
                <Link
                  data-magnetic
                  href="/lab"
                  className="inline-flex h-11 items-center rounded-full border px-6 text-sm font-semibold transition-colors hover:bg-[var(--aui-hover)]"
                >
                  Visit the lab
                </Link>
              </div>
            </MagneticElements>
          </div>

          {lead ? (
            <div
              className="rounded-[var(--aui-radius)] border p-6"
              style={{ background: "var(--aui-surface)", boxShadow: "var(--aui-elev)" }}
            >
              <h2
                className="aui-kicker"
                style={{ color: "var(--aui-muted)" }}
              >
                Quick start
              </h2>
              <div className="mt-4">
                <InstallCommand
                  variant="block"
                  command={`npx shadcn add https://ui.aetherissolutions.com/r/${lead.name}.json`}
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--aui-muted)" }}>
                Any Next.js + Tailwind app. The source lands in your project —
                restyle it, rewrite it, own it.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Gallery */}
      <section id="modules" className="mx-auto max-w-6xl px-6 pb-28">
        <div className="flex items-end justify-between border-b pb-5">
          <h2 className="aui-display text-[1.7rem]">Modules</h2>
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
      <h3 className="aui-display mt-5 text-[1.35rem]">
        The catalog is being built
      </h3>
      <p
        className="mx-auto mt-2 max-w-md text-sm leading-relaxed"
        style={{ color: "var(--aui-muted)" }}
      >
        Nothing has graduated from the lab yet. That is where every module starts
        — follow the work in progress.
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
