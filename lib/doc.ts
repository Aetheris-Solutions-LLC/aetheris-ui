import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

export type ModuleDoc = {
  /** The intro prose under the doc's `# Title`, rendered as the page lead. */
  lead: string | null;
  /** Everything else — props, theming, notes — as HTML. */
  body: string | null;
};

/**
 * Reads a module's `doc.mdx` for its docs page.
 *
 * The .mdx files are authored to read well on GitHub too, so two parts are
 * dropped here rather than removed from the source: the frontmatter, and the
 * `## Install` section — the page renders install as a copyable pill instead.
 * The `# Title` line goes too, since the page has a real `<h1>`.
 *
 * Server-only (reads from disk at build time). The content is ours, so the
 * markdown is rendered as-is.
 */
export async function getModuleDoc(moduleName: string): Promise<ModuleDoc> {
  const file = path.join(process.cwd(), "registry", moduleName, "doc.mdx");

  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    return { lead: null, body: null };
  }

  const sections = splitSections(stripFrontmatter(raw));
  const intro = sections.find((s) => s.startsWith("# "));
  const rest = sections.filter((s) => s !== intro && !/^##\s+Install\b/i.test(s));

  return {
    lead: intro ? render(dropHeading(intro)) : null,
    body: rest.length ? render(rest.join("\n\n")) : null,
  };
}

function render(markdown: string): string {
  const html = marked.parse(markdown, { async: false, gfm: true });
  // Prop tables are wide. Give each one its own scroll box so a long type
  // signature scrolls the table instead of the whole page.
  return html.replace(
    /<table>[\s\S]*?<\/table>/g,
    (table) => `<div class="aui-table-scroll">${table}</div>`,
  );
}

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("\n---", 3);
  return end === -1 ? raw : raw.slice(end + 4).trimStart();
}

function dropHeading(section: string): string {
  return section.split("\n").slice(1).join("\n").trim();
}

/** Splits on `## ` headings, keeping the `# Title` + intro as one leading section. */
function splitSections(body: string): string[] {
  const sections: string[] = [];
  let current: string[] = [];

  for (const line of body.split("\n")) {
    if (line.startsWith("## ")) {
      if (current.length) sections.push(current.join("\n").trim());
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) sections.push(current.join("\n").trim());

  return sections.filter(Boolean);
}
