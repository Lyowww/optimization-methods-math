export type MethodId =
  | "newton"
  | "jacobi"
  | "gauss-seidel"
  | "lagrange"
  | "least-squares"
  | "lu";

export interface MethodMeta {
  id: MethodId;
  href: string;
  icon: string;
  color: string;
}

export const METHODS: MethodMeta[] = [
  { id: "newton", href: "/methods/newton", icon: "∿", color: "from-cyan-500 to-blue-600" },
  { id: "jacobi", href: "/methods/jacobi", icon: "▦", color: "from-violet-500 to-purple-600" },
  { id: "gauss-seidel", href: "/methods/gauss-seidel", icon: "◈", color: "from-fuchsia-500 to-pink-600" },
  { id: "lagrange", href: "/methods/lagrange", icon: "◇", color: "from-emerald-500 to-teal-600" },
  { id: "least-squares", href: "/methods/least-squares", icon: "📈", color: "from-amber-500 to-orange-600" },
  { id: "lu", href: "/methods/lu", icon: "⊞", color: "from-rose-500 to-red-600" },
];

export function methodPath(id: MethodId): string {
  return `/methods/${id}`;
}
