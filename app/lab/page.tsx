import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "The Aetheris UI playground — rough experiments, clearly labeled, on their way to becoming modules. Rough edges on purpose.",
};

type Experiment = {
  slug: string;
  title: string;
  tag: string;
  blurb: string;
};

const experiments: Experiment[] = [
  {
    slug: "aura-field",
    title: "Aura field",
    tag: "Motion",
    blurb:
      "The aura-card glow pushed to viewport scale — a full-bleed reactive dot grid that lights up around the cursor. The idea before it graduated into a bounded, installable card.",
  },
];

export default function LabIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="max-w-2xl">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          style={{ color: "var(--aui-muted)" }}
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--aui-accent)" }}
          />
          The lab
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
          Rough edges on purpose.
        </h1>

        <p
          className="mt-5 text-lg leading-relaxed"
          style={{ color: "var(--aui-muted)" }}
        >
          Public experiments — half-formed interactions, ideas stress-tested in
          the open before they earn the quality bar. Nothing here is installable
          yet. When an experiment holds up, it graduates into a{" "}
          <Link
            href="/#modules"
            className="font-medium underline underline-offset-4 decoration-1"
            style={{ color: "var(--aui-accent-strong)" }}
          >
            module
          </Link>
          .
        </p>
      </header>

      <section className="mt-14">
        <div className="flex items-end justify-between border-b pb-5">
          <h2 className="text-2xl font-semibold tracking-tight">Experiments</h2>
          <span className="text-sm" style={{ color: "var(--aui-muted)" }}>
            {experiments.length} in the open
          </span>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((exp) => (
            <ExperimentCard key={exp.slug} experiment={exp} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <Link
      href={`/lab/${experiment.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--aui-radius)] border p-6 transition-transform duration-300 hover:-translate-y-1"
      style={{ background: "var(--aui-surface)", boxShadow: "var(--aui-elev)" }}
    >
      {/* dashed corner mark — the visual signal that this is unfinished */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--aui-accent), transparent)",
        }}
      />

      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--aui-accent)" }}
        />
        <span
          className="aui-kicker"
          style={{ color: "var(--aui-muted)" }}
        >
          {experiment.tag} · experiment
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight">
        {experiment.title}
      </h3>

      <p
        className="mt-2 flex-1 text-sm leading-relaxed"
        style={{ color: "var(--aui-muted)" }}
      >
        {experiment.blurb}
      </p>

      <span
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--aui-accent-strong)" }}
      >
        Open experiment
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
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </Link>
  );
}
