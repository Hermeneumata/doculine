import { Suspense } from "react";
import { Inter } from "next/font/google";
import classNames from "classnames";
import Nav from "@/components/Nav";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doculine",
  description: "Timeline of documents",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={classNames(inter.className, "h-full")}>
        <Suspense>
          <Nav />
        </Suspense>
        <main className="p-4 md:px-10 mx-auto max-w-7xl">{children}</main>
      </body>
    </html>
  );
}
