import registry from "@/registry.json";

export type RegistryItem = {
  name: string;
  title: string;
  description: string;
  type: "registry:component";
  files: { path: string; type: string }[];
  dependencies?: string[];
  devDependencies?: string[];
};

export function getRegistryIndex(): RegistryItem[] {
  return registry.items as RegistryItem[];
}
