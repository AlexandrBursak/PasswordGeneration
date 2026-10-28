import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { themeBootScript } from "@/shared/lib/themePreference";
import { ServiceFooter } from "@/view/components/ServiceFooter";
import { ServiceHeader } from "@/view/components/ServiceHeader";

export const metadata: Metadata = {
  title: "passGeneration",
  description: "A browser-based password and UUID generator.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // The boot script sets data-theme before hydration.
    <html lang="uk" className="font-sans" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ServiceHeader />
        {children}
        <ServiceFooter />
      </body>
    </html>
  );
}
