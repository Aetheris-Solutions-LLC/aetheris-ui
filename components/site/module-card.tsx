import Link from "next/link";
import type { RegistryItem } from "@/lib/registry";

export function ModuleCard({ item }: { item: RegistryItem }) {
  const kicker = item.dependencies?.[0] ?? "component";

  return (
    <Link
      href={`/docs/${item.name}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--aui-radius)] border p-6 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-[var(--aui-accent-line)] hover:shadow-[var(--aui-accent-glow)]"
      style={{
        background: "var(--aui-surface)",
        boxShadow: "var(--aui-elev)",
        transitionTimingFunction: "var(--aui-ease)",
      }}
    >
      {/* accent hairline that lights up on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--aui-accent), transparent)",
        }}
      />

      {/* a whisper of brand warmth pooling in the corner on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, var(--aui-accent-tint), transparent 70%)",
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
          {kicker}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h3>

      <p
        className="mt-2 flex-1 text-sm leading-relaxed"
        style={{ color: "var(--aui-muted)" }}
      >
        {item.description}
      </p>

      <span
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--aui-accent-strong)" }}
      >
        View docs
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
