import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRegistryIndex } from "@/lib/registry";
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
  const item = getRegistryIndex().find((i) => i.name === moduleName);

  if (!item) {
    notFound();
  }

  const Demo = demos[item.name];
  const installUrl = `https://ui.aetherissolutions.com/r/${item.name}.json`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.14em]"
          style={{ color: "var(--aui-muted)" }}
        >
          {item.dependencies?.[0] ?? "component"}
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{item.title}</h1>
      </header>

      {/* Live demo */}
      <section
        className="mt-10 flex min-h-[320px] items-center justify-center rounded-[var(--aui-radius)] border p-10"
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

      {/* Install command */}
      <section className="mt-8 max-w-2xl">
        <InstallCommand command={`npx shadcn add ${installUrl}`} />
      </section>

      {/* Description */}
      <section className="mt-8 max-w-2xl">
        <p className="text-base leading-relaxed" style={{ color: "var(--aui-muted)" }}>
          {item.description}
        </p>
      </section>
    </main>
  );
}
