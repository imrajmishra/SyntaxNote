import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "SyntaxNote",
  description:
    "SyntaxNote transforms plain text into organized knowledge using the power of Markdown.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
    >
      <body
        className={cn(
          inter.className,
          " bg-amber-50 min-h-screen flex flex-col justify-between",
        )}
      >
        <main className="w-full grow flex flex-col">{children}</main>
      </body>
    </html>
  );
}
