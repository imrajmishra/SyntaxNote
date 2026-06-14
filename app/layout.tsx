import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "SyntaxNote",
  description:
    "SyntaxNote transforms plain text into organized knowledge using the power of Markdown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.className,
          "dark:bg-black bg-amber-50 dark:text-white min-h-screen flex flex-col justify-between",
        )}
      >
        <Header />
        <main className="w-full grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
