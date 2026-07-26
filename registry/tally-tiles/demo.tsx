"use client";

import { TallyTiles } from "./tally-tiles";

export default function TallyTilesDemo() {
  return (
    <TallyTiles
      className="max-w-4xl"
      tiles={[
        { label: "modules", value: 9, hint: "installable today", featured: true },
        { label: "install", value: 1, unit: " cmd", hint: "npx shadcn add" },
        { label: "contrast", value: 7.1, unit: ":1", hint: "accent on white" },
        { label: "deps added", value: 0, hint: "for half the catalog", live: true },
      ]}
    />
  );
}
