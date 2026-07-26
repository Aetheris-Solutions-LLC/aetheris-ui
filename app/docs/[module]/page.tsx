import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistryIndex, type RegistryItem } from "@/lib/registry";
import { getModuleDoc } from "@/lib/doc";
import { demos } from "@/lib/demos";
import { InstallCommand } from "@/components/site/install-command";

type PageProps = {
  params: Promise<{ module: string }>;
};

export function generateStaticParams() {
  return getRegistryIndex().map((item) => ({ module: item.name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { module: moduleName } = await params;
  const item = getRegistryIndex().find((i) => i.name === moduleName);

  if (!item) return {};

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function DocsPage({ params }: PageProps) {
  const { module: moduleName } = await params;
  const index = getRegistryIndex();
  const position = index.findIndex((i) => i.name === moduleName);
  const item = index[position];

  if (!item) {
    notFound();
  }

  const Demo = demos[item.name];
  const doc = await getModuleDoc(item.name);
  const installUrl = `https://ui.aetherissolutions.com/r/${item.name}.json`;
  const previous = index[position - 1];
  const next = index[position + 1];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <Link
          href="/#modules"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium"
          style={{ color: "var(--aui-muted)" }}
        >
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          All modules
        </Link>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight">{item.title}</h1>

        {doc.lead ? (
          <div
            className="aui-prose mt-4 text-base"
            dangerouslySetInnerHTML={{ __html: doc.lead }}
          />
        ) : (
          <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--aui-muted)" }}>
            {item.description}
          </p>
        )}

        {item.dependencies?.length ? (
          <ul className="mt-6 flex flex-wrap items-center gap-2">
            {item.dependencies.map((dep) => (
              <li
                key={dep}
                className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                style={{
                  background: "var(--aui-surface)",
                  color: "var(--aui-muted)",
                  fontFamily: "var(--font-mono-brand)",
                }}
              >
                {dep}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {/* Live demo */}
      <section
        aria-label={`${item.title} demo`}
        className="mt-10 flex min-h-[320px] items-center justify-center overflow-hidden rounded-[var(--aui-radius)] border p-10"
        style={{ background: "var(--aui-surface)", boxShadow: "var(--aui-elev)" }}
      >
        {Demo ? (
          <Demo />
        ) : (
          <p className="text-sm" style={{ color: "var(--aui-muted)" }}>
            Demo coming soon.
          </p>
        )}
      </section>

      {/* Install */}
      <section className="mt-8 max-w-2xl">
        <h2 className="aui-kicker" style={{ color: "var(--aui-muted)" }}>
          Install
        </h2>
        <div className="mt-3">
          <InstallCommand command={`npx shadcn add ${installUrl}`} />
        </div>
      </section>

      {/* Everything the doc.mdx has to say — props, theming, notes */}
      {doc.body ? (
        <article
          className="aui-prose mt-14 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: doc.body }}
        />
      ) : null}

      {(previous || next) && (
        <nav
          aria-label="Module navigation"
          className="mt-16 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:justify-between"
        >
          {previous ? <AdjacentLink item={previous} direction="previous" /> : <span />}
          {next ? <AdjacentLink item={next} direction="next" /> : null}
        </nav>
      )}
    </main>
  );
}

function AdjacentLink({
  item,
  direction,
}: {
  item: RegistryItem;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";

  return (
    <Link
      href={`/docs/${item.name}`}
      className="group flex flex-col gap-1 rounded-[var(--aui-radius)] border px-5 py-4 transition-colors hover:bg-[var(--aui-hover)] sm:min-w-[15rem]"
      style={{ background: "var(--aui-surface)" }}
    >
      <span
        className={`aui-kicker ${isNext ? "sm:text-right" : ""}`}
        style={{ color: "var(--aui-muted)" }}
      >
        {isNext ? "Next" : "Previous"}
      </span>
      <span className={`text-sm font-semibold ${isNext ? "sm:text-right" : ""}`}>
        {item.title}
      </span>
    </Link>
  );
}
