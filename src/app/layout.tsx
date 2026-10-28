import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { themeBootScript } from "@/shared/lib/themePreference";
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
      <body>
        <ServiceHeader />
        {children}
      </body>
    </html>
  );
}
