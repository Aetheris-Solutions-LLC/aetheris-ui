"use client";

import { DriftMarquee, type MarqueeItem } from "./drift-marquee";

const items: MarqueeItem[] = [
  { id: "1", image: "/demo/print-1.jpg", title: "Field Study 01", meta: "Editorial" },
  { id: "2", image: "/demo/print-2.jpg", title: "Ember Wash", meta: "Print" },
  { id: "3", image: "/demo/print-3.jpg", title: "Long Exposure", meta: "Series" },
  { id: "4", image: "/demo/print-4.jpg", title: "Crimson Fold", meta: "Print" },
  { id: "5", image: "/demo/print-2.jpg", title: "Second Light", meta: "Editorial" },
  { id: "6", image: "/demo/print-3.jpg", title: "Static Bloom", meta: "Series" },
];

export default function DriftMarqueeDemo() {
  return <DriftMarquee items={items} rows={2} duration={34} aspect="square" className="-mx-10" />;
}
