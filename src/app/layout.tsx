import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ServiceNavigation } from "@/view/components/ServiceNavigation";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "passGeneration",
  description: "A browser-based password generator.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="uk" className={cn("font-sans", geist.variable)}>
      <body>
        <ServiceNavigation />
        {children}
      </body>
    </html>
  );
}
