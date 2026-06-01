export type MethodId =
  | "constrained-extremum"
  | "linear-programming"
  | "graphical-lp"
  | "calculus-of-variations";

export interface MethodMeta {
  id: MethodId;
  href: string;
  icon: string;
  color: string;
}

export const METHODS: MethodMeta[] = [
  {
    id: "constrained-extremum",
    href: "/methods/constrained-extremum",
    icon: "∇",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "linear-programming",
    href: "/methods/linear-programming",
    icon: "▣",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "graphical-lp",
    href: "/methods/graphical-lp",
    icon: "◫",
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "calculus-of-variations",
    href: "/methods/calculus-of-variations",
    icon: "∫",
    color: "from-emerald-500 to-teal-600",
  },
];

export function methodPath(id: MethodId): string {
  return `/methods/${id}`;
}
