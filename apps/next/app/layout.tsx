import type { Metadata } from "next";

import AppShell from "@/components/AppShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next Solid Parity",
  description: "Next app shell aligned with the Solid app foundation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
