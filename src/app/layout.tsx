import type { Metadata } from "next";
import type { ReactNode } from "react";
import "katex/dist/katex.min.css";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Optimization Methods Visual Lab",
  description: "Interactive optimization laboratory: constrained extrema, linear programming, graphical LP, calculus of variations",
  authors: [{ name: "Lyova Hovhannisyan" }],
  other: {
    course: "Optimization Methods (Օպտիմիզացիայի մեթոդներ)",
    university: "Yerevan State University — Faculty of Informatics and Applied Mathematics",
    instructor: "Rafik Khachatryan",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
